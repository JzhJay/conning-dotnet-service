import {PivotTable} from '../index'

interface DragDropItem {
	panel: HTMLElement;
	index: number;
	isRow: boolean;
}

export class PivotDragAndDropHelper {
	dragSource:DragDropItem;
	dropTarget:DragDropItem;

	get pivotMetadata() { return this.pivot.props.queryResult.pivotMetadata; }

	constructor(private pivot: PivotTable) {
		const rowHeaderNode = this.pivotMetadata.rowAxes.length > 0 ?
		                      pivot.$nodes.rowTable.find("div[wj-part=ch]").get(0) :
		                      pivot.$nodes.rowTable.find(".header").get(0);

		const columnHeaderNode = this.pivotMetadata.columnAxes.length > 0 ?
		                         pivot.$nodes.columnTable.find("div[wj-part=rh]").get(0)
			: pivot.$nodes.columnTable.find(".header").get(0);


		// this.pivotMetadata.columnAxes.length > 0 ?
		//    $(columnTableNode).find("div[wj-part=rh]").get(0) :
		//    $(columnTableNode).find(".header").get(0);


		// Setup the drag and drop event handlers
		this.setDropTarget(columnHeaderNode, true);
		this.setDropTarget(rowHeaderNode, false);

		this.addEventListener(pivot.$nodes.rowTable.get(0),'dragstart', (e) => {
			const targetRow = e.target.parentNode;
			const index = $(targetRow.children).index(e.target as HTMLElement);
			if (index >= 0) {
				this.dragSource = {panel: rowHeaderNode, index: index, isRow: true};

				//console.log('Row Drag&Drop Started - ', this.dragSource, index)
				e.dataTransfer.setData('text', ""); // required in FireFox (note: text/html will throw in IE!)
			}
		});

		this.addEventListener(pivot.$nodes.columnTable.get(0), 'dragstart', (e) => {
			const targetRow = e.target.parentNode;
			const index = $(targetRow.parentNode.children).index(targetRow as HTMLElement);
			if (index >= 0) {
				this.dragSource = {panel: columnHeaderNode, index: index, isRow: false};
				//console.log('Column Drag&Drop Started - ', this.dragSource, index)
				e.dataTransfer.setData('text', ""); // required in FireFox (note: text/html will throw in IE!)
			}
		});
	}

	destroy() {
		this.pivot = null
		this._toDispose.forEach(f => f());
	}

	_toDispose = [];
	addEventListener(element:HTMLElement, event, callback) {
		element.addEventListener(event, callback);
		this._toDispose.push(() => element.removeEventListener(event, callback));
	}


	/**
	 * Handle Drag and Drop of Axis Column Headers
	 */
	setDropTarget(dropTarget, isColumnHeader) {
		this.addEventListener(dropTarget, 'dragleave', function (e) {
			$(".dropIndicator").remove();
		});

		this.addEventListener(dropTarget, 'dragover', (e:DragEvent) => {
			if (this.dragSource == null) return;

			//console.log(e.dataTransfer)

			// Allow pointer to be shown by preventing the default behavior
			e.preventDefault();

			this.dropTarget = {panel: dropTarget, index: null, isRow: !isColumnHeader};

			const headers = $(dropTarget).find(".wj-header");
			const dropTargetRect = dropTarget.getBoundingClientRect();
			let closestHeader;
			let minDistance = isColumnHeader ? Math.abs(e.pageY - dropTargetRect.top) : Math.abs(e.pageX - dropTargetRect.left);
			let dropPos = 0;
			let insertionIndex = 0;

			// Find the closest drop/insertion position
			for (let i = 0; i < headers.length; i++) {
				let header = headers.get(i);
				const rect = header.getBoundingClientRect();
				const currentDistance = isColumnHeader ? Math.abs(e.pageY - rect.bottom) : Math.abs(e.pageX - rect.right);

				if (currentDistance < minDistance) {
					minDistance = currentDistance;
					closestHeader = header;
					dropPos = isColumnHeader ? closestHeader.offsetTop + rect.height - 2 : closestHeader.offsetLeft + rect.width - 2;
					insertionIndex = i + 1;
				}
			}

			$(".dropIndicator").remove();

			if (this.dragSource.panel === dropTarget &&
			    (insertionIndex === this.dragSource.index ||
			     insertionIndex === this.dragSource.index + 1)) {
				this.dropTarget.index = null;
			}
			else {
				this.dropTarget.index = insertionIndex;
				let dropAttr = (isColumnHeader ? "top" : "left") + `:${dropPos}px`;
				$(dropTarget).append(`<div class="dropIndicator" style="${dropAttr};">&nbsp;</div>`);
			}
		});

		this.addEventListener(dropTarget, 'drop', (e) => {
			if (this.dragSource == null) {
				console.warn('dragSource is null')
				return;
			}

			const {dragSource, dropTarget} = this;
			this.dragSource = null;

			if (dropTarget.index == null)
				return;

			// console.log(dragSource, dropTarget)

			const {pivotMetadata} = this;

			const axes = { rowAxes: _.cloneDeep(pivotMetadata.rowAxes.slice()), columnAxes: _.cloneDeep(pivotMetadata.columnAxes.slice())};

			const source = dragSource.isRow ? axes.rowAxes : axes.columnAxes;
			const target = dropTarget.isRow ? axes.rowAxes : axes.columnAxes;

			const axisIndex = source[dragSource.index];
			source.splice(dragSource.index, 1);

			if ((source === target) && dragSource.index < this.dropTarget.index)
				target.splice(dropTarget.index - 1, 0, axisIndex);
			else
				target.splice(dropTarget.index, 0, axisIndex);

			$(".dropIndicator").remove();

			this.pivot.queryResult.arrangement.rearrange(axes);
		});
	}
}
