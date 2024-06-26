import {api} from 'stores';
import * as css from './JiraIssueLink.css'

import { computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
interface MyProps {
	// project: string;
	// issue: number;
	rerunTestUrl?: string;
	issueId: string;
}

@observer
export class JiraIssueLink extends React.Component<MyProps, {}> {
	constructor(props) {
        super(props);

        makeObservable(this);

        if (JIRA) {
			api.xhr.get(`/api/admin/jira/issues/${this.props.issueId}`).then((issue) => this.issue = issue);
		}
    }

	@observable issue: {error?: string, issue?: any};

	render() {
		const {props: {issueId, rerunTestUrl}, issue} = this;

		/*
		 <div class="react-root" />
		 <a class="replay" href="${rerunTestHref}">‣</a>
		 </div>
		 */

		//console.log(issue);

		if (!issue || issue.error) {
			return (<div className={css.jiraIssue}>
				{!JIRA ? issueId : !issue ? `(Loading ${issueId} from JIRA...)` : issue.error}
			</div>);
		}
		else {
			const {
				      key,
				      fields: {
					      project, assignee,
					      status: {statusCategory: {key: jiraStatusKey, name: jiraStatus}},
					      components, summary, reporter, issuetype, resolution
				      }
			      } = issue.issue;

			return (<div className={css.jiraIssue}
			           data-jira-status={jiraStatusKey}
			           data-tip data-for={`${key}-tooltip`}>
				{/*<a href={project.self}>*/}
				{/*<img title={project.name} src={project.avatarUrls['48x48']} /> */}
				{/*</a>*/}

				<span className={css.issueDetails}>
					<h1 className={css.summary}><a href={rerunTestUrl}>{summary}</a></h1>
					<br />
					<a onClick={() => api.utility.openInNewTab(`https://jira.advise-conning.com/browse/${key}`)}
					                                                                           className={css.key}>{key}</a>
					<br/>
					<img src={assignee.avatarUrls['16x16']} title={assignee.name}/> {/* Jira User Image */ } -
					<div className={css.status}>
						<span className={css.text}>{jiraStatus}</span>
							{/*<AppIcon icon={statusToIcon[currentStatus]}/>*/}
					</div> -
					<img src={issuetype.iconUrl} title={issuetype.name}/>
				</span>
				<ReactTooltip id={`${key}-tooltip`} type="info" place='bottom'>
					<Field label="Summary" value={summary}/>
					<Field label="Issue Type" value={issuetype.name}/>
					<Field label="Jira Status" value={jiraStatus}/>
					<Field label="Reported By" value={reporter.name}/>
					<Field label="Assigned To" value={assignee.name}/>
				</ReactTooltip>
			</div>);
		}
	}
}

class Field extends React.Component<{label: string, value: string}, {}> {
	render() {
		const {label, value} = this.props;

		return <div>
			<label>{label}:</label>
			<span className='value'>{value}</span>
		</div>
	}
}