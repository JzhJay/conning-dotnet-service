import gql from "graphql-tag";
import {FormattedMessage} from 'react-intl';
import * as css from './OmdbAdminPage.css'
import {observer} from 'mobx-react';
import {bp, SortableCardsPanel, ApplicationPage, Splitter} from 'components';
import type {IObjectTypeDescriptor} from 'stores';
import {ObjectCatalogContext, settings, omdb, OmdbTag, IOmdbQueryGraph, apolloStore, slugs, utility, OmdbUserTag, site, i18n, Simulation, Query, IO, ClimateRiskAnalysis, UserFile} from 'stores';
import { action, computed, observable, makeObservable } from 'mobx';
import type {OmdbObjectSchema} from 'stores';
import {ActiveTool} from 'stores';
import {Alignment, AnchorButton, Button, Navbar, NavbarGroup, NavbarHeading, Tooltip, Tabs, Tab, MenuItem} from '@blueprintjs/core';
import {AutoSizer} from 'react-virtualized';
import {Select} from '@blueprintjs/select';
import * as tabs from './tabs';

export class OmdbAdminPageContext {

	@observable _key = uuid.v4();
	@observable _selectedObjectTypes: string[] = [];
	@observable _objectTypeDescriptors: IObjectTypeDescriptor[] = [];

	@observable schema: OmdbObjectSchema;
	@observable catalogContext: ObjectCatalogContext = null;
	@observable availableObjectTypes = new Set<string>();
	@observable loading = true;
	_isUpdate = false;

	constructor(paramObjectType) {
		makeObservable(this);
		let objectTypes = (paramObjectType ? [paramObjectType] : this.preferences.selectedObjectTypes) || [];

		if (!KARMA) {
			if (objectTypes.length == 1) {
				history.replaceState(null, null, `/${slugs.objectSchemas}/${objectTypes[0]}`);
			} else {
				history.replaceState(null, null, `/${slugs.objectSchemas}/`);
			}
		}

		this.loading = true;
		apolloStore.client.query<IOmdbQueryGraph>({
			query: omdb.graph.objectTypes,
			fetchPolicy:  'network-only'
		}).then( r => {
			if (r.errors) {
				throw r.errors;
			}
			r.data.omdb.objectTypes.filter(ot => ot.ui && ot.id != "Report").forEach( ot => {
				this.availableObjectTypes.add(ot.id);
				this._objectTypeDescriptors.push(ot);
			});

			objectTypes = _.filter(objectTypes, ot => this.availableObjectTypes.has(ot));
			if (!objectTypes?.length) {
				objectTypes = [this.availableObjectTypes.values().next().value];
			} else if (objectTypes.length > 1) {
				objectTypes = [objectTypes[0]];
			}

			this.selectedObjectTypes = objectTypes;
		}).finally(action(() => {
			this.loading = false;
		}));
	}

	dispose = () => {
		this.catalogContext?.dispose();
	}

	translateTagName = (tag: OmdbTag) => {
		if (tag.displayName) {
			return tag.displayName;
		}
		if (tag.reserved === false) {
			return tag.name;
		}
		const formattedName = utility.formatLabelText(tag.name);
		return _.get(i18n.databaseLookups.tags, [formattedName], formattedName);
	}

	get preferences() {
		return settings.pages.manageDataSchema;
	}

	@computed get isMultiTypeSelected() {
		return this.selectedObjectTypes?.length > 1;
	}

	@computed get selectedObjectTypes() {
		return this._selectedObjectTypes;
	}

