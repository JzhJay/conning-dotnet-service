import {GenericBrowser} from 'components/widgets/SmartBrowser/GenericBrowser';
import type {IObjectTypeDescriptor} from 'stores';
import {i18n, OmdbUserTag, settings} from 'stores';
import {Observer, observer} from 'mobx-react';
import {bp, LoadingUntil, OmdbFolderTree, SortableCardsPanel} from 'components'
import {OmdbTag, DistinctTagValue, ObjectCatalogContext, OmdbDistinctValue, utility, } from 'stores'
import {action, computed, observable, reaction, makeObservable} from 'mobx';
import {Button, Checkbox, ContextMenuTarget, Menu, MenuItem, Tooltip} from '@blueprintjs/core';
import * as css from './ObjectCatalogSidebar.css'
import {formatLabelText} from 'utility';
import {defineMessages} from 'react-intl';

// HIERARCHICAL_TAG: tagName as key and split regExp as value;
const HIERARCHICAL_TAG: { [key:string]: RegExp} = {
	"name" : new RegExp("/","g")
};

interface MyProps {
	context: ObjectCatalogContext;
	panel: SortableCardsPanel;
}

export const I18N_MESSAGES = defineMessages({
	clearFilter: {
		defaultMessage: 'Clear Filter',
		description:    `[ObjectCatalogSidebar] label for option that removes search result filters`
	}
})

@observer
export class ObjectCatalogSidebar extends React.Component<MyProps, {}> {
	render() {
		let {props, props: {panel, context, context: {distinctTagValues, allDistinctTagValues, loadedDistinct}}} = this;

		// If our search criteria results in no selected rows, instead show the global distinct category list.
		if (allDistinctTagValues.size > 0 && _.every(_.flatMap(Array.from(distinctTagValues.values()), v => Array.from(v.values())), v => _.isEmpty(v.distinct))) {
			distinctTagValues = allDistinctTagValues;
		}

		// var ot    = _.first(context.objectTypes);
		// let uiDef = ot && omdb.ui.get(ot.name);

		const distinctPanel = <CatalogDistinctSidebarPanel key="distinct-panel" sidebar={this} {...props} />
		let folderPanel = <div key="folders" className={css.folderTree}>
			<OmdbFolderTree panel={panel}/>
		</div>;

		const {catalog: {swapPanels, showFolders}} = settings;
		let panels = [distinctPanel];
		return (
			<div className={css.root}>
				{distinctPanel}
			</div>
		);
	}

	splitter;
}

@observer
export class CatalogSidebarSection extends React.Component<{ context: ObjectCatalogContext, objectType: string }, {}> {
    @observable open = false;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get objectTypeDescriptor(): IObjectTypeDescriptor {
		return this.props.context.getObjectType(this.props.objectType);
	}

    @computed get allTags(): Array<OmdbTag|OmdbUserTag> {
		let otd = this.objectTypeDescriptor;
		if (!otd) {
			return [];
		} else {
			return [...otd.userTags, ...otd.tags];
		}
	}

