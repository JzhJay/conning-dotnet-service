import {InputTable} from 'components/system/userInterfaceComponents/Table/InputTable';
import { computed } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {IO, IOPage, IOView} from 'stores/io';
import * as css from './InterestMaintenanceReserve.css';

interface MyProps {
	io: IO;
	view: IOView;
	page: IOPage;
	verboseMode: boolean;
}

@observer
export class InterestMaintenanceReserve extends React.Component<MyProps, {}> {
	static PATH = "interestMaintenanceReserve";

    @computed get rows() {
		return [this.props.io.optimizationInputs.interestMaintenanceReserve];
	}

    render() {
		return <div className={css.root}>
			<InputTable
				userInterface={_.get(this.props.io.inputOptions, InterestMaintenanceReserve.PATH)}
				data={this.rows}
				showToolbar={false}
				onUpdateValue={this.onUpdateValue}
			/>
		</div>
	}

	onUpdateValue = (updateValue: object, updatePath: string) => {
		let {props: {io}} = this;
		const value = _.get(updateValue, updatePath);
		const splitPath = updatePath.split(".");
		io.sendOptimizationInputsUpdate(_.set({}, `${InterestMaintenanceReserve.PATH}.${splitPath[1]}`, value));
	};

}
