import { simulationStore, simulationTestData, queryStore, HTTP_STATUS_CODES, Query, QueryState, QueryDescriptor, Accordion } from 'stores';
import {mobx} from '../../stores';

export async function runQueryFromOptions(queryOptions, queryIdDefault?, simulation?) {
	//let simulations = await simulationStore.loadDescriptors();

	await simulationTestData.registerTestSimulations();
	if (simulation == null) {
		simulation = _.first(simulationTestData.simulations);
	}
	let queryId
	let name = 'Test Query';
	if (queryIdDefault == null){
		queryId = await queryStore.createQuerySessionDescriptor(name, [simulation.id]);
	} else{
		queryId = queryIdDefault
	}
	let query: Query;
	query = await queryStore.startQuerySession(queryId);

	const findAccordion = (query, panelName, accordionName): Accordion => {
		const accordion = query.panels[panelName][0].accordions.filter((accordion) => accordion.axis.label === accordionName)[0];
		return accordion;
	}

	const findAccordionValue = (accordion, coordinateName) => {
		const values = accordion.values;
		let accordionValue = null;

		for (let key in values) {
			const coordinateValue = values[key]
			if (coordinateValue.coordinate.label == coordinateName) {
				accordionValue = coordinateValue;
				break;
			}
		}

		return accordionValue;
	}

	// await Promise.all(queryOptions.selections.map((selection) => {
	// 	//const accordion = findAccordion(query, selection.panel, selection.axis);
	// 	//const accordionValue = findAccordionValue(accordion, selection.coordinate);
	//
	// 	const moduleAxis = query.axisByLabel(selection.axis),
	// 		clause = query.variables.clauses.values()[0];
	//
	// 	// return clause.selectCoordinates('Only', moduleAxis, [moduleAxis.coordinateByLabel(selection.coordinate)]);
	// 	return clause.selectCoordinates('Only', moduleAxis, selection.coordinate.map((c) => moduleAxis.coordinateByLabel(c)))
	//
	// 	//return accordion.selectValues("Only", [accordionValue])
	// }))
	for (let selection of queryOptions.selections){
		let moduleAxis = query.axisByLabel(selection.axis);
		if (!moduleAxis) {
			console.log(`[queryHelper] no axis "${selection.axis}" found in query. [${Object.keys(query._axisByLabel)}]`);
			continue;
		}
		let clause = mobx.values(query._variables.clauses)[0];
		await clause.selectCoordinates('Only', moduleAxis, selection.coordinate.map((c) => moduleAxis.coordinateByLabel(c)))
	}

	// await Promise.all(queryOptions.statistics.map((statistic) => {
	// 	query.statistics.addClause(statistic.axis);
	// 	statistic.stats.map() .query.statistics.addStatistic(stats.axis)
	// }))
	if ('statistics' in queryOptions) {
		for (let statistic of queryOptions.statistics) {
			// console.warn("aa", query.statistics.clauses.length)
			// console.warn(statistic)
			await query.statistics.addClause(statistic.axis);
			// console.warn("bb", query.statistics.clauses.length)
			let clause = query.statistics.clauses.filter(clause => clause.axis == statistic.axis)[0]
			for (let stat of statistic.stats) {
				await query.statistics.addStatistic(clause, stat)
			}
		}
	}

	//TODO: specify arrangement

	return query.run();
}