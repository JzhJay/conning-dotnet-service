import classNames from 'classnames';
import {bp} from 'components';
import {observer} from 'mobx-react';
import * as React from 'react';

import * as css from './TreePreviewCardGrid.css';

interface SubItemProps<T> {
	activeItem: bp.TreeNodeInfo<T>;
	onNodeClick: bp.TreeEventHandler<T>;
	className?: string;
}

@observer export class TreePreviewCardGrid<T> extends React.Component<SubItemProps<T>, any> {
	render() {
		const {activeItem,onNodeClick, className} = this.props;
		return <div className={classNames(css.root, className)}>
			{ _.map(activeItem?.childNodes, (item,i) => <TreePreviewCard<T>
				key={`TreePreviewCard_${item.id}_${i}`}
				activeItem={item}
				onNodeClick={onNodeClick}
			/> )}
		</div>;
	}
}

@observer class TreePreviewCard<T> extends React.Component<SubItemProps<T>, any> {

	handleNodeSelect: bp.TreeEventHandler<T> = (node, nodePath, e) => {
		this.props.onNodeClick(node, nodePath, e)
		e?.stopPropagation();
	}

	render() {
		const {activeItem, onNodeClick} = this.props;
		return <bp.Card
			interactive={true}
			elevation={bp.Elevation.THREE}
			onClick={(e) => onNodeClick(activeItem, null, e)}
		>
			{!activeItem?.childNodes?.length ?
			 <div className={css.leaf}>
				 <span>{activeItem.label}</span>
				 <bp.Icon icon={activeItem.icon || "document-open"} iconSize={50}/>
			 </div> :
			 <bp.Tree
				 contents={[activeItem]}
				 onNodeClick={this.handleNodeSelect}
			 />
			}
		</bp.Card>
	}
}