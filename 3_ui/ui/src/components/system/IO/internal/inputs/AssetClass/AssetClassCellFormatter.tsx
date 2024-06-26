import {computed} from 'mobx';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {appIcons} from '../../../../../../stores/site/iconography';
import {AppIcon} from '../../../../../widgets';
import {ClosableTooltip} from 'components';
import {Validator} from 'components';
import {AssetClassInput} from './AssetClassInput';
import { hexToRgb, isDarkColor } from 'utility';

import * as css from './AssetClassInput.css';

const MAX_FORMAT_COLUMN = 3;

export class AssetClassCellFormatter {
	constructor(public assetClassInput: AssetClassInput) {
		this.colorIcon = ReactDOMServer.renderToStaticMarkup(<AppIcon className={classNames("iconic-sm", css.colorIcon)} icon={appIcons.investmentOptimizationTool.color} small/>)
		this.dragIcon = ReactDOMServer.renderToStaticMarkup(<AppIcon icon={{type: "blueprint", name: "drag-handle-vertical"}} small/>)

		// Scroll clipped messages on scroll since their target cell might go offscreen causing the tooltip to be rendered at (0, 0)
		assetClassInput.grid.scrollPositionChanged.addHandler(() => {
			Object.keys(this.clippedRefs).map(k => this.clippedRefs[k] && (this.clippedRefs[k].close = true))
			assetClassInput.clippedMessages = {};
		});

		this.cache = new FormatterCache();
	}

	colorIcon: string;
	dragIcon: string;
	clippedRefs = {};
	focusedHeaderCell = [];
	dragRowIndex: number = -1;
	unmountElements: {[key: string]: Function} = {};
	cache: FormatterCache = null;

	isCellFocused(row, col) {
		return this.focusedHeaderCell && this.focusedHeaderCell[0] == row && this.focusedHeaderCell[1] == col;
	}

