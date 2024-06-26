import {bp} from 'components';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import type {IObjectTypeDescriptor, OmdbUserTag, OmdbUserTagValue} from 'stores';

interface UserTagListProps {
	objectTypeDesc: IObjectTypeDescriptor;
	model: {_id: string, userTagValues: OmdbUserTagValue[], createdTime: Date, modifiedTime: Date}
	displayTagId: string;
	tagClassName?: string;
	tagWrapper?: (tagComponent: JSX.Element) => JSX.Element;
}

@observer export class UserTagList extends React.Component<UserTagListProps, any> {

	@computed get userTag(): OmdbUserTag {
		return _.find(this.props.objectTypeDesc.userTags, tag => tag._id == this.props.displayTagId);
	}

	@computed get availableTags(): OmdbUserTagValue[] {
		const valueIds = _.map(this.props.model.userTagValues, utv => utv._id);
		return _.filter(this.userTag.values, utv => _.includes(valueIds, utv._id));
	}

	userTagComponent = (utv: OmdbUserTagValue) : JSX.Element => {
		const {tagWrapper, tagClassName} = this.props;
		const style: React.CSSProperties = _.assign({color: utv.color, background: utv.background, fontWeight: "normal"}, tagWrapper? null : {margin: '3px'});
		const rtnTag = <bp.Tag className={classNames("UserTagList__tag",tagClassName)} style={style}>{utv.label ? utv.label : utv.value}</bp.Tag>;

		if(!tagWrapper) {
			return rtnTag;
		}
		return tagWrapper(rtnTag);
	}

	render() {
		return this.availableTags.map((utv, i) => <React.Fragment key={utv._id}>{this.userTagComponent(utv)}</React.Fragment>);
	}

}