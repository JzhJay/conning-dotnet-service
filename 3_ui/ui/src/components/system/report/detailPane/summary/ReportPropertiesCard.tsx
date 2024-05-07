import * as css from './ReportSummary.css';
import { sem, bp } from 'components';
import { observer } from "mobx-react";
import { Report, reportStore, routing, copyToClipboard } from 'stores';
import { computed, observable, makeObservable } from "mobx";

interface MyProps {
	report: Report;
}

@observer
export class ReportPropertiesCard extends React.Component<MyProps, {}> {
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
		const { pathIsValid, linkCopied, props: { report } } = this;

		return <sem.Card fluid>
			<sem.Card.Content>
				<sem.Form size="small" as='div'>
					<sem.Form.Field>
						<label>Name</label>
						<sem.Input defaultValue={report.name}
						           onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
							           if (pathIsValid && !routing.isActive(report.clientUrl)) {
								           //report.slug = input.value;
								           routing.replace(report.clientUrl);
							           }
						           }}
						           onChange={(e, value) => report.name = value.value}/>
					</sem.Form.Field>

					<sem.Form.Field error={!pathIsValid}>
						<label>Path</label>

						<sem.Input labelPosition='left' action>
							{/*<sem.Label>{window.location.protocol}//{window.location.hostname}</sem.Label>*/}
							{/*<sem.Label>{window.location.protocol}//{window.location.hostname}{reportStore.browserUrl}</sem.Label>*/}
							<sem.Label>{reportStore.browserUrl}</sem.Label>

							<input readOnly value={report.slug ? report.slug : report.id}/>

							<bp.Tooltip
							            content={linkCopied ? 'Copied!' : "Copy to Clipboard"}>
								<sem.Button icon="linkify"
								            onClick={() => {
									            copyToClipboard(`${window.location.protocol}//${window.location.hostname}${report.clientUrl}`);
									            this.linkCopied = true;
									            setTimeout(() => this.linkCopied = false, 2000);
								            }}/>
							</bp.Tooltip>
						</sem.Input>
					</sem.Form.Field>
				</sem.Form>
			</sem.Card.Content>
		</sem.Card>
	}
}