	set selectedObjectTypes(newObjectTypes: string[]) {
		newObjectTypes = _.filter(newObjectTypes, ot => this.availableObjectTypes.has(ot));
		if(!newObjectTypes?.length) {
			return;
		}
		if ( _.isEqual(this.selectedObjectTypes, newObjectTypes)) {
			return;
		}

		// console.log("updateObjectTypes: " + newObjectTypes);
		newObjectTypes = _.filter(newObjectTypes, ot => this.availableObjectTypes.has(ot));

		if (!KARMA) {
			if (newObjectTypes.length == 0) {
				return;
			} else if (newObjectTypes.length == 1) {
				history.replaceState(null, null, `/${slugs.objectSchemas}/${newObjectTypes[0]}`);
			} else {
				history.replaceState(null, null, `/${slugs.objectSchemas}/`);
			}
		}

		const updateKey = this._selectedObjectTypes[0] != newObjectTypes[0];

		this._selectedObjectTypes = newObjectTypes;
		this.preferences.selectedObjectTypes = newObjectTypes;

		if (updateKey) {
			this.catalogContext?.dispose();
			this.catalogContext = new ObjectCatalogContext();
			this.catalogContext.replaceNewObjectTypes([this.firstSelectedObjectTypeDescriptor]);
			this._key = uuid.v4();
		}
	}

	@computed get firstSelectedObjectTypeText(): IObjectTypeDescriptor {
		return i18n.translateObjectName(this.selectedObjectTypes[0] || '');
	}

	@computed get firstSelectedObjectTypeDescriptor(): IObjectTypeDescriptor {
		return _.find(this.selectedObjectTypeDescriptors, (desc, i) => i == 0 );
	}

	@computed get selectedObjectTypeDescriptors(): IObjectTypeDescriptor[] {
		return _.map(this.selectedObjectTypes, sot => _.find(this._objectTypeDescriptors, desc => desc.id == sot));
	}

	getDescriptorByObjectType(objectType: string): IObjectTypeDescriptor {
		return _.find(this._objectTypeDescriptors, otd => otd.id == objectType);
	}

	@computed get reservedTags(): OmdbTag[] {
		if (!this.selectedObjectTypeDescriptors || this.selectedObjectTypeDescriptors.length != 1) {
			return [];
		}
		return this.selectedObjectTypeDescriptors[0].tags;
	}

	@computed get userTags(): OmdbUserTag[] {
		let rtnUserTags: OmdbUserTag[] = [];
		_.forEach(this.selectedObjectTypeDescriptors, (otDesc, index) => {
			let userTag = otDesc?.userTags || [];
			if (index == 0) {
				rtnUserTags = userTag;
				return;
			}
			rtnUserTags = _.filter(rtnUserTags, rut => _.some(userTag, ut => ut._id == rut._id));

		});
		return rtnUserTags;
	}

	@computed get tags(): OmdbTag[] {
		return [...this.userTags, ...this.reservedTags] as any;
	}

	@computed get tagsByName() {
		const {tags} = this;
		return _.keyBy(tags, t => t.name);
	}

	dirtyTagFilter(tags: {_id?: string, name?:string, reserved?: boolean}[], pickKeys: string[], objectTypeDescriptor: IObjectTypeDescriptor) : object[] {
		const allUserTagId = objectTypeDescriptor.userTags.map(tag => tag._id);
		const updateName = _.includes(pickKeys, "name");
		tags = _.filter(tags, tag => tag.reserved !== false || _.includes(allUserTagId, tag._id));
		tags = _.map(tags, tag => {
			if (tag.reserved === false && tag._id && updateName) {
				const userTagDef = _.find(objectTypeDescriptor.userTags, t => t._id = tag._id) as OmdbUserTag;
				userTagDef && (tag.name = userTagDef.name);
			}
			return _.pick(tag, pickKeys);
		});
		return tags;
	}

	@action saveUiCatalogToDatabase = async (objectTypeDescriptor: IObjectTypeDescriptor) => {
		objectTypeDescriptor.ui.catalog.tags = this.dirtyTagFilter(
			_.map(objectTypeDescriptor.ui.catalog.tags, tag => (typeof tag == "string") ? {name: tag as any} : tag),
			["_id", "name", "reserved"],
			objectTypeDescriptor
		);

		const doBusyCtrl = !site.busy;
		doBusyCtrl && (site.busy = true);
		await apolloStore.client.mutate({
			mutation:  gql`
				mutation updateUiTags($objectType: String!, $tags:[omdb_UiCatalogTag_update] ) {
					omdb {
						ui {
							catalog {
								update(objectType: $objectType, tags: $tags)
							}
						}
					}
				}
			`,
			variables: {objectType: objectTypeDescriptor.id, tags: objectTypeDescriptor.ui.catalog.tags}
		})
		.then(action(() => {
			this._isUpdate = true;
			this.catalogContext.reloadDistinct();
		}))
		.finally(action(() => doBusyCtrl && (site.busy = false)));
	}