    @computed get displayTags() {

		const allTags = this.allTags;
		if (!allTags.length) {
			return [];
		}

		const { props: {context}} = this;

		let outputTags = allTags.filter( t => {
			if (!t.name) {
				return false;
			}
			if (!t._id) {
				// (t.ui.catalog.index == null || t.ui.catalog.index != -1);
				let extraTagNames = _.keys(context.extraWhere);
				if (_.includes(extraTagNames, GenericBrowser.ALL_RELATED_SIMULATION_TAG)) {
					_.remove(extraTagNames , tag => tag == GenericBrowser.ALL_RELATED_SIMULATION_TAG);
					extraTagNames = [...extraTagNames, ...GenericBrowser.SIMULATION_TAG];
				} else if (_.includes(extraTagNames, GenericBrowser.ALL_RELATED_USERFILE_TAG)) {
					_.remove(extraTagNames , tag => tag == GenericBrowser.ALL_RELATED_USERFILE_TAG);
					extraTagNames = [...extraTagNames, ...GenericBrowser.USERFILE_TAG];
				}
				return (!_.includes(context.hiddenFilters, t.name)) && (!_.includes(extraTagNames, t.name));
			} else {
				return t.values && t.values.length;
			}
		});

		let otd = this.objectTypeDescriptor;
		let uiTagOrders =  otd.ui?.catalog?.tags;
		if (!uiTagOrders || !uiTagOrders.length) {
			return outputTags;
		}
		return uiTagOrders
			.map( uiTag => {
				let filterName = (typeof uiTag == "string") ? uiTag : uiTag.name;
				let filterId = (typeof uiTag == "string") ? null : uiTag._id;
				let rtnTag;
				if (filterId) {
					rtnTag = outputTags.filter( t => t._id && t._id == filterId);
				} else {
					rtnTag =  outputTags.filter( t => !t._id && t.name == filterName);
				}
				return rtnTag[0]
			})
			.filter( t => !!t );
	}

    @computed get enable() {
		if (!this.displayTags?.length)
			return false;

		const {props: {objectType, context: {distinctTagValues}}} = this;
		const valuesByField = distinctTagValues.get(objectType);
		let distinctCount = 0;
		this.displayTags.forEach( t => {
			const entry = valuesByField.get(t._id || t.name);
			entry && (distinctCount += entry.distinct.length);
		})
		return distinctCount > 0;
	}


    render() {
		const {open, enable, props: {objectType, context, context: {distinctTagValues}}} = this;
		//let uiDef = omdb.ui.get(objectType);

		// var ot = context.objectTypes.find(t => t.name == objectType);
		// if (!ot) { throw new Error(`Unable to find object type ${objectType}`)}

		return <div className={css.objectType} data-object-type={objectType}>
			{distinctTagValues.size > 1 && <div className={css.titlebar} onClick={() => enable && ( this.open = !this.open )}>
				<Button className={bp.Classes.MINIMAL} icon="property" text={i18n.translateObjectName(objectType)} rightIcon={open ? 'caret-up' : 'caret-down'} disabled={!enable}/>
			</div>}

			<Collapse isOpened={(open || distinctTagValues.size == 1) && enable} className={classNames(css.tags)}>
				<LoadingUntil loaded={!!this.objectTypeDescriptor}>
					<Observer>{ () => <React.Fragment key={objectType}>
						{this.displayTags.map( (t, i) => {
						    var valuesByField = distinctTagValues.get(objectType);
						    var entry = valuesByField.get(t._id || t.name);
						    if (entry) {
							    if (t.reserved) {
								    return <CatalogTagEntry key={`objectType_${i}`} context={context} entry={entry}/>;
							    } else {
								    return <CatalogTagEntry key={`objectType_${i}`} context={context} entry={entry} className={css.userTag} userTag={t}/>;
							    }
						    }
						})}
					</React.Fragment>}</Observer>
				</LoadingUntil>
			</Collapse>

			{/*<Collapse isOpened={open} className={css.tags}>*/}
			{/*{uiDef && uiDef.catalog && uiDef.catalog.tags*/}
			{/*? <React.Fragment key={ot}>*/}
			{/*<div key='header' className={css.header}>*/}
			{/*<a className={css.clearFilters} onClick={() => context.reset()}>Reset Search</a>*/}
			{/*</div>*/}

			{/*{uiDef.catalog.tags.map((f, i) => {*/}
			{/*var valuesByField = distinctTagValues.get(uiDef.objectType);*/}
			{/*if (!f.name) {*/}
			{/*console.warn(`Field defined in database is missing 'name' field.`, f)*/}
			{/*}*/}
			{/*else {*/}
			{/*var entry = valuesByField.get(f.name);*/}
			{/*if (!entry) {*/}
			{/*console.warn(`Unable to find field defined in UI definition - ${f.name} does not exist`)*/}
			{/*}*/}
			{/*else {*/}
			{/*return <CatalogTagEntry key={i.toString()} context={context} entry={entry} />;*/}
			{/*}*/}
			{/*}*/}
			{/*})}*/}
			{/*</React.Fragment>*/}
			{/*: <React.Fragment key="no-tags">*/}
			{/*<div>No Tags are Defined for {ot}</div>*/}
			{/*</React.Fragment>}*/}
			{/*</Collapse>*/}
		</div>;
	}
}

