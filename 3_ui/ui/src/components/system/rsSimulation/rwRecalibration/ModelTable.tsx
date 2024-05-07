import {i18n} from 'stores';
import {CombinatorialAddRows} from './CombinatorialAddRows';
import type {RecalibrationComponentProps} from './ModelSettings';
import {RecalibrationDialogMenuItem} from './RWRecalibrationTool';
import {computed, makeObservable, runInAction} from 'mobx';
import {Observer, observer} from 'mobx-react';
import {InputTable} from '../../userInterfaceComponents/Table/InputTable';
import {yearMonthInputFields} from 'stores/rsSimulation/rwRecalibration/models';
import {convertMonthToYM, convertYMtoMonth} from 'utility';

import * as css from "./ModelTable.css";
import { bp } from 'components';

@observer
export class ModelTable extends React.Component<RecalibrationComponentProps, {}> {
    yearMonthInputFieldsArray = Array.from(yearMonthInputFields);

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get displayName() {
		return this.props.recalibration.metadata[this.props.dataset?.name].title;
	}

    @computed get userInterface() {
		const {recalibration, dataset: {name}} = this.props;
		let userInterface = recalibration.getTableInterface(name);
		if (!userInterface) {
			return null;
		}
		if (!userInterface.hints) userInterface.hints = {};
		//userInterface.hints.invert = true;
		// TODO Update back-end to specify dimension and mark as expandable
		userInterface.hints.dimension = 2;
		userInterface.options.forEach((o: any) => {
			o.isExpandable = true;
			o.isExpandableOnAlternate = true;
		});
	    userInterface.locationPath = this.props.dataset.name.split("/");

		return userInterface;
	}

    @computed get data() {
		return this.props.dataset.table;
	}

    @computed get displayChart() {
		return this.props.dataset.settings.displayChart !== false;
	}

    set displayChart(update) {
		this.props.dataset.settings.displayChart = update;
	}


    translateCellValue = (path: string[], value: any) => {
		const colSetting = _.find(this.userInterface.options, o => o.name == path[1]);

		if (yearMonthInputFields.has(colSetting.name)) {
			return convertYMtoMonth(value, 'month');
		}

		return value;
	}

    onUpdate = async (update_values: object, update_path: string) => {
		const userInterface = this.userInterface;
		const update_path_split = update_path.split(".");
		const update_key = update_path_split[1];

		const colSetting = _.find(userInterface.options, o => o.name == update_key);
		if (!colSetting) {
			console.log(`can not update col ${update_key}, no match column setting.`);
			return;
		}

		const updateId = _.get(this.props.dataset.table, `${update_path_split[0]}.id`);
		const org_value = _.get(this.data, update_path);
		let update_value: any = _.toString(_.get(update_values, update_path));
		if (yearMonthInputFields.has(colSetting.name)) {
			if (!_.isInteger(update_value)) {
				update_value = parseInt(update_value)
			}
			runInAction(() => _.set(this.props.dataset.table, update_path, update_value));
		} else if (colSetting.inputType == "float") {
			update_value = parseFloat(update_value);
		} else if (colSetting.inputType == "integer") {
			update_value = parseInt(update_value, 10);
		}

		if (org_value === update_value) {
			return;
		}

		await this.props.recalibration.updateRecalibrationRow(updateId, update_key, update_value);
	}

    onDelete = async (records: object[]) => {
		let delete_ids = _.map(records, r => r['id']);
		await this.props.recalibration.removeRows(delete_ids);
	}

    onInsert = async (startIndex: number, numItems: number) => {
		const tableName = this.props.dataset.name;
		await this.props.recalibration.addRows(tableName, numItems);
	}

    itemFormatter = (inputValue: object, cellPath: string, cell: HTMLElement) => {
		const colName = _.find(this.yearMonthInputFieldsArray, c => cellPath.indexOf(c) >= 0 );
		if (colName) {
			const key = Object.keys(inputValue)[0];
			const input = cell.querySelector('input');
			if (input) {
				input.value = convertMonthToYM(inputValue[key][colName]);
				return;
			}
			cell.innerText = convertMonthToYM(inputValue[key][colName]);
		}
	}

    onPastingCell = (e: wijmo.grid.CellRangeEventArgs): boolean => {
		const header = e.panel.grid.getColumn(e.col).header;
		const option = this.userInterface.options.find((option) => option.title === header);
		if (option && yearMonthInputFields.has(option.name)) {
			e.data = convertYMtoMonth(e.data, 'month');
		}

		return true;
	}

    render() {
		const {userInterface, displayName, data } = this;
		const { recalibration, dataset: {name}, recalibration:{ metadata }} = this.props;

		if (!userInterface) {
			return "null table interface"; //TODO
		}

		return <div className={css.root}>
			<InputTable
				userInterface={userInterface}
				globalLists={null}
				className={css.table}
				axes={null}
				data={data}
				flipPrimary={true}
				title={displayName}
				dataWithIndex={false}
				translateCellValue={this.translateCellValue}
				onUpdateValue={this.onUpdate}
				onDeleteRows={this.onDelete}
				onInsertRows={this.onInsert}
				onPastingCell={this.onPastingCell}
				extendToolbarMenus={<bp.Menu>
					<Observer>{()=>
						<bp.MenuItem text={<bp.Switch
							checked={recalibration.isChartDisplay(name)}
							label={i18n.intl.formatMessage({defaultMessage: "Display Chart", description: "[ModelTable] display chart switcher"})}
							disabled={data.length == 0}
							onChange={ () => {
								recalibration.toggleChartDisplay(name);
							}
						}/>} />
					}</Observer>
					<RecalibrationDialogMenuItem recalibration={recalibration}
					                             icon={CombinatorialAddRows.ICON}
					                             title={CombinatorialAddRows.TITLE}
					                             dialogWidth={500}
					                             component={(r) => {
													 return <CombinatorialAddRows recalibration={recalibration} tableName={name} metadata={metadata[name]} />
												 }}
					/>
				</bp.Menu>}
				itemFormatter={this.itemFormatter}
			/>
		</div>
	}
}
