import {ReactSortable} from 'components';
import { action, makeObservable } from 'mobx';
import * as React from 'react';
import {TabularUserOptions} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuItem, MenuDivider, Switch, Icon} from '@blueprintjs/core';
import * as css from './DatasetToolbarItemBase.css'

interface MyProps {
	userOptions: TabularUserOptions;
	updateUserOptions: (userOptions) => void;
}

@observer
export class SSRowsToolbarItem extends React.Component<MyProps, {}> {
    labelNames = {
		showDuration:   'Duration',
		showAssetClass: 'Asset Class',
		showTotal:      'Total',
		showMetrics:    'Risk and Reward',
		showMean:       'Mean',
		showMin:        'Minimum',
		showMax:        'Maximum',
		showPercentiles:                    'Percentiles',
		showCtes:                           'CTEs',
		showStandardDeviation:              'Standard Deviation',
	}

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {userOptions, userOptions:{rowsOrder}} = this.props;
		return <>
			<MenuDivider title="Rows" />
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
						const item = rowsOrder.splice(oldIndex, 1);
						rowsOrder.splice(newIndex, 0, item[0]);
						this.props.updateUserOptions({'rowsOrder':rowsOrder});
					}
				}}>
				{userOptions.rowsOrder.map((attr) => {
					const labelName = this.labelNames[attr];
					return <li key={attr} className={css.sortableItem}>
						<Icon icon="drag-handle-vertical" />
						<Switch checked={userOptions[attr]} label={labelName} onChange={(e) => this.toggleRow(attr, e)} name={labelName} />
                    </li>
				})}
			</ReactSortable>
		</>
	}

    @action toggleRow = (row, e) => {
		const checked = (e.target as HTMLInputElement).checked;
		if(!checked && this.props.userOptions.rowsOrder.filter((attr) => this.props.userOptions[attr]).length == 1 ){
			return;
		}
		this.props.updateUserOptions({[row]: checked});
	}
}
