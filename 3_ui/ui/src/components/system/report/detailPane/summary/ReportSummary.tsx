import { LoadingIndicator, ReactSelect, sem, bp, ReportCard} from 'components'
import { Report } from 'stores';
import { observer } from 'mobx-react'
import { computed, observable } from 'mobx';
import * as css from './ReportSummary.css';
import { ReportPagesCard } from "../../ReportCard/ReportPagesCard";
import { QuerySlotsCard } from "../../ReportCard/QuerySlots";
import { ReportSimulations } from "../../ReportCard/Simulations";

interface MyProps {
	report: Report;
}

@observer
export class ReportSummary extends React.Component<MyProps, {}> {
	render() {
		const { props, props: { report } } = this;

		const tabView = false; // todo - media query

		return (
			<div className={classNames(css.reportSummary, bp.Classes.CARD, "fluid")}>
				<ReportCard showHeader={false} report={report} addSecuritySection={false} />
			</div>
		)
	}
}

@observer
class ReportPartsTab extends React.Component<MyProps, {}> {
	render() {
		const { props } = this;

		return <sem.Card className="fluid">
			<sem.Card.Content>
				<bp.Tabs id="report-parts" className={css.partsTab}>

					{/*<TabToolbar>*/}
					{/*<span className='pt-navbar-group pt-align-right'>*/}
					{/*<bp.Tooltip className="right floated" content="Add a " >*/}
					{/*<bp.AnchorButton icon="plus"/>*/}
					{/*</bp.Tooltip>*/}
					{/*</span>*/}
					{/*</TabToolbar>*/}

					<bp.Tab id="pages"
					         title={<div className={css.tabTitle}>
						         <sem.Icon name="file outline"/>
						         Contents</div>}
					         panel={<ReportPagesCard {...props}/>}/>
					<bp.Tab id="simulations"
					         title={<div className={css.tabTitle}>
						         <sem.Icon name="database"/>
						         Simulations</div>}
					         panel={<ReportSimulations {...props} />}/>
					<bp.Tab id="queries"
					         title={<div className={css.tabTitle}>
						         <sem.Icon name="search"/>
						         Queries</div>}
					         panel={<QuerySlotsCard {...props} />}/>
				</bp.Tabs>
			</sem.Card.Content>
		</sem.Card>;
	}
}