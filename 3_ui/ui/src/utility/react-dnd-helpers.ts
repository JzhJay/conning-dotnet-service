import {ConnectDragSource, ConnectDragPreview, ConnectDropTarget, DragSourceConnector, DragLayerMonitor, DropTargetConnector, DropTargetMonitor} from 'react-dnd'
export interface DragAndDropProps<T> {
	dndDrag?: DragProps<T>;
	dndDrop?: DropProps<T>;
}

export interface DragProps<T> {
	dragSource: ConnectDragSource
	dragPreview: ConnectDragPreview;
	isDragging: boolean;
	item: T;
}

export interface DropProps<T> {
	item: T;
	dropTarget: ConnectDropTarget;
	itemType: any;
	isOver: boolean;
	isOverCurrent: boolean;
	canDrop: boolean;
	clientOffset: { x: number, y: number };
}

export function dragCollectFn(connect: DragSourceConnector, monitor: DragLayerMonitor) {
	return {
		dndDrag: {
			item:        monitor.getItem(),
			itemType:    monitor.getItemType(),
			dragSource:  connect.dragSource(),
			dragPreview: connect.dragPreview(),
			isDragging:  monitor.isDragging(),
		}
	}
}

export function dropCollectFn(connect: DropTargetConnector, monitor: DropTargetMonitor) {
	return {
		dndDrop: {
			         item:          monitor.getItem(),
			         itemType:      monitor.getItemType(),
			         dropTarget:    connect.dropTarget(),
			         isOver:        monitor.isOver(),
			         isOverCurrent: monitor.isOver({shallow: true}),
			         clientOffset:  monitor.getClientOffset(),
			         canDrop:       monitor.canDrop()
		         } as DropProps<any>
	}
}