	formatItem = (panel: wijmo.grid.GridPanel, row: number, col: number, cell: HTMLElement) => {
		let {columnHeaders, grid, rows, cellFormatOptions: {inlineValidations, advancedFormatting, extendAssetColor }} = this.assetClassInput;
		if (grid == null)
			return;

		//let {row, col, panel, cell} = e;
		const columnHeader = columnHeaders[col];
		const columnHeaderEntryLeaf = _.last(columnHeader);
		const isAdditionalAllocation = this.assetClassInput.isAdditionalAllocationColumn(columnHeader);
		const isDataColumn = col > MAX_FORMAT_COLUMN;

		// Reset properties that might still exist on recycled cells
		cell.style.backgroundColor = "";
		cell.style.borderRight = "";
		cell.onclick = null;

		if (panel == grid.columnHeaders) {
			if (isAdditionalAllocation) { 
				if (this.assetClassInput.showGroups && row === 2) {
					const groupColorCode = this.assetClassInput.getAdditionalAllocationGroupColor(columnHeader);
					if (groupColorCode ) {
						cell.className += ` ${css.additionalPointGroupNameCell}`;
						cell.style.backgroundColor = groupColorCode;
						const rgb = hexToRgb(groupColorCode);
						const isUseLightFrontColor = isDarkColor(rgb.r, rgb.g, rgb.b);
						if (isUseLightFrontColor) {
							cell.className += ` ${css.lightForegroundColor}`;
						}
					} else {
						cell.className += ` ${css.additionalPointNameCell}`;
					}
				} else if (row === 2 || row === 3) {
					cell.className += ` ${css.additionalPointNameCell}`;
				}
			}

			if (columnHeaders[col][row].editable) {
				let input = null;
				cell.className += ` ${css.editable}`;
				
				cell.onclick = (event) => {
					cell.innerHTML = `<input className="wj-grid-editor wj-form-control" value='${panel.getCellData(row, col, true)}'>`;
					input = cell.firstChild;
					input.focus();
					input.select();
					this.focusedHeaderCell = [row, col];

					let saveUpdate = async () => {
						if (this.isCellFocused(row, col))
							this.focusedHeaderCell = null;

						cell.innerHTML = _.escape(input.value);

						this.assetClassInput.columnChanged = true;
						const groupColorCode = this.assetClassInput.getAdditionalAllocationGroupColor(columnHeader);
						if (isAdditionalAllocation) {
							const isEditGroupName = this.assetClassInput.showGroups && groupColorCode && row === 2;
							await this.assetClassInput.renameGroupAdditionalAllocation(columnHeader, { [isEditGroupName ? 'group' : 'name']: input.value });
						} else {
							await this.assetClassInput.renameAxisCoordinate(this.assetClassInput.getParentListColumn(columnHeader).axis, columnHeaderEntryLeaf.label, input.value);
						}
						this.assetClassInput.updateListColumnContent(columnHeader); // Trigger a column update to pick up back-end name change if name was not unique.
					}

					input.onblur = (event) => {
						if (event.relatedTarget != null && event.relatedTarget != cell) {
							saveUpdate();
						}
					};

					input.onkeydown = (event) => {
						if (event.keyCode == 13) {
							saveUpdate();
						}
					};

					input.onclick = (event) => {
						event.preventDefault();
						event.cancelBubble = true;
					};
				}

				// Re-apply focus if it gets losed due to a re-render
				if (this.isCellFocused(row, col))
					cell.onclick(null);
			}
		}

		if (panel == grid.cells && this.assetClassInput.shouldDisableEdit(row, col)) {
			cell.className += ` ${css.notEditable}`;

			if (columnHeaderEntryLeaf.showDropDown || columnHeaderEntryLeaf.inputType == "boolean") {
				//cell.innerText = ""; // Too slow, use CSS
				cell.className += ` ${css.hideChildren}`;
			}
		}

		if (panel == grid.cells) {
			if (this.assetClassInput.isExtremeRow(row)) {
				if (!this.assetClassInput.columnHeaders[col][1].supportsExtreme)
					cell.className += ` ${css.extreme}`;

				if (columnHeaderEntryLeaf.autoPercentFormat && cell.innerText != "")
					cell.innerText += "%";
			}

			if (columnHeaderEntryLeaf.showDropDown) {
				cell.className += ` ${css.dropdown}`;
			}

			const isAdditionalAllocation = columnHeader[0].name === "additionalAllocations";
			const isGroupRow = rows[row].group && rows[row].group.assetClasses && rows[row].group.assetClasses.length > 0;

			if ((this.isTotalRow(row) && isDataColumn && columnHeaderEntryLeaf.total === "auto") || (isGroupRow && columnHeaderEntryLeaf.allowGroupTotal)) {

				let cachedValue = this.cache.get(row, col);
				if (cachedValue !== undefined) {
					cell.innerText = cachedValue;
				}
				else {
					const headerPath = this.assetClassInput.headerPath(columnHeader);
					const multiple   = columnHeaderEntryLeaf.isPercentage ? 100 : 1;
					const total      = (group) => {
						if (group.assetClasses == null || group.assetClasses.length == 0) {
							return (_.get(group, headerPath) as number || 0) * multiple;
						} else {
							return _.sum(group.assetClasses.map(g => total(g)));
						}
					}

					const result   = total(this.isTotalRow(row) ? {assetClasses: this.assetClassInput.assetClasses} : rows[row].group);
					const value = result ? wijmo.Globalize.formatNumber(result, columnHeaderEntryLeaf.isPercentage ? 'n2' : 'n0') : (isAdditionalAllocation && columnHeaderEntryLeaf.name != "additionalAllocations" ? "0.00" : "") as any;;
					cell.innerText = value;
					this.cache.set(row, col, value);
				}
			}
			else if (isDataColumn && isGroupRow && this.assetClassInput.shouldDisableEdit(row, col)) {
				// Display empty cells for all disabled group rows that are not being totaled.
				cell.innerText = "";
			}

			const assetBackgroundColor = panel.getCellData(row, 3, false);
			if (col < 4) {
				if (row == 0 && this.assetClassInput.showTotalRow) {
					cell.className += ` ${css.total}`;

					if (col < 3)
						cell.style.borderRight = "0px";

				} else if (this.assetClassInput.isExtremeRow(row)) {
					cell.className += ` ${css.assetGroup}`;
				} else if (col == 3) {
					cell.className += ` ${css.assetColor}`;
					cell.style.backgroundColor = assetBackgroundColor;
					advancedFormatting && (cell.innerHTML = this.colorIcon);
				} else {
					this.formatSortableCell(panel, row, col, cell);
				}
			} else if (extendAssetColor && !this.isTotalRow(row) && !this.assetClassInput.isExtremeRow(row)) {
				this.formatAssetCellBg(assetBackgroundColor, cell, false);
			}

			if (inlineValidations && (!this.isTotalRow(row) || (this.isTotalRow(row) && cell.innerText != ""))) {
				const {io} = this.assetClassInput.props;
				const assetPath = this.isTotalRow(row) ? ["assetClasses", null] :
				                  this.assetClassInput.isExtremeRow(row) ? [] : this.assetClassInput.getAssetClassPathFromRowIndex(row);
				let path     = this.assetClassInput.isExtremeRow(row) ? this.assetClassInput.extremesPath(columnHeader) + "." + rows[row].name :
				                                                          assetPath.join(".") + "." + this.assetClassInput.headerPath(columnHeader);

				// Translate display axis paths to stored order that is specified by back-end in validation message
				// let axis = io.axes[this.assetClassInput.getParentListColumn(columnHeader).axis];
				// if (axis) {
				// 	let pathSplit = path.split(".");
				// 	let axisValueIndex = this.assetClassInput.isExtremeRow(row) ? -2 : -1;
				// 	pathSplit[pathSplit.length + axisValueIndex] = axis.orderIndices[parseInt(pathSplit.slice(axisValueIndex)[0])];
				// 	path = pathSplit.join(".");
				// }

				const error    = io.validations[path];
				const hasInput = $(cell).find('input[type="text"]').length > 0;

				if (!hasInput && error) {
					//cell.innerHTML = cell.innerHTML + (columnHeaderEntryLeaf.showDropDown ? "&emsp;" : "") + ReactDOMServer.renderToStaticMarkup(<Validator io={io} path={path}></Validator>)
					$(cell).append((columnHeaderEntryLeaf.showDropDown ? "&emsp;&emsp;" : "") + "<span></span>");
					ReactDOM.render(<Validator validations={io.validations} path={path}></Validator>, cell.children[cell.children.length - 1]);
					this.saveUnmounter(row, col, cell);
				}

				const clippedKey = `${row}-${col}`;
				const clippedMessage = this.assetClassInput.clippedMessages[clippedKey];
				if (!hasInput && clippedMessage) {
					// Close any existing tooltips
					if (this.clippedRefs[clippedKey] != null) {
						this.clippedRefs[clippedKey].close = true;
					}
					cell.innerHTML = cell.innerHTML + "<span></span>";
					ReactDOM.render(<ClosableTooltip tooltip={clippedMessage}
					                                 ref={(r) => this.clippedRefs[clippedKey] = r}
					                                 onClosed={() => {
						                                 this.assetClassInput.clippedMessages[clippedKey] = null;
						                                 this.clippedRefs[clippedKey].close = true;
						                                 this.clippedRefs[clippedKey] = null;
					                                 }}>
						<span></span>
					</ClosableTooltip>, cell.children[cell.children.length - 1]);
					this.saveUnmounter(row, col, cell);
				}
			}
		}
	}

