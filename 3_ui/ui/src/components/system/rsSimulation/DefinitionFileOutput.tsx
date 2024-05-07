import type {ProgressMessage} from 'components/system/Progress/model';
import {Progress} from 'components/system/Progress/Progress';
import {SolidGaugeMonitor} from 'components/system/Progress/SolidGaugeMonitor';
import { computed, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation} from 'stores';
import * as css from './RSSimulationOutput.css';

interface MyProps {
	rsSimulation: RSSimulation;
}

@observer
export class DefinitionFileOutput extends React.Component<MyProps, {}> {

	render() {
		const {rsSimulation} = this.props;

		return <>
			{(!rsSimulation.isRunning && !rsSimulation.isComplete) && <div className={css.noResults}>No results available. Run simulation to generate output files.</div>}
			{ rsSimulation.isComplete && <div className={css.completeMessage}>Simulation Complete!</div>}
		</>
	}
}
