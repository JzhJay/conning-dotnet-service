import {defineMessages} from 'react-intl';

export const queryMessages = defineMessages({
	arrangement: {
		defaultMessage: 'Arrangement:',
		description: `[Query] Label text for correlation table's operations toolbar`
	},
	swapRowsAndColumns: {
		defaultMessage: 'Flip',
		description: '[Query] Button text for Swap Rows and Columns function'
	},
	swapRowsAndColumnsTooltip: {
		defaultMessage: 'Swap Rows and Columns',
		description: '[Query] Tooltip for Swap Rows and Columns function'
	},
	allToRows: {
		defaultMessage: 'Rows',
		description: '[Query] Button text for All to Rows function'
	},
	allToRowsTooltip: {
		defaultMessage: 'All to Rows',
		description: '[Query] Tooltip for All to Rows function'
	},
	allToColumns: {
		defaultMessage: 'Columns',
		description: '[Query] Button text for All to Columns function'
	},
	allToColumnsTooltip: {
		defaultMessage: 'All to Columns',
		description: '[Query] Tooltip for All to Columns function'
	},
	importQuerySpecification: {
		defaultMessage: 'Import Query Specification',
		description: '[Query] Modify query inputs by uploading a query specification json file'
	},
	valueIsChanged: {
		defaultMessage: 'The value is changed since last run',
		description: `[Query] Tooltip to notify an input value is changed since last run in Bootstrap and Sensitivity`
	}	
});