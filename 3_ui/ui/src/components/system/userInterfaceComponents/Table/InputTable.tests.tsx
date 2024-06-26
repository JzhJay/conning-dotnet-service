import * as React from 'react';
import {enzyme, enzymeMount, enzymeUnmount, expect, ITestable, sendNativeEventToElement, testScheduler} from '../../../../test/core';
import {sleep, waitCondition} from '../../../../utility';
import {findOption} from '../../IO/internal/inputs/utility';
import {InputTable} from './InputTable';
import mockData from "./testFiles/mockExamples";
import userValueBased from "./testFiles/userValueBased";
import * as css from "./InputTable.css";

class InputTableTests implements ITestable {
	describeTests = () => {
		let result;
		let container;
		let updates;

		describe("Input table tests", () => {

			after(() => enzymeUnmount(result));

			const renderExample = async (example, validationMessages=null) => {
				await renderTable(
					mockData,
					findOption(mockData.inputOptions.examples, [example, "parent"]),
					mockData.inputs.examples[example].parent,
					`examples.${example}.parent`,
					validationMessages)
			}

			const renderTable = async (userInterface, optionNode, inputData, path, validationMessages=null) => {
				result = enzymeMount(<InputTable userInterface={optionNode}
												 data={inputData}
												 globalLists={userInterface.globalLists}
												 axes={userInterface.axes}
												 showToolbar={false}
												 path={path}
												 onUpdateValue={(updateValues, paths) => updates = updateValues}
												 validationMessages={validationMessages}/>);
				await sleep(1000); // Table has a few internal 100ms delays when sizing. Ideally we shouldn't render until table is ready
			}

			const validateSlotHeaders = () => {
				// row headers has 4 rows and 2 columns
				let $rowHeader = $(`.wj-rowheaders`);

				expect($rowHeader.find(".wj-row").length).to.equal(4);
				expect($rowHeader.find(".wj-row").first().find(".wj-cell").length).to.equal(2);

				// Goo is merged across rows (3 times the height of other non-merged cells)
				const $gooCell = $rowHeader.find(".wj-row").first().children().first();
				expect($gooCell.text()).to.equal("Goo");
				expect($gooCell.outerHeight()).to.equal($gooCell.siblings().first().outerHeight() * 3);

				// Foobar is merged across all columns
				const $foobarRow = $rowHeader.find(".wj-row").last();
				const $foobarCell = $foobarRow.children().first();
				expect($foobarCell.text()).to.equal("Foobar");
				expect($foobarRow.children()).has.length.of(1);
			}

			it("Basic slot with merged header", async function() {
				await renderExample("ui3");
				validateSlotHeaders();

				// 4 grid cells
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`)).has.length.of(4);

			})

			it("Expandable slot", async function() {
				await renderExample("ui4");

				validateSlotHeaders();

				// 8 grid cells
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`)).has.length.of(8);

			})

			it("Expandable Table (Inverted Slot)", async function() {
				await renderExample("ui5");

				// column headers has 2 rows and 4 columns
				let $colHeader = $(`.wj-colheaders`);

				expect($colHeader.find(".wj-row").length).to.equal(2);
				expect($colHeader.find(".wj-row").first().find(".wj-cell").length).to.equal(2);
				expect($colHeader.find(".wj-row").last().find(".wj-cell").length).to.equal(3); // Foobar element is only in first row but merges into second row

				// Goo is merged across columns (It has a width that is equal to the sum of the unmerged cells beneath it)
				const $gooCell = $colHeader.find(".wj-row").first().children().first();
				expect($gooCell.text()).to.equal("Goo");
				const $nextRow = $gooCell.parent().siblings().first();
				expect($nextRow.children()).has.length.of(3, "elements rendered in another row under Goo");
				expect($gooCell.outerWidth()).to.equal(_.sumBy($nextRow.children(), cell => $(cell).outerWidth()), "Goo width");

				// Foobar is merged across all rows
				const $foobarCell = $colHeader.find(".wj-row").first().children().last();
				expect($foobarCell.text()).to.equal("Foobar");
				expect($foobarCell.outerHeight()).to.equal($(`div[wj-part="ch"]`).outerHeight(), "Foobar height");

				// 8 grid cells
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`)).has.length.of(8);

			})

			it("Expandable Table on both primary and secondary dimensions", async function() {
				const validationMessages = {"examples.ui6.parent.goo.0.0": {"description": "Test Validation", "errorType": "Error"}}
				await renderExample("ui6", validationMessages);

				let $colHeader = $(`.wj-colheaders`);

				// Second row has 3 editable header cells
				expect($colHeader.find(".wj-row").last().find(`.${css.editable}`)).has.length.of(3);

				// 8 grid cells
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`)).has.length.of(8);

				// Show add new in Goo context menu
				const $gooCell = $colHeader.find(".wj-row").first().children().first();
				sendNativeEventToElement($gooCell.get(0), "contextmenu");
				await waitCondition(() => $('.bp3-portal').length === 1, 100, 1000);
				expect($(".bp3-portal .bp3-menu-item:contains('Add New')")).to.not.be.empty;
				$(".bp3-portal").remove();


				// Show add new row in grid/body context menu
				sendNativeEventToElement($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).get(0), "contextmenu");
				await waitCondition(() => $('.bp3-portal').length === 1, 100, 1000);
				expect($(".bp3-portal .bp3-menu-item:contains('Insert a New Row')")).to.not.be.empty;
				$(".bp3-portal").remove();


