import type {IconName} from '@blueprintjs/core';
import {ReportText} from 'stores';
import { ReportItemNode } from "./ReportItemNode";
import { bp, ReportTextCard } from "components";

export class ReportTextNode extends ReportItemNode {
	icon : IconName = "new-text-box" as IconName;
	canRename = true;

	constructor(public item: ReportText) {
		super(item);

		this.setupInfoTooltip(() => <ReportTextCard text={item} isTooltip/>);
	}
}
