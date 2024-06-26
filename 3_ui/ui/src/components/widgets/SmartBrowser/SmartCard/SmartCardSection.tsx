import {UserTagValue} from 'codegen/types';
import * as React from 'react';
import * as css from './SmartCard.css';
import {isObservableArray} from 'mobx';
import {observer} from 'mobx-react';
import type {IObjectTypeDescriptor, OmdbCardTag, OmdbUserTagValue} from 'stores';
import {utility} from 'stores';
import {bp, SmartCard, SortableCardsPanel} from 'components';
import {SmartCardTagLabel} from './SmartCardTagLabel';
import {SmartCardTagValue} from './SmartCardTagValue';

interface SmartCardSectionProps {
	objectTypeDesc: IObjectTypeDescriptor;
	label?: string;
	tags: Array<OmdbCardTag | OmdbUserTagValue| boolean>;
	panel?: SortableCardsPanel;
	card: SmartCard;
	model?: any;
	flex: boolean;
}

@observer
export class SmartCardSection extends React.Component<SmartCardSectionProps, {}> {
	render() {
		let {label, tags: cardTags, objectTypeDesc, model, panel, card, children, flex} = this.props;

		cardTags = cardTags ? cardTags.filter((f: OmdbCardTag) => {
			if (!f || typeof(f) == 'boolean' || f.hide) {
				return false;
			}
			const isReserved = f.reserved !== false;
			if (!isReserved || f.hideEmpty) {
				if (isReserved) {
					let value = f.value || (model && model[f.name]);
					return value != null && !_.isEmpty(`${value}`);
				} else {
					return _.some(model.userTagValues, (utv: UserTagValue) => utv.tag?._id == f._id);
				}
			}
			return true;
		}) : [];
		if (!children && !cardTags.length) {
			return null;
		}

		return <div className={classNames(css.section, {[css.flexSection]: flex})}>
				{/*label && <sem.Card.Header>{label}</sem.Card.Header>*/}

			{children}

			{cardTags && cardTags.map((cardTag: OmdbCardTag, i) => {
				const {name, label, value, hideEmpty, className} = cardTag;

				let omdbTag = null;
				let smartCardTagValues = null;

				if (objectTypeDesc) {
					let userTags = objectTypeDesc.userTags;
					let tags = objectTypeDesc.tags;

					let isUserTag = cardTag.reserved === false;
					let isCommnetField = !isUserTag && cardTag.name == 'comments';

					let renderValue;
					if (!isUserTag) {
						renderValue = value || (model && name && utility.findNestedPropertyValue(model, name)) || null;
						omdbTag = _.find(tags , ut => ut.name == cardTag.name);
					} else {
						renderValue = model?.userTagValues ? model.userTagValues.filter(utv => utv.tag._id == cardTag._id).map(utv => utv._id) : null;
						omdbTag = _.find(userTags , ut => ut._id == cardTag._id);
					}
					let isEmpty = _.isEmpty(renderValue) && (typeof renderValue != 'number');

					if (hideEmpty && isEmpty) {
						return null;
					}

					if (!isEmpty || isCommnetField) {
						if (!isUserTag) {
							const objectType = model && model.constructor ? model.constructor.name : undefined;
							const isMultiple = cardTag.multiple || isObservableArray(renderValue) || _.isArray(renderValue);
							if (isMultiple) {
								smartCardTagValues = <>{renderValue.slice().map((v, i) => <SmartCardTagValue
									key={`${model._id}_${cardTag.name}_${i}`}
									objectType={objectType}
									panel={panel}
									card={card}
									model={model}
									omdbTag={omdbTag}
									cardTag={cardTag}
									value={v}
								/>)}</>
							} else {
								smartCardTagValues = <SmartCardTagValue
									objectType={objectType}
									panel={panel}
									card={card}
									model={model}
									omdbTag={omdbTag}
									cardTag={cardTag}
									value={renderValue}
								/>
							}
						} else {
							smartCardTagValues = omdbTag?.values?.length ? <>{renderValue.map((tagValueId) => {
								const tagValue = _.find(omdbTag.values, v => v._id == tagValueId);
								return tagValue ? <SmartCardTagValue
									key={`${model._id}_${cardTag._id}_${tagValueId}`}
									objectType={model.__type ? model.__type : typeof (model)}
									panel={panel}
									card={card}
									model={model}
									omdbTag={tagValue.tag}
									cardTag={cardTag}
									value={<bp.Tag style={{color: tagValue.color, background: tagValue.background, fontWeight: "normal"}}>{tagValue.label ? tagValue.label : tagValue.value}</bp.Tag>}
								/> : null;
							})}</> : null;
						}
					}
				} else {
					let renderValue = value || (model && name && utility.findNestedPropertyValue(model, name)) || null;
					smartCardTagValues = <SmartCardTagValue
						panel={panel}
						card={card}
						model={model}
						omdbTag={null}
						cardTag={cardTag}
						value={renderValue}
					/>
				}

				return <div key={`${name || label}_${i}`} className={classNames(className, css.tag, `tag-${name}`)}>
					{/* tag Label */}
					<SmartCardTagLabel tag={omdbTag || cardTag} panel={panel}/>

					<div className={css.tagValueContainer}>
						{smartCardTagValues}
					</div>
				</div>
			})}
		</div>
	}
}
