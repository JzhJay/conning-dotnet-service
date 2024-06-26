import {observer} from 'mobx-react';
import * as React from 'react';
import {isDarkColor} from 'utility/utility';
import * as css from './TagValuesEditor.css';
import {OmdbTag, OmdbUserTagValue, apolloStore, fragments, omdb, site, i18n, ObjectNameChecker} from 'stores';
import {bp, sem, ReactSortable, OmdbAdminPageContext} from 'components';
import {SortableElement, SortableContainer, SortableContainerProps, SortableElementProps, SortableHandle} from 'react-sortable-hoc';
import {AnchorButton, Button, ButtonGroup, Dialog, Navbar, NavbarGroup, Popover, Tooltip, Checkbox, Radio} from '@blueprintjs/core';

const {Form, Input} = sem;
import {PhotoshopPicker, SliderPicker, SketchPicker} from 'react-color';
import {action, computed, observable, reaction, makeObservable, runInAction} from 'mobx';
import gql from 'graphql-tag';
import FlipMove from 'react-flip-move';

const DragHandle = SortableHandle(() => <bp.Icon icon='drag-handle-vertical' className={classNames(css.dragHandle, 'draggable')}/>)

class TagValueStore {

	static async add(tag: OmdbTag) {
		if (tag.values == null)
			runInAction(() => tag.values = []);

		const newValue = await (new ObjectNameChecker({
			defaultName: i18n.intl.formatMessage({
				defaultMessage: `Tag Value`,
				description: "[TagValueStore] default new tag value name, which used to tag/identify system objects"
			}),
			type: "numeric",
			alwaysAddSequence: true,
			sequenceStartFrom: 1,
			customizeCompareList: () => {
				return _.map(tag.values, v=> v.value);
			}
		})).getAvailableName(null);

		const newTagValue: OmdbUserTagValue = {value: newValue, background: '#000000', color: "#FFFFFF", order: tag.values.length}

		site.busy = true;
		await apolloStore.client.mutate({
			mutation: gql`
				${fragments.userTagValue}
				mutation addUserTagValue($tagValue: omdb_UserTagValue_insert) {
					omdb {
						typed {
							userTagValue {
								insert(values: [$tagValue]){
									...userTagValue
								}
							}
						}
					}
				}
			`,
			variables: {tagValue: {...newTagValue, tag: tag._id}}
		}).then( result => {
			if (result.data) {
				result.data.omdb.typed.userTagValue.insert.forEach(action(d => tag.values.push(d)));
			}
			return result;
		}).finally(() => {
			site.busy = false;
		});
	}

	static async updateSingle(tagValue: OmdbUserTagValue, paramName, paramValue, updateImmediately: boolean = true) {
		let param = {};
		param[paramName] = paramValue;
		await TagValueStore.update( tagValue, param, updateImmediately);
	}

	static async update(tagValue: OmdbUserTagValue, params: Object, updateImmediately: boolean = true) {

		let oldData = {};
		if (updateImmediately) {
			_.assign(oldData, tagValue);
			runInAction(() => _.assign(tagValue, params));
		}

		site.busy = true;
		 await apolloStore.client.mutate({
			 mutation:  gql`
				mutation updateUserTagValue($id: ID!, $value: omdb_UserTagValue_update!) {
					omdb {
						typed {
							userTagValue {
								update(id: $id, value: $value)
							}
						}
					}
				}
			`,
			 variables: {id: tagValue._id, value: params}
		 }).then( result => {
		 	const data = result.data && result.data.omdb.typed.userTagValue.update;
		 	if ( !updateImmediately && data && data._id == tagValue._id) {
			    runInAction(() => _.assign(tagValue, data));
		    } else if(updateImmediately && !data) {
		 		// if update fail. recovery data.
			    runInAction(() => _.assign(tagValue, oldData));
		    }
		 	return result;
		 }).finally(() => {
			 site.busy = false;
		 });

	 }

	static async delete(tag: OmdbTag, tagValue: OmdbUserTagValue) {
		let {values: tagValues} = tag;

		let r = await omdb.runQuery({objectTypes: tag.objectTypes, where: {userTagValues: [tagValue._id]}});
		if (r.result.total > 0 && !(await site.confirm(`${tagValue.label || tagValue.value} is referenced by ${r.result.total} objects. Deleting will remove all references.`))) {
			return;
		}

		site.busy = true;
		await apolloStore.client.mutate({
			mutation: gql`
				mutation delete($id: ObjectId!) {
					omdb {
						typed {
							userTagValue {
								delete(id: $id)
							}
						}
					}
				}`,
			variables: {id: tagValue._id}
		}).then((result) => {
			if (result.data) {
				runInAction(() => _.pull(tagValues, tagValue));
			}
			return result;
		}).finally(() => {
			site.busy = false;
		});
	}

