import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import * as React from 'react';

import { ModelTree } from '../ModelTree';
import {testScheduler, ITestable, expect, enzyme, simulateMetaKeyClickEvent, simulateMouseEvent, enzymeUnmount, enzymeMount} from 'test';
import { waitCondition } from '../../../../../utility';
import { RWRecalibration } from '../../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

const timeouts = {
	load: 60 * 1000,
	render: 100 * 1000,
	test: 30 * 1000,
};

class RecalibrationModelTreeTests implements ITestable {
	describeTests = () => {
		let recalibration: RWRecalibration;
		// let container;
		let result;

		const firstLayerLabel = { US: 'US'};
		const secondLayerLabel = {
			Real_Term_Structure_And_Inflation: 'Real Term Structure and Inflation',
			Corporate_Bonds: 'Corporate Bonds',
			Equity: 'Equity'
		};

		const getLabel$DOM = (label_text: string, expectLength?: number) => {
			const found = $(`span.bp3-tree-node-label:contains(${label_text})`);
			if (expectLength == null) {
				expect(found.length > 0).to.eq(true, `label: ${label_text} not found`);
			} else if (expectLength >= 0 ) {
				expect(found.length).to.eq(expectLength, `label: ${label_text} expect length = ${expectLength}`);
			}

			return found;
		}
		const getNodeBy$DOM = ($dom, selected?: boolean) => {
			const found = $dom.is(`li.bp3-tree-node`) ? $dom() : $dom.closest(`li.bp3-tree-node`).first();
			expect(found.length > 0).to.eq(true, `node element: ${$dom.text()} not found`);
			if (selected != null) {
				expect(found.is('.bp3-tree-node-selected')).to.eq(selected, `node element: ${found.attr('className')}`);
			}
			return found;
		}
		const getIconBy$DOM = ($dom) => {
			const found = getNodeBy$DOM($dom).find(`.bp3-icon`).first();
			expect(found.length > 0).to.eq(true, `label controller: ${$dom.text()} not found`);
			return found;
		}

		describe('RWRecalibration ModelTree Tests', async function () {

			before('can render', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);

				recalibration = await rsSimulationKarmaTool.getRecalibration();

				result = enzymeMount(<ModelTree recalibration={recalibration} />);
			});

			after(() => enzymeUnmount(result));

			it("can render", async function() {
				this.timeout(timeouts.render);
				await rsSimulationKarmaTool.resetRecalibrationAxisOrganization(recalibration);
				getLabel$DOM(firstLayerLabel.US, 1);
			});

			it("can expand a node", async function() {
				this.timeout(timeouts.test);

				getLabel$DOM(secondLayerLabel.Real_Term_Structure_And_Inflation, 0);

				const $usNodeIcon = getIconBy$DOM(getLabel$DOM(firstLayerLabel.US));
				simulateMouseEvent($usNodeIcon[0], 'click');

				let $selectedNode;
				await waitCondition(() => {
					$selectedNode = getLabel$DOM(secondLayerLabel.Real_Term_Structure_And_Inflation, -1);
					return $selectedNode.length === 1;
				});

				expect($selectedNode).to.have.lengthOf(1);
				// no default value anymore.
				// expect($selectedNode.closest('li').hasClass('bp3-tree-node-selected')).to.eq(true);
			});

			it("can select a node", async function() {
				this.timeout(timeouts.test);

				const $corporateBonds = getLabel$DOM(firstLayerLabel.US);
				simulateMouseEvent($corporateBonds[0], 'click');

				await waitCondition(() => getNodeBy$DOM($corporateBonds).hasClass('bp3-tree-node-selected'));
				getNodeBy$DOM($corporateBonds, true)
				expect(recalibration.datasets.length).to.gte(1);
				_.each(recalibration.datasets, dataset => {
					expect(dataset.name.indexOf(firstLayerLabel.US)).to.eq(0);
				});
			});

			it("can select a sub node", async function() {
				this.timeout(timeouts.test);

				const $corporateBonds = getLabel$DOM(secondLayerLabel.Corporate_Bonds);
				simulateMouseEvent($corporateBonds[0], 'click');

				await waitCondition(() => getNodeBy$DOM($corporateBonds).hasClass('bp3-tree-node-selected'));
				getNodeBy$DOM($corporateBonds, true)
				expect(recalibration.datasets.length).to.gte(1);
				_.each(recalibration.datasets, dataset => {
					expect(dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Corporate_Bonds}`)).to.eq(0);
				});
			});

			it("can select multiple nodes", async function() {
				this.timeout(timeouts.test);

				const $realTermNode = getLabel$DOM(secondLayerLabel.Real_Term_Structure_And_Inflation);
				const $equityNode = getLabel$DOM(secondLayerLabel.Equity);
				const $corporateBonds = getLabel$DOM(secondLayerLabel.Corporate_Bonds);

				// select additional 2 nodes
				simulateMetaKeyClickEvent($realTermNode[0]);
				simulateMetaKeyClickEvent($equityNode[0]);

				await waitCondition(() => getNodeBy$DOM($realTermNode).hasClass('bp3-tree-node-selected'));
				await waitCondition(() => getNodeBy$DOM($corporateBonds).hasClass('bp3-tree-node-selected'));

				getNodeBy$DOM($corporateBonds, true)
				getNodeBy$DOM($realTermNode, true)
				getNodeBy$DOM($corporateBonds, true)

				expect(recalibration.datasets.length).to.gte(3);
				let catalogResult = {
					[secondLayerLabel.Real_Term_Structure_And_Inflation]: false,
					[secondLayerLabel.Equity]: false,
					[secondLayerLabel.Corporate_Bonds]: false,
				};
				_.each(recalibration.datasets, dataset => {
					let testResult = false;
					if (dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Real_Term_Structure_And_Inflation}`) == 0) {
						testResult = true;
						catalogResult[secondLayerLabel.Real_Term_Structure_And_Inflation] = true;
					}
					if (dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Equity}`) == 0) {
						testResult = true;
						catalogResult[secondLayerLabel.Equity] = true;
					}
					if (dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Corporate_Bonds}`) == 0) {
						testResult = true;
						catalogResult[secondLayerLabel.Corporate_Bonds] = true;
					}
					expect(testResult).to.eq(true);
				});
				expect(catalogResult[secondLayerLabel.Real_Term_Structure_And_Inflation]).to.eq(true);
				expect(catalogResult[secondLayerLabel.Equity]).to.eq(true);
				expect(catalogResult[secondLayerLabel.Corporate_Bonds]).to.eq(true);
			});

			it("can deselect 1 node from multiple nodes", async function() {

				const $realTermNode = getLabel$DOM(secondLayerLabel.Real_Term_Structure_And_Inflation);

				// deselect 1 node
				simulateMetaKeyClickEvent($realTermNode[0]);
				await waitCondition(() => !getNodeBy$DOM($realTermNode).hasClass('bp3-tree-node-selected'));
				getNodeBy$DOM($realTermNode, false)

				expect(recalibration.datasets.length).to.gte(2);
				let catalogResult = {
					[secondLayerLabel.Real_Term_Structure_And_Inflation]: true,
					[secondLayerLabel.Equity]: false,
					[secondLayerLabel.Corporate_Bonds]: false,
				};
				_.each(recalibration.datasets, dataset => {
					let testResult = false;
					if (dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Real_Term_Structure_And_Inflation}`) == 0) {
						catalogResult[secondLayerLabel.Real_Term_Structure_And_Inflation] = false;
					}
					if (dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Equity}`) == 0) {
						testResult = true;
						catalogResult[secondLayerLabel.Equity] = true;
					}
					if (dataset.name.indexOf(`${firstLayerLabel.US}/${secondLayerLabel.Corporate_Bonds}`) == 0) {
						testResult = true;
						catalogResult[secondLayerLabel.Corporate_Bonds] = true;
					}
					expect(testResult).to.eq(true);
				});
				expect(catalogResult[secondLayerLabel.Real_Term_Structure_And_Inflation]).to.eq(true);
				expect(catalogResult[secondLayerLabel.Equity]).to.eq(true);
				expect(catalogResult[secondLayerLabel.Corporate_Bonds]).to.eq(true);
			});

		});
	}
}

testScheduler.register(new RecalibrationModelTreeTests());
