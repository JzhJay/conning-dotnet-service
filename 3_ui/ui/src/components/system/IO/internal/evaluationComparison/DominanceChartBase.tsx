import { Colors } from 'themes/themes';
import type { EvaluationDetail, EvaluationComparisonResult } from '../../../../../stores/io';

export interface DominanceChartProps {
	className?: string;
	evaluation1: EvaluationDetail;
	evaluation2: EvaluationDetail;
	targetIndex?: number;
	comparisonResult: EvaluationComparisonResult;
}

class DominanceChartBase extends React.Component<DominanceChartProps, {}> {
    chartDiv = React.createRef<HTMLDivElement>();	
	chart;
	
	getChartColors() : string[] {
		return [Colors.light.secondary, Colors.light.primary];
	}
 
	checkAndRenderChart() {
		const {
			evaluation1,
			evaluation2,
			comparisonResult,
		} = this.props;

		if (evaluation1 && evaluation2 && comparisonResult) {
			if (evaluation1.evaluationNumber === comparisonResult.minuendIndex && evaluation2.evaluationNumber === comparisonResult.subtrahendIndex) {
				this.renderChart();
			}
		}
	}

	renderChart() {
		// must be implemented in derived classes
	}

	componentDidUpdate(prevProps) {
		if (prevProps.evaluation1 !== this.props.evaluation1 || prevProps.evaluation2 !== this.props.evaluation2) {
			this.checkAndRenderChart();
		} else if (prevProps.comparisonResult !== this.props.comparisonResult ) {
			this.checkAndRenderChart();
		}
	}

	componentDidMount() {
		this.checkAndRenderChart();
	}

	componentWillUnmount() {
		if (this.chart) {
			this.chart.destroy();
			this.chart = null;
		}
	}

    render() {
		const { className } = this.props;

        return (
			<div className={className} ref={this.chartDiv} />
		);
    }
}

export default DominanceChartBase;