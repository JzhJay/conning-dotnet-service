import gql from 'graphql-tag';
import type {IObservableArray} from 'mobx';
import {computed, observable, makeObservable} from 'mobx';
import {UserTagValue} from '../../codegen/types';
import {camelToRegular} from '../../utility';
import type {IApplicationIcon} from '../index';
import {apolloStore, fragments, utility} from '../index';
import type {OmdbObjectType} from './OmdbObjectType';

export interface IObjectTypeDescriptor {
	id?: string,
	tags?: Array<OmdbTag>
	userTags?: Array<OmdbUserTag>;
	ui?: { card?: any, catalog?: any, table?: any, uniqueName?: any }
}

export interface OmdbUserTag {
	_id?: string;
	name?: string;
	label?: string;
	mutates?: boolean;
	multiple?: boolean;
	required?: boolean;
	canSearch?: boolean;
	canSort?: boolean;
	values?: Array<OmdbUserTagValue>;
	objectTypes?: Array<String>;
}

export interface OmdbUserTagValue {
	_id?: string,
	value?: any,
	label?: string,
	background?: string,
	color?: string,
	align?: string;
	tag?: OmdbUserTag;
	order?: number;
	isDefault?: boolean;
}

export interface OmdbCardTag extends IOmdbTag {
	hide?: boolean;
	reverse?: boolean;
	default?: boolean;
	className?: string;
	hideEmpty?: boolean;
	icon?: IApplicationIcon;
	value?: React.ReactNode | string | number;
	renderValue?: (model) => React.ReactNode | string | number;
	urlField?: string;

	minWidth?: number,
	wrapText?: boolean,
	align?: 'left' | 'center' | 'right';
}

export interface OmdbObjectSchema {
	objectType?: OmdbObjectType;
	tags?: IObservableArray<OmdbTag>;
	userTags?: IObservableArray<IOmdbTag>;
}

export const omdbTagTypes = ['', 'id', 'userId', 'date']

export interface OmdbTagUi {
	catalog?: {
		index?: number
	},
	table?: {
		index?: number,
		props?: any
	}
}

export interface IOmdbTag {
	reserved?: boolean;
	required?: boolean;
	oridinal?: number;
	type?: string;
	mutates?: boolean;
	multiple?: boolean;
	name?: string;
	label?: string;
	values?: Array<OmdbUserTagValue>;
	wrapText?: boolean;
	objectTypes?: string[];
	canSearch?: boolean;
	canSort?: boolean;
	_id?: string;

	ui ?: OmdbTagUi;

	align?: 'left' | 'center' | 'right';
	defaultWidth?: number;
	renderValue?: (model) => React.ReactNode | string | number;
}

export class OmdbTag implements IOmdbTag {
	_id                                         = "";
	@observable
	reserved         = false;
	@observable
	required         = false;

	@observable
	name : string = "";

	@observable
	label                                 :string = "";

	@observable
	objectTypes: string[]                 = [];

	@observable
	multiple     = false;
	@observable
	mutates      = false;
	@observable
	type: string = null;

	@observable objectType = "";

	@observable
	canSearch?: boolean;
	@observable
	canSort?: boolean;

	ui?: OmdbTagUi;

	@observable wrapText?: boolean;
	@observable defaultWidth?: number;
	@observable align?: 'left' | 'right' | 'center';
	@observable width?: string;
	@observable value?: React.ReactNode | string | number;
	@observable values?: Array<OmdbUserTagValue>;
	@observable renderValue?: (model) => React.ReactNode | string | number;
	@observable urlField?: string;

	@observable minWidth?: number

	@computed get displayName() {
		const {name, label} = this;

		return label ? label : name ? camelToRegular(name) : ''
	}


	renderCell

	constructor(tag: IOmdbTag) {
        makeObservable(this);
        Object.assign(this, tag);
    }
}

export interface IOmdbUpdateRecord {
	collection: OmdbObjectType;
	_id: string;
	tags: Array<{
		tag_id: string,
		tag_name?: string,
		value: any
	}>;
}

export interface IDistinctTagValue {
	tagName: string;
	tagType: string;
	isUserTag: boolean;
	label?: string;
	distinct: Array<{_id: any, count: number} | OmdbDistinctValue>;
}

export class OmdbDistinctValue {
	_id?: string;
	value: any;
	label?: string;
	checked?: boolean;
	//@observable checked = false;
	@observable count = 0;
	@observable color: string;
	@observable background: string;
	@observable align?: string;

	@observable isLoading = false;
	missingMapping = false;


	constructor(options: {value?: any, label?: string, count?: number, color?: string, background?: string, _id?: string, align?: string}) {
		Object.assign(this, options);

		makeObservable(this);
    }

}

export class DistinctTagValue {
	tagName: string;
	tagType: string;
	isUserTag: boolean;
	label?: string;
	distinct: OmdbDistinctValue[] = [];

	//@computed get selected() { return this.distinct.filter(d => d.checked).map(d => d.value)}

	constructor(v: IDistinctTagValue) {
        makeObservable(this);
        this.tagName      = v.tagName;
        this.tagType = v.tagType;
        this.label = v.label;
        this.isUserTag = v.isUserTag;

        if (this.tagType == "Boolean") {
			let distinct:any = _.keyBy(v.distinct, "_id");
			this.distinct = [
				new OmdbDistinctValue({value: false, label: "False", count: distinct.false ? distinct.false.count : 0}),
				new OmdbDistinctValue({value: true, label: "True", count: distinct.true ? distinct.true.count: 0})
			]
		}
		else {
			this.distinct = v.distinct.filter(d => d != null).map(item => item instanceof OmdbDistinctValue ? item : new OmdbDistinctValue({value: item._id, count: item.count}));
		}
    }

	@computed get displayTitle() {
		return this.label ? this.label : utility.formatLabelText(this.tagName);
	}

	@computed get distinctByName(): { [name: string]: OmdbDistinctValue } {
		return _.keyBy(this.distinct, d => String(d.value));
	}
}

export async function saveTagValues( objectType: string, objectId: string, tagValueIds: string[] = [] ): Promise<{_id: string, userTagValues: UserTagValue[]}> {
	objectType = _.camelCase(objectType);
	return await apolloStore.client.mutate({
		mutation:  gql`
					mutation updateUserTagValues($id: ID!, $tagValueIds: [ID!]) {
						omdb {
							typed {
								${objectType} {
									updateUserTagValues(id: $id, tagValueIds: $tagValueIds) {
										...on UserFile { _id, userTagValues { ...userTagValue } }
										...on Simulation { _id, userTagValues { ...userTagValue } }
										...on Query {  _id, userTagValues { ...userTagValue } }
										...on InvestmentOptimization {  _id, userTagValues { ...userTagValue } }
										...on ClimateRiskAnalysis {  _id, userTagValues { ...userTagValue } }
									}
								}
							}
						}
					}
					${fragments.userTagValue}
				`,
		variables: {id: objectId, tagValueIds: tagValueIds},
		fetchPolicy: 'no-cache'
	}).then( r => {
		return _.get(r, `data.omdb.typed.${objectType}.updateUserTagValues`);
	});
}