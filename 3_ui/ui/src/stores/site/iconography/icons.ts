import { iconningNames } from "iconning";
import * as _ from 'lodash';

export interface IApplicationIcon {
	type: 'semantic' | 'iconic' | 'customIconic' | 'blueprint' | 'iconning' | string;
	name: string;
}

const customIconicIcons = {
	box:       {type: 'customIconic', name: 'box-plot', customAttributes: {'orientation': ['normal', 'transposed']}},
	cone:      {type: 'customIconic', name: 'cone-plot'},
	cdf:       {type: 'customIconic', name: 'cumulative-density-function'},
	scatter:   {type: 'customIconic', name: 'scatter-plot'},
	pdf:       {type: 'customIconic', name: 'probability-density-function', customAttributes: {'degree-of-smoothing': ['-2', '-1', '0', '1', '2']}},
	histogram: {type: 'customIconic', name: 'histogram', customAttributes: {'degree-of-smoothing': ['-2', '-1', '0', '1', '2']}},

	addView:   {type: 'customIconic', name: 'add-view', customAttributes: {'orientation': ['right', 'left', 'above', 'below']}},
	gridLines: {type: 'customIconic', name: 'grid-lines', customAttributes: {'grid-direction': ['both', 'horizontal', 'vertical', 'none']}},
	fontSize:  {type: 'customIconic', name: 'font-size', customAttributes: {'font-size-change': ['smaller', 'bigger']}},

	separateWindow:  {type: 'customIconic', name: 'separate-window', customAttributes: {'direction': ['out', 'in']}},
	accordionAction: {type: 'customIconic', name: 'accordion-action', customAttributes: {'action': ['expand', 'collapse']}},
	curvedArrow:     {
		type:             'customIconic', name: 'curved-arrow',
		customAttributes: {
			'orientation': ['upper-left', 'lower-left', 'lower-right', 'upper-right'],
			'direction':   ['double', 'clock-wise', 'counter-clockwise']
		}
	}
}

export interface IConningApplicationIcon extends IApplicationIcon {
	name: iconningNames;
}

const iconning : {[name: string]: IConningApplicationIcon }= {
	bar:       {type: 'iconning', name: 'bar'},
	scatter:       {type: 'iconning', name: 'scatter'},
	correlation:       {type: 'iconning', name: 'correlation'},
	line:       {type: 'iconning', name: 'line'},
	histogram:       {type: 'iconning', name: 'histogram'},
	pdf:       {type: 'iconning', name: 'pdf'},
	beeswarm:       {type: 'iconning', name: 'beeswarm'},
	cdf:       {type: 'iconning', name: 'cdf'},
	cone:       {type: 'iconning', name: 'cone'},
	box:       {type: 'iconning', name: 'box'},
	pivot:       {type: 'iconning', name: 'pivot'},
	ioComparison: {type: 'iconning', name: 'io-compare'}
}

const chartIcons = {
	bar:        iconning.bar,
	scatter:    iconning.scatter,
	line:       iconning.line,
	histogram:  iconning.histogram,
	pdf:        iconning.pdf,
	beeswarm:   iconning.beeswarm,
	cdf:        iconning.cdf,
	cone:       iconning.cone,
	box:        iconning.box,
	bootstrap:  null,
	sensitivity:null,

	line2: null,
}