				// Test validation
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"] .InputSpecificationComponent__validator.InputSpecificationComponent__severe-error`)).has.length.of(1);

			})

			it("Expandable Table on both primary and secondary dimensions", async function() {
				await renderExample("ui6");

				let $colHeader = $(`.wj-colheaders`);

				// Second row has 3 editable header cells
				expect($colHeader.find(".wj-row").last().find(`.${css.editable}`)).has.length.of(3);

				// 8 grid cells
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`)).has.length.of(8);

				// Show add new in Goo context menu
				const $gooCell = $colHeader.find(".wj-row").first().children().first();
				sendNativeEventToElement($gooCell.get(0), "contextmenu");
				await waitCondition(() => $('.bp3-portal').length === 1, 100, 1000);
				expect($(".bp3-portal .bp3-menu-item:contains('Add New')")).to.not.be.empty;
				$(".bp3-portal").remove();


				// Show add new row in grid/body context menu
				sendNativeEventToElement($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).get(0), "contextmenu");
				await waitCondition(() => $('.bp3-portal').length === 1, 100, 1000);
				expect($(".bp3-portal .bp3-menu-item:contains('Insert a New Row')")).to.not.be.empty;
				$(".bp3-portal").remove();
			})

			it("Table with Row and Column Headers", async function() {
				await renderExample("ui7");

				let $colHeader = $(`.wj-colheaders`);

				// Column header has 2 rows and second row has 3 editable header cells
				expect($colHeader.find(".wj-row")).has.length.of(2, "Column headers");
				expect($colHeader.find(".wj-row").last().find(`.${css.editable}`)).has.length.of(3);

				let $rowHeader = $(`.wj-rowheaders`);
				// Row header has 8 rows and first row has 2 editable header cells
				expect($rowHeader.find(".wj-row")).has.length.of(8, "Row headers");
				expect($rowHeader.find(".wj-row").first().find(`.${css.editable}`)).has.length.of(2);

				// Last cell is not editable
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).last().hasClass(css['not-editable'])).to.be.true;
			})

			it("Can edit table", async function() {
				await renderExample("ui7");
				const cells = $(`.wj-cells .wj-row .wj-cell[role="gridcell"]`);

				const simulateKeyPress = (character) => {
					let e = new KeyboardEvent('keypress', {key: character.toString(), charCode: character.charCodeAt(0)} as any)
					$('.wj-control').get(0).dispatchEvent(e)
				};

				const updateCell = (cellIndex, character) => {
					sendNativeEventToElement(cells.get(cellIndex), "mousedown");
					simulateKeyPress(character);
					sendNativeEventToElement(cells.get(2), "mousedown"); // submit change by navigating to different cell
				}

				updateCell(0, "1");
				expect(_.get(updates, "goo.0.device.0.model.0")).to.equal(1);

				updateCell(3, "2");
				expect(_.get(updates, "foobar.device.0.model.0")).to.equal(2);

				updateCell(30, "3");
				expect(_.get(updates, "goo.2.maximum")).to.equal(3);
			})


			// Real world examples
			it("RBC Ratio Limits Table with Dropdowns and inapplicable columns", async function() {
				await renderExample("ui8");

				// 5 visible columns
				expect($(`.wj-colheaders`).find(".wj-row:first-child .wj-header")).has.length.of(5, "Column headers");

				// Dropdowns are present
				const $firstCell = $(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).first();
				const $lastCell = $(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).last();
				expect($firstCell.find("button").hasClass("wj-elem-dropdown")).to.be.true;
				expect($firstCell.text()).to.equal("Minimum");
				expect($lastCell.text()).to.equal("Optimization Horizon");

				// Verify the limit text
				expect($(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).eq(2).text()).to.equal("100.00");

			})

			it("Should be able to render a cross with dropdowns", async function() {
				// TRAC-9277
				await renderTable(userValueBased, userValueBased.inputOptions, userValueBased.userInputs.User_Value_Based, null, null);

				// Dropdowns is present
				const $firstCell = $(`.wj-cells .wj-row .wj-cell[role="gridcell"]`).first();
				expect($firstCell.find("button .wj-glyph-down")).has.length.of(1);
				expect($firstCell.text()).to.equal("Zero");
			})
		})
	}
}


testScheduler.register(new InputTableTests());