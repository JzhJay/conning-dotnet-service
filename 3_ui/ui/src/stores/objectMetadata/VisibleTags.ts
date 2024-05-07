import {isObservableArray, isObservableMap, observable} from 'mobx';
import {IObjectTypeDescriptor, OmdbCardSection, OmdbTag, user} from 'stores';

class VisibleTags {

	savedVisibleTagsSettings: {[objectKey: string]: Map<string, boolean>} = {};

	getVisibilityKey_table(objectTypes: string[]): string {
		return `table:${objectTypes.sort().join(',')}`;
	}

	getVisibilityKey_card(objectType: string): string {
		return `card:${objectType}`;
	}

	getVisibleTagsSetting(visibilityKey: string): Map<string, boolean> {
		if (this.savedVisibleTagsSettings[visibilityKey]) {
			return this.savedVisibleTagsSettings[visibilityKey];
		}

		const userVisibleTags = visibilityKey ? user.settings.catalog.visibleTags[visibilityKey] : null;
		let returnMap: Map<string, any>;

		if (!userVisibleTags) {
			returnMap = observable(new Map());
		} else if (isObservableMap(userVisibleTags)) {
			returnMap = userVisibleTags;
		} else if (userVisibleTags instanceof Map) {
			returnMap = observable(userVisibleTags);
		} else {
			try {
				returnMap = observable(new Map(userVisibleTags as any)) as any;
			} catch (e) {
				returnMap = observable(new Map());
			}
		}

		_.forEach(Array.from(returnMap.keys()), (key) => {
			if (returnMap[key] !== false) { // remove useless values.
				returnMap.delete(key);
			}
		});

		this.savedVisibleTagsSettings[visibilityKey] = returnMap;
		return returnMap;
	}

	setVisibleTagsSetting(objectKey: string, saveMap: Map<string, boolean>): void {
		if (this.savedVisibleTagsSettings[objectKey] != saveMap) {
			this.savedVisibleTagsSettings[objectKey] = isObservableMap(saveMap) ? saveMap : observable(saveMap);
		}

		const visibleTags:{[columnName:string]: boolean} = {};
		saveMap.forEach((v, k) => {
			_.isBoolean(v) && (visibleTags[k] = v);
		});
		if (_.eq(visibleTags, user.settings.catalog.visibleTags[objectKey])) {
			return;
		}

		let hasParentMapUpdate = false;
		const parentMap = {...user.settings.catalog.visibleTags};
		_.forEach(Object.keys(parentMap), key => {
			if (!(key.match(/^card:[a-zA-Z]+$/) || key.match(/^table:/))) {
				delete parentMap[key];
				hasParentMapUpdate = true;
			}
		});// remove Dirty data.

		if (hasParentMapUpdate) {
			parentMap[objectKey] = visibleTags;
			user.settings.catalog.visibleTags = parentMap;
		} else {
			user.settings.catalog.visibleTags[objectKey] = visibleTags;
		}
	}

	getVisibleTagsSetting_card(objectTypeDescriptor: IObjectTypeDescriptor): Map<string, boolean> {
		const objectType = objectTypeDescriptor.id;
		const visibilityKey = this.getVisibilityKey_card(objectType);

		return this.getVisibleTagsSetting(visibilityKey);
	}

	getVisibleTagsSetting_table(objectTypeDescriptors: IObjectTypeDescriptor[]): Map<string, boolean> {
		const objectTypes = objectTypeDescriptors.map(desc => desc.id);
		const visibilityKey = this.getVisibilityKey_table(objectTypes);

		return this.getVisibleTagsSetting(visibilityKey);
	}


}

export const visibleTagUtil = new VisibleTags();