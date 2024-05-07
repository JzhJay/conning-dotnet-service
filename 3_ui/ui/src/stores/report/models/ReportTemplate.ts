/*
	A report template has the skeleton structure of an existing report,
	but with simulations pulled out to named slots and queries stored unbound

 */


const mockReport = {
	name: 'Mock Report Template',
	simulationSlots: [
		{
			id: 0,
			name: 'Base',
			restrictions: {
				module: ['Economies']
			}
		},
		{
			id: 1,
			name: 'Other',
			restrictions: {
				module: ['Economies']
			}
		}
	],

	childNodes: [
		{
			type: 'folder',
			label: 'Folder 1',

			childNodes: [
				{
					name: 'Query 1',
					type: 'query',
					simulationSlotIds: [0],
					queryId: 'some-query-guid',
					view: 'cone',
					// Layout Info
				},
				{
					name: 'Query 2',
					type: 'query',
					simulationSlotIds: [1],
					queryId: 'some-query-guid-2',
					view: 'pivot'
				}
			]
		}
	]
}