export const appIcons = {
	customIconicIcons: customIconicIcons,

	sidebar: {
		toggle: {type: 'semantic', name: "sidebar"},

		/* This is currently a blueprint tree and so the name is used directly as iconName */
		tree: {
			queryResults:  {type: 'blueprint', name: 'chart'},
			savedQueries:  {type: 'blueprint', name: 'floppy-disk'},
			simulations:   {type: 'blueprint', name: 'database'},
			querySessions: {type: 'blueprint', name: 'search'},
		}
	},

	help: {type: 'semantic', name: "help"},
	info: {type: 'blueprint', name: "info-sign"},
	trash:     {type: 'semantic', name: 'trash outline'},
	dropdown:  {type:'blueprint', name: 'caret-down'},
	pages: {type: 'iconning', name: 'report-cover'},
	page : {type: 'iconning', name: 'report-page'},
	error: {type: 'iconic', name: 'circle-x'},
	warning: {type: 'iconic', name: 'warning'},

	chart: {
		toolbar: {
			print:     {type: 'blueprint', name: 'print'},
			gridLines: customIconicIcons.gridLines,
			fontSize:  customIconicIcons.fontSize,
			markerStyle : {type: 'blueprint', name: 'scatter-plot'},
			lineStyle : {type: 'blueprint', name: 'timeline-line-chart'},
			bar : {type: 'iconning', name: 'bar-adjacent'},
			stackedBar : {type: 'iconning', name: 'bar-stacked'},
			percentBar : {type: 'iconning', name: 'bar-percentage'},
			beeswarmOverlap : {type: 'iconning', name: 'beeswarm-overlap'},
			beeswarmSeparate : {type: 'iconning', name: 'beeswarm-separate'},
			beeswarmMix : {type: 'iconning', name: 'beeswarm-mix'},
			cdfStepped : {type: 'iconning', name: 'cdf-stepped'},
			cdfSmooth: {type: 'iconning', name: 'cdf-smooth'},
			bootstrap : {type: 'iconning', name: 'roulette'},
			sensitivity : {type: 'blueprint', name: 'series-configuration'},
			zoom: {type:'iconic', name:'zoom'},
			pdf: customIconicIcons.pdf,
			histogram: customIconicIcons.histogram,
			pie : {type:'iconic', name:'pie-chart'},
		},

		...chartIcons,
	},

	simulation:{
		download: {type: 'iconic', name: 'cloud-transfer'},
		file: {type: 'blueprint', name: 'document'},
		zip: {type: 'blueprint', name: 'box'},
	},

	queryTool: {
		views: {
			query:       {type: 'blueprint', name: 'search'},
			queryResult: {type: 'blueprint', name: 'th'},
			pivot:       {type: 'iconning', name: 'pivot'},
			correlation: {type: 'iconning', name: 'correlation'},
			statistics:	 {type: 'blueprint', name: 'calculator'},
			unsupported: {type: 'semantic', name: 'ban'},
			...chartIcons
		},

		search:      {type: 'iconic', name: 'magnifying-glass'},
		save:        {type: 'semantic', name: 'save'},
		download:    {type: 'iconic', name: 'cloud-transfer'},
		upload:      {type: 'iconic', name: 'cloud-transfer'}, // iconicDataAttribute: {"data-transfer-direction": "upload"} must be specified when rendering
		session:     { type: 'iconic', name: 'signal' },

		arrangement: {
			flip:             {type: 'iconning', name: 'axes-flip'},
			allToRows:        {type: 'iconning', name: 'axes2rows'},
			allToColumns:     {type: 'iconning', name: 'axes2columns'},
			resetArrangement: {type: 'blueprint', name: 'history'},
		},

		queryBuilder: {
			resetQuery: {type: 'blueprint', name: 'step-backward'},
			runQuery:   {type: 'blueprint', name: 'play'},

			collapseSuperPanel: {type: 'semantic', name: 'double angle left'},

			expandAxis:   {type: 'blueprint', name: 'chevron-up'},
			collapseAxis: {type: 'blueprint', name: 'chevron-down'},

			expandAllAxes:   {type: 'blueprint', name: 'double-chevron-down'},
			collapseAllAxes: {type: 'blueprint', name: 'double-chevron-up'},

			addPanel:    {type: 'semantic', name: 'plus'},
			deletePanel: {type: 'blueprint', name: 'cross'},

			newStatistic:        {type: 'semantic', name: 'content'},
			removeStatistic:     {type: 'semantic', name: 'remove circle'},
			removeStatisticAxis: {type: 'semantic', name: 'remove circle'},

			singularAxes: {type: 'iconning', name: 'singular-axes'},

			// selectAll:     {type: 'semantic', name: 'checkmark box', iconName: 'blank'},
			// selectNone:    {type: 'semantic', name: 'square outline', iconName: 'blank'},
			// selectOnly:    {type: 'semantic', name: 'checkmark', iconName: 'blank'},
			// selectExcept:  {type: 'semantic', name: 'remove circle', iconName: 'blank'},
			// selectWith:    {type: 'semantic', name: 'plus square outline', iconName: 'blank'},
			// selectWithout: {type: 'semantic', name: 'minus square', iconName: 'blank'},
		},
	},

	investmentOptimizationTool: {
		views: {
			status: {type: 'iconning', name: 'io-monitor'},
			efficientFrontier: {type: 'iconning', name: 'investment-optimization'},
			assetAllocation: {type: 'iconning', name: 'bar-percentage'},
			ioBox: {type: 'iconning', name: 'box-ordered'},
			cdf: iconning.cdf,
			pdf: iconning.pdf,
			beeswarm: iconning.beeswarm,
			pathWiseDominance: iconning.correlation,
			statisticalDominance: iconning.correlation,
			evaluationComparison: iconning.ioComparison,
			directionalConstraint: {type: 'blueprint', name: 'heat-grid'},
			strategySummary: {type: 'blueprint', name: 'heat-grid'},
			input: {type: 'blueprint', name: 'edit'}
		},
		pages: {type: 'iconning', name: 'report-cover'},
		page : {type: 'iconning', name: 'report-page'},
		color: {type: 'iconic', name: 'aperture'},
		error: {type: 'iconic', name: 'circle-x'},
		download: {type: 'iconic', name: 'cloud-transfer'},
		batchExport: { type: 'blueprint', name: 'multi-select'}
	},

	book: {
		views: {
			status: {type: 'iconning', name: 'io-monitor'},
			efficientFrontier: {type: 'iconning', name: 'investment-optimization'},
			assetAllocation: {type: 'iconning', name: 'bar-percentage'},
			ioBox: {type: 'iconning', name: 'box-ordered'},
			cdf: iconning.cdf,
			pdf: iconning.pdf,
			beeswarm: iconning.beeswarm,
			pathWiseDominance: iconning.correlation,
			statisticalDominance: iconning.correlation,
			evaluationComparison: iconning.ioComparison,
			directionalConstraint: {type: 'blueprint', name: 'heat-grid'},
			strategySummary: {type: 'blueprint', name: 'heat-grid'},
			distributionsAtHorizon: iconning.pdf,
			throughTimeStatistics: {type: 'iconning', name: 'cone'},
			marketValueStatistics: {type: 'blueprint', name: 'heat-grid'},
			craBox: {type: 'iconning', name: 'box-ordered'},
			financialDamageAndVolatilityShock: iconning.line,
			assetClassesReturnsChart: iconning.scatter,
			assetClassesReturnsTable: {type: 'blueprint', name: 'heat-grid'},
			input: {type: 'blueprint', name: 'edit'}
		},

		pages: {type: 'iconning', name: 'report-cover'},
		page : {type: 'iconning', name: 'report-page'},
	},

	climateRiskAnalysisTool: {
		pages: {type: 'iconning', name: 'report-cover'},
		page : {type: 'iconning', name: 'report-page'},
		download: {type: 'iconic', name: 'cloud-transfer'}
	},

	report: {
		addView:    customIconicIcons.addView,
		link:       {type: 'semantic', name: 'linkify'},
		unlink:     {type: 'semantic', name: 'unlinkify'},
		rename:     {type: 'semantic', name: 'edit'},
		delete:     {type: 'iconic', name: 'trash'},
		pageLayout: {type: 'semantic', name: 'expand'},
		remove:      {type: 'iconic', name: 'x'},

		expandSubtree:   {type: 'semantic', name: 'angle double right'},
		collapseSubtree: {type: 'semantic', name: 'angle double left'},

		openInNewTab: {type: 'semantic', name: 'external share'},

		newFolder:    {type: 'semantic', name: 'folder outline'},
		openFolder:   {type: 'semantic', name: 'folder open outline'},
		closedFolder: {type: 'semantic', name: 'folder outline'},

		page:   {type: 'semantic', name: 'file outline'},
		report: {type: 'semantic', name: 'book'},

		tabLayout:        {type: 'semantic', name: 'folder outline'},
		resizeHorizontal: {type: 'semantic', name: 'resize horizontal'},
		resizeVertical:   {type: 'semantic', name: 'resize vertical'},

		presentationMode: {type: 'iconic', name: 'monitor'},
		settings: {type: 'iconic', name: 'cog'},

		items: {
			text: {type: 'blueprint', name: 'new-text-box'}
		}
	},

	favorite: {
		unchecked: {type: 'iconic', name: 'star'},
		checked: {type: 'iconic', name: 'star'}
	},

	tools: {
		simulations:   {type: 'iconning', name: 'simulation'},
		simulationUseCase:     {type: 'blueprint', name: 'globe'},
		simulationRiskNeutral: {type: 'blueprint', name: 'confirm'},
		ios:           {type: 'iconning', name: 'investment-optimization'},
		queries:       {type: 'iconic', name: 'magnifying-glass'},
		reports:       {type: 'iconic', name: 'book'},
		settings:      {type: 'iconic', name: 'settings'},
		user:          {type: 'iconic', name: 'people'},
		notifications: {type: 'blueprint', name: 'envelope'},
		userFiles:     {type: 'blueprint', name: 'box'},
		climateRiskAnalyses:     {type: 'blueprint', name: 'globe'},
		billing:       {type: 'blueprint', name: 'bank-account'},
		notices: 	   {type: 'iconic', name: 'copyright'},
	},

	cards: {
		//open = bp4-open-application
		open: {type: 'blueprintSvgPath', name: 'M4 1h14c.55 0 1 .45 1 1v13c0 .55-.45 1-1 1h-8v-2h7V4H5v6H3V2c0-.55.45-1 1-1zm2.5 5h7c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-7c-.28 0-.5.22-.5.5s.22.5.5.5zm0 2h3c.28 0 .5-.22.5-.5S9.78 7 9.5 7h-3c-.28 0-.5.22-.5.5s.22.5.5.5zm5 2h-5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h5c.28 0 .5.22.5.5s-.22.5-.5.5zM7 17c0 .55.45 1 1 1s1-.45 1-1v-5c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1s.45 1 1 1h2.59L.3 18.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L7 14.41V17z'},
		delete: {type: 'iconic', name: 'trash'},
		clone: {type: 'blueprint', name: 'duplicate'},

		query: {
			cardIcon: {type: 'iconic', name: 'magnifying-glass'},
		},

		queryResult: {
			cardIcon: {type: 'semantic', name: 'lab'},
		},

		ioRuns:    {cardIcon: {type: 'semantic', name: 'bullseye'}},
		ios: {cardIcon: {type: 'iconning', name: 'investment-optimization'}},
		userFile: {cardIcon: {type: 'blueprint', name: 'box'}},
		climateRiskAnalysis: {cardIcon: {type: 'blueprint', name: 'globe'}},

		simulation: {
			cardIcon:  {type: 'iconning', name: 'simulation'},
			scenarios: {type: 'semantic', name: 'options'},
			timesteps: {type: 'semantic', name: 'calendar'},
			variables: {type: 'semantic', name: 'database'}
		},

		report: {
			cardIcon: { type: 'semantic', name: 'book' },
		},

		reportText: {
			cardIcon: {type: 'blueprint', name: 'new-text-box'},
		},

		user: {
			cardIcon: {type: 'semantic', name: 'user'},
		},

		email: {type: 'semantic', name: 'globe'},
		clock: {type: 'semantic', name: 'clock'},
		date:  {type: 'semantic', name: 'calendar'}

	},

	sort: {
		sortDefault: {type: 'semantic', name: 'random'},
		sortAsc:     {type: 'semantic', name: 'sort alphabet ascending'},
		sortDesc:    {type: 'semantic', name: 'sort alphabet descending'},
	},

	widgets: {
		checkbox: {
			checked:   {type: 'semantic', name: 'checkmark box'},
			unchecked: {type: 'semantic', name: 'square outline'}
		},

		sortableCardsPanel: {
			cardView:  {type: 'blueprint', name: 'grid-view'},
			tableView: {type: 'blueprint', name: 'th'},

			me:       {type: 'iconic', name: 'person'},
			everyone: {type: 'iconic', name: 'people'},
		}
	},

	developer: {type: 'semantic', name: "space shuttle"},
	// queryReport: icons.semBook,
	// query:       icons.semSearch,
	// queryResult: icons.semSignal,
	// preferences: icons.semWrench,
	// simulation:  icons.semDatabase,
	// pivot:  icons.iconicSpreadsheet,

	file: {
		//open = bp4-open-application
		open: {type: 'blueprintSvgPath', name: 'M4 1h14c.55 0 1 .45 1 1v13c0 .55-.45 1-1 1h-8v-2h7V4H5v6H3V2c0-.55.45-1 1-1zm2.5 5h7c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-7c-.28 0-.5.22-.5.5s.22.5.5.5zm0 2h3c.28 0 .5-.22.5-.5S9.78 7 9.5 7h-3c-.28 0-.5.22-.5.5s.22.5.5.5zm5 2h-5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h5c.28 0 .5.22.5.5s-.22.5-.5.5zM7 17c0 .55.45 1 1 1s1-.45 1-1v-5c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1s.45 1 1 1h2.59L.3 18.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L7 14.41V17z'},
		create: { type: 'blueprint', name: 'document'},
		rename: { type: 'blueprint', name: 'edit'},
		delete: { type: 'blueprint', name: 'trash'},
		copy: { type: 'blueprint', name: 'duplicate'},
		download: {type: 'blueprint', name: 'export'},
		pdf: {type: 'semantic', name: 'file pdf outline'},
		import: {type: 'blueprint', name: 'folder-open'},
	},

	action: {
		run: { type: 'blueprint', name: 'play'},
		stop: { type: 'blueprint', name: 'stop'},
		pause: { type: 'blueprint', name: 'pause'}
	}
}

