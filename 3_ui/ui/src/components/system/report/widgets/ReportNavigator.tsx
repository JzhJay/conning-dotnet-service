import {ButtonGroup} from '@blueprintjs/core';
import { Report, Link, ReportPage } from 'stores';
import { bp, sem } from 'components';
import { observer } from "mobx-react";
import * as css from './ReportNavigator.css';
import { ReportItemContextMenu } from "./ReportItemContextMenu";
import { ReportItemPopoverMenu } from "./ReportItemPopoverMenu";

interface MyProps {
	report: Report;
}

const descriptors = {
	page: { icon: 'document' }
}

@observer
export class ReportNavigator extends React.Component<MyProps, {}> {
	render() {
		const { report, report: { selectedItem } } = this.props;

		if (!selectedItem) {
			return null;
		}

		const canNavigateBackwards = selectedItem.index > 0,
			canNavigateForwards = selectedItem.parent && selectedItem.index + 1 < selectedItem.parent.children.length;

		// const canGoBack = report.isPrototypeOf(c) && querySlot.index == 0 && querySlot.page.index == 0;
		// const canGoForward = querySlot && querySlot.index == querySlot.page.reportQueries.length && querySlot.page.index == report.pages.length;

		const descriptor = descriptors[selectedItem.type]

		return (
			<div className={classNames(css.reportTitleBar)}>
				<ButtonGroup minimal className="left floated">
					{/*<bp.Tooltip  content='First Page'>*/}
						{/*<bp.AnchorButton icon="step-backward" disabled={!canNavigateBackwards} onClick={() => report.navigate.first()}/>*/}
					{/*</bp.Tooltip>*/}
					{/*<bp.Tooltip  content='Previous Page'>*/}
						{/*<bp.AnchorButton icon="fast-backward" disabled={!canNavigateBackwards} onClick={() => selectedItem.navigateToPrevious()}/>*/}
					{/*</bp.Tooltip>*/}

					{/*<bp.Tooltip  content={selectedItem.tooltip}>*/}
					{/*<bp.Button rightIcon='caret-down'*/}
					{/*icon={descriptor && descriptor.iconName}*/}
					{/*className={css.reportTitle}>{selectedItem == report ? 'Report Builder' : selectedItem.label}</bp.Button>*/}
					{/*</bp.Tooltip>*/}

					<ReportItemPopoverMenu item={selectedItem} />

					{/*<bp.AnchorButton minimal style={{ fontWeight: 'bold', alignSelf: 'center' }} text={selectedItem instanceof ReportPage ? `Page ${selectedItem.index + 1} of ${report.pages.length}` : selectedItem.label}/>*/}

					{/*<bp.Tooltip  content='Next Page'>*/}
						{/*<bp.AnchorButton icon="fast-forward" disabled={!canNavigateForwards} onClick={() => selectedItem.navigateToNext()}/>*/}
					{/*</bp.Tooltip>*/}
					{/*<bp.Tooltip  content='Last Page'>*/}
						{/*<bp.AnchorButton icon="step-forward" disabled={!canNavigateForwards} onClick={() => report.navigate.last()}/>*/}
					{/*</bp.Tooltip>*/}
				</ButtonGroup>
			</div>)
	}
}


/*

					<bp.Popover
						className={css.root}

						interactionKind={bp.PopoverInteractionKind.HOVER}
						canEscapeKeyClose={true}
						content={
							<bp.Menu>
								{page && (<div>
									<bp.MenuDivider title={`Page ${page.index + 1}`} />
									<bp.MenuItem text="Add Query" disabled={!report} icon="search" onClick={() => page.addReportQuery()}/>
									<bp.MenuItem text="Add Text Block" disabled={!report} icon="new-text-box" onClick={() => page.addText()}/>
								</div>).props.children}
								<bp.MenuDivider title={report.name} />
								{selectedItem != report && <bp.MenuItem icon="link" text="Report Builder" onClick={() => report.navigateTo()} />}
								<bp.MenuItem text="Rename" disabled={!report} icon="edit"/>
								<bp.MenuItem text="Duplicate" disabled={!report} icon="duplicate" onClick={() => report.duplicate(true)}/>
								<bp.MenuItem text="Export" disabled={!report} icon="export" onClick={() => report.export()}/>
								<bp.MenuDivider />
								<bp.MenuItem text="Show Tabs"
								             icon={report.showReportTabs ? 'small-tick' : 'blank'}
								             onClick={() => report.toggleShowReportTabs()}/>
							</bp.Menu>}>
						<div className={classNames(css.reportTitle, 'pt-minimal pt-button')}>
							<Link to={report.clientUrl} className={css.reportName}>
{report.name}{selectedItem != report ? ` - ${selectedItem.label}` : null}
</Link>
  <span className="pt-icon-standard pt-icon-caret-down pt-align-right"/>
                  </div>
                  </bp.Popover>
 */