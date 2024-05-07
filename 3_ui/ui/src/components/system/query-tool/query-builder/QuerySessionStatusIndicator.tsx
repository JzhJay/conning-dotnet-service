import { Query, QueryDescriptor, appIcons } from 'stores';
import { bp, AppIcon } from 'components'
import { observer } from "mobx-react";
import * as css from './QuerySessionStatusIndicator.css';

interface MyProps {
	query: Query | QueryDescriptor;
	className?: string;
}

@observer
export class QuerySessionStatusIndicator extends React.Component<MyProps, {}> {
	render() {
		const { className, query, query: { hasSession, isStartingSession, isRunning, hasError } } = this.props;

		return ( <bp.Tooltip
		                     className={classNames(css.root, className, { [css.hasError]: hasError, [css.hasSession]: hasSession, [css.isStartingSession]: isStartingSession })}
		                     content={hasSession ? 'Query Session is Active' : isRunning ? 'Query is Running' : isStartingSession ? 'The session is starting' : 'No Query Session'}>
			<AppIcon icon={appIcons.queryTool.session} className="iconic-md" onClick={() => {
				if (!hasSession && !isStartingSession) {
					query.startSession();
				}
			}}/>
		</bp.Tooltip>)

	}
}