interface DistinctGroup {
	label: string;
	distinct: (OmdbDistinctValue | DistinctGroup)[] ;
	isGroup: true;
}

@observer
class CatalogTagEntry extends React.Component<{ className?: string, context: ObjectCatalogContext, entry: DistinctTagValue, userTag?: OmdbUserTag }, {}> {
	@observable open = true;

	_openStatusCopy;
	_toDispose = [];
	constructor(props) {
        super(props);
        makeObservable(this);
        const {entry, context} = this.props;
        // collapsing name by default when not in hierarchical view
        if (HIERARCHICAL_TAG[entry.tagName]) {
			this.open = context.isHierarchicalViewEnabled;
			this._toDispose.push(reaction(() => context.isHierarchicalViewEnabled, (isHierarchicalViewEnabled) => {
				const _openStatesCopy = this._openStatusCopy == null ? null : !!this._openStatusCopy;
				this._openStatusCopy = this.open;
				if (_openStatesCopy !== null) {
					this.open = _openStatesCopy;
				} else {
					this.open = this.props.context.isHierarchicalViewEnabled ? true : false;
				}
			}));
		}

        if (entry.distinct.length > 20) {
			this.open = false;
		}
    }

	componentWillUnmount() {
		this._toDispose.forEach( dispose => dispose() );
	}

	@computed get catalogTagName() {
		const { props: { userTag, entry, context}} = this;
		if (entry.label) {
			return entry.label;
		}
		if (userTag) {
			return userTag.label || utility.formatLabelText(userTag.name);
		} else {
			const formattedText = formatLabelText(entry.tagName);
			return _.get(i18n.databaseLookups.tags, formattedText, formattedText);
		}
	}

	@computed get distinct(): (OmdbDistinctValue | DistinctGroup)[] {
		const {props: { context, userTag, entry, entry: {distinct}}} = this;
		if (userTag) {
			return distinct
				.filter( d => {
					const value = d.value;
					return _.some(userTag.values, v => v._id == value);
				})
				.sort( (a,b) => {
					const aValue = a.value;
					const bValue = b.value;
					const aIndex = _.indexOf(userTag.values, _.find(userTag.values, v => v._id == aValue));
					const bIndex = _.indexOf(userTag.values, _.find(userTag.values, v => v._id == bValue));
					return aIndex-bIndex;
				})
		} else if (context.isHierarchicalViewEnabled && HIERARCHICAL_TAG[entry.tagName]) {
			const newDistinct = [];
			const groupMaps = new Map<string, DistinctGroup>();
			distinct.forEach( d => {
				const nameSplit = d.value.split(HIERARCHICAL_TAG[entry.tagName]);
				if (nameSplit.length == 1) {
					newDistinct.push(d);
					return;
				}
				nameSplit.pop(); // remove name;
				const folderKey = JSON.stringify(nameSplit);
				const testFolderKeys = [];
				while (nameSplit.length) {
					const folder = nameSplit.shift();
					const parentFolderKey = testFolderKeys.length && JSON.stringify(testFolderKeys);
					testFolderKeys.push(folder);
					const childFolderKey = JSON.stringify(testFolderKeys);
					if (!groupMaps.has(childFolderKey)) {
						const newGroup: DistinctGroup = {
							label: folder,
							distinct: [],
							isGroup: true
						}
						groupMaps.set(childFolderKey, newGroup);
						if (!parentFolderKey) {
							newDistinct.push(newGroup);
						} else {
							groupMaps.get(parentFolderKey).distinct.push(newGroup);
						}
					}
				}
				groupMaps.get(folderKey).distinct.push(d);
			});
			return newDistinct;
		}
		return distinct;
	}