	saveUnmounter = (r, c, cell) => {
		const key = `${r}-${c}`;
		this.unmountElements[key] = () => cell.children.length > 0 && ReactDOM.unmountComponentAtNode(cell.children[cell.children.length - 1]);
	}

	isUsingLightFrontColor = _.memoize((backgroundColor: string) => {
		const rgbArr = backgroundColor.match(/\d+/g);
		let usingLightFrontColor = false;
		if (rgbArr.length == 3) {
			usingLightFrontColor = isDarkColor(parseFloat(rgbArr[0]), parseFloat(rgbArr[1]), parseFloat(rgbArr[2]));
		}
		return usingLightFrontColor;
	})

	formatAssetCellBg = (backgroundColor: string, cell: HTMLElement, isAssetGroup: boolean = true) => {
		const usingLightFrontColor = this.isUsingLightFrontColor(backgroundColor);
		const $cell = $(cell);
		$cell.css('backgroundColor', backgroundColor).toggleClass(css.lightFontColor, usingLightFrontColor);

		if (isAssetGroup) {
			$cell.addClass(css.assetGroup)
		}
	}

	formatSortableCell = (panel: wijmo.grid.GridPanel, row: number, col: number, cell: HTMLElement) => {
		const backgroundColor = panel.getCellData(row, 3, false);
		const content     = Number.parseInt(panel.getCellData(row, col, false));
		const isSpaceCell = this.assetClassInput.isSpacerCell(row, col) && Number.isInteger(content);

		if (this.assetClassInput.cellFormatOptions.advancedFormatting) {
			this.formatAssetCellBg(backgroundColor, cell);
			if (isSpaceCell) {
				const groupBackgroundColor = panel.getCellData(content, 3, false);
				$(cell)
					.css('backgroundColor', groupBackgroundColor)
					.addClass(css.spaceCell)
					.html(`<div class="${css.lineCover}"></div>`) //div will cover the line between space cells.
			}
		}
		else {
			cell.className += ` ${css.assetGroup}`;
			cell.style.backgroundColor = panel.getCellData(row, 3, false);
			isSpaceCell && (cell.className += ` ${css.hideChildren}`);
		}

		if (!this.assetClassInput.cellFormatOptions.rowReorder)
			return;

		const isLastOfGroup = this.assetClassInput.isLastOfGroup(row, col);
		if ((!isSpaceCell || isLastOfGroup)) {

			const dropTatget = `<div class="${css.dropTarget}"><div class="${css.dropTargetTop}"><hr /></div><div class="${css.dropTargetBottom}"><hr /></div></div>`;

			if (isSpaceCell) {
				cell.innerHTML = `${cell.innerHTML}${dropTatget}`;
			} else {
				cell.innerHTML = `<div class="${css.dragTarget}">${this.dragIcon}<div class="${css.content}">${cell.innerHTML}</div></div>${dropTatget}`;
			}

			const activeDragTargetClassName = "drag_active";

			const isGroupTitle = this.assetClassInput.isGroupTitle(row);
			const isAloneInGroup = this.assetClassInput.isAloneInGroup(row);
			if (isGroupTitle) {
				$(cell).find(`.${css.dropTarget}`).append(`<div class="${css.lineCover}" style="background:${backgroundColor};"></div>`);
			}

			$(cell)
				.attr("draggable", `${!isAloneInGroup && !isSpaceCell}`)
				.attr("data-row",`${isSpaceCell ? content : row}`)
				.attr("data-level",`${col}`)
				.toggleClass(css.assetGroupTitle, isGroupTitle)
				.toggleClass(css.lastOfGroup, isLastOfGroup)
				.on('dragstart' , (e) => {
					const $target = $(e.target);
					if ($target.attr('draggable') == "false") {
						return false;
					}
					if(!$target.find(`.${activeDragTargetClassName}`).length){
						return false;
					}
					this.assetClassInput.grid.select(new wijmo.grid.CellRange(-1, -1));
					this.assetClassInput.grid.selectionMode = wijmo.grid.SelectionMode.None;
					const dropRowIndex = $target.data('row');
					this.dragRowIndex = dropRowIndex;
				})
				.on('dragend' , (e) => {
					$(panel.hostElement).find(`.${css.dragging}`).removeClass(css.dragging);
					this.dragRowIndex = -1;
					this.assetClassInput.grid.selectionMode = wijmo.grid.SelectionMode.CellRange;
				})
				.on('dragover' ,(e) => {
					if ( this.dragRowIndex <= 0 ) {
						return;
					}
					e.preventDefault();
					const $target = $(e.target);
					if (!$target.is(`.${css.assetGroup}`) || $target.hasClass(css.dragging)) {
						return;
					}
					$(panel.hostElement).find(`.${css.dragging}`).removeClass(css.dragging);

					const dropRowIndex = $target.data('row');
					if ( dropRowIndex == this.dragRowIndex ) {
						return;
					}
					$target.addClass(css.dragging);
				}).on('drop',async (e) => {
					let $target = $(panel.hostElement).find(`.${css.assetGroup}.${css.dragging} .${css.dragging}`).first();
					const updateProps = this.getRowMoveProps($target[0]);
					$(panel.hostElement).find(`.${css.dragging}`).removeClass(css.dragging);
					if(updateProps != null) {
						await this.assetClassInput.props.io.sendAssetClassInputUpdate(updateProps);
					}
					this.dragRowIndex = -1
				});

			$(cell).find(`.${css.dragTarget}`).find('.AppIcon__root').first()
				.on('mouseover' , (e) => {
					$(e.currentTarget || e.target).addClass(activeDragTargetClassName);
				})
				.on('mouseout' , (e) => {
					$(e.currentTarget || e.target).removeClass(activeDragTargetClassName);
				});

			$(cell).find(`.${css.dropTarget}`).children()
				.on('dragover', (e) => {
					e.preventDefault();
					const $target = $(e.target);
					if ($target.hasClass(css.dragging)) {
						return;
					}
					$target.parent().find(`.${css.dragging}`).removeClass(css.dragging);

					if (this.getRowMoveProps(e.target) == null) {
						return;
					}

					$target.addClass(css.dragging);
				})

		} else {
			$(cell)
				.attr("draggable","false")
				.removeAttr("data-row")
				.removeAttr("data-level")
				.removeClass(css.assetGroupTitle)
				.removeClass(css.lastOfGroup)
				.off('dragstart')
				.off('dragend')
				.off('dragover')
				.off('drop');
		}
	}

