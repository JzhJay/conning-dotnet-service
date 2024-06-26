import {ReactSortable} from 'components';
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {StatisticsOptions} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuItem, MenuDivider, Switch, Icon} from '@blueprintjs/core';
import * as css from './StatisticsMenu.css';

interface MyProps {
	statistics: StatisticsOptions[];
	onChange: () => void;
}

@observer
export class StatisticsMenu extends React.Component<MyProps, {}> {
    labelNames = {
		"sum"       : "Sum",
		"count"     : "Count",
		"mean"      : "Mean",
		"varp"      : "Variance.P",
		"vars"      : "Variance.S",
		"stdp"      : "StDev.P",
		"stds"      : "StDev.S",
		"coeffvar"  : "CoeffVar",
		"skew"      : "Skewness",
		"kurtosis"  : "Kurtosis",
		"min"       : "Minimum",
		"max"       : "Maximum",
		"percentile": "Percentile",
		"cte"       : "CTE",
	};

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {statistics} = this.props;
		return <>
			<ReactSortable
				className={css.sortableList}
				options={{
					animation:      100,
					forceFallback:  false,
					fallbackOnBody: true
				}}
				onChange={(order, sortable, event) => {
					if (event) {
						const {newIndex, oldIndex} = event;
						const item = statistics.splice(oldIndex, 1);
						statistics.splice(newIndex, 0, item[0]);
						this.props.onChange();
					}
				}}>
				{statistics.map((statistic) => {
					const labelName = this.labelNames[statistic.statistic];
					return <li key={statistic.statistic} className={css.sortableItem}>
						<Icon icon="drag-handle-vertical" />
						<Switch checked={statistic.enabled} label={labelName} onChange={(e) => this.toggleRow(statistic, e)} name={labelName} disabled={statistic.enabled && statistics.filter(s => s.enabled).length === 1} />
					</li>
				})}
			</ReactSortable>
		</>
	}

    @action toggleRow = (statistic, e) => {
		statistic.enabled = !statistic.enabled;
		this.props.onChange();

	}
}
