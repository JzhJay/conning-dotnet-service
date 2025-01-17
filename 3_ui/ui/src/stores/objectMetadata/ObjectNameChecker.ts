import gql from 'graphql-tag';
import type {IOmdbQueryGraph, IOmdbQueryResultGraph} from 'stores';
import {apolloStore, omdb} from 'stores';

export interface ObjectNameCheckerConfig {
	type?: 'numeric' | 'alphabet' | 'random';
	alwaysAddSequence?: boolean;
	defaultName?: string;
	caseInsensitive?: boolean;
	sequenceStartFrom?: number;
	customizeCompareList?: () => string[];
	nameForCopyObject?: boolean;
}

export interface ObjectNameCheckerResult {
	isDuplicated: boolean;
	isAutoGenerated: boolean;
	isCaseInsensitive: boolean;

	input: string;
	inputWithoutPath: string;
	suggestName?: string;
	suggestNameWithoutPath?: string;
	suggestMessage?: string;
}

export class ObjectNameChecker {

	config: ObjectNameCheckerConfig;
	lastQuery: { objectType: string, name: string };
	resultList: {_id: string, name: string}[];
	savedUniqueNameStatus = new Map<String, boolean>();

	constructor(config?: ObjectNameCheckerConfig) {
		this.config = Object.assign({
			type: 'alphabet',
			defaultName: 'Untitled',
			caseInsensitive: true,
		}, config || {});
	}

	async isDuplicated(objectType: string, name?: string, excludeId?: string, canDuplicate?: boolean ) : Promise<ObjectNameCheckerResult> {

		let isAutoGenerated = false;
		const isCaseInsensitive = this.config.caseInsensitive !== false;
		if (_.isEmpty(name)) {
			isAutoGenerated = true;
			const sequenceStartFrom = _.isSafeInteger(this.config.sequenceStartFrom) ? this.config.sequenceStartFrom : 0;
			name = this.getNameWithIndex(this.config.defaultName, sequenceStartFrom);
		}

		const splittedName = this.splitName(name);

		if (await this.canDuplicated(objectType, canDuplicate)) {
			return {
				isAutoGenerated,
				isCaseInsensitive,
				isDuplicated: false,
				input: name,
				inputWithoutPath: splittedName.name
			}
		}

		let nameBase;
		if (this.config.nameForCopyObject) {
			nameBase = `Duplicate of ${splittedName.name}`
			name = splittedName.path ? `${splittedName.path}${nameBase}` : nameBase;
			splittedName.name = nameBase;
		} else {
			nameBase = this.getNameBase(splittedName.name).trim();
		}

		let nameList: string[];
		if(this.config.customizeCompareList) {
			nameList = this.config.customizeCompareList();
		} else {
			if (!this.canUsingCache(objectType, name)) {
				this.lastQuery = {objectType, name: nameBase}
				this.resultList = null;

				const resp = await apolloStore.client.query<IOmdbQueryResultGraph>({
					query:        gql`
						query runOmdbQuery($input: omdb_queryResultInput!) { omdb { raw { find(input: $input) {
							total
							results {
								... on UI { name }
								... on DbObject { _id }
								... on ClimateRiskAnalysis { name, _id }
							}
						} } } }
					`,
					fetchPolicy:  'network-only',
					variables:    {input: {objectTypes: [objectType], searchText: nameBase}}
				});
				this.resultList = resp.data.omdb.raw.find.results;
			}
			nameList = this.resultList ? (excludeId ? this.resultList.filter(r => r._id != excludeId) : this.resultList).map(r => this.splitName(r.name).name ) : [];
		}

		let testName = splittedName.name;
		if (isCaseInsensitive) {
			testName = _.toLower(testName);
			nameList = _.map(nameList, name => _.toLower(name))
		}

		if (!_.includes(nameList, testName)) {
			return {
				isAutoGenerated,
				isCaseInsensitive,
				isDuplicated: false,
				input: name,
				inputWithoutPath: splittedName.name
			};
		}

		const  suggestName = this.getNextName(nameBase, nameList);

		if (isAutoGenerated) {
			return {
				isAutoGenerated: true,
				isCaseInsensitive,
				isDuplicated: false,
				input: splittedName.path ? `${splittedName.path}${suggestName}` : suggestName,
				inputWithoutPath: suggestName
			}
		}

		return {
			isAutoGenerated,
			isCaseInsensitive,
			isDuplicated: true,
			input: name,
			inputWithoutPath: splittedName.name,
			suggestName: splittedName.path ? `${splittedName.path}${suggestName}` : suggestName,
			suggestNameWithoutPath: suggestName,
			suggestMessage: `An object with the name "${splittedName.name}" already exists. Would you like to use "${suggestName}" instead?`
		};
	}