	@action saveUiTableToDatabase = async (objectTypeDescriptor: IObjectTypeDescriptor) => {

		objectTypeDescriptor.ui.table.columns = this.dirtyTagFilter(
			objectTypeDescriptor.ui.table.columns,
			["_id", "name", "align", "defaultWidth", "internal", "wordWrap", "canSort", "reserved"],
			objectTypeDescriptor
		);

		const doBusyCtrl = !site.busy;
		doBusyCtrl && (site.busy = true);
		await apolloStore.client.mutate({
			mutation:  gql`
				mutation updateUiTags($objectType: String!, $frozenColumns: Int, $columns:[omdb_UiTableColumn_update] ) {
					omdb {
						ui {
							table {
								update(objectType: $objectType, frozenColumns: $frozenColumns, columns: $columns)
							}
						}
					}
				}
			`,
			variables: {objectType: objectTypeDescriptor.id, ...objectTypeDescriptor.ui.table}
		})
			.then( ()=> this._isUpdate = true )
			.finally(() => doBusyCtrl && (site.busy = false));
	}

	@action saveUiCardToDatabase = async (objectTypeDescriptor: IObjectTypeDescriptor) => {

		objectTypeDescriptor.ui.card.sections.forEach( sections => {
			sections.tags = this.dirtyTagFilter(
				sections.tags,
				["_id", "name", "hide", "viewableBy", "reserved"],
				objectTypeDescriptor,
			);
		});

		const doBusyCtrl = !site.busy;
		doBusyCtrl && (site.busy = true);
		await apolloStore.client.mutate({
			mutation:  gql`
				mutation updateUiTags($objectType: String!, $sections: [omdb_UiCard_update] ) {
					omdb {
						ui {
							card {
								update(objectType: $objectType, sections: $sections)
							}
						}
					}
				}
			`,
			variables: {objectType: objectTypeDescriptor.id, ...objectTypeDescriptor.ui.card}
		})
			.then( ()=> this._isUpdate = true )
			.finally(() => doBusyCtrl && (site.busy = false));
	}

	@action saveUiUniqueNameToDatabase = async (objectTypeDescriptor: IObjectTypeDescriptor) => {
		await apolloStore.client.mutate({
			mutation:  gql`
				mutation updateUiTags($objectType: String!, $uniqueName: Boolean ) {
					omdb {
						ui {
							uniqueName {
								update(objectType: $objectType, uniqueName: $uniqueName)
							}
						}
					}
				}
			`,
			variables: {objectType: objectTypeDescriptor.id, uniqueName: objectTypeDescriptor.ui.uniqueName}
		}).then( ()=> this._isUpdate = true );
	}

	@action removeCache = () => {
		if (!this._isUpdate) {
			return;
		}
		const cacheData = (apolloStore.client.cache as any)?.data;
		if (!cacheData || !cacheData.data) {
			return;
		}
		_.forEach(Array.from(this.availableObjectTypes), objectType => {
			const matchRegExp = new RegExp(`OmdbObjectType:${objectType}`, '');
			let deleteCount = 0;
			Object.keys(cacheData.data).forEach(key => {
				if (key.match(matchRegExp)) {
					// console.log("remove cache - " + key);
					cacheData.delete(key);
					deleteCount++;
				}
			})
			console.log(`Delete Apollo cache: ${matchRegExp.source} (${deleteCount})`);
		});
	}

	@action forceReQuery = async () => {
		await this.catalogContext.runQuery(true, null, null, () => true);
	}

