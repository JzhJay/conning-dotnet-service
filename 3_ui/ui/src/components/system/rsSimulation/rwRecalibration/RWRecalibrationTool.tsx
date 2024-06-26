import {RSSimulationApplication} from 'components/system/rsSimulation/RSSimulationApplication';
import {AxisOrganizer} from 'components/system/rsSimulation/rwRecalibration/AxisOrganizer';
import {OptimizationAlgorithm} from 'components/system/rsSimulation/rwRecalibration/OptimizationAlgorithm';
import {Progress} from 'components/system/Progress/Progress';
import { computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {i18n} from 'stores';
import {RSSimulation} from '../../../../stores/rsSimulation/RSSimulation';
import {RWRecalibration, RecalibrationDialogConfig} from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';
import {CalibrationProgress} from './CalibrationProgress';
import {ModelSettings} from './ModelSettings';
import {ModelTree} from './ModelTree';
import {bp, LoadingIndicator} from 'components';

import * as css from "./RWRecalibrationTool.css";

interface MyProps {
	rsSimulation: RSSimulation;
}

@observer
export class RWRecalibrationTool extends React.Component<MyProps, {}> {

	constructor(props: MyProps) {
		super(props);

		if (!this.props.rsSimulation.recalibration.isLoaded) {
			this.props.rsSimulation.recalibration.getRecalibration();
		}
	}

	render() {
		const {rsSimulation, rsSimulation: {recalibration} } = this.props;
		return <div className={css.root}>{
			!recalibration.isLoaded ?
			rsSimulation.recalibrationProgress ?
			<Progress
				title={i18n.intl.formatMessage({defaultMessage: "Starting", description: "[RecalibrationTool] progress box title when loading recalibration"})}
				progressMessages={[rsSimulation.recalibrationProgress]}/> :
			<LoadingIndicator/> :
			rsSimulation.isCalibrating ?
			<CalibrationProgress rsSimulation={rsSimulation}/> :
			<>
				<div className={css.content}>
					<ModelSettings rsSimulation={rsSimulation} recalibration={recalibration} />
				</div>
				<RecalibrationDialog recalibration={recalibration} />
			</>
		}</div>
	}
}



@observer
class RecalibrationDialog extends React.Component<{recalibration: RWRecalibration}, {}> {
    @observable opened = false;

    constructor(props: {recalibration: RWRecalibration}) {
        super(props);
        makeObservable(this);
    }

    @computed get recalibration() {
		return this.props.recalibration;
	}

    @computed get config() {
		return this.recalibration?.actionDialog;
	}

    @computed get style():React.CSSProperties {
		const {config} = this;

		if(_.isNumber(config?.dialogWidth)) {
			return { width: config.dialogWidth };
		} else {
			return {};
		}
	}

    onClose = () => {
		const {recalibration, config} = this;
		recalibration.closeDialog();

		config.onClose && config.onClose.call(recalibration, recalibration)
	}

    onOpened = () => {
		this.opened = true;
	}

    render() {
		const {recalibration, config, style} = this;

		if (!config) {
			return null;
		}

		return <bp.Dialog isOpen={true}
		                  icon={config.icon}
		                  title={config.title}
		                  onOpened={this.onOpened}
		                  onClose={this.onClose}
		                  className={css.dialog}
		                  portalClassName={css.dialogPortal}
		                  style={style}
          >
			<div className={css.dialogBody}>
				{ this.opened ? recalibration.actionDialog?.component.call(recalibration, recalibration) : <LoadingIndicator /> }
			</div>
		</bp.Dialog>
	}
}

interface RecalibrationDialogMenuItemProps extends RecalibrationDialogConfig {
	recalibration: RWRecalibration
}

export class RecalibrationDialogMenuItem  extends React.Component<RecalibrationDialogMenuItemProps, {}> {
	onClick = () => {
		this.props.recalibration.openDialog(this.props);
	}

	render() {
		const {icon, title} = this.props;
		return <bp.MenuItem icon={icon || 'blank'} text={title} onClick={this.onClick} />
	}
}