	static async setDefaultToRecords(tag: OmdbTag){
		site.busy = true;
		await apolloStore.client.mutate({
			mutation:  gql`
				mutation updateTagDefault($tagId: String!) {
					omdb {
						userTagDefault {
							set(tagId: $tagId)
						}
					}
				}
			`,
			variables: {tagId: tag._id}
		}).finally(() => {
			site.busy = false;
		});
	}
}

@observer
class SortableTagValue extends React.Component<{ tag: OmdbTag, tagValue: OmdbUserTagValue } & SortableElementProps, {}> {
	tagValueInput: sem.Input;

	setBackgroundColor = (pickColor) => {
		const {tagValue} = this.props;
		const {rgb: {r, g, b, a}} = pickColor;
		TagValueStore.update(tagValue, {
			background: `rgba(${r}, ${g}, ${b}, ${a})`,
			color: isDarkColor(r, g, b, a) ? '#FFFFFF' : '#000000'
		});
	}

	setAsDefault = (e) => {
		const {tagValue, tag, tag: {multiple}} = this.props;
		const updated_checked = e.target.checked;
		if(!multiple) {
			if (updated_checked) {
				tag.values.filter( v => v.isDefault).forEach( v => {
					TagValueStore.update(v, { isDefault: false });
				})
			} else {
				e.target.checked = true;
				return;
			}
		}
		TagValueStore.update(tagValue, { isDefault: updated_checked });
	}

	deleteItem = () => {
		const {tag, tagValue} = this.props;
		TagValueStore.delete(tag, tagValue).then((r) => {
			const itemOrder = tagValue.order;
			tag.values.forEach( (v,i) => {
				if (v.order > itemOrder) {
					TagValueStore.updateSingle(v, 'order', v.order-1);
				}
			})
		})
	}

	render() {
		const {index, tag, tagValue, tagValue: {value, align, background, color, isDefault}} = this.props;

		const setAsDefaultBtnAttrs = {
			checked: !!tagValue.isDefault,
			onChange: this.setAsDefault,
			large: true
		}

		const column1 = i18n.intl.formatMessage({defaultMessage: `Value`, description: "[EditTagValuesDialog] column - Indicates the value of the user tag's sub-option"});
		const column2 = i18n.intl.formatMessage({defaultMessage: `Color`, description: "[EditTagValuesDialog] column - Indicates the background color of the user tag's sub-option"});
		const column3 = i18n.intl.formatMessage({defaultMessage: `Preview`, description: "[EditTagValuesDialog] column - Indicates the style preview of the user tag's sub-option"});
		const tooltip1 = i18n.intl.formatMessage({defaultMessage: `Click To Set Background Color`, description: "[EditTagValuesDialog] tooltip - Indicates the background color of the user tag's sub-option"});
		const tooltip2 = i18n.intl.formatMessage({defaultMessage: `Remove Value`, description: "[EditTagValuesDialog] tooltip - delete the user tag's sub-option that to be used to tag/identify system objects"});

		return <div className={css.tagValue}>
			<Form as="div">
				<Form.Group>
					<Form.Field>
						<label></label>
						<DragHandle/>
					</Form.Field>
					<Form.Field width={5}>
						<label>{column1}</label>
						<Input width={6}
						       placeholder={i18n.intl.formatMessage({
							       defaultMessage: `Tag Value`,
							       description: "[TagValueStore] default new tag value name, which used to tag/identify system objects"
						       })}
						       value={value}
						       ref={r => this.tagValueInput = r}
						       onChange={(e, data) => TagValueStore.updateSingle(tagValue, 'value', data.value) }/>
					</Form.Field>

					<Form.Field>
						<label>{column2}</label>
						<div style={{display: 'flex', flexGrow: 1, lineHeight: 0, flexDirection: 'row', alignItems: 'center'}}>
							<Popover interactionKind={bp.PopoverInteractionKind.CLICK}
							         content={<SketchPicker color={background} onChange={this.setBackgroundColor}/>}>
								<Tooltip content={tooltip1}>
									<button className={css.swatch} style={{background: background}} />
								</Tooltip>
							</Popover>
						</div>
					</Form.Field>

					<Form.Field width={4}>
						<label>{column3}</label>
						<bp.Tag className={css.preview} style={{background, color}}>{value}</bp.Tag>
					</Form.Field>

					{tag.required && <Form.Field>
						<label>Default</label>
						<div className={css.defaultCheckbox}>
							{tag.multiple ? <Checkbox {...setAsDefaultBtnAttrs}/> : <Radio  {...setAsDefaultBtnAttrs}/>}
						</div>
					</Form.Field>}

					<Form.Field style={{textAlign: 'right'}}>
						<label>
						</label>
						<ButtonGroup minimal className="right floated">
							<Tooltip content={tooltip2}>
								<AnchorButton icon='trash' onClick={this.deleteItem}/>
							</Tooltip>
						</ButtonGroup>
					</Form.Field>
				</Form.Group>
			</Form>
		</div>
	}
}

