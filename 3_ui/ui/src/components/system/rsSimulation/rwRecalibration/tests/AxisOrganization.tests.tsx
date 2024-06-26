import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import * as React from 'react';

import { AxisOrganizer } from '../AxisOrganizer';
import {testScheduler, ITestable, sleep, expect, enzyme, enzymeMount, enzymeUnmount} from 'test';
import { waitCondition } from '../../../../../utility';
import { rsSimulationStore } from '../../../../../stores/rsSimulation';
import { RWRecalibration } from '../../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

const timeouts = {
	load: 60 * 1000,
	render: 100 * 1000,
	test: 30 * 1000,
};

class RecalibrationAxisOrganizationTests implements ITestable {
	describeTests = () => {
		let recalibration: RWRecalibration;
		// let container;
		let result;

		function createMouseEvent (type, props = {}) {
			const defaultProps = {
				bubbles: true,
				cancelable: true
			};
			Object.assign(defaultProps, props);
			return new MouseEvent(type, defaultProps);
		}

		function moveElement(startingNode, endingNode, position = 'center') {
			const startRect = startingNode.getBoundingClientRect();
			const dragClientX = startRect.x + 10;
			const dragClientY = startRect.y + 10;
			const endRect = endingNode.getBoundingClientRect();
			let dropClientX = endRect.x;
			let dropClientY = endRect.y;
			if (position === 'top') {
				dropClientX = dropClientX + endRect.width/2;
				dropClientY = dropClientY + endRect.height*0.3;
			} else if (position === 'bottom') {
				dropClientX = dropClientX + endRect.width/2;
				dropClientY = dropClientY + endRect.height*0.8;
			} else {
				dropClientX = dropClientX + endRect.width/2;
				dropClientY = dropClientY + endRect.height/2;
			}

			startingNode.focus();
			startingNode.dispatchEvent(createMouseEvent('dragstart'));
			startingNode.dispatchEvent(createMouseEvent('drag', { clientX: dragClientX, clientY: dragClientY }));
			startingNode.dispatchEvent(createMouseEvent('drag', { clientX: dropClientX, clientY: dropClientY }));
			endingNode.dispatchEvent(createMouseEvent('dragover', { clientX: dropClientX, clientY: dropClientY }));
			endingNode.dispatchEvent(createMouseEvent('drop', { clientX: dropClientX, clientY: dropClientY }));
			startingNode.dispatchEvent(createMouseEvent('dragend', { clientX: dropClientX, clientY: dropClientY }));
		}

		describe('RWRecalibration Axis Organization Tests', async function () {

			before('can render', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				recalibration = await rsSimulationKarmaTool.getRecalibration();

				result = enzymeMount(<AxisOrganizer recalibration={recalibration} />);
			});

			after(() => enzymeUnmount(result));

			const callouts = {
				state: 'State',
				model: 'Model',
				tenor: 'Tenor',
				rating: 'Rating',
				economy: 'Economy',

				separateAlways: 'Always Separate Tables',
				combineAlways: 'Always Same Table',
				separateByDefault: 'Separate Tables by Default',
				combineByDefault: 'Same Table by Default',

				treeHierarchy: 'Tree Hierarchy'
			}
			const get$callout = (text: string) => $(`.bp3-callout:contains("${callouts[text]}")`);

			const getCallout = (text: string, elementNum= 0) => get$callout(text)[elementNum];

			const dragIntoGroup = async (targetNode: Element, group: string, groups: string[] = []) => {
				// console.log('dragEconomyIntoGroup : ' + group + ' / ' + callouts[group]);
				const $groupContainer = () => get$callout(group).next('div');
				const targetText = $(targetNode).text();
				moveElement(targetNode, $groupContainer().get(0));

				if (groups?.length) {
					await waitCondition(() => $groupContainer().find(`.bp3-callout:contains("${targetText}")`).length === 1);

					_.forEach(groups, g => {
						const index = _.indexOf(recalibration.axisOrganization[g], 'economy');
						if (g == group) {
							expect(index).to.gte(0, `after economy move to '${group}', but can not fond in list`);
						} else {
							expect(index).to.lt(0, `after economy move to '${group}', should not fond in '${g}' list`);
						}
					})
				}
			}

			let savedLists: any = {};

			it("can render", async function() {
				this.timeout(timeouts.render);

				await waitCondition(() => getCallout('rating'));
				expect(get$callout('rating')).to.have.lengthOf(2);

				savedLists.treeHierarchy = _.clone(recalibration.axisOrganization.treeHierarchy);
				savedLists.tableColumns = _.clone(recalibration.axisOrganization.tableColumns);
				console.log(savedLists);
			});

			it("can drag column Rating between Tree Hierarchy and Table Columns", async function() {
				this.timeout(timeouts.test);

				// move rating above model
				let source = 'rating';
				let target = 'model';
				let sourceIndex = _.indexOf(savedLists.tableColumns, source);
				let targetIndex = _.indexOf(savedLists.treeHierarchy, target);
				expect(sourceIndex).to.gte(0);
				expect(targetIndex).to.gte(0);

				moveElement(getCallout(source), getCallout(target), 'top');
				await waitCondition(() => get$callout(source).first().parent('div').next('div').text() === callouts[target]);
				savedLists.tableColumns.splice(sourceIndex, 1);
				savedLists.treeHierarchy.splice(targetIndex, 0, source);
				expect(recalibration.axisOrganization.tableColumns).to.deep.equal(savedLists.tableColumns);
				expect(recalibration.axisOrganization.treeHierarchy).to.deep.equal(savedLists.treeHierarchy);


				// move rating below model
				moveElement(getCallout(source), getCallout(target), 'bottom');
				await waitCondition(() => get$callout(source).first().parent('div').prev('div').text() === callouts[target]);
				sourceIndex = _.indexOf(savedLists.treeHierarchy, source);
				savedLists.treeHierarchy.splice(sourceIndex, 1);
				targetIndex = _.indexOf(savedLists.treeHierarchy, target);
				savedLists.treeHierarchy.splice(targetIndex + 1, 0, source);
				expect(recalibration.axisOrganization.treeHierarchy).to.deep.equal(savedLists.treeHierarchy);

				// move rating above tenor
				source = 'rating';
				target = 'tenor';
				sourceIndex = _.indexOf(savedLists.treeHierarchy, source);
				targetIndex = _.indexOf(savedLists.tableColumns, target);
				expect(sourceIndex).to.gte(0);
				expect(targetIndex).to.gte(0);
				moveElement(getCallout(source), getCallout(target), 'top');
				await waitCondition(() => get$callout(source).first().parent('div').next('div').text() === callouts[target]);
				savedLists.treeHierarchy.splice(sourceIndex, 1);
				savedLists.tableColumns.splice(targetIndex, 0, source);
				expect(recalibration.axisOrganization.tableColumns).to.deep.equal(savedLists.tableColumns);
				expect(recalibration.axisOrganization.treeHierarchy).to.deep.equal(savedLists.treeHierarchy);
			});

			it("can drag column Rating between different axis categories", async function() {
				this.timeout(timeouts.test);

				const groups = ['separateAlways', 'separateByDefault', 'combineAlways', 'combineByDefault']

				// move economy to Always Separate Tables
				await dragIntoGroup(getCallout('economy', 1), 'separateAlways', groups);

				// move economy to Same Table by Default
				await dragIntoGroup(getCallout('economy', 1), 'combineByDefault', groups);

				// move economy to Same Always Same Table
				await dragIntoGroup(getCallout('economy', 1), 'combineAlways', groups);

				// move economy back to Separate Tables by Default
				await dragIntoGroup(getCallout('economy', 1), 'separateByDefault', groups);

			});

			it("axis in always same table cannot be dragged to Tree Hierarchy ", async function() {
				this.timeout(timeouts.test);

				const groups = ['separateAlways', 'separateByDefault', 'combineAlways', 'combineByDefault']

				// move economy to always same table
				await dragIntoGroup(getCallout('economy', 1), 'combineAlways', groups);
				await dragIntoGroup(getCallout('model', 1), 'combineAlways', groups);

				await dragIntoGroup(getCallout('economy'), 'treeHierarchy');
				await dragIntoGroup(getCallout('model'), 'treeHierarchy');
				await sleep(1500);

				// expect no effect
				expect(_.indexOf(recalibration.axisOrganization.treeHierarchy, 'economy') < 0).to.eq(true);
				expect(_.indexOf(recalibration.axisOrganization.treeHierarchy, 'model') < 0).to.eq(true);

				// move economy and model back to Separate Tables by Default and restore Tree Hierarchy
				await dragIntoGroup(getCallout('economy', 1), 'separateByDefault');
				await dragIntoGroup(getCallout('model', 1), 'separateByDefault');

				moveElement(getCallout('economy'), getCallout('state'), 'top');
				moveElement(getCallout('model'), getCallout('state'), 'top');
			});

		});
	}
}

testScheduler.register(new RecalibrationAxisOrganizationTests());
