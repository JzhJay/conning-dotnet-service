import { DropdownCycleButton, bp } from 'components';
import { Menu, MenuItem, Button } from '@blueprintjs/core'
import { ToolbarItemProps } from '../highchartsToolbar';
import { StatisticsType } from 'stores/queryResult';
import { utility } from 'stores';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class StatisticsToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const { statistics } = this.props.userOptions;

		return (
			<div className={bp.Classes.BUTTON_GROUP}>
				<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>Statistics:</label>
				<DropdownCycleButton
					title={false ? 'Statistics' : ''}
					buttonContent={<Button className="stats" style={{ minWidth: 60 }} onClick={() => this.setStatistics(null)} text={this.labels[statistics]}/>}
					menu={<Menu>
						{_.map(utility.enumerateEnum(StatisticsType), stat =>
							<MenuItem icon={statistics === stat ? 'small-tick' : null}
							          key={stat.toString()}
							          onClick={() => this.setStatistics(stat)}
							          text={this.labels[stat]}/>)}
					</Menu>}
				/>
			</div>
		);
	}

	componentDidMount() {
		this.updateExtender();

		this._toDispose.push(
			reaction(() => this.props.userOptions.statistics, () => {
				this.updateExtender();
			}));
	}

	_toDispose = [];

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

	labels = {
		[StatisticsType.None]      : "None",
		[StatisticsType.MeanOnly]  : "μ",
		[StatisticsType.MeanAnd1SD]: "μ ± 1σ",
		[StatisticsType.MeanAnd2SD]: "μ ± 2σ",
		[StatisticsType.MeanAnd3SD]: "μ ± 3σ"
	};

	updateExtender() {
		if (this.props.chartComponent.chart != null) {
			const { chartComponent } = this.props;
			const { statistics }     = this.props.userOptions;

			if (chartComponent && chartComponent.extender) {
				chartComponent.extender.setStatistics(statistics, this.props.chartData.statistics);
			}
		}
	}

	setStatistics = (statistics) => {
		// If no type is specified, use the "next"(after the selected type) statistics type in the
		// grid line icons object.
		if (statistics == null) {
			let foundStatType = false;

			for (let key of Object.keys(this.labels)) {
				const statisticKey = parseInt(key);

				// Set the first type found to handle the wrap around case
				if (statistics == null) {
					statistics = statisticKey;
				}

				// Use the next type after the selection type
				if (foundStatType) {
					statistics = statisticKey;
					break;
				}

				foundStatType = (statisticKey === this.props.userOptions.statistics);
			}
		}

		this.props.onUpdateUserOptions({ statistics: statistics });
	}
}

@observer
export class MomentsToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const { moment } = this.props.userOptions.moments;

		return (
			<div className={bp.Classes.BUTTON_GROUP}>
				<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>Moments:</label>
				<DropdownCycleButton
					title={false ? "Number of Moments" : ''}
					buttonContent={<Button className="moments" onClick={() => this.setMoment(null)} text={moment.toString()}/>}
					menu={<Menu>
						{_.map([0, 1, 2, 3, 4], m =>
							<MenuItem key={m} icon={moment === m ? 'small-tick' : null} text={m.toString()} onClick={() => this.setMoment(m)}/>)}
					</Menu>}/>
			</div>
		);
	}

	componentDidMount() {
		this.updateExtender();

		reaction(() => this.props.userOptions.moments, () => {
			this.updateExtender();
		})
	}

	updateExtender() {
		if (this.props.chartComponent.chart != null) {
			const { chartComponent }         = this.props;
			const { moment, x, y, fontSize } = this.props.userOptions.moments;
			if (chartComponent && chartComponent.extender) {
				chartComponent.extender.showMomentsBox(moment, x, y, fontSize, this.props.chartData.statistics);
			}
		}
	}

	setMoment = (v?: number) => {
		let { moment } = this.props.userOptions.moments;
		if (v == null) {
			moment++;
		}
		else {
			moment = v;
		}

		if (moment > 4) moment = 0;

		this.props.onUpdateUserOptions({ moments: { moment: moment, x: this.props.userOptions.moments.x, y: this.props.userOptions.moments.y, fontSize: this.props.userOptions.moments.fontSize } });

	}
}

