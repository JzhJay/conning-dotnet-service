import { observer } from "mobx-react";
import { Query, i18n } from 'stores';
import { sem, bp } from 'components'
import {ProgressStep} from '../Progress/ProgressStep';
import {FormattedMessage} from 'react-intl';

import * as css from './QueryRunProgress.css';

const { Step, List, Progress, Loader } = sem;

interface MyProps {
	query: Query;
}


@observer
export class QueryRunProgress extends React.Component<MyProps, {}> {
	render() {
		const { query, query: { progress } } = this.props;

		if (!progress) { return null }

		const simServers = progress.get('simservers');
		const simWorkers = progress.get('simworkers');
		const vtp = progress.get('vtp');
		const loadingMesage = query._variables.selected > 1 ? i18n.intl.formatMessage({
			defaultMessage: 'Your query for {variablesSelected} variables is running...',
			description: '[Query] loading message for running query (single variable)'
		}, { variablesSelected: query._variables.selected }) : i18n.intl.formatMessage({
			defaultMessage: 'Your query for {variablesSelected} variable is running...',
			description: '[Query] loading message for running query (multiple variables)'
		}, { variablesSelected: query._variables.selected, });
		// const remaining = _.omit(progress.keys(), ['simservers', 'vtp']) as string[];
		// {remaining.map(k => <ProgressStep key={k} icon={<sem.Icon name='help'/>} progress={progress.get(k)} />)}

		return <div className={css.root}>
			<Loader active inline='centered' content={loadingMesage} className={css.root}/>
			<Step.Group vertical>
				<Step>
					<sem.Icon name='cloud'/>
					<Step.Content>
						<Step.Title>
							<FormattedMessage defaultMessage="Initializing Resources..." description="[Query] Query run step title - Initializing Resources" />
						</Step.Title>
						<Step.Description>
							<Step.Group fluid vertical>
								<Step completed={query.hasSession}>
									{!query.hasSession ? <sem.Loader className='icon' active inline /> : <sem.Icon name='checkmark' color='green' />}
									<Step.Content>
										<Step.Title>
											<FormattedMessage defaultMessage="Query Server" description="[Query] Query run step title - Query Server" />
										</Step.Title>
									</Step.Content>
								</Step>
								{simServers && <ProgressStep key='sim-servers' progress={simServers}/>}
								{simWorkers && <ProgressStep key='sim-workers' progress={simWorkers}/>}

								{/*<Step completed={simServers && simServers.isComplete}>*/}
									{/*{!query.hasSession ? <sem.Icon name='ellipsis horizontal' /> : simServers && simServers.isComplete ? <sem.Icon name='checkmark' color='green' /> : <sem.Loader className='icon' active inline />}*/}
									{/*<Step.Content>*/}
										{/*<Step.Title>Starting Simulation Server{query.simulationIds.length > 1 ? 's' : ''}...</Step.Title>*/}
										{/*<Step.Description>*/}
											{/*{simServers && <ProgressStep key='sim-servers' progress={simServers}/>}*/}
										{/*</Step.Description>*/}
									{/*</Step.Content>*/}
								{/*</Step>*/}

								{/*<Step key='workers'>*/}
									{/*<sem.Icon name='ellipsis horizontal' />*/}
									{/*<Step.Content>*/}
										{/*<Step.Title>Simulation Workers...</Step.Title>*/}
									{/*</Step.Content>*/}
								{/*</Step>*/}
							</Step.Group>
						</Step.Description>
					</Step.Content>
				</Step>

				<Step>
					<sem.Icon name='list'/>
					<Step.Content>
						<Step.Title>
							<FormattedMessage defaultMessage="Reading Data..." description="[Query] Query run step title - Reading Data" />
						</Step.Title>
						<Step.Description>
							<Step.Group fluid vertical>
								{vtp && <ProgressStep key='vtp' progress={vtp}/>}
							</Step.Group>
						</Step.Description>
					</Step.Content>
				</Step>
			</Step.Group>
		</div>
	}
}