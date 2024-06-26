import {FormattedMessage} from 'react-intl';
import {Axis, GroupMember} from 'stores/queryResult';
import {settings, simulationStore} from "stores";
import * as css from './CorrelationCellTooltip.css'

export interface CorrelationTooltipAxisCoordinate {
	axis: Axis;
	coord: GroupMember;
}

interface MyProps {
	rowAxes: CorrelationTooltipAxisCoordinate[];
	colAxes: CorrelationTooltipAxisCoordinate[];
	correlation: number;
}

export class CorrelationCellTooltip extends React.Component<MyProps, {}> {
	render() {
		const { rowAxes, colAxes, correlation } = this.props;


		return <div className={classNames(css.root, "content")}>
			<i className={css.title}>
				<FormattedMessage defaultMessage="Row Series" description="[query] Correlation Maxtrix Tooltip Content - Row Series" />
			</i>
			<div className={css.axes}>
				{rowAxes.map(a => <AxisCoord key={`${a.axis.id}-${a.coord.label}-row`} {...a} />)}
			</div>

			<i className={css.title}>
				<FormattedMessage defaultMessage="Column Series" description="[query] Correlation Maxtrix Tooltip Content - Column Series" />
			</i>
			<div className={css.axes}>
				{colAxes.map(a => <AxisCoord key={`${a.axis.id}-${a.coord.label}-col`} {...a} />)}
			</div>

			<span className={css.title}>
				<FormattedMessage defaultMessage="Correlation" description="[query] Correlation Maxtrix Tooltip Content - Correlation" />
			</span>
			<span className={css.value}>{correlation && correlation.toFixed(settings.formatPrecision)}</span>
		</div>;
	}
}

class AxisCoord extends React.Component<CorrelationTooltipAxisCoordinate, {}> {
	render() {
		const {axis, coord} = this.props;
		const label = !coord ? '' : axis.groupName.label == 'Simulation' ? simulationStore.simulations.has(coord.label) ? simulationStore.simulations.get(coord.label).name : coord.label : coord.label;

		return <div className={css.axisCoord}>
			<span className={css.axis}>{axis.groupName.label}</span>
			<span className={css.coord}>{label}</span>
		</div>
	}
}