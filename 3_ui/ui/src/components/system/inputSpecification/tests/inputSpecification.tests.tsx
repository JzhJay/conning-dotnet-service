import {inputSpecification, InputSpecificationComponent} from 'components';
import {specification, initValue} from 'components/system/inputSpecification/tests/mockExamples';
import {action, makeObservable, observable, toJS,} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {enzyme, enzymeMount, enzymeUnmount, expect, get$Container, ITestable, sendNativeEventToElement, simulateMouseEvent, testScheduler} from 'test';
import {sleep, waitCondition} from 'utility';
import {Validation} from 'components/system/inputSpecification/models';

@observer
class MockComponent extends React.Component<{name: string, initValue?: any, validations?: {[key: string]: Validation}}, any> {

	constructor(props) {
		super(props);
		makeObservable(this);

		this.userInputs = props.initValue ? _.merge({}, props.initValue) : {};
	}

	@observable userOptions = {verboseMode: false};
	@observable userInputs;

	render() {
		console.log(inputSpecification(this.props.name, {options: specification}, this.userOptions.verboseMode));

		return <InputSpecificationComponent
			inputs={this.userInputs}
			specification={inputSpecification(this.props.name, {options: specification}, this.userOptions.verboseMode)}
			applyUpdate={action((updates) => {
				this.userInputs = _.merge(this.userInputs, updates);
			})}
			updateUserOptions={action((userOptions) => {
				_.merge(this.userOptions, userOptions);
			})}
			userOptions={this.userOptions}
			validations={this.props.validations || {}}
		/>;
	}
}

