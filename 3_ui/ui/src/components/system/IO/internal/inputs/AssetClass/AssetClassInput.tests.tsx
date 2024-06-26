require("lib/semantic/dist/semantic.min.js");
require("lib/Iconic/js/iconic.min.js");

import {IOComponent} from 'components/system/IO/IOComponent';
import * as React from 'react';
import type {AssetTableUserOptions} from "stores/io";
import {ioStore, IO, ioTestData, IOView, IOPage} from "stores/io";
import {testScheduler, ITestable, sendNativeEventToElement, sleep, simulateMouseEvent, get$Container, enzymeMount, enzymeUnmount} from "test";
import {waitCondition} from '../../../../../../utility';
import {AssetClassInput} from './AssetClassInput';
import * as css from './AssetClassInput.css';

const enzyme: any = require('enzyme');
const expect: any = chai.expect;

class AssetClassInputTests implements ITestable {
	describeTests = () => {
		describe("IO Asset Class Input Table Tests", function () {
			//this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;
			let container = null;

			before(async function () {
				this.timeout(5 * 60 * 1000);
				console.log("Before Block Asset Table")

				io = await ioTestData.loadTestData();
				await io.currentPage.insertView("assetClasses");
				io.clearLocalStorage();

				await mount();
			})

			let mount = () => {
				return new Promise((accept, reject) => {
					const view = io.currentPage.selectedViews[io.currentPage.selectedViews.length - 1];

					console.log("Before Render Asset Table")

					result = enzymeMount(<AssetClassInput io={io} view={view} page={io.currentPage} userOptions={view.userOptions as AssetTableUserOptions}> </AssetClassInput>);
					container = get$Container();
					container.width(5000); // Context menu operations fail when the table is too narrow.

					window.setTimeout(() => {
						accept(result);
						console.log("Rendered Asset Table")
					}, 5000);
				});
			}

			after(async function () {
				this.timeout(60 * 1000);
				console.log("Asset Class cleanup");
				enzymeUnmount(result);
				await sleep(5000); // wait user-input API takes effect
				await io.resetLoadedIO();
			})

			const waitContextMenu = () => waitCondition(() => $('.AssetClassInput__context-menu').length > 0);

			const addAssetClass = async (newRowCount = 1) => {
				const startingRowCount = rowCount();
				const $node = $(result.getDOMNode());
				const assetGroup = $node.find(".wj-colheaders .wj-header").get(0);
				sendNativeEventToElement(assetGroup, "contextmenu");
				await waitContextMenu();
				simulateMouseEvent($('.AssetClassInput__context-menu .bp3-menu-item').get(0), 'mouseover');
				await waitCondition(() => $(`.AssetClassInput__context-menu .bp3-menu-item:contains("${newRowCount}")`).length > 0);
				sendNativeEventToElement($(`.AssetClassInput__context-menu .bp3-menu-item:contains("${newRowCount}")`).get(0), "click");
				let endingRowCount;
				await waitCondition(() => {
					endingRowCount = rowCount();
					return endingRowCount > startingRowCount;
				});
				await sleep(1000)
				return rowCount();
			}

			const rowCount = () => {
				const $node = $(result.getDOMNode());
				return $node.find(".wj-cells .wj-row").length;
			}

			const innerCount = () => {
				const $node = $(result.getDOMNode());
				const $rows = $node.find(".wj-colheaders .wj-row");
				return $rows.eq(2).children().length;
			}

			const columnCount = () => {
				const $node = $(result.getDOMNode());
				const $rows = $node.find(".wj-cells .wj-row");
				return $rows.eq($rows.length - 1).children().length;
			}

			const addColumn = async (target) => {
				const startCount = innerCount();
				sendNativeEventToElement(target, "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.AssetClassInput__context-menu .bp3-menu-item').get(0), "click");
				await waitCondition(() => innerCount() > startCount);
			}

			const removeColumn = async (target) => {
				const startCount = innerCount();
				sendNativeEventToElement(target, "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.AssetClassInput__context-menu .AssetClassInput__delete-column').get(0), "click");
				await waitCondition(() => innerCount() < startCount);
			}

			const selectCell = target => {
				sendNativeEventToElement(target, "mousedown");
				sendNativeEventToElement(target, "mouseup");
			}

			const multiClassConstraintCell = () => result.instance().grid.columnHeaders.getCellElement(2, 8);
			const additionalAllocationCell = () => result.instance().grid.columnHeaders.getCellElement(2, 10);

			it.skip("should clear asset classes", async function () {
				const startingRowCount = rowCount();
				const instance = result.instance();
				instance.grid.select(new wijmo.grid.CellRange(1, 0, 0, 0), true);
				instance.deleteRow();
				instance.grid.select(new wijmo.grid.CellRange(1, 0, 0, 0), true);
				instance.deleteRow();
				instance.grid.select(-1, -1);
				expect(instance.grid.rows.length).to.be.equal(3);
				await waitCondition(() => rowCount() < startingRowCount);
				console.log("should clear asset classes")
			})

			it("should display merged column headers", async function () {
				const $node = $(result.getDOMNode());
				expect($node.find(".wj-colheaders .wj-header").eq(5).outerWidth()).to.be.at.least(400);
				console.log("should display merged column headers");
			})

			it('should be able to insert multiple asset classes', async function () {
				this.timeout(10 * 1000);
				const startingRowCount = rowCount();

				console.log('startingRowCount', startingRowCount);
				const endingRowCount = await addAssetClass(3);
				console.log('endingRowCount', endingRowCount);
				expect(startingRowCount + 3).to.equal(endingRowCount, `should insert 3 new asset classes in one time(${startingRowCount} => ${endingRowCount})`);
			})

			it("should be able to insert multiple asset classes by asset class rows", async function () {
				['Before', 'After'].forEach(async (insertPosition)=> {
					const startingRowCount = rowCount();
					const cell = result.instance().grid.cells.getCellElement(2, 0);
					sendNativeEventToElement(cell, "contextmenu");
					await waitContextMenu();

					simulateMouseEvent($(`.AssetClassInput__context-menu .bp3-menu-item:contains("Insert 1 Rows ${insertPosition}")`).get(0), 'mouseover');
					await waitCondition(() => $(`.AssetClassInput__context-menu .bp3-menu-item:contains("2")`).length > 0);
					sendNativeEventToElement($(`.AssetClassInput__context-menu .bp3-menu-item:contains("2")`).get(0), "click");
					let endingRowCount;
					await waitCondition(() => {
						endingRowCount = rowCount();
						return endingRowCount > startingRowCount;
					});

					expect(startingRowCount + 2).to.equal(endingRowCount, `should insert 2 new asset classes ${insertPosition} selected row in one time`);
				});
			})

			it("should be able to insert asset class", async function () {
				this.timeout(10 * 1000);
				const $node = $(result.getDOMNode());
				const startingRowCount = rowCount();

				console.log("startingRowCount", startingRowCount);
				await addAssetClass();
				result.update();
				console.log("endingRowCount", rowCount());
				expect(startingRowCount + 1).to.equal(rowCount());
				console.log("should be able to insert asset class");
			})

			it("should be able to set asset class color", async function () {
				this.timeout(30 * 1000);

				const $node = $(result.getDOMNode());

				await sleep(5 * 1000); // Back-end returns wrong color if we change the color immediately after insertion. So wait a second. This race needs to be tracked down in back-end.
				selectCell($node.find(".AssetClassInput__color-icon").get(0));
				await waitCondition(() => $('.sketch-picker').length > 0);
				sendNativeEventToElement($('.sketch-picker .flexbox-fix:last-of-type :nth-child(1) div').get(0), "click");

				const expectedColor = "rgb(208, 2, 27)";
				const currentColor = () => $node.find(".AssetClassInput__asset-group").eq(0).css("backgroundColor");
				await waitCondition(() => currentColor() == expectedColor);

				console.log("before color wait");
				expect(currentColor()).to.equal(expectedColor);
				await waitCondition(() => io.getAssetClassInput(false).length > 0 && io.getAssetClassInput(false)[0] != null && io.getAssetClassInput(false)[0].color == expectedColor);
				expect(io.getAssetClassInput(false)[0].color).to.equal(expectedColor);
				console.log("should be able to set asset class color");

				// close color picker
				selectCell($node.find('.AssetClassInput__drag-target').get(0));
				await waitCondition(() => $('.sketch-picker').length == 0);
			})

			it("should be able to set asset class source", async function () {
				const $node = $(result.getDOMNode());
				const dropdown = $node.find(".wj-elem-dropdown").get(1); // First cell is total row
				const cell = dropdown.parentElement;

				sendNativeEventToElement(dropdown, "click");
				sendNativeEventToElement($(".wj-dropdown-panel .wj-listbox-item").get(0), "click");

				const expectedSource = "unspecified";
				const expectedSourceTitle = "Unspecified ...";
				expect(cell.innerText).to.include(expectedSourceTitle);
				await waitCondition(() => io.getAssetClassInput(false)[0].returnSource == expectedSource);
				expect(io.getAssetClassInput(false)[0].returnSource).to.equal(expectedSource);
			})

			it("should be able to group and ungroup assets", async function () {
				this.timeout(20 * 1000);
				const $node = $(result.getDOMNode());
				const assetGroup = $node.find(".AssetClassInput__total").get(0);
				const startingRowCount = rowCount();
				const instance = result.instance();

				// Add second asset class
				await addAssetClass();
				await waitCondition(() => rowCount() > startingRowCount);

				// Select range
				instance.grid.select(new wijmo.grid.CellRange(1, 0, 2, 0), true);

				// Group them
				sendNativeEventToElement(assetGroup, "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.AssetClassInput__context-menu .AssetClassInput__group').get(0), "click");
				await waitCondition(() => rowCount() == startingRowCount + 2);

				// Verify that there is a new row for the newly added asset and the group
				expect(startingRowCount + 2).to.equal(rowCount(), "should be able to add group");

				// Remove group
				instance.grid.select(new wijmo.grid.CellRange(1, 0, 1, 0), true);
				const cell = instance.grid.cells.getCellElement(1, 0);
				sendNativeEventToElement(cell, "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.AssetClassInput__context-menu .AssetClassInput__ungroup').get(0), "click");
				await waitCondition(() => rowCount() != startingRowCount + 2);

				expect(startingRowCount + 1).to.equal(rowCount(), "should be able to remove group");
			})

			it("should be able delete assets", async function () {
				const $node = $(result.getDOMNode());
				const startingRowCount = rowCount();
				const cell = result.instance().grid.cells.getCellElement(2, 0);

				sendNativeEventToElement(cell, "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.AssetClassInput__context-menu .AssetClassInput__delete-row').get(0), "click");
				await waitCondition(() => rowCount() != startingRowCount);

				expect(startingRowCount - 1).to.equal(rowCount());
			})

			it("should be able to add and delete multi-class constraints", async function () {
				this.timeout(30 * 1000);
				await addColumn(multiClassConstraintCell());
				await sleep(2 * 1000)
				expect(multiClassConstraintCell().innerText).to.equal("Untitled", "should be able to insert constraint");

				await removeColumn(multiClassConstraintCell());
				await sleep(2 * 1000)
				expect(multiClassConstraintCell().innerText).to.not.equal("Untitled", "should be able to delete constraint");
			})

			it("should be able to and and delete additional points", async function () {
				this.timeout(30 * 1000);
				await addColumn(additionalAllocationCell());
				await sleep(2 * 1000)
				expect(additionalAllocationCell().innerText).to.equal("Untitled", "should be able to insert additional point");

				await removeColumn(additionalAllocationCell());
				await sleep(2 * 1000)
				expect(additionalAllocationCell().innerText).to.not.equal("Untitled", "should be able to delete additional point");
			})

			it("should be able to add and remove sections", async function () {
				const $node = $(result.getDOMNode());
				sendNativeEventToElement($('.AssetClassInput__options .bp3-popover-target').get(0), "click");
				await waitCondition(() => $('.AssetClassInput__options-menu').length > 0);

				const colorText = result.instance().grid.columnHeaders.getCellData(0, 3);
				const sourceText = result.instance().grid.columnHeaders.getCellData(0, 4);
				sendNativeEventToElement($('.bp3-switch').get(0), "click");
				sendNativeEventToElement($('.bp3-switch').get(1), "click");

				const cell = (c) => $node.find('.wj-colheaders .wj-row:first-of-type .wj-cell').get(c);
				await waitCondition(() => cell(3).innerText != colorText);

				expect(cell(3).innerText).to.not.equal(colorText, "Should be able to remove color");
				expect(cell(4).innerText).to.not.equal(sourceText, "Should be able to remove source");

				sendNativeEventToElement($('.bp3-switch').get(0), "click");
				sendNativeEventToElement($('.bp3-switch').get(1), "click");

				await waitCondition(() => cell(3).innerText == colorText);
				expect(cell(3).innerText).to.equal(colorText, "Should be able to re-add color");
				expect(cell(4).innerText).to.equal(sourceText, "Should be able to re-add source");

				$('.AssetClassInput__options-menu').remove();
				console.log("should be able to add and remove sections");
			})

			it("should be able to persist data entry", async function () {
				this.timeout(10*1000);

				//const $node = $(result.getDOMNode());
				const editableCells = () => $(result.getDOMNode()).find('.wj-cells .wj-row:nth-of-type(3) .wj-cell:not(.AssetClassInput__not-editable)').toArray();
				const simulateKeyPress = (character) => {
					let e = new KeyboardEvent('keypress', {key: character.toString(), charCode: character.charCodeAt(0)} as any)
					$('.wj-control').get(0).dispatchEvent(e)
				};

				await addColumn(multiClassConstraintCell());
				await sleep(1);
				await addColumn(additionalAllocationCell());

				const cellContent = (i) => (i % 10);
				editableCells().forEach((cell, i) => {
					if (i > 4) {
						selectCell(cell);
						simulateKeyPress(cellContent(i).toString());
						selectCell(editableCells()[i == 0 ? 1 : 0]);
					}
				})

				await mount();

				editableCells().forEach((cell, i) => {
					if (i > 4) {
						expect(parseInt(cell.innerText)).to.equal(cellContent(i));
					}
				});

				console.log("should be able to persist data entry");
			})

			it("should be able to reorder the first row to last and redo", async function () {
				this.timeout((60+60) * 1000);

				this.timeout((60+60) * 1000);

				const getJqAssetGroups = () => $(result.getDOMNode()).find(`.${css.assetGroup}[draggable="true"]`).not(`.${css.spaceCell}`);

				console.time("should be able to reorder the first row to last");
				let $assetGroups = getJqAssetGroups();
				let $dragCell = $assetGroups.first();
				let $dropCell = $assetGroups.last();
				const checkText = $dragCell.text();
				const checkColor = $dragCell.css('background-color');
				$dragCell.find(`.AppIcon__root`).trigger('mouseenter');
				$dragCell.trigger('dragstart');
				$dropCell.trigger('dragover');
				$dropCell.find(`.${css.dropTargetBottom}`).trigger('dragover');
				$dropCell.trigger('drop');

				await waitCondition( () => {
					const $checkCell = getJqAssetGroups().last();
					return $checkCell.text() == checkText && $checkCell.css('background-color') == checkColor;
				} , 500 , 60000 );
				console.timeEnd("should be able to reorder the first row to last");

				console.time("should be able to reset order");
				$assetGroups = getJqAssetGroups();
				$dragCell = $assetGroups.last();
				$dropCell = $assetGroups.first();
				$dragCell.find(`.AppIcon__root`).trigger('mouseenter');
				$dragCell.trigger('dragstart');
				$dropCell.trigger('dragover');
				$dropCell.find(`.${css.dropTargetTop}`).trigger('dragover');
				$dropCell.trigger('drop');

				await waitCondition( () => {
					const $checkCell = getJqAssetGroups().first();
					return $checkCell.text() == checkText && $checkCell.css('background-color') == checkColor;
				} , 500 , 60000 );
				console.timeEnd("should be able to reset order");

			})
		})
	}
}

class MultiView extends React.Component<{io: IO, page:IOPage} , {}>{

	render() {
		return <>
			{ this.props.page.selectedViews.map( (v,i) => <AssetClassInput key={i} io={this.props.io} view={v} page={this.props.page} userOptions={v.userOptions as AssetTableUserOptions}> </AssetClassInput> )}
		</>
	}

}

class MultiAssetClassInputTests implements ITestable {
	describeTests = () => {
		let io: IO = null;
		let viewResult;

		const initTestCase = (viewCount = 1) => {
			return async () => {
				console.log("Before Block Asset Table")
				io = await ioTestData.loadTestData();
				await io.book.addPage();
				io.book.navigateToPage(io.pages.length-1);
				for(let i=0; i < viewCount; i++) {
					await io.currentPage.insertView("assetClasses");
				}
				io.clearLocalStorage();
				viewResult = await mountView();
			};
		};

		const endTestCase = async () => {
			console.log("Asset Class cleanup");
			enzymeUnmount(viewResult);
			await sleep(5000); // wait user-input API takes effect
			await io.resetLoadedIO();
		};

		const mountView = () => {
			return new Promise((accept, reject) => {
				const views = io.pages[io.pages.length-1].selectedViews;
				console.log("Before Render Asset Table" + views.length);
				const result = enzymeMount(<MultiView io={io} page={io.book.pages[io.pages.length-1]} />)
				window.setTimeout(() => {
					accept(result);
				}, 3000);
			});
		}

		const waitContextMenu = () => waitCondition(() => $('.AssetClassInput__context-menu').length > 0);

		const openAndWaitContextMenu = (element) => {
			sendNativeEventToElement(element, 'contextmenu');
			return waitCondition(() => $('.AssetClassInput__context-menu').length > 0);
		};

		const innerCount = () => {
			const $node = get$Container();
			const $rows = $node.find(".wj-colheaders .wj-row");
			return $rows.eq(2).children().length;
		}

		const addlocColumnCount = () => {
			return get$Container().find(`.wj-header.${css.additionalPointNameCell}`).length;
		}

		const addColumn = async (target) => {
			const startCount = innerCount();
			sendNativeEventToElement(target, "contextmenu");
			await waitContextMenu();
			sendNativeEventToElement($('.AssetClassInput__context-menu .bp3-menu-item:contains("Insert Additional Allocation")').get(0), "click");
			await waitCondition(() => innerCount() > startCount);
		}

		const removeColumn = async (target) => {
			const startCount = innerCount();
			sendNativeEventToElement(target, "contextmenu");
			await waitContextMenu();
			sendNativeEventToElement($('.AssetClassInput__context-menu .AssetClassInput__delete-column').get(0), "click");
			await waitCondition(() => innerCount() < startCount);
		}

		describe("IO sync multi Asset Class Input Table Tests", function () {
			this.timeout(30 * 1000);

			before(initTestCase(2));

			after(endTestCase);

			it("should create 2 views", async function () {
				await waitCondition(() => {
					let roots = $(`.${css.root}`);
					if(roots.length){
						expect(roots.length).to.eq(2);
						return true;
					}else{
						return false;
					}
				});
			})

			it("add Additional Allocation", async function () {
				let roots = $(`.${css.root}`);
				const oldColumnCount = addlocColumnCount();

				let header = $(roots[0]).find('.wj-header').filter( (i,n) => $(n).text() == 'Additional Allocations (%)' );

				expect(header.length).to.eq(1);
				await addColumn(header[0]);
				await waitCondition( () => addlocColumnCount() == oldColumnCount+2 , 100 , 10000  );
			})

			it("remove Additional Allocation", async function () {
				let roots = $(`.${css.root}`);
				const oldColumnCount = addlocColumnCount();

				let cell = $(roots[0]).find(`.wj-header.${css.additionalPointNameCell}`)[0];
				await removeColumn(cell);
				await waitCondition( () => addlocColumnCount() == oldColumnCount-2 , 100 , 10000  );
			})
		});

		describe("Grouping additional allocations tests", function () {
			this.timeout(60 * 1000);

			before(initTestCase());

			after(endTestCase);

			function findAdditionalPointGroupNameCells($roots) {
				return $roots.find(`.wj-header.${css.additionalPointGroupNameCell}`);
			}

			function findAdditionalPointNameCells($roots) {
				return $roots.find(`.wj-header.${css.additionalPointNameCell}`);
			}

			async function assignGroupColor($cell, colorIndex) {
				// select first group
				await openAndWaitContextMenu($cell);
				$('.AssetClassInput__context-menu .bp3-menu-item:contains("Assign Group")').trigger('focus');
				await waitCondition(() => $('.AssetClassInput__context-menu .AssetClassInput__color-menu-item').length > 0);
				sendNativeEventToElement($('.AssetClassInput__context-menu .AssetClassInput__color-menu-item').get(colorIndex), 'click');
			}

			async function insertAdditionalAllocation($roots, index, isInsertBefore) {
				const $additionalPointNameCells = findAdditionalPointNameCells($roots);
				await openAndWaitContextMenu($additionalPointNameCells[index]);
				const positionText = isInsertBefore ? 'Before' : 'After';
				sendNativeEventToElement($(`.AssetClassInput__context-menu .bp3-menu-item:contains("Insert Column ${positionText}")`).get(0), 'click');
				await sleep(1000);
			}

			it('group and ungroup additional Allocation', async function () {
				const $roots = $(`.${css.root}`);
				const $header = $roots.find('.wj-header').filter( (i,n) => $(n).text() == 'Additional Allocations (%)' );
				await addColumn($header[0]);

				let $additionalPointNameCells = findAdditionalPointNameCells($roots);

				// assign 1st additional point's group color; Dark color: #D0021B
				await assignGroupColor($additionalPointNameCells[0], 1);

				let $additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots);
				let expectedAdditionalPointGroupCount = $additionalPointGroupNameCells.length + 1;
				let groupColor = 'rgb(208, 2, 27)'; // '#D0021B' (not sure why hex color code will be transfered to rgb by blueprintjs)
				await waitCondition(() => (($additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots)) && $additionalPointGroupNameCells.length === expectedAdditionalPointGroupCount));

				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);
				expect($additionalPointGroupNameCells[0].style.backgroundColor).to.eq(groupColor);
				expect($($additionalPointGroupNameCells[0]).hasClass('AssetClassInput__lightForegroundColor')).to.eq(true);

				// assign 1st additional point's group color; light color: #F8E71C
				await assignGroupColor($additionalPointGroupNameCells[0], 3);

				groupColor = 'rgb(248, 231, 28)'; // '#F8E71C' (not sure why hex color code will be transfered to rgb by blueprintjs)
				await waitCondition(() => $additionalPointGroupNameCells[0].style.backgroundColor === groupColor);

				expect($additionalPointGroupNameCells[0].style.backgroundColor).to.eq(groupColor);
				expect($($additionalPointGroupNameCells[0]).hasClass('AssetClassInput__lightForegroundColor')).to.eq(false);

				// ungroup
				expectedAdditionalPointGroupCount = expectedAdditionalPointGroupCount -1;
				await assignGroupColor($additionalPointGroupNameCells[0], 0);
				await waitCondition(() => (($additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots)) && $additionalPointGroupNameCells.length === expectedAdditionalPointGroupCount));

				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);
			});

			it('insert additional allocation and keep original group', async function () {
				const $roots = $(`.${css.root}`);

				let $additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots);
				let expectedAdditionalPointGroupCount = $additionalPointGroupNameCells.length + 1;
				let $additionalPointNameCells = findAdditionalPointNameCells($roots);

				// assign 1st additional point's group color; Dark color: #D0021B
				await assignGroupColor($additionalPointNameCells[0], 1);
				const groupColor = 'rgb(208, 2, 27)'; // '#D0021B' (not sure why hex color code will be transfered to rgb by blueprintjs)
				await waitCondition(() => (($additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots)) && $additionalPointGroupNameCells.length === expectedAdditionalPointGroupCount ));
				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);
				expect($additionalPointGroupNameCells[0].style.backgroundColor).to.eq(groupColor);
				await sleep(1000);

				// insert right column
				let oldColumnCount = addlocColumnCount();
				await insertAdditionalAllocation($roots, 0, false);
				oldColumnCount = oldColumnCount + 1;
				expectedAdditionalPointGroupCount = expectedAdditionalPointGroupCount + 1;
				await waitCondition(() => {
					return addlocColumnCount() === oldColumnCount;
				});
				await waitCondition(() => (($additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots)) && $additionalPointGroupNameCells.length === expectedAdditionalPointGroupCount ));
				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);

