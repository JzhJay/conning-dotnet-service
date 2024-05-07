import { Report, Link, ReportPage } from 'stores';
import { bp, sem } from 'components';
import { observer } from "mobx-react";
import * as css from './ReportNavigator.css';

interface MyProps {
	page: ReportPage;
}

@observer
export class PageLayoutToolbarButtons extends React.Component<MyProps, {}> {
	render() {
		const { page } = this.props;


		// const canGoBack = report.isPrototypeOf(c) && querySlot.index == 0 && querySlot.page.index == 0;
		// const canGoForward = querySlot && querySlot.index == querySlot.page.reportQueries.length && querySlot.page.index == report.pages.length;


		return (
			<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>

				<bp.Tooltip  content='First Page'>
					<bp.AnchorButton icon="step-backward" />
				</bp.Tooltip>

			</div>)
	}
}

