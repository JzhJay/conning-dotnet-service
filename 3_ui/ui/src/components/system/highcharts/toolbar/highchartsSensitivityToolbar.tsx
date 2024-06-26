import { Navbar, NavbarDivider, NavbarGroup} from '@blueprintjs/core';
import { computed, observable, when, IReactionDisposer, makeObservable } from 'mobx';
import { observer} from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { bp, HighchartsComponent} from 'components';
import { Select } from '@blueprintjs/select';
import { QueryResult} from '../../../../stores/queryResult/models';
import { getCoordinateName } from '../dataTemplates/highchartDataTemplate';
import {i18n} from '../../../../stores/i18n';
import { queryMessages } from '../../../../stores/i18n/queryMessages';

import * as css from './highchartsToolbar.css';

interface MyProps {
	chartComponent?: HighchartsComponent;
	queryResult: QueryResult;
	onSensitivityApply?: () => Promise<any>;
}

type SelectOption = {
	label: string;
	value: number;
}

const ColumnSelect = Select.ofType<SelectOption>();

@observer
class SensitivityChartToolbar extends React.Component<MyProps, {}> {
    @observable isSensitivityRan: boolean = false;
    @observable shiftedMean: string = '0';
    @observable shiftedStandardDeviation: string = '0';
    _disposers: IReactionDisposer[] = [];

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get referenceVariableOptions() {
		const { queryResult } = this.props;
		const pivotMetadata = queryResult.pivotMetadata;

		return queryResult.sensitivity.coordinateIndices.map((axisCols, columnIndex) => {
			const label = axisCols.map((coordinate, i) => {
				const groupName = pivotMetadata.axes[pivotMetadata.columnAxes[i]].groupName.label;
				const coordinateName = getCoordinateName(pivotMetadata.axes[pivotMetadata.columnAxes[i]], coordinate)
				return `${groupName}=${coordinateName}`;
			}).join(',');

			return  { label, value: columnIndex };
		});
	}

    @computed get isRunDisabled() {
		const { isSensitivityRan, shiftedMean, shiftedStandardDeviation } = this;
		const { sensitivity } = this.props.queryResult;
		return isSensitivityRan && parseFloat(shiftedMean) === sensitivity.shiftedMean && parseFloat(shiftedStandardDeviation) === sensitivity.shiftedStandardDeviation;
	}

    onColumnChange = async (option : SelectOption ) => {
		await this.props.queryResult.getSensitivityColumn(option.value);
	}

    runSensitivity = async(e: React.MouseEvent<HTMLButtonElement>) => {
		const { chartComponent, queryResult } = this.props;

		if (chartComponent) {
			chartComponent.syncActions(async () => {
				this.isSensitivityRan = true;
				chartComponent.busy = true;

				try {
					await queryResult.runSensitivity(parseFloat(this.shiftedMean), parseFloat(this.shiftedStandardDeviation));
					await chartComponent.refetchData();
				} finally {
					chartComponent.busy = false;
				}
			});
		} else {
			this.isSensitivityRan = true;
			await queryResult.runSensitivity(parseFloat(this.shiftedMean), parseFloat(this.shiftedStandardDeviation));
		}

		if (this.props.onSensitivityApply) {
			await this.props.onSensitivityApply();
		}
	}

    onShiftedMeanChange = (event) => {
		this.shiftedMean = event.target.value || '0';
	}

    onShiftedStandardDeviationChange = (event) => {
		this.shiftedStandardDeviation = event.target.value || '0';
	}

    selectItemRenderer = (item, { handleClick, modifiers }) => {
		return (
			<bp.MenuItem
				active={modifiers.active}
				key={item.value}
				label={item.label}
				onClick={handleClick}
				text={item.title}
			/>
		);
	};

    isSelectItemsEqual = (a, b) => {
        return a.value ===  b.value;
	}

    componentDidMount() {
		this._disposers.push(
			when(() => !!this.props.queryResult.sensitivity, () => {
				if (typeof this.props.queryResult.sensitivity.columnIndex !== 'number') {
					// set default column index if it doesn't exist
					this.onColumnChange(this.referenceVariableOptions[0]);
				} else {
					this.shiftedMean = String(this.props.queryResult.sensitivity.shiftedMean);
					this.shiftedStandardDeviation = String(this.props.queryResult.sensitivity.shiftedStandardDeviation);
				}
			})
		);
	}