class InputSpecificationTests implements ITestable {
	describeTests = () => {
		let result;
		let $container;
		let mockComponent: MockComponent;

		describe("Input Specification tests (basic)", () => {

			before(() => {
				//get$Container().remove();
				//$container = $(`<div id='testContainer' class="conning app ui" style="display:flex; width:1000px; height:1000px"></div>`).appendTo(document.body);
				result = enzymeMount(<MockComponent name={"mockInputs"} ref={ ref => mockComponent = ref} />);
				$container = get$Container();
			})

			after(() => enzymeUnmount(result));

			it(`component can render`, async function(){
				expect($container.find('.InputSpecificationComponent__view-title').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__view-title').text()).to.eq("Mock Section");

				expect($container.find('.bp3-navbar .bp3-button').length).to.eq(3);
				expect($container.find('.bp3-navbar .bp3-button:contains("Compact")').is('.bp3-active')).to.eq(true); // verboseMode = true;
				expect($container.find('.InputSpecificationComponent__description').length).to.eq(0);
				expect($container.find('.bp3-radio').length).to.eq(0);
			});

			const getInlineGroup = (text) => {
				const $title = $(`.InputSpecificationComponent__title:contains("${text}")`);
				expect($title.length).to.eq(1, `input group ${text} should exist`);

				const $parent = $title.parents('.InputSpecificationComponent__inline').first();
				expect($parent.length).to.eq(1, `input group ${text} should found inline parent`);

				return $parent;
			}

			const getControlWrapper = (text) => {
				const $title = $(`.InputSpecificationComponent__title:contains("${text}")`);
				expect($title.length).to.eq(1, `input group ${text} should exist`);

				const $parent = $title.parents('.InputSpecificationComponent__control-wrapper').first();
				expect($parent.length).to.eq(1, `input group ${text} should found control wrapper`);

				return $parent;
			}

			it('can change string input', async () => {
				const testGroup = "String Input";
				let $input = getInlineGroup(testGroup).find('input');
				expect($input.length).to.eq(1, `input should be found`);
				expect($input.val()).to.eq("ABC", `verify default value`);
				$input.focus();
				$input.val("EFG");
				$input.blur();

				await sleep(100);
				$input = getInlineGroup(testGroup).find('input');
				expect($input.val()).to.eq("EFG", `verify modified value`);
			})

			it('can change integer input', async () => {
				const testGroup = "Integer Input";
				let $input = getInlineGroup(testGroup).find('input');
				expect($input.length).to.eq(1, `input should be found`);
				expect($input.val()).to.eq("0", `verify default value`);
				$input.focus();
				$input.val("5");
				$input.blur();

				await sleep(100);
				$input = getInlineGroup(testGroup).find('input');
				expect($input.val()).to.eq("5", `verify modified value`);
			})

			it('can change float input', async () => {
				const testGroup = "Float Input:";
				let $input = getInlineGroup(testGroup).find('input');
				expect($input.length).to.eq(1, `input should be found`);
				expect($input.val()).to.eq("1", `verify default value`);
				$input.focus();
				$input.val("0.5689995");
				$input.blur();

				await sleep(100);
				$input = getInlineGroup(testGroup).find('input');
				expect($input.val()).to.eq("0.569", `verify modified value`);
			})

			it('can change float input (hints: percent)', async () => {
				const testGroup = "Float Input with percent";
				let $input = getInlineGroup(testGroup).find('input');
				expect($input.length).to.eq(1, `input should be found`);
				expect($input.val()).to.eq("100", `verify default value`);
				$input.focus();
				$input.val("50.5689995");
				$input.blur();

				await sleep(100);
				$input = getInlineGroup(testGroup).find('input');
				expect($input.val()).to.eq("50.569", `verify modified value`);
			})

			it('can change float input (hints: decimalPlaces)', async () => {
				const testGroup = "Float Input max 5 decimal";
				let $input = getInlineGroup(testGroup).find('input');
				expect($input.length).to.eq(1, `input should be found`);
				expect($input.val()).to.eq("1", `verify default value`);
				$input.focus();
				$input.val("0.5689995");
				$input.blur();

				await sleep(100);
				$input = getInlineGroup(testGroup).find('input');
				expect($input.val()).to.eq("0.569", `verify modified value`);
			})

			it('can change selection at compact mode', async () => {
				const testGroup = "selection:";
				let $popover = getInlineGroup(testGroup).find('.bp3-popover-target');

				expect($popover.length).to.eq(2, `popover should be found`);
				expect($popover.last().text()).to.eq(" Option 1", `verify default value`);

				simulateMouseEvent($popover.last()[0], 'click');
				await waitCondition(() => $('.bp3-portal .bp3-menu').length);
				const $options = $('.bp3-portal .bp3-menu .bp3-menu-item');
				expect($options.length).to.eq(3, `popover should be found`);

				simulateMouseEvent($options.last()[0], 'click');

				await sleep(100);
				$popover = getInlineGroup(testGroup).find('.bp3-popover-target');
				expect($popover.last().text()).to.eq(" Option 3", `verify modified value`);
			})

			it('can change boolean input', async () => {
				const testGroup = "Boolean Input (default: false)";
				let $input = getInlineGroup(testGroup).find('.bp3-checkbox');
				expect($input.length).to.eq(1, `input should be found`);
				expect(($input.find('input')[0] as any).checked).to.eq(false, `verify default value`);
				simulateMouseEvent($input[0], 'click');

				await sleep(100);
				$input = getInlineGroup(testGroup).find('.bp3-checkbox');
				expect(($input.find('input')[0] as any).checked).to.eq(true, `verify modified value`);

				// test another checkbox
				$input = getInlineGroup("Boolean Input (default: true)").find('.bp3-checkbox');
				expect($input.length).to.eq(1, `input should be found`);
				expect(($input.find('input')[0] as any).checked).to.eq(true, `verify default value`);
			})

			it(`can switch verbose mode`, async () => {
				expect($container.find('.bp3-navbar .bp3-button:contains("Detailed")').is('.bp3-active')).to.eq(false);

				result.find('.bp3-navbar .bp3-button').first().simulate('click');

				await waitCondition( () => $container.find('.bp3-navbar .bp3-button:contains("Detailed")').is('.bp3-active'));
				expect($container.find('.InputSpecificationComponent__description').length).to.eq(9);
				expect($container.find('.bp3-radio').length).to.eq(3);
				expect($container.find('.InputSpecificationComponent__option-group .bp3-button').length).to.eq(3);
			})

			it(`selection should into radio`, () => {
				const testGroup = "selection:";
				let $radios = getControlWrapper(testGroup).find('.bp3-radio');
				expect($radios.length).to.eq(3, `options should be found`);
				expect(($radios.last().find('input')[0] as any).checked).to.eq(true, `verify default value`);
			})

			it('can change selection at Detailed mode', async () => {
				const testGroup = "selection:";
				let $radios = getControlWrapper(testGroup).find('.bp3-radio');
				expect($radios.length).to.eq(3, `options should be found`);

				let currentRadio = ($radios.find('input').filter((i, el) => (el as any).checked));
				expect(currentRadio.length).to.eq(1, `verify default value`);
				expect(currentRadio.val()).to.eq(`option3`);

				simulateMouseEvent($radios[1], 'click');

				await sleep(100);
				currentRadio = ($radios.find('input').filter((i, el) => (el as any).checked));
				expect(currentRadio.length).to.eq(1, `verify default value`);
				expect(currentRadio.val()).to.eq(`option2`);
			})

			it('can change selection at Button mode', async () => {
				const testGroup = "selection (hints: renderAsButtons)";
				let $buttons = getControlWrapper(testGroup).find('.bp3-button');
				expect($buttons.length).to.eq(3, `options should be found`);
				expect(getControlWrapper(testGroup).find('.bp3-button.bp3-active').length).to.eq(1, `verify default value`);
				expect(getControlWrapper(testGroup).find('.bp3-button.bp3-active').text()).to.eq(`Option 1 Option Description`, `verify default value`);

				simulateMouseEvent($buttons[1], 'click');

				await sleep(100);

				expect(getControlWrapper(testGroup).find('.bp3-button.bp3-active').length).to.eq(1, `verify default value`);
				expect(getControlWrapper(testGroup).find('.bp3-button.bp3-active').text()).to.eq(`Option 2 Option Description`, `verify modified value`);
			})

			it('verify userInputs', () => {
				expect(mockComponent.userInputs.mockSection).to.deep.eq({
					"stringInput": "EFG",
					"integerInput": 5,
					"floatInput": 0.5689995,
					"floatInput2": 0.505689995,
					"floatInput3": 0.5689995,
					"selection": "option2",
					"booleanInput1": true,
					"selection2": "2"
				})
			})
		});

		describe("Input Specification tests (interpolate)", () => {

			before(() => {
				result = enzymeMount(<MockComponent name={"interpolate"} ref={ ref => mockComponent = ref} />);
				$container = get$Container();
			})

			after(() => enzymeUnmount(result));

			it(`verify`, () => {

				expect($container.find('.InputSpecificationComponent__view-title').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__view-title').text()).to.eq("Mock Section");

				expect($container.find('.InputSpecificationComponent__title').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__title').text()).to.eq("Lambdas:");

				expect($container.find('.InputSpecificationComponent__interpolate').length).to.eq(5);
			});
		});

		describe("Input Specification tests (hints: renderAsGrid)", () => {

			before(() => {
				result = enzymeMount(<MockComponent name={"mockGrids"} ref={ ref => mockComponent = ref} />);
				$container = get$Container();
			})

			after(() => enzymeUnmount(result));

			it(`verify`, async function() {

				this.timeout( 5 * 1000);

				expect($container.find('.InputSpecificationComponent__view-title').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__view-title').text()).to.eq("Mock Grids");

				expect($container.find('.InputSpecificationComponent__grid-layout').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__grid-layout-row').length).to.eq(3);
				expect($container.find('.InputSpecificationComponent__grid-layout .InputSpecificationComponent__grid-layout-row').length).to.eq(2);

			});

		});

		describe("Input Specification tests (hints: showTitle)", () => {

			before(() => {
				result = enzymeMount(<MockComponent name={"noTitle"} />);
				$container = get$Container();
			})

			after(() => enzymeUnmount(result));

			it(`verify`, () => {

				expect($container.find('.InputSpecificationComponent__view-title').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__view-title').text()).to.eq("Mock Section");

				expect($container.find('.InputSpecificationComponent__focusable').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__title').length).to.eq(0);
			});
		});

		describe("Input Specification tests (hints: dimension)", () => {

			before(() => {
				result = enzymeMount(<MockComponent name={"mockTables"} initValue={initValue} ref={ ref => mockComponent = ref} />);
				$container = get$Container();
			})

			after(() => enzymeUnmount(result));

			it(`component can render`, () => {

				expect($container.find('.InputSpecificationComponent__view-title').length).to.eq(1);
				expect($container.find('.InputSpecificationComponent__view-title').text()).to.eq("Mock Tables");

				expect($container.find('.InputTable__root').length).to.eq(2);
			});

			const editCell = async ($testTable, $testCell, currentVal?, updateVal?, expectValue?) => {

				if( currentVal != null) {
					expect($testCell.text()).to.eq(currentVal);
				}

				if( updateVal != null) {
					sendNativeEventToElement($testCell[0], "mousedown");
					$testTable.find('.wj-control').get(0).dispatchEvent(new KeyboardEvent('keypress', {key:"1", charCode: 49} as any))

					await waitCondition(() => $testCell.find('input').length);
					$testCell.find('input').val(updateVal);

					sendNativeEventToElement($testTable.find('.wj-cell')[0], "mousedown");
					await waitCondition(() => !$testCell.find('input').length);

					expect($testCell.text()).to.eq(expectValue == null ? updateVal : expectValue);
				}
			}

			describe("(dimension=2)", () => {

				let $testTable;

				before(() => {
					$testTable = $container.find('.InputTable__root').first();
					expect($testTable.length).to.eq(1);
				})

				const get$Cell = ($testTable, row, col) => {
					const $cell = $testTable.find(`div[wj-part="cells"] .wj-row:nth-child(${row + 1}) .wj-cell:nth-child(${col})`);
					expect($cell.length).to.eq(1);
					return $cell;
				}

				it(`check table`, async () => {

					await waitCondition(() => $testTable.find('.wj-cell').length);

					let $rowHeader = $testTable.find(`div[wj-part="ch"]`);
					expect($rowHeader.find(".wj-row").length).to.equal(1);
					expect($rowHeader.find(".wj-cell").length).to.equal(5);

					expect($testTable.find(`.wj-cell[role="gridcell"]`)).has.length.of(5 * 3);
				});

				it(`change string col`, async () => {
					await editCell( $testTable, get$Cell($testTable, 2, 1), "V2", "234");
				})

				it(`change integer col`, async () => {
					await editCell( $testTable, get$Cell($testTable, 2, 3), null, "5");
				})

				it(`can not change integer col using a string`, async () => {
					await editCell( $testTable, get$Cell($testTable, 2, 3), "5", "ABC", "5");
				})

				it(`change float col`, async () => {
					await editCell( $testTable, get$Cell($testTable, 2, 4), null, "5.99756");
				})

				it(`verify and update boolean col`, async () => {
					expect(get$Cell($testTable, 3, 2).find('input')[0].checked).to.eq(false);

					const $testInput = get$Cell($testTable, 2, 2).find('input');
					expect($testInput[0].checked).to.eq(true);
					sendNativeEventToElement($testInput[0], 'click');
					expect($testInput[0].checked).to.eq(false);
				})


				it(`update selection col`, async () => {
					let $testCell = get$Cell($testTable, 2, 5);
					expect($testCell.text()).to.eq("");
					sendNativeEventToElement($testCell.find('button')[0], 'click');
					await waitCondition(() => $('.wj-dropdown-panel').length);
					expect($('.wj-dropdown-panel .wj-listbox-item').length).to.gte(3);
					$('.wj-dropdown-panel .wj-listbox-item').first().click();

					await waitCondition(() => !$('.wj-dropdown-panel').length);

					expect(get$Cell($testTable, 2, 5).text()).to.eq("Option 1");
				})

				it('verify userInputs', () => {
					expect(_.get(mockComponent.userInputs, ["mockTables","inputTable","1"])).to.deep.eq({
						"string": "234",
						"boolean": false,
						"integer": 5,
						"float": 5.99756,
						"stringSelection": "option1"
					})
				})
			});

			describe("(dimension=1)", () => {

				let $testTable;

				before(() => {
					$testTable = $container.find('.InputTable__root').last();
					expect($testTable.length).to.eq(1);
				})

				const get$Cell = ($testTable, row, col) => {
					const $cell = $testTable.find(`div[wj-part="cells"] .wj-row:nth-child(${col + 1}) .wj-cell:nth-child(${row})`);
					expect($cell.length).to.eq(1);
					return $cell;
				}

				it(`check table`, async () => {

					await waitCondition(() => $testTable.find('.wj-cell').length);

					let $rowHeader = $testTable.find(`div[wj-part="rh"]`);
					expect($rowHeader.find(".wj-row").length).to.equal(3);
					expect($rowHeader.find(".wj-cell").length).to.equal(3);

					expect($testTable.find(`.wj-cell[role="gridcell"]`)).has.length.of(3);
				});

				it(`change integer col`, async () => {
					await editCell( $testTable, get$Cell($testTable, 1, 2), null, "5");
				})

				it(`can not change integer col using a string`, async () => {
					await editCell( $testTable, get$Cell($testTable, 1, 2), "5", "ABC", "5");
				})

				it('verify userInputs', () => {
					expect(_.get(mockComponent.userInputs, ["mockTables","inputTable2"])).to.deep.eq({
						"string": "V1",
						"integer": 5
					})
				})




			});


		});
	}
}


testScheduler.register(new InputSpecificationTests());