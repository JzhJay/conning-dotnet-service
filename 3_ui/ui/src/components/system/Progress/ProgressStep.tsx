import {observer} from 'mobx-react';
import FlipMove from 'react-flip-move';
import {sem} from '../../index';
import { ProgressStepMessage } from './ProgressStepMessage';

import * as css from './ProgressStep.css';

const { Step, List, Progress } = sem;

@observer
export class ProgressStep extends React.Component<{ icon?: React.ReactNode, progress: ProgressStepMessage }, {}> {
	render() {
		const { icon, progress: { isComplete, label, description, log, numerator, denominator} } = this.props;
		return <Step completed={isComplete}>
			{isComplete ? <sem.Icon name='checkmark' color='green' /> : icon ? icon : <sem.Icon name='ellipsis horizontal' />}
			<Step.Content>
				{label && <Step.Title>{label}</Step.Title>}
				{description && <div className={css.description} >{description}</div>}
				<Step.Description>
					{numerator != null && denominator != null && <Progress value={numerator}
					                                                       total={denominator}
					                                                       autoSuccess
					                                                       active={numerator > 0 && numerator < denominator}
					                                                       color='green'
					                                                       label={`${Math.round(numerator / denominator * 100)}%`}
					/>}
					{log && <List as={FlipMove}>
						{log.map((l, i) => <div className='item' key={i}>{l}</div>)}
					</List>}
				</Step.Description>
			</Step.Content>
		</Step>;
	}
}