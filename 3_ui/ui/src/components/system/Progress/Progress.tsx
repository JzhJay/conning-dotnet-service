import { observer } from "mobx-react";
import { sem } from 'components'
import type {ProgressMessage} from './model';
import {ProgressStep} from './ProgressStep';
import { ProgressStepMessage } from './ProgressStepMessage';
import * as css from './Progress.css';

const { Step } = sem;

interface MyProps {
	progressMessages: ProgressMessage[];
	title: string;
}


@observer
export class Progress extends React.Component<MyProps, {}> {

	get progressStepMessages() {
		return this.props.progressMessages.filter(s => s.progress.denominator > 0)
			.map(s => new ProgressStepMessage({numerator: s.progress.numerator, denominator: s.progress.denominator || null, label: s.label, log: [s.currentMessage] }));
	}

	render() {
		return <div className={css.root}>
			<span className={css.title}>{this.props.title}</span>
			<Step.Group vertical>
				{this.progressStepMessages.map((p, i) => <ProgressStep key={i} progress={p}/>)}
			</Step.Group>
		</div>
	}
}
