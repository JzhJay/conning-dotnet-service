import {inputSpecification, InputSpecificationComponent} from 'components';
import {container} from 'components/site/header/ErrorIndicator.css';
import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import * as React from 'react';
import {testScheduler, ITestable, expect, enzyme, simulateMouseEvent, enzymeUnmount, get$Container, enzymeMount} from "test"
import {RSSimulation, site} from 'stores';
import * as css from 'components/system/inputSpecification/InputSpecificationComponent.css';
import {waitCondition} from 'utility';

const timeouts = {
	load: 60 * 1000,
	render: 10 * 1000,
	delete: 10 * 1000,
	test: 30 * 1000,
}

class RSSimulationInputs implements ITestable {

	describeTests = () => {
		let rsSimulationId: string;
		let rsSimulation: RSSimulation;
		describe(`RSSimulation Input Component Tests`, async function () {

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				rsSimulation = await rsSimulationKarmaTool.getRSSimulation(true);
				rsSimulationId = rsSimulation._id;

				console.log(`[RSSimulationInputs] load input state`);
				await rsSimulation.loadInputState();
			})

			function getControlWrapper(titleName, expectNum = 1) {
				let testInputSet = get$Container().find(`.${css.title}:contains('${titleName}')`).closest(`.${css.inline}`);
				expect(testInputSet.length).to.eq(expectNum);
				return testInputSet;
			}

			describe(`Simulation Nodes`, function () {

				let container;
				let result;

				before('can render', async function () {
					this.timeout(timeouts.render)

					result = enzymeMount(<InputSpecificationComponent
						inputs={rsSimulation.userInputs}
						applyUpdate={rsSimulation.sendInputsUpdate}
						validations={{}}
						userOptions={{verboseMode: false}}
						allowScrolling={true}
						specification={inputSpecification("simulationNodes", {options: rsSimulation.inputOptions}, false)}/>);

					container = get$Container();
				})

				after(() => enzymeUnmount(result));

				it("can load", function() {
					this.timeout(timeouts.test);
					// verify fields
					let titles = container.find(`.${css.title}`);
					expect(titles).to.have.lengthOf(5);
					[
						'Time Step:',
						'Years to Project:',
						'Enable to execute Simulation from Interpreted Steps or not:',
						'Save Simulation Start Date Data:',
						'Scenarios to Simulate:'
					].forEach( (title, i) => {
						expect($(titles[i]).text()).to.eq(title, `title: "${title}" should be exist and equals to "${$(titles[i]).text()}"`);
					});
				})

				it("can modify selection input", async function () {
					this.timeout(timeouts.test);

					const wrapper = getControlWrapper('Time Step');
					simulateMouseEvent(wrapper.find(`.${css.control} .bp3-popover-target`)[0], 'click');

					await waitCondition(() => {
						result.update();
						return result.find(".bp3-menu-item").length > 1;
					});

					const selectItem = "Annual";

					result.find(".bp3-menu-item").filterWhere( n => n.html().includes(selectItem)).at(0).simulate("click");

					await waitCondition(() => !site.busy);
					expect(wrapper.find(`.${css.control}`).text()).to.includes(selectItem);
				})

				it("can modify text input", async function () {
					this.timeout(timeouts.test);

					const wrapper = getControlWrapper('Scenarios to Simulate');

					await rsSimulation.sendInputsUpdate({"simulationNodes":{"scenarios": "1-50"}})

					result.update();
					let textInput = wrapper.find(`input`).first();
					expect(textInput.val()).to.eq('1-50');
				})

			})

			describe(`Files To ProduceNodes`, function () {

				let container;
				let result;

				before('can render', async function () {
					this.timeout(timeouts.render)

					result = enzymeMount(<InputSpecificationComponent
							inputs={rsSimulation.userInputs}
							applyUpdate={rsSimulation.sendInputsUpdate}
							validations={{}}
							userOptions={{verboseMode: false}}
							allowScrolling={true}
							specification={inputSpecification("filesToProduceNodes", {options: rsSimulation.inputOptions}, false)}/>)
					container = get$Container();
				});

				after(() => enzymeUnmount(result));

				it("can load", function() {
					this.timeout(timeouts.test);

					let titles = container.find(`.${css.title}`);
					expect(titles).to.have.lengthOf(8);
					[
                        "Save Simulation Results",
						"Create Files For Download",
						"File Format:",
						"All Tenors and All Returns in One File",
                        "All Tenors in One File",
						"All Asset Classes in One File",
                        "Separate Files for Each Tenor",
                        "Separate Files for Each Asset Class"
					].forEach( (title, i) => {
						expect($(titles[i]).text()).to.eq(title, `title: "${title}" should be exist`);
					});
				})

				it("can modify checkbox input", async function () {
					this.timeout(timeouts.test);

					const wrapper = getControlWrapper('Separate Files for Each Tenor');
					const attributePath = "filesToProduceNodes.fileFormat.separateTenorsCsv";

					const separateTenorsCsv = _.get(rsSimulation.userInputs, attributePath);

					simulateMouseEvent(wrapper.find(`.bp3-checkbox`)[0], 'click');

					await waitCondition(() => {
						return _.get(rsSimulation.userInputs, attributePath) != separateTenorsCsv;
					});

				})

			})

		})
	}
}

testScheduler.register(new RSSimulationInputs());