	render() {
		const {open, distinct, props, props: {className}} = this;

		if (_.isEmpty(distinct)) { return null; }
		return (<div className={classNames(css.tag, className)}>
			<div className={css.titlebar} onClick={() => this.open = !open}>
				<span className={css.title}>{this.catalogTagName}</span>
				<Button className={bp.Classes.MINIMAL} icon={open ? 'caret-up' : 'caret-down'}/>
			</div>
			<div className={classNames({[css.open]: open}, css.tagValues)}>
				{distinct.map((v, i) => {
					if ((v as any).isGroup) {
						return <CatalogTagEntryValueGroup {...props} key={i.toString()} group={v as DistinctGroup} />;
					} else {
						return <CatalogTagEntryValue {...props} key={i.toString()} value={v as OmdbDistinctValue}/>;
					}
				})}
			</div>
		</div>);
	}
}

@observer
class CatalogTagEntryValueGroup extends React.Component<{ context: ObjectCatalogContext, entry: DistinctTagValue, userTag?: OmdbUserTag, group: DistinctGroup }, {}> {
    @observable isOpen = true;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get allChildrenDistinct () : OmdbDistinctValue[] {
		let rtnList = [];

		const getDistinctFormGroup = (group: DistinctGroup) => {
			group.distinct.forEach((v) => {
				if ((v as any).isGroup) {
					getDistinctFormGroup(v as DistinctGroup);
				} else {
					rtnList.push(v as OmdbDistinctValue);
				}
			})
		}
		getDistinctFormGroup(this.props.group);
		return rtnList;
	}

    @computed get childrenCheckedCount () {
		const {userTag, entry} = this.props;
		const tagName = userTag ? userTag.name : entry.tagName;
		const selectedValues = this.props.context.selectedTagValues.get(tagName);
		let count = 0;
		this.allChildrenDistinct.forEach( d => {
			if (_.some(selectedValues, s => s == this.getValue(d))) {
				count++;
			}
		});
		return count;
	}

    getValue (value: OmdbDistinctValue) {
		const {userTag} = this.props;
		let userTagValue = null;
		if (userTag) {
			userTagValue = _.find(userTag.values, v => v._id == value.value);
		}
		if (userTagValue) {
			return `${userTagValue.value}`;
		} else {
			return value.value?.toString() || '';
		}
	}

    render() {
		const {allChildrenDistinct, childrenCheckedCount, isOpen, props, props: {group}} = this;
		const childrenDistinctCount = allChildrenDistinct.length;
		if (!childrenDistinctCount) { return null; }

		return <div className={css.distinctGroup}>
			<div className={css.distinctGroupTitle}>
				<Checkbox checked={childrenDistinctCount == childrenCheckedCount}
				          indeterminate = {childrenCheckedCount > 0 && childrenDistinctCount != childrenCheckedCount}
				          onClick={this.toggleTagValue}
				          labelElement={<div style={{display: 'flex'}}>
					          <span className={css.tagValue}>
						          <span>{group.label}</span>
						          <span className={css.distinctCount}>({childrenDistinctCount})</span>
					          </span>
				          </div>}
				          large
				/>
				<Button className={css.distinctGroupTrigger} icon={isOpen ? 'caret-up' : 'caret-down'} small={true} minimal={true} onClick={() => this.isOpen = !isOpen}/>
			</div>

			<div className={classNames(css.distinctGroupItems, {[css.distinctGroupFolded]: !isOpen})}>
				{group.distinct.map((v, i) => {
					if ((v as any).isGroup) {
						return <CatalogTagEntryValueGroup {...props} key={i.toString()} group={v as DistinctGroup} />;
					} else {
						return <CatalogTagEntryValue {...props} key={i.toString()} value={v as OmdbDistinctValue} inFolder={true}/>;
					}
				})}
			</div>
		</div>;
	}

