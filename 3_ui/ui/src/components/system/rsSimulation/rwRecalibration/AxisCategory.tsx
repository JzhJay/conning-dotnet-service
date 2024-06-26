import { observer } from 'mobx-react';
import { DropTarget } from 'react-dnd';

import DnDAxisValue from './DndAxisValue';
import { RWRecalibration } from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

import * as css from "./AxisOrganizer.css";

export const axisCategoryFields = new Set([
	'tree',
	'table'
]);

export const axisCategoryCombineOptions = new Set([
	'separate_always',
	'separate_by_default',
	'combine_by_default',
	'combine_always'
]);

export function isCategorySwappable(category1, category2) {
	return axisCategoryFields.has(category1) === axisCategoryFields.has(category2);
}

interface MyProps {
	recalibration: RWRecalibration;
	category: string;
	title: string;
	axisValues: string[];
	isSortable: boolean;
	isOver?: boolean;
    onOrderChanged?: (dragItem: string, dropItem: string, dragIndex: number, dropIndex: number, position: string) => void;
	onInsertItem?: (dragItem: string, dropItem: string, dragIndex: number, dropIndex: number) => void;
	connectDropTarget?: (element: Element) => React.ReactElement;
}

const dropTarget = {
    events: {
        canDrop(props, monitor) {
			const { component: { props: { category, value }}} = monitor.getItem();
			
			if (category === 'table' && props.recalibration.axisOrganization.combineAlways.indexOf(value) !== -1) {
				return false;
			}

			return isCategorySwappable(props.category, category) && props.category !== category;
        },
        drop(props, monitor, component) {
            if (monitor.didDrop()) {
                // If you want, you can check whether some nested
                // target already handled drop
				return;
            }

			const { component: dragComponent } = monitor.getItem();
			const { props: { index, value, category }} = dragComponent;

			if (props.category !== category) {
				dragComponent.props.onRemove(value, index);
				component.onInsert(value, props.axisValues.length, 'bottom');
			}
        }
    },
    connect(connect, monitor, props) {
		return {
			isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            connectDropTarget: connect.dropTarget()
        };
    }
};

class AxisCategoryClass extends React.Component<MyProps, {}> {
	onOrderChanged = async (axisValue: string, hoverItem: string, dragIndex: number, hoverIndex: number, position: string) => {
		const { axisValues } = this.props;
		axisValues.splice(dragIndex, 1);
		let insertIndex = position === 'top' ? hoverIndex : hoverIndex + 1;
		if (dragIndex < hoverIndex) {
			insertIndex -= 1;
		}

		axisValues.splice(insertIndex, 0, axisValue);
		await this.props.recalibration.reorderAxis({ axis: axisValue, axisType: this.props.category, index: insertIndex + 1 });
	}

	onRemove = (dragAxisValue: string, dragAxisIndex: number) => {
		this.props.axisValues.splice(dragAxisIndex, 1);
	}

	onInsert = async (axisValue: string, dropAxisIndex: number, position: string = 'top') => {
		let insertJuliaIndex;
		if (position === 'top') {
			insertJuliaIndex = dropAxisIndex + 1;
			this.props.axisValues.splice(dropAxisIndex, 0, axisValue);
		} else {
			insertJuliaIndex = dropAxisIndex + 2;
			this.props.axisValues.splice(dropAxisIndex + 1, 0, axisValue);
		}
		if (axisCategoryFields.has(this.props.category)) {
			await this.props.recalibration.reorderAxis({ axis: axisValue, axisType: this.props.category, index: insertJuliaIndex });
		} else {
			await this.props.recalibration.updateAxisCategory({ axis: axisValue, category: this.props.category });
		}	
	}

    render() {
        const { recalibration, title, category, axisValues, isSortable, isOver, connectDropTarget } = this.props;
        
		return (
			<div className={css.axisContainer}>
				<div className={`${css.axisTitle} bp3-callout bp3-intent-primary`}>
					{title}
				</div>
				<div className={classNames(css.axisItems, {[css.axisItemsHover]: isOver})} ref={connectDropTarget}>
					{ axisValues.map((axis, index)=> 
					<DnDAxisValue key={axis} index={index}
						recalibration={recalibration}
						category={category}
						value={axis}
						isSortable={isSortable}
						onRemove={this.onRemove}
						onInsert={this.onInsert}
						onOrderChanged={this.onOrderChanged} 
					/>)}
				</div>
			</div>
        );
    }
}

const AxisCategory = _.flow(
	observer,
	DropTarget('DnDAxisValue', dropTarget.events, dropTarget.connect)
)(AxisCategoryClass);

export default AxisCategory;
