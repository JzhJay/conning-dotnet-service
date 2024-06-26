import { computed, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation} from '../../../../stores/rsSimulation';
import {Progress} from '../../Progress/Progress';

interface MyProps {
	rsSimulation: RSSimulation;
}

@observer
export class RNRecalibrationProgress extends React.Component<MyProps, {}> {
    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    @computed get statusMessages() {
		let process =  this.props.rsSimulation.progressMessage.filter(pm => pm.type == "run_rn_recalibration");
		if (process.length) {
			return process;
		} else {
			return [{
				type: "run_rn_recalibration",
				label: "Starting...",
				currentMessage: "",
				progress: { numerator: 0, denominator: 1 }
			}];
		}
	}

    render() {
		return <Progress title={"Calibrating"} progressMessages={this.statusMessages}/>
	}
}