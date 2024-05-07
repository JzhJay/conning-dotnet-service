import gql from 'graphql-tag';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import {appIcons, OmdbFolder, fragments, GetFolderQuery, ObjectTypeQuery, ObjectTypesQuery, omdb, omdbGraph, routing, api, site} from 'stores';
import {bp, sem, SmartCardProps, SortableCardsPanel, SmartCard, Highlighter, OmdbFolderTree} from 'components';
import * as css from "./FolderCard.css"
import {FormattedMessage} from 'react-intl';

interface MyProps extends SmartCardProps {
	folder: any;
	panel?: SortableCardsPanel;
}

@observer
//@bp.ContextMenuTarget
export class FolderCard extends React.Component<MyProps, {}> {

	render() {
		const {props: {className, panel, panel: {props: {catalogContext}}, isTooltip, ...props}} = this;
		var folder = props.folder as OmdbFolder;

		return <SmartCard
					className={classNames(className, css.root)}
					appIcon={{type: 'blueprint', name: 'folder-close'}}
					panel={panel}
					propagateClick={false}
					isTooltip={isTooltip}
					{...props}
					onClick= {e => catalogContext.setPath(props.folder.name)}
					//onDoubleClick= {e => catalogContext.addToPath(props.model.name)}
					title={{name: 'name', value: props.folder.name}}
					onRename={async(newName) => {
						const oldName = props.folder.name;
						if (newName == oldName) {
							return;
						}
						const objectTypes = catalogContext.objectTypes;
						site.busy = true;
						try {
							let updateCount = 0;
							let newPath = "";
							for (let i = 0; i < objectTypes.length; i++) {
								const rtn = await omdb.updateFolderName(objectTypes[i].id, oldName, newName);
								updateCount += rtn.count;
								if (!newPath && catalogContext.path && rtn.newName.indexOf(catalogContext.path) != 0) {
									newPath = rtn.newName.replace(/\/[^\/]*\/?$/, ''); //remove last level
								}
							}
							if (newPath) {
								catalogContext.path = newPath;
							}
							if (updateCount > 0) {
								await catalogContext.refresh();
							}

						} finally {
							site.busy = false;
						}
					}}
				>
			<div className={css.folderContent}>
				<bp.Icon icon="folder-close"/>
				<span className={css.itemCount}><FormattedMessage defaultMessage="{itemCount, plural, =0 {no Items} one {1 Item} other {{itemCount} Items}}" description= "[FolderCard] the number of objects/items in a folder" values={{itemCount: this.props.folder.numObjects}} /></span>
			</div>
		</SmartCard>

	}

	renderContextMenu(e) {
		return null;
		// const {sim, panel} = this.props;
		// return <SimulationContextMenu location='card' simulation={sim} panel={panel}/>
	}
}

export class FolderComponent extends React.Component<{ folder: OmdbFolder, searchText?: string, isTooltip?: boolean }, {}> {
	render() {
		const {folder, searchText, isTooltip} = this.props;
		if (!folder) return null;

		return <sem.List.Item icon='folder open'
		                      content={
			                      <bp.Popover interactionKind={bp.PopoverInteractionKind.HOVER} disabled={isTooltip}
			                                  content={<FolderCard showHeader={false} isTooltip folder={folder}/>}>
				                      <Link to={`/folder/${folder._id}`}>
					                      <Highlighter
						                      searchWords={searchText ? searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
						                      textToHighlight={folder.name ? folder.name : '(Root)'}/>
				                      </Link>
			                      </bp.Popover>
		                      }
		/>

	}
}