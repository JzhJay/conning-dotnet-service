import {RNRecalibration} from 'stores/rsSimulation/rnRecalibration/RNRecalibration';
import {bp, Option} from 'components';
import {Observer, observer} from 'mobx-react';
import * as React from 'react';
import {yearMonthInputFields} from 'stores/rsSimulation/rwRecalibration/models';
import {computed, makeObservable} from 'mobx';
import {HeaderEntry} from 'components/system/userInterfaceComponents/Table/TableHeaderSpecification';
import {convertMonthToYM, convertYMtoMonth} from 'utility';
import * as css from "./ModelTable.css";
import {InputTable} from 'components/system/userInterfaceComponents/Table/InputTable';
import {i18n} from 'stores';
import {RecalibrationDialogMenuItem} from 'components/system/rsSimulation/rwRecalibration/RWRecalibrationTool';
import {CombinatorialAddRows} from 'components/system/rsSimulation/rwRecalibration/CombinatorialAddRows';

interface ModelTableProps {
	rnRecalibration: RNRecalibration;
	verboseMode: boolean;
	option: Option;
	data: any;
	path: string[];
}

@observer
export class ModelTable extends React.Component<ModelTableProps, {}> {
	yearMonthInputFieldsArray = Array.from(yearMonthInputFields);
	batchUpdateStorage:{[key: string]: any} = {};

	constructor(props) {
		super(props);

		makeObservable(this);
	}

	@computed get data() {
		return this.props.data;
	}

	translateCellValue = (path: string[], value: any, headerEntry: HeaderEntry) => {
		if (headerEntry.hints.maturity) {
			return convertYMtoMonth(value, 'month');
		}

		return value;
	}

	onUpdate = async (updateValues: object, update_path: string) => {
		_.merge(this.batchUpdateStorage, _.set({}, this.props.path, updateValues));
		this.batchUpdate();
	}

	batchUpdate= _.debounce(() => {
		this.props.rnRecalibration.updateUserInterface(this.batchUpdateStorage);
		this.batchUpdateStorage = {};
	})

	itemFormatter = (inputValue: object, cellPath: string, cell: HTMLElement, headerEntry: HeaderEntry) => {
		if (headerEntry.hints.maturity) {
			const key = Object.keys(inputValue)[0];
			const input = cell.querySelector('input');
			const value = _.get(inputValue, cellPath);
			if (input) {
				input.value = convertMonthToYM(value);
				return;
			}
			cell.innerText = convertMonthToYM(value);
		}
	}

	render() {
		const { data } = this;
		const {option, rnRecalibration, path} = this.props;
		const pathJoined = path.join(".");

		return <div className={css.root}>
			<InputTable
				userInterface={option}
				globalLists={null}
				className={css.table}
				axes={rnRecalibration?.userInterface?.axes}
				data={data}
				path={pathJoined}
				onUpdateAxis={this.props.rnRecalibration.updateUserInterface}
				translateCellValue={this.translateCellValue}
				onUpdateValue={this.onUpdate}
				extendToolbarMenus={<bp.Menu>
					<Observer>{()=>
						<bp.MenuItem text={<bp.Switch
							checked={rnRecalibration.isChartDisplay(pathJoined)}
							label={i18n.intl.formatMessage({defaultMessage: "Display Chart", description: "[ModelTable] display chart switcher"})}
							disabled={data.length == 0}
							onChange={ () => {
								rnRecalibration.toggleChartDisplay(pathJoined);
							}
							}/>} />
					}</Observer>
				</bp.Menu>}
				itemFormatter={this.itemFormatter}
			/>
		</div>
	}
}