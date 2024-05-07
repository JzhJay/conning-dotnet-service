import {Navbar, NavbarDivider, NavbarGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import {bp, HighchartsComponent} from "components";
import { Select } from '@blueprintjs/select';
import { computed, observable, reaction, IReactionDisposer, makeObservable } from "mobx";
import type { ChartType, ChartUserOptions} from '../../../../stores/charting';
import {QueryResult} from '../../../../stores/queryResult/models';
import {i18n} from '../../../../stores/i18n';
import { queryMessages } from '../../../../stores/i18n/queryMessages';

import * as css from './highchartsToolbar.css';

interface MyProps {
	chartType: ChartType;
	chartComponent: HighchartsComponent;
	queryResult: QueryResult;
	userOptions: ChartUserOptions;
}

type SelectOption = {
	title: string;
	label: string;
	value: number;
}

const StatisticSelect = Select.ofType<SelectOption>();

@observer
export class BootstrapChartToolbar extends React.Component<MyProps, {}> {
    _disposers: IReactionDisposer[] = [];
    @observable numberResamples;
    @observable resampleSize;
    @observable seed;
    @observable bootstrap = this.props.queryResult.bootstrap ? Object.assign({}, this.props.queryResult.bootstrap.bootstrapOptions) :
		{
			numberResamples: null,
			resampleSize: null,
			seed: null,
			statistic: null
		}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get isDisabled() {
		const {bootstrapOptions} = this.props.queryResult.bootstrap;
		return (this.props.queryResult.bootstrap.bootstrapRan &&
				bootstrapOptions.resampleSize == this.bootstrap.resampleSize &&
				bootstrapOptions.numberResamples == this.bootstrap.numberResamples &&
				bootstrapOptions.seed == this.bootstrap.seed &&
				bootstrapOptions.statistic == this.bootstrap.statistic)
	}
    @observable statisticsNumber = this.props.queryResult.bootstrap ? this.props.queryResult.bootstrap.bootstrapOptions.statistic : 0;

    render() {
		const { bootstrap } = this.props.queryResult;
		if (!bootstrap) {
			return null;
		}

		const { bootstrapStatistics, bootstrapOptions, bootstrapExtrema, bootstrapRan } = bootstrap;
		const selectOptions : SelectOption[] = bootstrapStatistics.map((s, i) => {return {value: i, label: s.label, title:s.description}});
		const isStatisticChanged = bootstrapRan && this.bootstrap.statistic != bootstrapOptions.statistic;
		const isNumberResamplesChange = bootstrapRan && this.bootstrap.numberResamples != bootstrapOptions.numberResamples;
		const isResampleSizeChange = bootstrapRan && this.bootstrap.resampleSize != bootstrapOptions.resampleSize;
		const isSeedChange = bootstrapRan && this.bootstrap.seed != bootstrapOptions.seed;
		const defaultSelectedStatistic = selectOptions.find(s => s.value === this.bootstrap.statistic) || selectOptions[0];
		const { formatMessage } = i18n.intl;

		return (
			<Navbar className={css.highchartsPopoverToolbar}>
				<NavbarGroup align='left' className={css.toolbarLeftPanel}>
					<StatisticSelect
						activeItem={defaultSelectedStatistic}
						items={selectOptions}
						filterable={false}
						popoverProps={{ minimal: true, popoverClassName: css.highchartsPopoverToolbarSelect }}
						itemRenderer={this.selectItemRenderer}
						onItemSelect={this.onStatisticChange}
						itemsEqual={this.isSelectItemsEqual}
					>
						{ isStatisticChanged ?
						<bp.Button className="bootstrap-statistic-select" rightIcon="edit">
							<bp.Tooltip content={formatMessage(queryMessages.valueIsChanged)}>
								{ defaultSelectedStatistic.label }
							</bp.Tooltip>
						</bp.Button> :
						<bp.Button className="bootstrap-statistic-select" text={defaultSelectedStatistic.label} rightIcon="caret-down" />
						}
					</StatisticSelect>
					<NavbarDivider/>
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Number of Resamples:" description="[Query] Bootstrap settings - Number of Resamples" />
						</div>
						<bp.InputGroup
							className={`bootstrap-number-resamples ${css.semanticInput}`}
							type="number"
							onChange={this.onNumberResamplesChange}
							rightElement={isNumberResamplesChange &&
							<bp.Tooltip content={formatMessage(queryMessages.valueIsChanged)}>
								<bp.Button
									disabled={true}
									icon="edit"
									minimal={true}
								/>
							</bp.Tooltip>}
							value={`${this.numberResamples}`} />
					</div>
					<NavbarDivider/>
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Resample Size:" description="[Query] Bootstrap settings - Resample Size" />
						</div>
						<bp.InputGroup
							className={`bootstrap-resample-size ${css.semanticInput}`}
							type="number"
							onChange={this.onResampleSizeChange}
							rightElement={isResampleSizeChange &&
							<bp.Tooltip content={formatMessage(queryMessages.valueIsChanged)}>
								<bp.Button
									disabled={true}
									icon="edit"
									minimal={true}
								/>
							</bp.Tooltip>}
							value={`${this.resampleSize}`} />
					</div>
					<NavbarDivider/>
					<div className="ui labeled input">
						<div className="ui label">
							<FormattedMessage defaultMessage="Seed:" description="[Query] Bootstrap settings - Seed" />
						</div>
						<bp.InputGroup
							className={`bootstrap-seed ${css.semanticInput}`}
							type="number"
							onChange={this.onSeedChange}
							rightElement={isSeedChange &&
							<bp.Tooltip content={formatMessage(queryMessages.valueIsChanged)}>
								<bp.Button
									disabled={true}
									icon="edit"
									minimal={true}
								/>
							</bp.Tooltip>}
							value={`${this.seed}`} />
						<span className={bp.Classes.NAVBAR_DIVIDER}/>
					</div>
				</NavbarGroup>
				<NavbarGroup align='right' className="run-bootstrap">
					<bp.Button className={css.runButton} intent={bp.Intent.PRIMARY} disabled={this.isDisabled} onClick={this.runBootstrap}>
						<FormattedMessage defaultMessage="Run Bootstrap" description="[Query] Button text for changing Query Result by settings of bootstrap" />
					</bp.Button>
				</NavbarGroup>
			</Navbar>
		);
	}

    runBootstrap = async(e: React.MouseEvent<HTMLButtonElement>) => {
		let { queryResult: { bootstrap: { bootstrapOptions } }, chartComponent, chartComponent: { chart }, chartType, userOptions } = this.props;

		chartComponent.syncActions(async () => {
			this.props.queryResult.bootstrap.bootstrapRan = true;

			chartComponent.busy = true;

			bootstrapOptions.numberResamples = parseInt(this.numberResamples);
			bootstrapOptions.resampleSize = parseInt(this.resampleSize);
			bootstrapOptions.seed = parseInt(this.seed);
			bootstrapOptions.statistic = this.bootstrap.statistic;
			await this.props.queryResult.runBootstrap();
			await chartComponent.refetchData();

			chartComponent.busy = false;
		})
	}

    clamp = (val: number, min: number, max: number) => {
		return Math.max(min, Math.min(max, val));
	}

    isSelectItemsEqual = (a, b) => {
        return a.value ===  b.value;
	}

    onStatisticChange = (option : SelectOption) => {
		this.bootstrap.statistic = option.value;
	}

    selectItemRenderer = (item, { handleClick, modifiers }) => {
		return (
			<bp.MenuItem
				active={modifiers.active}
				key={item.value}
				onClick={handleClick}
				text={item.label}
			/>
		);
	}

    onNumberResamplesChange = (event) => {
		const { bootstrap, bootstrap: { bootstrapOptions }} = this.props.queryResult;
		const val = parseInt(event.target.value);

		if (!val) {
			this.numberResamples = bootstrapOptions.numberResamples;
		} else {
			this.numberResamples = this.clamp(val, 1, bootstrap.bootstrapExtrema.maximumNumberResamples);
			this.bootstrap.numberResamples = this.numberResamples;
		}
	}

    onResampleSizeChange = (event) => {
		const { bootstrap, bootstrap: { bootstrapOptions }} = this.props.queryResult;
		const val = parseInt(event.target.value);

		if (!val) {
			this.resampleSize = bootstrapOptions.resampleSize;
		} else {
			this.resampleSize = this.clamp(val, 1, bootstrap.bootstrapExtrema.maximumResampleSize);
			this.bootstrap.resampleSize = this.resampleSize;
		}
	}

    onSeedChange = (event) => {
		const { bootstrap, bootstrap: { bootstrapOptions }} = this.props.queryResult;
		const val = parseInt(event.target.value);

		if (!val) {
			this.seed = bootstrapOptions.seed;
		} else {
			this.seed = this.clamp(val, 0, Number.MAX_SAFE_INTEGER);
			this.bootstrap.seed = this.seed;
		}
	}

    syncBootstrapValues = () => {
		this.bootstrap = Object.assign({}, this.props.queryResult.bootstrap.bootstrapOptions);
		this.numberResamples = this.bootstrap.numberResamples;
		this.resampleSize = this.bootstrap.resampleSize;
		this.seed = this.bootstrap.seed;
	}

    componentDidMount() {
		if (this.props.queryResult.bootstrap) {
			this.syncBootstrapValues();
		}

		this._disposers.push(reaction(() => this.props.queryResult.bootstrap, this.syncBootstrapValues));
	}

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}
}