    @action toggleTagValue = async () => {
		const {allChildrenDistinct, childrenCheckedCount, props: {userTag, entry, context: {selectedTagValues}}} = this;
		const isChecked = allChildrenDistinct.length == childrenCheckedCount;
		const tagName = userTag ? userTag.name : entry.tagName;
		const selectedValues = selectedTagValues.get(tagName);
		const getValue = (value: OmdbDistinctValue) => {
			let parseValue = this.getValue(value);
			try {
				return JSON.parse(parseValue);
			} catch(e) {
				return parseValue;
			}
		};
		if (!isChecked) {
			if (!selectedValues) {
				selectedTagValues.set(tagName, observable.array(allChildrenDistinct.map( d => getValue(d))));
			} else {
				allChildrenDistinct.forEach(d => {
					const value = getValue(d);
					if (selectedValues.indexOf(value) < 0) {
						selectedValues.push(value);
					}
				});
			}
		} else if (selectedValues) {
			allChildrenDistinct.forEach(d => {
				const value = getValue(d);
				selectedValues.remove(value);
			});
			if (selectedValues.length == 0) {
				selectedTagValues.delete(tagName);
			}
		}
	}
}

@observer
class CatalogTagEntryValue extends React.Component<{ context: ObjectCatalogContext, entry: DistinctTagValue, userTag?: OmdbUserTag, value: OmdbDistinctValue, inFolder?: boolean }, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get tagName() {
		const {userTag, entry} = this.props;
		return userTag ? userTag.name : entry.tagName;
	}

    @computed get userTagValue() {
		const {userTag, value} = this.props;
		if (userTag) {
			return _.find(userTag.values, v => v._id == value.value);
		}
		return;
	}

    @computed get value() {
		const {userTagValue, props: {value}} = this;
		if (userTagValue) {
			return `${userTagValue.value}`;
		} else {
			return value.value?.toString() || '';
		}
	}

    @computed get label() {
		const {userTagValue, tagName, props: {value, inFolder, entry}} = this;
		let label, tag;
		if (userTagValue) {
			label = userTagValue.label || userTagValue.value || '';
			tag = <bp.Tag style={{color: userTagValue.color, background: userTagValue.background}}>{label.replace(/_/g, ' ')}</bp.Tag>
		} else if (value.isLoading){
			tag = <span className={bp.Classes.SKELETON}>Loading</span>;
		} else {
			label = value.label || '';
			if (!label) {
				label = `${value.value}`;
				if (inFolder === true && HIERARCHICAL_TAG[tagName] ) {
					label = label.split(HIERARCHICAL_TAG[tagName]).pop();
				}
			}

			label = _.get(i18n.databaseLookups.tagValues, label, label);

			tag = <span>{label.replace(/_/g, ' ')}</span>;
		}
		return <>{tag}<span className={css.distinctCount}>({value.count.toLocaleString()})</span></>
	}

    render() {
		const {tagName, label, value, userTagValue, props: {userTag, value: v, context: {selectedTagValues}, entry: {tagType}}} = this;
		if (v.count == 0) {
			return null;
		}
		if (userTag && !userTagValue) {
			return null;
		}
		if (v.missingMapping) {
			return null;
		}

		return <Observer>
			{() => <Checkbox checked={selectedTagValues.has(tagName) && selectedTagValues.get(tagName).find(tv => _.toString(tv) == _.toString(value)) != null}
			                 disabled={v.count == 0 || v.isLoading}
			                 onClick={this.toggleTagValue}
			                 key={v.value ? v.value.toString() : 'null'}
			                 labelElement={<div style={{display: 'flex'}}>
				                 <span className={css.tagValue} title={value.toString()}>{label}</span>
			                 </div>}
			                 large
			/>}</Observer>;
	}

    @action toggleTagValue = async () => {
		const {tagName, value, props: {context: {selectedTagValues}}} = this;
		let parseValue = null;
		try {
			parseValue = JSON.parse(value);
		} catch(e) {
			parseValue = value;
		}
		if (!selectedTagValues.has(tagName)) {
			selectedTagValues.set(tagName, observable.array([parseValue]));
		}
		else {
			const selected = selectedTagValues.get(tagName);
			let index = selected.slice().indexOf(parseValue);
			if (index == -1) {
				selected.push(parseValue);
			}
			else {
				selected.remove(selected[index]);

				// Avoid specify an empty selection in query. Fixes bug where empty query ([]) is expected to be null when comparing last query result.
				if (selected.length == 0) {
					selectedTagValues.delete(tagName);
				}
			}
		}
	}
}