const SortableTagValueElement = SortableElement(SortableTagValue);

const SortableContainerWrapper = SortableContainer(({children}) => {
	return <div>{children}</div>;
});

@observer
class SortableTagValues extends React.Component<{ tag: OmdbTag } & SortableContainerProps, {}> {

	moveItem = ({oldIndex, newIndex}) => {
		if (oldIndex == newIndex) {
			return;
		}
		const {tag:{values: tagValues}} = this.props;
		const actionTagValue = tagValues[oldIndex];
		tagValues.splice(oldIndex, 1);
		tagValues.splice(newIndex, 0, actionTagValue);
		tagValues.forEach((tv,i) => {
			if (tv.order !== i) {
				TagValueStore.updateSingle(tv, 'order', i);
			}
		});
	}

	render() {
		const {tag, tag: {values: tagValues}} = this.props;

		const addBtnText = i18n.intl.formatMessage({defaultMessage: `Add A New Tag Value`, description: "[EditTagValuesDialog] add the user tag's sub-option that to be used to tag/identify system objects"});

		return <FlipMove maintainContainerHeight className={css.tagValues}>
			{tagValues && <SortableContainerWrapper onSortEnd={this.moveItem} useDragHandle>
				{tagValues.map((v, i) => <SortableTagValueElement index={i} key={i.toString()} tag={tag} tagValue={v}/>)}
			</SortableContainerWrapper>}

			<Form as="div">
				<Form.Group>
					<Form.Field width={1}>
						<label/>
					</Form.Field>
					<Form.Field>
						<a key='add-value' onClick={() => TagValueStore.add(tag)}>{addBtnText}</a>
					</Form.Field>
					<Form.Field /> {/* Fill remaining space */}
				</Form.Group>
			</Form>
		</FlipMove>
	}
}

const SortableTagValueContainer = SortableContainer(SortableTagValues);

interface EditTagValuesProps {
	tag: OmdbTag,
	onClose: () => void,
	context: OmdbAdminPageContext
}

@observer
export class EditTagValuesDialog extends React.Component<EditTagValuesProps, {}> {
    constructor(props: EditTagValuesProps) {
        super(props);
        makeObservable(this);
    }

    @computed get closeEnable() {
		const {tag} = this.props;
		if (!tag || !tag.required) {
			return true;
		}
		return _.some(tag.values, v => v.isDefault);
	}

    @action onClose = () => {
		const {tag, onClose, context} = this.props;
		if (tag.required) {
			TagValueStore.setDefaultToRecords(tag).then( () => {
				context.catalogContext.refresh();
			});
		}
		onClose();
	}

    render() {
		const {closeEnable, onClose, props: {tag}} = this;

		const title = tag ? i18n.intl.formatMessage({defaultMessage: `Values for Tag "{tagName}"`, description: "[EditTagValuesDialog] Indicates the dialog title"}, {tagName: tag.name}) : '';
	    const errMsg = i18n.intl.formatMessage({defaultMessage: `Default tag value needed.`, description: "[EditTagValuesDialog] Indicates the error message if user tag is required but no sub-option set as a default value"});
	    const okBtnText = i18n.common.DIALOG.OK;


		return (
			<Dialog className={css.tagValuesEditor}
			        icon="properties"
			        isOpen={tag != null}
			        isCloseButtonShown={closeEnable}
			        canOutsideClickClose={false}
			        canEscapeKeyClose={false}
			        title={title}
			        onClose={onClose}>
				<div className={bp.Classes.DIALOG_BODY} style={{display: 'flex', flexDirection: 'column'}}>
					{tag && <SortableTagValueContainer tag={tag}/>}
				</div>
				<div className={classNames(bp.Classes.DIALOG_FOOTER, css.dialogFoot)}>
					{!closeEnable && <span>{errMsg}</span>}
					<div className={bp.Classes.DIALOG_FOOTER_ACTIONS}>
						<AnchorButton disabled={!closeEnable} text={okBtnText} intent={bp.Intent.PRIMARY} onClick={onClose}/>
					</div>
				</div>
			</Dialog>
		)
	}
}