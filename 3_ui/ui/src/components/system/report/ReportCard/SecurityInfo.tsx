import * as css from './ReportSummary.css';
import { sem, bp, TimeAgo} from 'components';
import { observer } from "mobx-react";
import { Report, reportStore, ReportDescriptor, routing, copyToClipboard, user } from 'stores';
import { computed, observable, makeObservable } from "mobx";

interface MyProps {
	report: Report;
}

@observer
export class ReportSecurityCard extends React.Component<MyProps, {}> {
    @observable linkCopied = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed
	get pathIsValid() {
		return true;
	}

    render() {
		const { pathIsValid, linkCopied, props, props: { report, report: {createdByUser} } } = this;

		return <sem.Card fluid>
			<sem.Card.Content>
				<sem.Card.Header>
					<sem.Icon name="user"/>
					Sharing and Security
				</sem.Card.Header>
			</sem.Card.Content>
			<sem.Card.Content>
				<sem.Form as='div'>
					<sem.Form.Group>
					<sem.Form.Field>
						<label>Created By</label>
						{createdByUser ? createdByUser.fullName : 'Unknown'}
					</sem.Form.Field>

					<sem.Form.Field>
						<label>Created</label>
						<TimeAgo datetime={new Date(report.createdTime)}/>
					</sem.Form.Field>
					</sem.Form.Group>
				</sem.Form>
			</sem.Card.Content>
		</sem.Card>
	}
}