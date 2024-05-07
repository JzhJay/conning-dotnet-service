import { observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { DragSource, DropTarget } from 'react-dnd';
import { bp } from 'components';
import { formatLabelText } from 'utility';

import { isCategorySwappable } from './AxisCategory';
import { RWRecalibration } from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

import * as css from './AxisOrganizer.css';

interface MyProps {
	recalibration: RWRecalibration;
	category: string;
    value: string;
    index: number;
	isDragging?: boolean;
	isOver?: boolean;
	isSortable?: boolean;
	onOrderChanged: (dragItem: string, dropItem: string, dragIndex: number, dropIndex: number, position: string) => void;
	onRemove: (dragItem: string, index: number) => void;
	onInsert: (dragItem: string, index: number) => void;
    connectDragSource?: (element: Element) => React.ReactElement;
    connectDropTarget?: (element: Element) => React.ReactElement;
}

const dropTarget = {
    events: {
        canDrop(props, monitor) {
			const { category: dropCategory, value: dropValue } = props;
			const { component: { props: { category, value }}} = monitor.getItem();
			if (dropValue === value) {
				return false;
			}

			if (category === 'table' && props.recalibration.axisOrganization.combineAlways.indexOf(value) !== -1
			&& dropCategory !== 'table') {
				return false;
			}

			return isCategorySwappable(dropCategory, category);
        },
        hover(props, monitor, hoverItem) {
			if (!hoverItem) {
                return null;
            }

            const { rootRef } = hoverItem;
            if (!rootRef) {
                return null;
            }

            const { index: dragIndex, component: dragComponent  } = monitor.getItem();
			const { category: dragCategory } = dragComponent. props;
            const { index: hoverIndex, category: hoverCategory } = props;

            // Determine rectangle on screen
            const hoverBoundingRect = rootRef.getBoundingClientRect()

            // Get vertical middle
			// const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

			let hoverMiddleY;
			if (hoverItem.hoverPosition && hoverItem.hoverPosition === 'top') {
				hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) - 20;
			} else {
				hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			}

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

          	// Dragging upwards
			if (hoverClientY > hoverMiddleY) {
				if (dragCategory === hoverCategory && (dragIndex - hoverIndex) === 1) {
					hoverItem.setHoverPosition(null); // ignore adjacent axis
					return null;
				}
				hoverItem.setHoverPosition('bottom');
			}

            // Dragging downwards
			if (hoverClientY < hoverMiddleY) {
				if (dragCategory === hoverCategory && (hoverIndex - dragIndex) === 1) {
					hoverItem.setHoverPosition(null); // ignore adjacent axis
					return null;
				}
				hoverItem.setHoverPosition('top');
			}
        },
        drop(props, monitor, component) {
            if (monitor.didDrop()) {
                // If you want, you can check whether some nested
                // target already handled drop
                return;
            }

			const { value: dragAxisValue, index: dragAxisIndex, component: dragComponent } = monitor.getItem();
			const { props: { category: dragCategory }} = dragComponent;
			const { index: dropAxisIndex, value: dropAxisValue, onOrderChanged, category: dropCategory } = props;
            const { hoverPosition } = component.decoratedRef.current;

			if (dragCategory === dropCategory) {
				if (dragAxisIndex === dropAxisIndex || !hoverPosition) {
					return;
				}

				onOrderChanged(dragAxisValue, dropAxisValue, dragAxisIndex, dropAxisIndex, hoverPosition);
			} else {
				dragComponent.props.onRemove(dragAxisValue, dragAxisIndex);
				component.props.onInsert(dragAxisValue, dropAxisIndex, hoverPosition);
			}
        }
    },
    connect(connect, monitor) {
        return {
			isOver: monitor.isOver() && monitor.canDrop(),
            connectDropTarget: connect.dropTarget()
        };
    }
};

const dragSource = {
    events: {
        beginDrag(props, monitor, component) {
            const { index, value } = props;
			return { index, value, component };
        }
    },
    connect(connect, monitor) {
        return {
            isDragging: monitor.isDragging(),
            connectDragSource: connect.dragSource()
        }
    }
};

class DnDAxisValueClass extends React.Component<MyProps, {}> {
    @observable hoverPosition = null;	// TODO need to take some time to fine-tune hover effect
    rootRef = null;

    setHoverPosition = (position) => {
		if (position !== this.hoverPosition) {
			this.hoverPosition = position;
		}
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidUpdate(prevProps) {
		if (prevProps.isOver !== this.props.isOver && !this.props.isOver) {
			this.hoverPosition = null;
		}
	}

    render() {
        const { value, isDragging, isOver, isSortable, connectDragSource, connectDropTarget } = this.props;
        let isHoverTop = false;
		let isHoverBottom = false;

		if (isOver && isSortable) {
			if (this.hoverPosition === 'top') {
				isHoverTop = true;
			} else if(this.hoverPosition === 'bottom') {
				isHoverBottom = true;
			}
		}

        return (
            <div className={classNames(css.axisItem, { [css.axisItemDragging]: isDragging, [css.axisItemHoverTop]: isHoverTop, [css.axisItemHoverBottom]: isHoverBottom })} ref={(ref) => {
                this.rootRef = ref;
                connectDragSource(ref);
				if (isSortable) {
                	connectDropTarget(ref);
				}
            }}>
                <bp.Callout>
                    {formatLabelText(value)}
                </bp.Callout>
            </div>
        );
    }
}

const DnDAxisValue = _.flow(
	observer,
	DragSource('DnDAxisValue', dragSource.events, dragSource.connect),
	DropTarget('DnDAxisValue', dropTarget.events, dropTarget.connect)
)(DnDAxisValueClass);

export default DnDAxisValue;