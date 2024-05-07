import type {OmdbObjectType} from './OmdbObjectType';
import type {IOmdbTag} from '../index';
import type {OmdbCardTag, OmdbTag} from './OmdbTag';
import type {IObservableArray} from 'mobx';

export interface OmdbUiCatalogDefinition {
	tags?: Array<{name: string, _id?: string, reserved?: boolean}>;
}

export interface OmdbUiCardDefinition {
	title?: OmdbCardTag;
	sections?: IObservableArray<OmdbCardSection>;
}

export interface OmdbCardSection {
	_id?: string;
	label?: string;
	tags?: Array<OmdbCardTag>
}

export interface IOmdbUi {
	objectType: OmdbObjectType
	catalog?: OmdbUiCatalogDefinition;
	card?: OmdbUiCardDefinition;
	table?: OmdbUiTableDefinition;
}

export interface OmdbUiTableDefinition {
	sortBy?: string;
	sortOrder?: string;
	frozenColumns?: number;
	columns: IOmdbTag[];
}

export interface OmdbUiTableTagDefinition extends OmdbCardTag {
	defaultWidth?: number;
	minWidth?: number,
	wordWrap?: boolean,
	header?: string,
	align?: 'left' | 'center' | 'right';

	name: string

	renderCell?: (r,c,item) => React.ReactNode;
}
/*

export class OmdbUi {
	constructor(ui: IOmdbUi) {

	}

	objectType: OmdbObjectType
	@observable catalog?: OmdbUiCatalogDefinition = null;
	@observable card?: OmdbUiCardDefinition = null;
	@observable tableTags?: Array<OmdbCardTag> = null;
}

export class OmdbCardSection {
	constructor(section: IOmdbCardSection) {
		Object.assign(this, section);

	}

	_id?: string;
	@observable label?: string;
	tags: Array<OmdbTag>;
}
*/