    componentWillUnmount() {
		this._disposers.forEach(f => f());
	}

    render() {
		const {sensitivity, sensitivityEnabled } = this.props.queryResult;
		if (!sensitivity) {
			return null;
		}

		const { isSensitivityRan, referenceVariableOptions: selectOptions } = this;
		const isMeanChange = parseFloat(this.shiftedMean) !== sensitivity.shiftedMean;
		const isStandardDeviationChange = parseFloat(this.shiftedStandardDeviation) !== sensitivity.shiftedStandardDeviation;
		const defaultSelectedColumn = selectOptions.find(s => s.value === sensitivity.columnIndex) || selectOptions[0];
		const { formatMessage } = i18n.intl;

		return (
			<Navbar className={css.highchartsPopoverToolbar}>
				<NavbarGroup align="left" className={css.toolbarLeftPanel}>
					<ColumnSelect
						className="sensitivity-column-select"
						activeItem={defaultSelectedColumn}
						items={selectOptions}
						filterable={false}
						popoverProps={{ minimal: true, popoverClassName: `sensitivity-column-select-popover ${css.highchartsPopoverToolbarSelect}` }}
						itemRenderer={this.selectItemRenderer}
						onItemSelect={this.onColumnChange}
						itemsEqual={this.isSelectItemsEqual}
					>
						<bp.Button text={defaultSelectedColumn.label} rightIcon="caret-down"/>
					</ColumnSelect>
					<NavbarDivider />
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Reference Mean:" description="[Query] Sensitivity settings - Reference Mean" />
						</div>
						<bp.InputGroup
							className={`sensitivity-reference-mean-input ${css.semanticInput} ${css.inputDisabled}`}
							type="number"
							value={`${sensitivity.unshiftedMean}`}
							readOnly={true}
						/>
					</div>
					<NavbarDivider/>
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Shifted Mean:" description="[Query] Sensitivity settings - Shifted Mean" />
						</div>
						<bp.InputGroup
							className={`sensitivity-shifted-mean-input ${css.semanticInput}`}
							type="number"
							onChange={this.onShiftedMeanChange}
							rightElement={isMeanChange && isSensitivityRan &&
							<bp.Tooltip content={formatMessage(queryMessages.valueIsChanged)}>
								<bp.Button
									disabled={true}
									icon="edit"
									minimal={true}
								/>
							</bp.Tooltip>}
							value={`${this.shiftedMean}`}
						/>
					</div>
					<NavbarDivider/>
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Reference Standard Deviation:" description="[Query] Sensitivity settings - Reference Standard Deviation" />
						</div>
						<bp.InputGroup
							className={`sensitivity-reference-sd-input ${css.semanticInput} ${css.inputDisabled}`}
							type="number"
							value={`${sensitivity.unshiftedStandardDeviation}`}
							readOnly={true}
						/>
					</div>
					<NavbarDivider/>
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Shifted Standard Deviation:" description="[Query] Sensitivity settings - Shifted Standard Deviation" />
						</div>
						<bp.InputGroup
							className={`sensitivity-shifted-sd-input ${css.semanticInput}`}
							type="number"
							onChange={this.onShiftedStandardDeviationChange}
							rightElement={isStandardDeviationChange && isSensitivityRan &&
							<bp.Tooltip content={formatMessage(queryMessages.valueIsChanged)}>
								<bp.Button
									disabled={true}
									icon="edit"
									minimal={true}
								/>
							</bp.Tooltip>}
							value={`${this.shiftedStandardDeviation}`}
						/>
					</div>
				</NavbarGroup>
				<NavbarGroup align="right">
					<bp.Button className={`run-sensitivity ${css.runButton}`} intent={bp.Intent.PRIMARY}  disabled={this.isRunDisabled} onClick={this.runSensitivity}>
						<FormattedMessage defaultMessage="Run Sensitivity" description="[Query] Button text for changing Query Result by settings of sensivitiy" />
					</bp.Button>
				</NavbarGroup>
			</Navbar>
		);
	}
}

export default SensitivityChartToolbar;