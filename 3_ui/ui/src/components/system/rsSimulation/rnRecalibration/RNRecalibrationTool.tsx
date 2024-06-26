import {Progress} from 'components/system/Progress/Progress';
import { computed, observable, makeObservable, reaction, flow } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RNRecalibration, RNRecalibrationDialogConfig} from 'stores/rsSimulation/rnRecalibration/RNRecalibration';
import {RNRecalibrationProgress} from './RNRecalibrationProgress';
import {ModelSettings} from './ModelSettings';
import {bp, LoadingIndicator} from 'components';

import * as css from "./RNRecalibrationTool.css";
import { RSSimulation } from 'ui/src/stores/rsSimulation';

interface MyProps {
	rsSimulation: RSSimulation;
}

interface RNRecalibrationDialogMenuItemProps extends RNRecalibrationDialogConfig {
	rnRecalibration: RNRecalibration
}

@observer
export class RNRecalibrationTool extends React.Component<MyProps, {}> {
	static FIRST_PATH_NAME = "calibrationInpus";
	@observable currentInputSpecificationPath: string[] = null;
	_dispose: Function[] = [];
	
	constructor(props: MyProps) {
		super(props);

		if (!this.props.rsSimulation.rnRecalibration.isLoaded) {
			this.props.rsSimulation.rnRecalibration.getRecalibration();
		}
	}

	componentWillUnmount() {
		_.each(this._dispose, d => d());
	}

	render() {
		const {rsSimulation, rsSimulation: {rnRecalibration} } = this.props;
		return <div className={css.root}>{
			!rnRecalibration.isLoaded ?
			rsSimulation.rnRecalibrationProgress ?
			<Progress title={"Starting"} progressMessages={[rsSimulation.rnRecalibrationProgress]}/> :
			<LoadingIndicator/> :
			rsSimulation.isCalibrating ?
			<RNRecalibrationProgress rsSimulation={rsSimulation}/> :
			<>
				<div className={css.content}>
					<ModelSettings rsSimulation={rsSimulation} rnRecalibration={rnRecalibration} />
				</div>
				<RNRecalibrationDialog rnRecalibration={rnRecalibration} />
			</>
		}</div>
	}
}



@observer
class RNRecalibrationDialog extends React.Component<{rnRecalibration: RNRecalibration}, {}> {
    @observable opened = false;

    constructor(props: {rnRecalibration: RNRecalibration}) {
        super(props);
        makeObservable(this);
    }

    @computed get rnRecalibration() {
		return this.props.rnRecalibration;
	}

    @computed get config() {
		return this.rnRecalibration?.actionDialog;
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
		const {rnRecalibration, config} = this;
		rnRecalibration.closeDialog();

		config.onClose && config.onClose.call(rnRecalibration, rnRecalibration)
	}

    onOpened = () => {
		this.opened = true;
	}

    render() {
		const {rnRecalibration, config, style} = this;

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
				{ this.opened ? rnRecalibration.actionDialog?.component.call(rnRecalibration, rnRecalibration) : <LoadingIndicator /> }
			</div>
		</bp.Dialog>
	}
}

export class RNRecalibrationDialogMenuItem extends React.Component<RNRecalibrationDialogMenuItemProps, {}> {
	onClick = () => {
		this.props.rnRecalibration.openDialog(this.props);
	}

	render() {
		const {icon, title} = this.props;
		return <bp.MenuItem icon={icon || 'blank'} text={title} onClick={this.onClick} />
	}
}