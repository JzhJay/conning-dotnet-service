import {QueryViewUiDescriptor} from './'

export const viewDescriptors = {
			query:       {name: 'query', label: 'Query', hasSecondaryToolbar: false} as QueryViewUiDescriptor,
			pivot:       {name: 'pivot', label: 'Pivot', hasSecondaryToolbar: false} as QueryViewUiDescriptor,
			correlation: {name: 'correlation', label: 'Correlation', hasSecondaryToolbar: false} as QueryViewUiDescriptor,
			bar:         {name: 'bar', label: 'Bar'} as QueryViewUiDescriptor,
			box:         {name: 'box', label: 'Box', chartType: 'box', hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			cone:        {name: 'cone', label: 'Cone', chartType: 'cone', hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			cdf:         {name: 'cdf', label: 'CDF', chartType: 'cdf', hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			scatter:     {name: 'scatter', label: 'Scatter', chartType: 'regression-chart', hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			pdf:         {name: 'pdf', label: 'PDF', chartType: 'pdf', hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			histogram:   {name: 'histogram', label: 'Histogram', chartType: 'histogram',hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			bootstrap:   {name: 'bootstrap', label: 'Bootstrap', hide: true} as QueryViewUiDescriptor,
			sensitivity: {name: 'sensitivity', label: 'Sensitivity', hide: true} as QueryViewUiDescriptor,
			xy_line:     {name: 'xy_line', label: 'XY Line', hide: true} as QueryViewUiDescriptor,
			beeswarm:     {name: 'beeswarm', label: 'Beeswarm', hide: false} as QueryViewUiDescriptor,

			line:  {name: 'line', label: 'Line', hasSecondaryToolbar: true} as QueryViewUiDescriptor,
			line2: {name: 'line2', label: 'Line2?', hide: true} as QueryViewUiDescriptor,
		};

// Add ordinal field
['query', 'pivot', 'correlation', 'box', 'histogram', 'cone', 'cdf', 'pdf', 'scatter', 'line', 'bar', 'beeswarm'].forEach((v, i) => {
		viewDescriptors[v].ordinal = i;
})

export const defaultAvailableViews = []