	getRowMoveProps = (dropCell: Element) : ({action: string,sourcePath: any[], targetPath: any[], index: number }|null) => {
		if (!dropCell) {
			return null;
		}
		const $target = $(dropCell);
		let dropRowIndex = parseInt($target.parents(`.${css.assetGroup}`).first().data('row'));
		let dropLevel = parseInt($target.parents(`.${css.assetGroup}`).first().data('level'));
		let isBefore = $target.is(`.${css.dropTargetTop}`);
		// when wanting insert after group title, it will be a member of that group, not insert after the whole group.
		if (!isBefore && $target.parents(`.${css.assetGroup}`).first().is(`.${css.assetGroupTitle}`)) {
			dropRowIndex++;
			dropLevel++;
			isBefore = true;
		}

		// make sure the result of group depth <= 2
		if (dropLevel + this.assetClassInput.getGroupDepth(this.dragRowIndex) > 2) {
			return null;
		}
		const sourcePath = this.assetClassInput.getAssetClassPathFromRowIndex(this.dragRowIndex);
		const targetPath = this.assetClassInput.getAssetClassPathFromRowIndex(dropRowIndex);

		// group title can not drop into the sub of own group.
		if ( this.assetClassInput.isGroupTitle(this.dragRowIndex) && sourcePath.length < targetPath.length ) {
			let dropInSelfGroup = true;
			sourcePath.forEach((s, i) => dropInSelfGroup = dropInSelfGroup && (s == targetPath[i]) );
			if (dropInSelfGroup) {
				return null;
			}
		}

		let sameGroupLevel = sourcePath.length == targetPath.length;
		for ( let i = 0 ; sameGroupLevel && ( i < sourcePath.length - 1 ) ; i ++ ) {
			sameGroupLevel = sourcePath[i] == targetPath[i];
		}

		let index = targetPath.pop();
		// the insert position needs modify if they're in the same level and group
		if ( isBefore && this.dragRowIndex < dropRowIndex && sameGroupLevel ) {
			index--;
		} else if (!isBefore && ( this.dragRowIndex > dropRowIndex || !sameGroupLevel) ) {
			index++;
		}
		// item still at the same place
		if ( sameGroupLevel && index == sourcePath[sourcePath.length-1] ) {
			return null;
		}

		return {action: "move", sourcePath: sourcePath, targetPath: targetPath, index: index};
	}

	percentFormat(value) {
		return value.toFixed(2);
	}

	isTotalRow = (row) => row == 0 && this.assetClassInput.showTotalRow;
}


class FormatterCache {
	cache = {};

	get(r, c) {
		return this.cache[`${r}-${c}`];
	}

	set(r, c, value) {
		this.cache[`${r}-${c}`] = value;
	}

	clear() {
		this.cache = {};
	}
}