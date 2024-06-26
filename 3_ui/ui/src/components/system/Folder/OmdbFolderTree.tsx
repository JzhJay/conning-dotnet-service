import type {ITreeNode, IconName} from '@blueprintjs/core';
import {ContextMenu, Menu, MenuItem, MenuDivider, ButtonGroup, Button, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Tooltip} from '@blueprintjs/core';
import gql from 'graphql-tag';
import { action, computed, observable, makeObservable } from 'mobx';
import {Query} from '@apollo/client/react/components';
import {SortableCardsPanel} from '../../index';
import {SidebarContextMenu_Settings} from '../ObjectCatalog/internal';
import * as css from './OmdbFolderTree.css'
import {observer} from 'mobx-react';
import {bp, LoadingUntil, ObservableTree} from 'components'
import {OmdbFolder, fragments, omdb, ChildFolderQuery, OmdbFolderItem, apolloStore, FolderTreeNode, FolderItemTreeNode, settings, utility} from 'stores'

interface MyProps {
	folder?: OmdbFolder;
	panel?: SortableCardsPanel;
}

class ObservableTreeNode implements bp.ITreeNode {
	@observable isExpanded ?: boolean = false;
	@observable isSelected ?: boolean = false;

	@observable hasCaret ?: boolean = true;
	id;
	label;

	constructor(node: bp.ITreeNode & any) {
        makeObservable(this);
        Object.assign(this, node);
    }
}

const omdbTreeIcons: { [name: string]: IconName } = {
	Simulation: "database",
	Folder:     "folder-close",
	Query:      "search"
}

class MyTreeNode<T> implements bp.ITreeNode {
    childNodes: ITreeNode[];
    @observable className: string;
    @observable hasCaret: boolean;
    @observable icon: IconName | JSX.Element;
    @observable id: string | number;
    @observable isExpanded: boolean;
    @observable isSelected: boolean;
    @observable label: string | JSX.Element;
    @observable.ref nodeData: T;
    @observable secondaryLabel: string | JSX.Element;

    constructor() {
        makeObservable(this);
    }
}

@observer
export class OmdbFolderTree extends React.Component<MyProps, {}> {
    lastRootQuery: any;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {treeNodes, focusedFolderTreeNode, selectedNodes, onNewFolder, onDeleteSelectedNodes, onNodeExpand, onNodeCollapse, onNodeClick, onNodeDoubleClick, onNodeContextMenu, props: {panel, folder}} = this;

		const treeProps = {
			key: 'folderTree',
			ref: r => this.tree = r,
			onNodeExpand,
			onNodeCollapse,
			onNodeDoubleClick,
			onNodeClick,
			onNodeContextMenu,
		}

