// import {db} from "stores/db";
//
// export function find(id: string) {
// 	// Note: The default horizon behaviour when no result is found is to not respond, defaultIfEmpty() forces a response even when the result is null.
// 	return db.horizonAsPromised(horizon => horizon('queries').find(id).fetch().defaultIfEmpty()) as Promise<DatabaseQuery>;
// }
//
// export function add(id: string) {
// 	return db.horizonAsPromised(horizon => horizon('queries').insert({id: id}));
// }
//
// export function updateQuery(id, properties) {
// 	return db.horizonAsPromised(horizon => (horizon('queries') as any).update(Object.assign({id: id}, properties)));
// }
//
// export function updatePanelProperties(panel, properties) {
// 	return updateQuery(panel.queryId, getPanelProperties(panel, properties))
// }
//
// export function updateAccordionProperties(panel, accordions, properties) {
// 	let accordionPropsMap = {};
//
// 	accordions.forEach((accordion) => {
// 		accordionPropsMap[accordion.id] = properties;
// 	})
//
// 	return updateQuery(panel.queryId, getPanelProperties(panel, {accordions: accordionPropsMap}));
// }
//
//
// function getPanelProperties(panel, properties) {
// 	return {
// 		properties: {
// 			parts: {
// 				[panel.part]: {
// 					panels: {
// 						[panel.index]: properties
// 					}
// 				}
// 			}
// 		}
// 	}
// }
//
//
// export interface DatabaseQuery {
// 	selectedViews: string[]
// 	properties: {
// 		parts: {
// 			[key: string]: {
// 				panels: {
// 					[key: number]: {
// 						accordions: {
// 							[key: number]: {
// 								expanded: boolean
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// }