@observer
@ContextMenuTarget
class CatalogDistinctSidebarPanel extends React.Component<MyProps & { sidebar: ObjectCatalogSidebar }, {}> {
	render() {
		let {props: {context, context: {distinctTagValues, loadedDistinct}}} = this;

		return <div key="distinct" className={css.catalogDistinctPanel}>
			<LoadingUntil className={css.sectionContainer} loaded={loadedDistinct} message="Loading catalog...">
				<div className={css.sidebarSections}>
					{Array.from(distinctTagValues.keys()).map(
						(ot, otIndex) => <CatalogSidebarSection key={ot} objectType={ot} context={context}/>)}

				</div>
				<div key='footer' className={css.footer}>
					<Tooltip className={css.clearFilters} disabled={context.dirty} content={"No Filters are Set"}>
						<Button text={i18n.intl.formatMessage(I18N_MESSAGES.clearFilter)} large disabled={!context.dirty} onClick={() => context.reset()}/>
					</Tooltip>
				</div>
			</LoadingUntil>
		</div>;
	}

	renderContextMenu() {
		const {props: {context, sidebar}} = this;

		return <Menu>
			<MenuItem disabled={!context.dirty} icon="filter-remove" text={i18n.intl.formatMessage(I18N_MESSAGES.clearFilter)} onClick={() => context.reset()} />
			{/*<MenuDivider/>
			<SidebarContextMenu_Settings sidebar={sidebar} />*/}
		</Menu>
	}
}

@observer
export class SidebarContextMenu_Settings extends React.Component<{sidebar: ObjectCatalogSidebar},{}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {swapPanels: onSwapPanels} = this;
		return <MenuItem icon="settings" text="Settings">
			<MenuItem icon={settings.catalog.showFolders ? 'tick' : 'blank'} text="Show Folder Panel" onClick={() => settings.catalog.showFolders = !settings.catalog.showFolders}/>
			<MenuItem icon="swap-vertical" disabled={!settings.catalog.showFolders} text="Swap Sidebar Panels" onClick={onSwapPanels} />
		</MenuItem>;
	}

    @action swapPanels = () => {
		settings.catalog.swapPanels = !settings.catalog.swapPanels

		var node = ReactDOM.findDOMNode(this.props.sidebar);
		var height = $(node).height();
		settings.catalog.sidebarSplitLocation = height - settings.catalog.sidebarSplitLocation;
	}
}

{/* GraphQL Version - NYI */}
/*
{
	false && <Query query={gql`
				${fragments.objectType}
				${fragments.DistinctFields_untyped}

				query catalogSidebarDistinct($input:  OmdbDistinctInput!, $objectTypes: [String!]!) {
					omdb {
						objectTypes(ids: $objectTypes) {
							...objectTypes

							ui {
								catalog
							}
						}

						raw {
							distinct(input: $input) {
								...distinctFields_untyped
							}
						}
					}
				}`} variables={{
		objectType: context.objectTypes.map(ot => ot.id),
		input:      {objectType: context.objectTypes.map(ot => ot.id), /!*tags: uiDef.catalog.tags.map(t => _.first(t.name.split('.')))*!/}
	}}>
		{({data, loading, error}) => {
			//console.log(data)
			// Todo - actually use the results of this query...
			return <div>

			</div>;
		}}
	</Query>
}*/
