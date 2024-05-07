import {MenuItem, Checkbox} from '@blueprintjs/core';
import {OmdbTableBuilder} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/UiLayout/TableBuilder';
import { computed, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {visibleTagUtil} from 'stores/objectMetadata/VisibleTags';
import {i18n, ObjectCatalogContext, OmdbCardTag, OmdbTag, user, utility} from '../../../stores';
import {SortableCardsPanel} from '../../index';
import * as css from './TagVisibilitySubMenu.css';

interface MyProps {
	objectType: string;
	catalogContext: ObjectCatalogContext;
	visibleTags: Map<string, boolean>;
	view?: 'card'|'table';
}

@observer
export class TagVisibilitySubMenu extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    get view() {
		if (this.props.view) {
			return this.props.view;
		}
		return user.settings.searchers[_.camelCase(this.props.objectType)]?.view || 'card';
	}

    get objectKey() {
		if (this.view == 'card') {
			return visibleTagUtil.getVisibilityKey_card(this.props.objectType);
		} else {
			return visibleTagUtil.getVisibilityKey_table([this.props.objectType]);
		}
	}

    @computed get availableTags(): OmdbTag[] {
		let objectTypeObj = this.props.catalogContext.getObjectType(this.props.objectType);
		if (!objectTypeObj || !objectTypeObj.ui) {
			return [];
		}
		const allTags: OmdbTag[] = [ ...objectTypeObj.userTags as OmdbTag[], ...objectTypeObj.tags];
		let returnTags: OmdbTag[];
		if (this.view == 'card') {
			const allCardTags: OmdbCardTag[] = _.flatten(objectTypeObj.ui.card.sections.map(s => s.tags));
			returnTags = allCardTags.filter( cardTag => cardTag.hide !== true ).map( cardTag => {
				return _.find(allTags, tag => cardTag.reserved !== false ? tag.name == cardTag.name : tag._id == cardTag._id);
			});
		} else {
			const allTableColumns: any[] = objectTypeObj.ui.table.columns.filter( column => column.name != SortableCardsPanel.NAME_FIELD);
			returnTags = allTableColumns.map( tableColumn => {
				return _.find(allTags, tag => tableColumn.reserved !== false ? tag.name == tableColumn.name : tag._id == tableColumn._id);
			});
		}
		return returnTags.filter( t => !!t);
	}

	updateVisibleTagsSettings = () => {
		const {availableTags, props: {visibleTags}} = this;
		// remove dirty data and write the values into the object for saving to user metadata.
		Array.from(visibleTags.keys()).forEach( k => {
			if (this.props.view == 'table' && _.includes(OmdbTableBuilder.CAN_NOT_DELETE_COLUMN, k)) {
				return;
			}
			if (!_.some(availableTags, omdbTag => (omdbTag._id || omdbTag.name) == k)) {
				visibleTags.delete(k);
			}
		});
		visibleTagUtil.setVisibleTagsSetting(this.objectKey, visibleTags);
	}

    isTagVisible = (tag: OmdbTag) => {
		// Store visible tags instead
		const {visibleTags} = this.props;
		if (tag._id) {
			return visibleTags.get(tag._id) !== false;
		} else {
			return visibleTags.get(tag.name) !== false;
		}
	}

    toggleTagVisibility = (tag: OmdbTag) => {
		const {visibleTags} = this.props;

		if (this.isTagVisible(tag)){
			if (tag._id) {
				visibleTags.set(tag._id, false);
			} else {
				visibleTags.set(tag.name, false);
			}
		}
		else {
			if (tag._id) {
				visibleTags.delete(tag._id);
			} else {
				visibleTags.delete(tag.name);
			}
		}
		this.updateVisibleTagsSettings();
	}

    componentDidMount() {
		// This hack prevents the tag visibility sub menu from automatically being shown on table header dropdown click.
		// Blueprint tries to find an element to autofucs and if it can't it focuses our submenu.
		// We can avoid this behavior by adding an autofucus attribute to our root node which causes blueprint to focus it instead without a side-effect.
		$(ReactDOM.findDOMNode(this)).attr({autofocus:true})
	}

    render() {
	    const {availableTags} = this;
	    // Menu item close delay is needed to ensure that popup isn't dismissed before click is processed. Only an issue when submenu is displayed via clicking on table header.
		return (
			!_.isEmpty(availableTags) && <div className={css.container}>
				<MenuItem
					text={i18n.intl.formatMessage({defaultMessage: "Display Tags", description: "[TagVisibilitySubMenu] choose which tags will show on a card"})}
					popoverProps={{usePortal:false, hoverCloseDelay:1000}} icon={'blank'}
				>
				{availableTags.map(tag => {
					let text = null;
					if (!tag._id) {
						text = utility.formatLabelText(_.first((tag.label || tag.name).split('.'))).capitalize().replace('_', ' ');
						text = _.get(i18n.databaseLookups.tags,[text], text);
					} else {
						text = tag.label || utility.formatLabelText(_.first(tag.name.split('.'))).capitalize().replace('_', ' ');
					}
					return (<MenuItem key={tag.name}
					                  text={text}
					                  shouldDismissPopover={false}
					                  onClick={() => this.toggleTagVisibility(tag)}
					                  icon={<Checkbox className={css.toggleTagVisibility} checked={this.isTagVisible(tag)} onClick={() => this.toggleTagVisibility(tag)}/>}
							/>)
				})}
				</MenuItem>
			</div>)
	}
}