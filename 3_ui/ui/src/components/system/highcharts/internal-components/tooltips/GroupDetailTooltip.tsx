import {ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import * as React from 'react';
import type {ChartUserOptions} from '../../../../../stores/charting';
import {IO} from 'stores';

interface MyProps {
	point: any;
	chartingResult: IO;
	userOptions: ChartUserOptions;
}

export function createGroupedDetail (myProps:MyProps, evaluationKey:string, pointName:string) {
	let selectedGroupLevel = myProps.userOptions.assetGroupLevel;
	let io = myProps.chartingResult;
	let	headerLevelDatas = io.getAssetClassInput();

	const headerEvalutions = io.datasetEvaluations(myProps.userOptions);
	const evaluationIndex = headerEvalutions.findIndex(h => h.name == evaluationKey);
	const evaluation = headerEvalutions[evaluationIndex];
	return createGroupedDetailAssetClass(headerLevelDatas, 0, selectedGroupLevel, pointName, io, evaluation, false);
}

function createGroupedDetailAssetClass (headerLevelDatas , level:number, selectedGroupLevel, pointName:string, io:IO, evaluation, itemFound:boolean) {
	if (!headerLevelDatas || !headerLevelDatas.length) { return; }
	return <> { headerLevelDatas.map((d) =>
		<React.Fragment key={`${level}_${d.name}`}>{(!itemFound || level > selectedGroupLevel) && createGroupedDetailAssetClassItem(d , level, selectedGroupLevel, pointName, io, evaluation, itemFound)}</React.Fragment>
	)} </>
}

function createGroupedDetailAssetClassItem (headerLevelData , level:number, selectedGroupLevel, pointName:string, io:IO, evaluation, itemFound:boolean) {
	const { name , color, assetClasses } = headerLevelData;

	itemFound = itemFound || ( pointName == name && (level == selectedGroupLevel || io.getGroupDepth(assetClasses) == 0));
	if (!itemFound) { return createGroupedDetailAssetClass(assetClasses, level+1, selectedGroupLevel, pointName, io, evaluation, itemFound); }

	const groupIndex = io.assetGroups(level, false).findIndex((g) => g.name == name);
	const value  = evaluation.assetAllocation ? (io.allocationsAtLevel(level, evaluation.assetAllocation, false)[groupIndex] * 100) : 0;
	if (value === 0) { return; }

	let frontSpace = "";
	for (let i = 0 ; i < level-selectedGroupLevel ; i++) { frontSpace += "\u9608 "; }

	return  <>
		<ChartTooltipValueSet
			customFront={<>
				{ frontSpace && <tspan style={{color:"transparent", fontFamily:"Helvetica, sans-serif"}}>{frontSpace}</tspan> }
				<tspan style={{color:color, fontFamily:"Helvetica, sans-serif"}}>&#9608; </tspan>
			</>}
			label={name}
			value={`${value.toFixed(2)}%`}
			valueStyle={level == 2 ? {} : {opacity: .7}}
		/>
		{createGroupedDetailAssetClass(assetClasses, level+1, selectedGroupLevel, pointName, io, evaluation, itemFound)}
	</>
}
