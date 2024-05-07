import { observer } from "mobx-react";
import {bp, sem} from 'components'
import { ProgressStepMessage } from './ProgressStepMessage';

import * as css from './ProgressMessage.css'

@observer
export class ProgressMessageComponent extends React.Component<{ messageKey: string, message: ProgressStepMessage }, {}> {
	render() {
		const { messageKey, message: { label, numerator, denominator, grade, log } } = this.props

		return <div className={css.root}>
			<span className={css.key}>{messageKey}</span>
			<label className={css.title}>{label}</label>
			{numerator != null && denominator != null && <bp.ProgressBar value={numerator / denominator}/>}
			<span>{numerator} / {denominator}</span>
			<span>{grade}</span>
			<div className={css.log}>
				{log && log.map((l, i) => <span key={i}>{l}</span>)}
			</div>
		</div>
	}
}