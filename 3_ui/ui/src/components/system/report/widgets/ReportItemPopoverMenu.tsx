import { observer } from "mobx-react";
import { ReportPage, ReportItem, utility, ReportQuery, ReportText, Report } from 'stores'
import { bp, QueryContextMenu } from 'components'
import { ReportPageContextMenu } from "./ReportPageContextMenu";
import { ReportTextContextMenu } from "./ReportTextContextMenu";
import { ReportContextMenu } from "./ReportContextMenu";

interface MyProps {
	item: ReportItem;
}

@observer
export class ReportItemPopoverMenu extends React.Component<MyProps, {}> {
	render() {
		const { item, item: { report } } = this.props;

		if (item instanceof Report) {
			// Showing a button menu here for the 'report builder' or 'home' or 'properties' page for a report is confusing to me as the
			// ApplicationPopoverMenu already has report level operations in it and should at any level of navigating the report
			return <bp.Popover  interactionKind={bp.PopoverInteractionKind.HOVER}
			                   popoverClassName={utility.doNotAutocloseClassname}
			                   content={<ReportContextMenu report={report} location='header'/>}>
				<bp.Button style={{ padding: '0 8px' }} icon="home" text='Home' minimal/>
			</bp.Popover>
		}
		if (item instanceof ReportPage) {
			const page = item;
			return <bp.Popover  interactionKind={bp.PopoverInteractionKind.HOVER}
			                   popoverClassName={utility.doNotAutocloseClassname}
			                   content={<ReportPageContextMenu page={page} location='header'/>}>
				<bp.Button style={{ padding: '0 8px' }} icon="document" text={page.label} minimal rightIcon='caret-down'/>
			</bp.Popover>;
		}
		else if (item instanceof ReportQuery || item instanceof ReportText) {
			const page = item.parent;
			return <bp.Popover  interactionKind={bp.PopoverInteractionKind.HOVER}
			                   popoverClassName={utility.doNotAutocloseClassname}
			                   content={
				                   item instanceof ReportQuery ? <QueryContextMenu reportQuery={item} currentView={item.view} location='header'/>
					                   : item instanceof ReportText ? <ReportTextContextMenu reportText={item} location='header'/>
					                   : null}>
				<bp.Button style={{ padding: '0 8px' }} icon={item instanceof ReportQuery ? 'search' : 'new-text-box'}
				           text={item.label} minimal rightIcon='caret-down'/>
			</bp.Popover>;

		}

		return null;
	}
}