				const newRightCell = findAdditionalPointGroupNameCells($roots)[1];
				expect(newRightCell.style.backgroundColor).to.eq(groupColor);
				expect($(newRightCell).hasClass('AssetClassInput__lightForegroundColor')).to.eq(true);

				// insert left column
				await insertAdditionalAllocation($roots, 0, true);
				oldColumnCount = oldColumnCount + 1;
				expectedAdditionalPointGroupCount = expectedAdditionalPointGroupCount + 1;
				await waitCondition(() => addlocColumnCount() === oldColumnCount);
				await waitCondition(() => (($additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots)) && $additionalPointGroupNameCells.length === expectedAdditionalPointGroupCount ));
				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);

				const newLeftCell = findAdditionalPointGroupNameCells($roots)[0];
				expect(newLeftCell.style.backgroundColor).to.eq(groupColor);
				expect($(newLeftCell).hasClass('AssetClassInput__lightForegroundColor')).to.eq(true);
			});

			it('insert additional allocation without assigning group', async function () {
				const $roots = $(`.${css.root}`);
				let expectedAdditionalPointCount = addlocColumnCount();

				let $additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots);
				const expectedAdditionalPointGroupCount = $additionalPointGroupNameCells.length - 1;

				// ungroup 1st additional allocation
				await assignGroupColor($additionalPointGroupNameCells[0], 0);
				await waitCondition(() => ($additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots)) && $additionalPointGroupNameCells.length === expectedAdditionalPointGroupCount);
				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);

				// insert right column
				expectedAdditionalPointCount = expectedAdditionalPointCount + 1;
				await insertAdditionalAllocation($roots, 0, false);

				let $additionalPointNameCells = findAdditionalPointNameCells($roots);
				await waitCondition(() => ($additionalPointNameCells = findAdditionalPointNameCells($roots)) && $additionalPointNameCells.length === expectedAdditionalPointCount);

				$additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots);
				expect($additionalPointNameCells.length).to.eq(expectedAdditionalPointCount);
				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);

				// insert left column
				expectedAdditionalPointCount = expectedAdditionalPointCount + 1;
				await insertAdditionalAllocation($roots, 0, true);
				await waitCondition(() => ($additionalPointNameCells = findAdditionalPointNameCells($roots)) && $additionalPointNameCells.length === expectedAdditionalPointCount);

				$additionalPointGroupNameCells = findAdditionalPointGroupNameCells($roots);
				expect($additionalPointNameCells.length).to.eq(expectedAdditionalPointCount);
				expect($additionalPointGroupNameCells.length).to.eq(expectedAdditionalPointGroupCount);
			});

			it('delete an additional allocation and keep groups', async function () {
				const $roots = $(`.${css.root}`);

				let $additionalPointNameCells = findAdditionalPointNameCells($roots);
				const oldColumnCount = addlocColumnCount();
				await removeColumn($additionalPointNameCells[0]);
				await waitCondition( () => addlocColumnCount() === oldColumnCount - 1 , 100 , 10000  );
			});

			it('hides group information when turn off display groups', async function () {
				const $roots = $(`.${css.root}`);
				const $toggleButton = $roots.find('.bp3-switch:contains("Display Groups")').parent().find('.bp3-control-indicator');
				sendNativeEventToElement($toggleButton.get(0), 'click');
				let $cells;
				await waitCondition(() => ($cells = findAdditionalPointGroupNameCells($roots)) && $cells.length === 0);
				expect($cells.length).to.eq(0);
			});
		});
	}
}

testScheduler.register(new AssetClassInputTests());
// testScheduler.register(new MultiAssetClassInputTests());