function getIcons(obj, names=[]) {
	if (obj && obj.name != null && obj.type != null) {
		names.push(obj)
	}
	else if (_.isObject(obj) && Object.keys(obj).length > 0) {
		_.values(obj).forEach((o) => {
			getIcons(o, names)
		})
	}

	return names;
}


// Use this code to generate svg icon names from the appIcons

let svgIconNames = []
getIcons(appIcons).forEach((icon) => {
    const {name} = icon

	if (icon.type == "iconning") {
    	[20, 24, 48].forEach(size => {
		    svgIconNames.push(`iconning/svg/static/${name}-${size}.svg`)
	    })
	}
	else if (icon.type == "iconic" || icon.type == 'customIconic') {
		let file = `lib/${icon.type == "customIconic" ? "customIconic" : "Iconic"}/svg/smart/${name}.svg`;
		svgIconNames.push(file)
	}
})

svgIconNames = _.uniq(svgIconNames.sort())

export let iconsString = "";
let svgIcons = svgIconNames.map((file) => {
	return `"${file}": require("${file}")`
})

//console.log(svgIcons.join(",\n"));

export const iconUrls = {
	applicationGrid: '/ui/lib/Iconic/svg/smart/grid.svg',
	fontSize:        '/ui/conning-icons/svg/smart/font-size.svg',
	conningLogo:     '/images/advise/conning-logo.svg',
	conningLogoNoText:     '/images/advise/conning-logo-no-text.svg'
}
