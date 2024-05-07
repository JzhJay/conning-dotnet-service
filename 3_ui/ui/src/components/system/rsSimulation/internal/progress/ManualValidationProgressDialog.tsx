import {computed, makeObservable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation, i18n, xhr} from 'stores';
import { Progress } from 'semantic-ui-react';
import { BlueprintDialog } from 'components/widgets/BlueprintDialog';
import {Callout, IconName} from '@blueprintjs/core';

import * as css from 'components/system/BatchExport/BatchExportProgressDialog.css';

interface MyProps {
	rsSimulation: RSSimulation;
}

@observer
export class ManualValidationProgressDialog extends React.Component<MyProps, {}> {
	static TITLE: string = i18n.intl.formatMessage({defaultMessage: "Validate", description: "[ManualValidationProgressDialog] dialog title"});
	static ICON: IconName = "form";

	dialogRef: BlueprintDialog;

	constructor(props) {
		super(props);
		makeObservable(this);

		const {rsSimulation} = this.props;
		rsSimulation.updateAdditionalControls({showValidationSetting: true});

		if (!this.progress || this.isComplete ) {
			rsSimulation.startCheckValidationMessages();
		}
	}

	@computed get progress() {
		return this.props.rsSimulation.manualValidationProgress;
	}

	@computed get messages() {
		return this.props.rsSimulation.manualValidationMessage?.messages;
	}

	@computed get isComplete() {
		if (this.progress?.type == "exception") {
			return false;
		}
		const progress = this.progress?.progress;
		return _.isFinite(progress?.denominator) && progress?.numerator == progress?.denominator;
	}

	@computed get resultSummery() {
		if (!this.isComplete || !this.messages?.length) { return null; }

		const summery: {[level: string]: number} = {};
		_.forEach(this.messages, vr => {
			const level = vr.messageType;
			_.set(summery, level, _.get(summery, level, 0) + 1);
		})
		return summery;
	}


	render() {
		const { progress } = this;

		const numerator = progress?.progress?.numerator || 0;
		const denominator = progress?.progress?.denominator || 1;

		return <BlueprintDialog
			ref={ref => this.dialogRef = ref}
			className={css.root}
			title={ManualValidationProgressDialog.TITLE}
			icon={ManualValidationProgressDialog.ICON}
			canCancel={false}
			isCloseButtonShown={this.isComplete}
			okDisabled={!this.isComplete}
			canOutsideClickClose={this.isComplete}
		>
			<Progress
				progress={true}
				value={numerator}
				total={denominator}
				precision={1}
				autoSuccess
				active={true}
				color={"green"}
				label={progress?.currentMessage}
			/>
			{this.isComplete && <Callout>
				<b>Validation Completed</b>
				{this.resultSummery && <>
					<br/>
					{_.map(this.resultSummery, (count, level) => `${level}: ${count}`).join(', ')}
				</>}
			</Callout>}
		</BlueprintDialog>
	}
}