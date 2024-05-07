import { ReportQuery } from 'stores';
import { sem } from 'components';
import { observer } from "mobx-react";
import * as css from './BadReportQuery.css';
import { ReportSimulations } from "../ReportCard/Simulations";
import { QuerySlotComponent } from "../ReportCard/QuerySlot";

interface MyProps {
	rq: ReportQuery;
}

@observer
export class BadReportQuery extends React.Component<MyProps, {}> {
	render() {
		const { rq, rq: { queryId, query, simulationSlots } } = this.props;

		return (
			<div className={css.root}>
				<sem.Message >
					<sem.Message.Header content={`We need more information to create your query:`}/>
					<sem.Message.Content>
						<ReportSimulations className='fluid' showTitle={false} report={rq.report}/>

						<sem.Card fluid>
							<sem.Card.Content>
								<QuerySlotComponent reportQuery={rq}/>
							</sem.Card.Content>
						</sem.Card>
					</sem.Message.Content>
				</sem.Message>
			</div>);
	}
}