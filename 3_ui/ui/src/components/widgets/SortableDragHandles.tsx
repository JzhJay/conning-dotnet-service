import { SortableHandle } from 'react-sortable-hoc';

const _VerticalDragHandle = SortableHandle(() => <div className='bp3-icon-drag-handle-vertical' />);
const _HorizontalDragHandle = SortableHandle(() => <div className='bp3-icon-drag-handle-horizontal' />);
export const VerticalDragHandle = _VerticalDragHandle;
export const HorizontalDragHandle = _HorizontalDragHandle;