	updateObjectUserTagValue = async (objectType: string, objectId: string, mewTagValueIds: string[]) => {
		const doBusyCtrl = !site.busy;
		doBusyCtrl && (site.busy = true);
		await apolloStore.client.mutate({
			mutation:  gql`
				mutation updateUserTagValues($id: ID!, $tagValueIds: [ID!]) {
					omdb {
						typed {
							${_.camelCase(objectType)} {
							updateUserTagValues(id: $id, tagValueIds: $tagValueIds) {
								... on DbObject {
									_id
								}
								... on Simulation {
									userTagValues {
										_id
									}
								}
								... on Query {
									userTagValues {
										_id
									}
								}
							}
						}
					}
				}
			}`,
			variables: {id: objectId, tagValueIds: mewTagValueIds}
		})
			.finally(() => doBusyCtrl && (site.busy = false));
	}
}

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	params?: { objectType?: string }
}

@observer
export class OmdbAdminPage extends React.Component<MyProps, {}> {

	static get APPLICATION_TITLE_SHORT() { return i18n.intl.formatMessage({defaultMessage: "Object Schemas", description:"[OmdbAdminPage] the page title display on the browser tab and system application menu"}) };
	static get APPLICATION_TITLE_LONG() { return i18n.intl.formatMessage({defaultMessage: "Manage Object Schemas", description:"[OmdbAdminPage] the page title display on the page's top-left button"}) };

	splitter;

	@observable pageContext = new OmdbAdminPageContext(this.props?.params?.objectType);

	constructor(props) {
		super(props);

		makeObservable(this);
	}

	componentWillUnmount() {
		!this.pageContext.loading && this.pageContext.removeCache();
		this.pageContext.dispose();

		// Bug in Splitter library that adds resize listener but doesn't remove it on unmount
		// https://github.com/martinnov92/React-Splitters/issues/9
		if (this.splitter) {
			window.removeEventListener('resize', this.splitter.getSize);
			document.removeEventListener('mouseup', this.splitter.handleMouseUp);
			document.removeEventListener('touchend', this.splitter.handleMouseUp);
			document.removeEventListener('mousemove', this.splitter.handleMouseMove);
			document.removeEventListener('touchmove', this.splitter.handleMouseMove);
		}
	}