		return (
			<div className={css.root} onContextMenu={this.onContextMenu}>
				<Navbar>
					<NavbarGroup>
						<NavbarHeading>System Folders</NavbarHeading>
					</NavbarGroup>
					<NavbarGroup align={bp.Alignment.RIGHT}>
						<ButtonGroup>
							<Tooltip disabled={!focusedFolderTreeNode || !focusedFolderTreeNode['folder']} content="New Folder">
								<Button icon="folder-new" disabled={!focusedFolderTreeNode || !focusedFolderTreeNode['folder']} onClick={() => onNewFolder(focusedFolderTreeNode, "untitled folder")}/>
							</Tooltip>
							<Button icon="insert" disabled={!focusedFolderTreeNode || !focusedFolderTreeNode['folder']} onClick={() => {}}/>
							<Tooltip disabled={selectedNodes.size == 0}
							         content={selectedNodes.size > 0 &&
							         `Delete ${selectedNodes.size > 1 ? `${selectedNodes.size} items` : _.first(Array.from(selectedNodes.values()))['name']}?`}>
								<Button icon="trash" disabled={selectedNodes.size == 0} onClick={() => onDeleteSelectedNodes()}/>
							</Tooltip>
						</ButtonGroup>
					</NavbarGroup>
				</Navbar>

				{folder
				 ? <ObservableTree {...treeProps}
				                   contents={this.foldersToTreeNodes([folder], {isExpanded: true})}/>
				 : <ChildFolderQuery query={omdb.graph.folder.query.foldersAtPath} variables={{path: null}} key="child-folder-query">
					 {({loading, error, data}) => {
						 if (loading || error || _.isEmpty(data)) {
							 return null;
						 }
						 else {
							 const {omdb: {typed: {folder: {find: {results}}}}} = data;

							 if (!treeNodes || this.lastRootQuery != results) {
								 this.lastRootQuery = results;
								 setTimeout(() => this.treeNodes = this.foldersToTreeNodes(results), 0);
							 }

							 return <ObservableTree {...treeProps} contents={this.treeNodes}/>
						 }
					 }}
				 </ChildFolderQuery>}
			</div>);
	}

    @computed get catalogContext() { return this.props.panel.props.catalogContext }

    @computed get selectedNodes() {
		return this.catalogContext.selectedTreeNodes;
	}

    @computed get focusedFolderTreeNode() {
		return this.catalogContext.focusedFolderTreeNode;
	}

    set focusedFolderTreeNode(value: ITreeNode) {
		this.catalogContext.focusedFolderTreeNode = value;
	}

    tree: ObservableTree;
    @observable.shallow treeNodes: ObservableTreeNode[];

    @action onNodeClick = async (node: ITreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		if (e.shiftKey || e.ctrlKey || e.metaKey) {

		}

		if (this.focusedFolderTreeNode) {
			this.focusedFolderTreeNode.isSelected = false;
			this.selectedNodes.delete(this.focusedFolderTreeNode.id);
		}
		node.isSelected = true;
		this.selectedNodes.set(node.id, node)
		this.focusedFolderTreeNode = node;
	}

    @action onNodeDoubleClick = async (node: ITreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		if (e.shiftKey || e.ctrlKey || e.metaKey) {

		}

		if (node.hasCaret) {
			node.isExpanded = !node.isExpanded;
		}
	}

    @action selectNode = (node: ITreeNode) => {
		if (this.focusedFolderTreeNode) {
			this.focusedFolderTreeNode.isSelected = false;

			this.selectedNodes.delete(this.focusedFolderTreeNode.id);
		}

		this.focusedFolderTreeNode = node;
		this.selectedNodes.set(node.id, node);
		node.isSelected = true;
	}

    /**
	 * Root of the tree context menu
	 */
    onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
		const {props: {panel: {catalogSidebar}}} = this;

		ContextMenu.show(
			<Menu>
				<MenuItem text="New Root Folder" onClick={() => this.onNewFolder(null)}/>

				<MenuDivider/>
				<SidebarContextMenu_Settings sidebar={catalogSidebar}/>

			</Menu>, {left: e.clientX, top: e.clientY});
		e.preventDefault();
	}

    @action onNodeContextMenu = async (node: FolderTreeNode & FolderItemTreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		this.selectNode(node);
		const {folder, folderItem} = node;
		const {catalogContext, props: {panel}} = this;

		ContextMenu.show(
			<Menu>
				{(folder || (folderItem && folderItem.itemType == "Folder")) && <>
					<MenuItem text="New Folder" onClick={() => this.onNewFolder(node)}/>
					{catalogContext && <>
						<MenuDivider/>
						<MenuItem text="Add Selection to Folder"
						          disabled={panel.selectedItems.size == 0}
						          onClick={() => catalogContext.addItemsToFolder(node, Array.from(panel.selectedItems.values()))}
						/>
					</>}

					<MenuDivider/>
					<SidebarContextMenu_Settings sidebar={panel.catalogSidebar}/>

					<MenuDivider/>
					<MenuItem text="Delete Folder" onClick={() => this.deleteFolder(node)}/>


				</>}

			</Menu>, {left: e.clientX, top: e.clientY});
		e.stopPropagation();
		e.preventDefault();
	}

    @action onNewFolder = async (parentNode: FolderTreeNode, name ?: string) => {
		if (!name) {
			name = window.prompt(!parentNode ? `Create a new root folder:` : `Create a new folder under '${parentNode.folder.name}':`, "untitled folder");
		}

		if (name) {
			var optimisticChildNode: FolderTreeNode = null;
			if (parentNode) {
				if (!parentNode.childNodes) {
					parentNode.childNodes = [];
				}
				optimisticChildNode =
					this.folderToTreeNode(parentNode, {hasChildren: false, _id: uuid.v4(), name: name, path: parentNode ? `${parentNode.folder.path}.${parentNode.folder._id}` : null});
				parentNode.childNodes.push(optimisticChildNode);
				parentNode.isExpanded = true;
				parentNode.hasCaret = true;
				this.selectNode(optimisticChildNode);
			}

			var path = this.pathFromNode(parentNode);
			var m = await apolloStore.client.mutate({
				mutation:       omdb.graph.folder.mutation.newFolder,
				variables:      {path, name},
				update:         (cache, {data: {omdb: {folder: {newFolder}}}}) => {

				},
				refetchQueries: !parentNode ? [{query: omdb.graph.folder.query.foldersAtPath, variables: {path}}] : null
			});
			const {omdb: {folder: {newFolder}}} = m.data;

			if (optimisticChildNode) {
				optimisticChildNode.id = newFolder._id;
				optimisticChildNode.folder = newFolder;
			}

			// Update the parent entry to include us
			if (parentNode) {
				if (!parentNode.folder.contents) {
					parentNode.folder.contents = [];
				}

				parentNode.folder.contents.push({_folder: parentNode.folder, itemId: newFolder._id, itemType: 'Folder'});
			}
		}
	}

    @action onDeleteSelectedNodes = async () => {
		var folders = Array.from(this.selectedNodes.values()).filter((node: any) => node.folder || (node.folderItem && node.folderItem.itemType == "Folder"));
		if (confirm(`Delete ${folders.length} item${folders.length > 1 ? 's' : ''}?`)) {
			for (var f of folders) {
				await this.deleteFolder(f as FolderTreeNode & FolderItemTreeNode, false);
			}
		}
	}

    @action deleteFolder = async (toDelete: FolderTreeNode & FolderItemTreeNode, confirm = true) => {
		if (!toDelete.folder || !confirm || window.confirm(`Delete '${toDelete.folder.name}'?`)) {
			/*var m = apolloStore.client.mutate({
				mutation:      omdb.graph.folder.mutation.deleteFolderItem,
				variables:      {
					id: toDelete.id,
					type: "Folder"
				},
				refetchQueries: [{query: omdb.graph.folder.query.foldersAtPath, variables: {parent: this.pathFromNode(toDelete)}}]
			});*/

			var m = apolloStore.client.mutate({
				mutation:     gql`
					mutation deleteItem($id: ObjectId!) {
						omdb { typed { ${_.camelCase(toDelete.nodeData as string)} { delete(id: $id) } } }
					}
				`, variables: {id: toDelete.id},
				// Causes recreation of all tree nodes, losing expansion/selection state
				// refetchQueries: [{query: omdb.graph.folder.query.foldersAtPath, variables: {parent: toDelete.folder ? toDelete.folder.path : null}}]
			});

			// Remove this folder from the parent
			const parent = toDelete.parent;
			if (parent) {
				parent.childNodes = parent.childNodes.filter(v => v != toDelete);
				parent.hasCaret = !_.isEmpty(parent.childNodes.length);

				this.selectNode(parent);
			}
			else {
				this.treeNodes = this.treeNodes.filter(tn => tn.id != toDelete.id);
			}
		}
	}

    loadChildrenNodes = (node: FolderTreeNode | FolderItemTreeNode | any, force = false) => {
		if (force || !node.childNodes) {
			let {folderItem, folder} = node;
			if (folderItem) {
				assert(folderItem.itemType == 'Folder');  // Todo - make an IExpandable perhaps to allow for drilling down beyond top level objects within this tree
			}
			folder = folder ? folder : folderItem.item as OmdbFolder;
			node.folder = folder;
			node.childNodes = this.contentsToTreeNodes(node, folder.contents);
		}
	}

    @action onNodeExpand = (node: FolderTreeNode & FolderItemTreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		this.expandNode(node);
	}

    @action expandNode = (node) => {
		// Load any missing children

		this.loadChildrenNodes(node);
		node.isExpanded = true;
		node.icon = "folder-open";
	}

    @action onNodeCollapse = (node: FolderTreeNode, nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
		node.isExpanded = false;
		node.icon = "folder-close";
	}

    private folderToTreeNode(parent: FolderTreeNode, f: OmdbFolder, defaults?: FolderTreeNode & any): ObservableTreeNode {
		var result = new ObservableTreeNode({
			parent:     parent,
			folder:     f,
			id:         f._id,
			isExpanded: false,
			isSelected: false,
			nodeData:   "Folder",
			icon:       omdbTreeIcons["Folder"],
			hasCaret:   f.hasChildren,
			...defaults
		}) as FolderTreeNode;

		result.label = (
			<div className={css.root} onContextMenu={this.onContextMenu}>
				{f.name ? f.name : `${f._id}`}
			</div>);

		result.childNodes = f.contents ? this.contentsToTreeNodes(result, f.contents) : null;

		if (result.isExpanded) {
			this.loadChildrenNodes(result);
		}

		return result;
	}

    private foldersToTreeNodes = (folders: Array<OmdbFolder>, defaults ?: FolderTreeNode & any): ObservableTreeNode[] => {
		return folders.map(f => this.folderToTreeNode(null, f, defaults));
	}

    private contentsToTreeNodes = (parent: FolderTreeNode | FolderItemTreeNode, contents: Array<OmdbFolderItem>): FolderItemTreeNode[] => {
		return contents && contents.map(item => {
			let treeNode: FolderItemTreeNode = new ObservableTreeNode({
				childNodes: null,
				isSelected: false,
				parent:     parent,
				folderItem: item,
				id:         item.itemId,
				icon:       omdbTreeIcons[item.itemType] ? omdbTreeIcons[item.itemType] : "blank",
				hasCaret:   item.itemType == "Folder" && item.item && item.item.hasChildren,
				//childNodes: this.contentsToTreeNodes(f.contents),
			}) as FolderItemTreeNode;

			treeNode.label = (<Query query={omdb.graph.folder.query.concreteFolderItem} variables={{id: item.itemId, type: item.itemType}}>
				{({loading, data, error = null}) => {
					if (!loading && !error) {
						const {omdb: {raw: {get}}} = data;

						if (get) {
							const {__typename, contents} = get;
							if (__typename == "Folder") {
								var folder = get as OmdbFolder;
								(treeNode as FolderTreeNode).folder = folder;
								treeNode.childNodes = this.contentsToTreeNodes(treeNode, folder.contents);
							}
							treeNode.nodeData = __typename;
						}

						setTimeout(() => treeNode.hasCaret = !_.isEmpty(treeNode.childNodes));
					}

					return <span className={classNames({[css.error]: error != null})}>
					                        {item.item && item.item.name ? item.item.name : loading ? '...' : !data.omdb.raw.get ? "Not Found" : data.omdb.raw.get.name ? data.omdb.raw.get.name
					                                                                                                                                                    : `${item.itemType}:${item.itemId}`}
				                        </span>
				}}
			</Query>);

			if (treeNode.isExpanded) {
				this.loadChildrenNodes(treeNode);
			}

			return treeNode;
		});

	};

    private pathFromNode(node: FolderTreeNode): string {
		if (!node || !node.folder) {
			return null;
		}

		const {folder} = node;
		if (folder.path) {
			return `${folder.path}.${folder._id}`;
		}

		return folder._id;
	}
}
