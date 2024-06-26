import {ReactDOM} from 'react';
import {
	loadValidQueryResults,
	enzyme,
	isPhantomJS,
	testScheduler,
	generateAndCompareScreenshot,
	ITestable,
	runQueryFromOptions,
	sampleQueries,
	expect,
	sleep,
	sendNativeEventToElement,
	enzymeMount, enzymeUnmount
} from "test"
import {DraggableQueryBuilder} from 'components';
import {queryStore as store, simulationTestData, simulationStore, QueryDescriptor} from 'stores';
import {AccordionHeader} from '../../components/system/query-tool/query-builder/SuperPanel/Accordion/AccordionHeader';
import {QueryBuilderInstrumenter} from './queryBuilderInstrumenter'
import {VariablesPanel} from '../../components/system/query-tool/query-builder/query-parts/VariablesPanel';
import {AccordionPanelToolbar} from '../../components/system/query-tool/query-builder/SuperPanel/AccordionPanel/AccordionPanelToolbar';
import {AccordionPanelComponent} from '../../components/system/query-tool/query-builder/SuperPanel/AccordionPanel/AccordionPanelComponent';
import {Checkbox} from '@blueprintjs/core';
import {ArrangementPanel} from '../../components/system/query-tool/query-builder/query-parts/ArrangementPanel';
import { reactionToPromise, waitCondition } from "../../utility/utility";

class QueryBuilderTests implements ITestable {

	describeTests() {
		describe(`Query Builder`, () => {

			let queryBuilder = null;
			let qBInstrumenter = null;
			const responseDelay = 6000; // Animation + backend
			let query : QueryDescriptor;

			before(async function () {
				this.timeout(120000);

				await simulationTestData.registerTestSimulations();
				let simulation     = _.first(simulationTestData.simulations);
				const name            = 'Test Query';
				const queryId = await store.createQuerySessionDescriptor(name, [simulation.id]);
				query           = await store.startQuerySession(queryId);

				queryBuilder = enzymeMount(<DraggableQueryBuilder queryId={queryId}/>)
				qBInstrumenter = new QueryBuilderInstrumenter(queryBuilder, responseDelay);
			});

			after(() => enzymeUnmount(queryBuilder));

			const validateTitle = async (expectedSelection :number, timeout = 30 * 1000) => {
				const accordionComponents = queryBuilder.find('.SuperPanelComponent__superPanel[data-part="variables"] .AccordionPanelToolbar__title');
				let selectedItems = -1;
				await waitCondition(() => {
					selectedItems = parseInt(accordionComponents.text().trim());
					return selectedItems === expectedSelection
				}, 100, timeout)
				expect(selectedItems).equals(expectedSelection)
			}


			it('should be able to expand accordion', async function () {
				this.timeout(15 * 1000);

				await qBInstrumenter.expandAccordion("FTime")
				expect($(qBInstrumenter.getAccordionComponentByLabel("FTime").find('.variables').at(0).getDOMNode()).height()).to.be.greaterThan(0);
			})

			it('Should be able to unselect all coordinates in accordion', async function () {
				this.timeout(5000);

				const accordionComponentWrapper = qBInstrumenter.getAccordionComponentByLabel("FTime");

				// Unselect all

				sendNativeEventToElement(accordionComponentWrapper.find('.check-all input').getDOMNode(), "click")
				await validateTitle(0);
			})

			it('should be able to select variables', async function () {
				this.timeout(60 * 1000);

				// select none
				await qBInstrumenter.selectAccordionValue("FTime", "(None)")
				await validateTitle(67);

				await qBInstrumenter.selectAccordionValue("FTime", "(None)") // turn off
				await validateTitle(0);

				// select f0
				await qBInstrumenter.selectAccordionValue("FTime", "+1 Period")
				await validateTitle(2);

				// sleep(3000);

				// Verify that arrangement panel updates correctly
				await qBInstrumenter.expandAccordion("Economy")
				await qBInstrumenter.selectAccordionValue("Economy", "DE")

				await validateTitle(1);

				//TODO: Sometimes the arrangment panel never updates, can't reproduce manually but worth looking into more.
				//const columnLength = () => queryBuilder.find('ArrangementPanel').find(".columns div").length;
				//await waitCondition(() => columnLength() == 1)
				//expect(columnLength()).equals(1)
			})
		})
	}
}

testScheduler.register(new QueryBuilderTests());