	async getAvailableName(objectType: string, name?: string, excludeId?: string, canDuplicated?: boolean ): Promise<string> {
		const result = await this.isDuplicated(objectType, name, excludeId, canDuplicated);
		return result.isDuplicated ? result.suggestName : result.input;
	}

	async canDuplicated(objectType: String, inputValue?: boolean): Promise<boolean> {
		if (inputValue === true || inputValue === false) {
			return inputValue;
		}
		if (_.isEmpty(objectType)) {
			return false;
		}
		if (this.savedUniqueNameStatus.has(objectType)) {
			return this.savedUniqueNameStatus.get(objectType);
		}
		return await apolloStore.client.query<IOmdbQueryGraph>({
			query:     omdb.graph.objectType,
			variables: {objectType: objectType},
			fetchPolicy:  'network-only'
		}).then( result => {
			const status = result.data?.omdb?.objectType?.ui?.uniqueName === false;
			this.savedUniqueNameStatus.set(objectType, status);
			return status;
		});
	}

	canUsingCache (objectType: string, name: string) {
		if (_.isEmpty(objectType)) {
			return false;
		}

		const baseName = this.getNameBase(this.splitName(name).name);
		return this.lastQuery &&
			objectType == this.lastQuery.objectType &&
			this.lastQuery.name.length <= baseName.length && baseName.indexOf(this.lastQuery.name) >= 0
	}

	splitName (name): { path: string, name: string} {
		const pathRegExp = new RegExp(`^(.*\\/\\s*)?(.*)$`);
		const pathRegExpResult = pathRegExp.exec(name);

		return {
			path: pathRegExpResult[1]?.trim(),
			name: pathRegExpResult[2]?.trim()
		};
	}

	getNameBase (name: string): string {
		// remove folder path
		switch (this.config.type) {
			case 'alphabet':
				return new RegExp(`^(.*?)(\\s+[A-Z]+)?$`).exec(name)[1];

			case 'numeric':
				return new RegExp(`^(.*?)(\\s+[0-9]+)?$`).exec(name)[1];

			case 'random':
				return new RegExp(`^(.*?)(\\s+[a-zA-Z0-9]{6,6})?$`).exec(name)[1];

			default:
				return null;
		}
	}

	getNameRegExp (name: string) : RegExp {
		const flag = this.config.caseInsensitive !== false ? 'i' : '';

		switch (this.config.type) {
			case 'alphabet':
				return new RegExp(`^${name}(\\s+[A-Z]+)?$`,flag);

			case 'numeric':
				return new RegExp(`^${name}(\\s+[0-9]+)?$`,flag);

			default:
				return null;
		}
	}

	getIndexByName (name: string, nameRegExp: RegExp) : number {
		if (!nameRegExp) {
			return -1;
		}

		let result = nameRegExp.exec(name);
		if (result?.length != 2) {
			return -1;
		}

		let matcher = result[1];
		if(!matcher) {
			return 0;
		}
		matcher = matcher.trim();

		switch(this.config.type) {
			case 'numeric':
				return _.toInteger(matcher);
			case 'alphabet':
				matcher = matcher.toUpperCase();
				const matcherLength = matcher.length - 1;
				let seq = 0;
				for (let i = matcherLength ; i >= 0; i--) {
					seq += (matcher.charCodeAt(i)-64) * Math.pow(26,matcherLength-i);
				}
				return seq;
			default:
				return 0;
		}
	}

	getNameWithIndex (name: string, index: number): string {
		const alwaysAddSequence = this.config.alwaysAddSequence === true;
		// console.log(`alwaysAddSequence: ${alwaysAddSequence} index: ${index}`)
		if (index == 0 && !alwaysAddSequence) {
			return name;
		}

		switch(this.config.type) {
			case 'numeric':
				return `${name} ${index}`;
			case 'alphabet':
				let transIndex = '';
				alwaysAddSequence && (index++);
				while ( index > 0 ) {
					index--;
					transIndex = String.fromCharCode(65 + index%26) + transIndex
					index = Math.floor(index/26);
				}
				return `${name} ${transIndex}`;
			default:
				return name;
		}
	}

	getNextName (name: string, nameList: string[]): string {
		const sequenceStartFrom = _.isSafeInteger(this.config.sequenceStartFrom) ? this.config.sequenceStartFrom : 0;
		if(!nameList?.length) {
			return this.getNameWithIndex(name, sequenceStartFrom);
		}

		if (this.config.type == 'random') {
			let suggestName;
			do {
				suggestName = `${name} ${uuid.v4().substr(-6)}`;
			} while (_.includes(nameList, suggestName))
			return suggestName;
		}

		const nameRegExp = this.getNameRegExp(name);
		let newSeq = Math.max(
			sequenceStartFrom,
			...nameList.map(n => this.getIndexByName(n, nameRegExp))
		) + 1;

		return this.getNameWithIndex(name, newSeq);
	}

}
