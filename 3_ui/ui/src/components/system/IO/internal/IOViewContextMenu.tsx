import {Intent, Tooltip} from '@blueprintjs/core';
import {IO, appIcons, mobx, ioStore, IOViewTemplate} from 'stores';
import { observer } from 'mobx-react';
import * as React from "react";
import {AppIcon, bp, dialogs, sem} from '../../../index';

interface MyProps {
	io?: IO;
	evaluationIndex?: number;
	viewID?: string;
}

@observer
export class IOViewContextMenu extends React.Component<MyProps, {}> {
	render() {
		let { io, evaluationIndex, viewID} = this.props;
		const showAdd = !io.isFrontierPoint(evaluationIndex) && !io.isAdditionalPoint(evaluationIndex);
		const userOptions = io.currentPage.getViewUserOptions(viewID);
		const isRelativePoint = evaluationIndex == io.relativeEvaluationIndex;
		const showRelative = (io.isAdditionalPoint(evaluationIndex) || io.isFrontierPoint(evaluationIndex)) && !isRelativePoint;

		return <bp.Menu>
			{showAdd && userOptions.showEfficientFrontier && <bp.MenuItem text="Add Point to Efficient Frontier" onClick={() => io.updateFrontierPoint(evaluationIndex, true)} ></bp.MenuItem>}
			{userOptions.showEfficientFrontier && io.isFrontierPoint(evaluationIndex) && <bp.MenuItem text="Remove Point from Efficient Frontier" onClick={() => io.updateFrontierPoint(evaluationIndex, false)}></bp.MenuItem>}
			{showAdd && <Tooltip intent={Intent.DANGER} content={userOptions.showAdditionalPoints ? "" : "Not Visible with Current Content Options"}>
				<bp.MenuItem text="Add Point to Additional Allocation Points List" onClick={() => io.updateAdditionalPoint(evaluationIndex, true)}></bp.MenuItem>
			</Tooltip>}
			{io.isAdditionalPoint(evaluationIndex) && <bp.MenuItem text="Remove Point from Additional Allocation Points List" onClick={() => io.updateAdditionalPoint(evaluationIndex, false)}></bp.MenuItem>}
			{showRelative && <bp.MenuItem text="Make Risk and Reward Relative to this Point" onClick={() => io.setRelativePoint(evaluationIndex)}></bp.MenuItem>}
			{isRelativePoint && <bp.MenuItem text="Make Risk and Reward Relative to Origin" onClick={() => io.setRelativePoint(null)}></bp.MenuItem>}
		</bp.Menu>
	}
}