	render() {
		const {props: {location}, pageContext, pageContext: { firstSelectedObjectTypeDescriptor, catalogContext, preferences, preferences: {uiTab, preview, previewView, splitLocation}}} = this;

		return <ApplicationPage className={css.root}
		                        title={() => OmdbAdminPage.APPLICATION_TITLE_LONG}
		                        tool={ActiveTool.preferences}
		                        breadcrumbs={() => [
			                        <div key="bc" className={bp.Classes.BREADCRUMB}>
				                        <AnchorButton className={bp.Classes.MINIMAL} icon="database">{OmdbAdminPage.APPLICATION_TITLE_SHORT}</AnchorButton>
			                        </div>
		                        ]}
		                        loaded={!pageContext.loading}
		                        renderToolbar={this.renderToolbar}>
			<AutoSizer>
				{({width, height}) => <div key="dynamic-panel" style={{overflow: 'hidden', width, height}}>
					<Splitter
						className={css.splitter}
						key="details-splitter"
						position="horizontal"
						ref={s => this.splitter = s}
						primaryPaneMaxHeight="70%"
						primaryPaneMinHeight="2%"
						primaryPaneHeight={splitLocation}
						dispatchResize={true}
						maximizedPrimaryPane={!preview}
						onDragFinished={(e) => {
							if (!_.isNaN(this.splitter.state.primaryPane)) {
								preferences.splitLocation = this.splitter.state.primaryPane;
							}
						}}
						postPoned={false}>

						<div className={css.top}>
							<Tabs id={`ui-tabs`} large selectedTabId={uiTab} animate renderActiveTabPanelOnly onChange={(tab: string) => {
								if(tab != "tags" && pageContext.isMultiTypeSelected) {
									site.toaster.show({
										intent: bp.Intent.WARNING,
										timeout: 30000,
										message: i18n.intl.formatMessage({
											defaultMessage: 'Selected Tag does not support multiple object types. using the first type instead.',
											description: "[OmdbAdminPage] warning message - multiple types selected, but we are not support this operate now"
										})});
									pageContext.selectedObjectTypes = [pageContext.firstSelectedObjectTypeDescriptor.id];
								}
								preferences.uiTab = tab
							}}>
								<Tab id="tags"
								     title={i18n.intl.formatMessage({
									     defaultMessage: "Manage Tags",
									     description: "[OmdbAdminPage] tab text - Indicates page which list the system tag and user tag and mange it"
									 })}
								     panel={<tabs.OmdbTagsEditor context={pageContext}/>}
								/>
								<Tab id="catalog"
								     title={i18n.intl.formatMessage({
									     defaultMessage: "Catalog Categories",
									     description: "[OmdbAdminPage] tab text - Indicates page which mange catalog and layout on the object browser sidebar"
									 })}
								     panel={<tabs.CatalogSidebarTags context={pageContext} objectTypeDescriptor={firstSelectedObjectTypeDescriptor}/>}
								/>
								<Tab id="layout"
								     title={i18n.intl.formatMessage({
									     defaultMessage: "Layout",
									     description: "[OmdbAdminPage] tab text - Indicates page which mange card and table layout on the object browser"
									 })}
								     panel={<tabs.OmdbUiLayoutTab context={pageContext} objectTypeDescriptor={firstSelectedObjectTypeDescriptor}/>}
								/>

								<Tabs.Expander/>
								{/*{DEV_BUILD && <Tab id="import" title="Migrate from Julia" panel={<tabs.ImportFromJuliaTab context={pageContext}/>}/>}*/}
							</Tabs>
						</div>
						{/* Bottom of horizontal splitter */}
						{(firstSelectedObjectTypeDescriptor && preview) ? <SortableCardsPanel
							key={pageContext._key}
							loaded={!pageContext.loading}
							className={css.bottom}
							catalogContext={catalogContext}
							queryParams={location.query}
							view={previewView}
							onSetView={v => preferences.previewView = v}
							uiDefinition={firstSelectedObjectTypeDescriptor.ui}
							updateUrl={false}
						/> : <div></div>}
					</Splitter>
				</div>}
			</AutoSizer>
		</ApplicationPage>;
	}

	renderToolbar = () => {


		const {pageContext, pageContext:{ availableObjectTypes, selectedObjectTypes, preferences, preferences: {preview}}} = this;
		return (
			<Navbar>
				<NavbarGroup>
					<NavbarHeading><FormattedMessage defaultMessage={"Object Type:"} description={"[OmdbAdminPage] header tag - Indicates the object type we mange currently"} /></NavbarHeading>
					<Select items={Array.from(availableObjectTypes)}
					        filterable={false}
					        activeItem = {selectedObjectTypes[0]}
					        onItemSelect={item => pageContext.selectedObjectTypes = [`${item}`]}
					        itemRenderer={(item, {handleClick, modifiers}) => {
						        return <MenuItem
							        key={item}
							        text={i18n.translateObjectName(item)}
							        active={modifiers.active}
							        onClick={handleClick}
						        />
					        }}>
						<Button text={pageContext.firstSelectedObjectTypeText} rightIcon='caret-down'/>
					</Select>
				</NavbarGroup>

				<NavbarGroup align={Alignment.RIGHT}>
					<Tooltip content={i18n.intl.formatMessage({defaultMessage: "Toggle Preview Panel", description: "[OmdbAdminPage] tooltip - show/hide the preview panel on the bottom of page"})} position={bp.Position.BOTTOM}>
						<Button active={preview} onClick={() => preferences.preview = !preview} icon="changes"/>
					</Tooltip>
				</NavbarGroup>
			</Navbar>
		);
	}
}