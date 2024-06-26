
import {IO, IOPage, IOView} from 'stores/io';
import {DropdownOptions, ResizeableInput, Validator} from 'components/system/inputSpecification/internal/CommonInputs';
import {getOption} from '../utility'
import { action, computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react'
import * as React from 'react';
import * as css from './OptimizationResources.css'

interface MyProps {
	io: IO;
	page: IOPage;
	view: IOView;
	verboseMode: boolean;
}

@observer
export class OptimizationResources extends React.Component<MyProps, {}> {
    colors = {optimizers: "193, 23, 23", vCpus: "11, 172,88", total: "0, 112, 192"};
    chartDiv: Element;
    chart;
    renPathQuantity;
    renPathSize;
    prices = {
		"c4": .125,
		"m5": .122,
		"m4": .125,
		"r5": .142,
		"r4": .146,
		"c5": .115
	};

    @observable awsInstanceQuantity = this.props.io.optimizationInputs.optimizationResources.awsInstanceQuantity;
    @observable awsInstanceSize = this.props.io.optimizationInputs.optimizationResources.awsInstances.awsInstanceSize;

    updateSVGPaths = () => {
		if (this.chart) {
			let x = this.chart.series[0].points[1].plotX + this.chart.plotBox.x;
			let y = this.chart.series[0].points[1].plotY + this.chart.plotBox.y;
			let optimizersLine = ['M', 0, 0, 'L', 0, y, 'L', this.chart.plotBox.x, y];
			let vCPULine = ['M', 250, 0, 'L', 250, this.chart.plotBox.y / 2, 'L', x, this.chart.plotBox.y / 2, 'L', x, this.chart.plotBox.y];
			if (this.renPathQuantity) {
				this.renPathQuantity.destroy();
				this.renPathSize.destroy();
			}
			this.renPathQuantity = this.chart.renderer.path(optimizersLine)
				.attr({
					'stroke-width': 3,
					stroke:  `rgb(${this.colors["optimizers"]})`
				})
				.add();
			this.renPathSize = this.chart.renderer.path(vCPULine)
				.attr({
					'stroke-width': 3,
					stroke:  `rgb(${this.colors["vCpus"]})`
				})
				.add();
		}
	}

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		if (this.props.verboseMode) {

			const xTickPositions = this.getAwsInstanceSizeOptions().filter(o => o.applicable).map(o => o.name);
			const maxX = Math.max(...xTickPositions);
			const maxY = getOption(this.getAwsInstanceOption().options, "awsInstanceQuantity").maximum;

			const data = {
				chart:       {
					renderTo:      this.chartDiv,
					type: "area",
					events: {
						render: this.updateSVGPaths
					}
				},
				boost:       {
					enabled: false
				},
				plotOptions: {
					area: {
						stickyTracking: false,
						pointStart: 0,
						dragDrop:       {
							draggableX: true,
							dragMinX:   0,
							dragMaxX:   maxX,
							dragMinY:   0,
							dragMaxY:   maxY,
						},
						boostThreshold: 0,
						marker:         {
							states: {
								hover: {
									enabled: false
								}
							}
						},
						states: {
							inactive: {
								opacity: 1
							}
						}
					}
				},
				xAxis:       [
					{
						min:            0,
						max:            maxX,
						gridLineWidth:  2,
						gridLineColor: "rgb(120,120,120)",
						title: {
							text: "vCPUs / Optimizer"
						},
						tickPosition: "inside",
						tickPositions: xTickPositions
					},
					{
						min:            0,
						max:            maxX,
						opposite: true,
						gridLineWidth:  1,
						tickPosition: "inside",
						tickPositions: _.range(maxX),
						labels: {
							enabled: false
						}
					}
				],
				yAxis:       {
					min:           0,
					max:           maxY,
					gridLineWidth: 1,
					title: {
						text: "Optimizers"
					},
					tickPositions: _.range(maxY+1),
				},
				series:      [
					{
						data: [
							{
								x: 0,
								y: this.awsInstanceQuantity,
								dragDrop:
									{
										draggableX: false,
										draggableY: true
									},
								marker: {
									enabled: true,
									fillColor: `rgb(${this.colors["optimizers"]})`,
									symbol: "circle",
									radius: 5
								},
								events: {
									drag: (e) => {
										const y = (_.values(e.newPoints)[0] as any).newValues.y;
										this.chart.series[0].points[1].update({y: y}, true);
									},
									drop : (e) => {
										this.snapToClosest({y: (_.values(e.newPoints)[0] as any).newValues.y});
										return false;
									}
								}
							},
							{
								x: this.awsInstanceSize,
								y: this.awsInstanceQuantity,
								dragDrop:
									{
										draggableX: true,
										draggableY: true
									},
								marker: {
									enabled: true,
									fillColor: `rgb(${this.colors["total"]})`,
									symbol: "circle",
									radius: 5
								},
								events: {
									drag: (e) => {
										const y = (_.values(e.newPoints)[0] as any).newValues.y;
										const x= (_.values(e.newPoints)[0] as any).newValues.x;
										this.chart.series[0].points[0].update({y: y}, false);
										this.chart.series[0].points[2].update({x: x}, false);
										this.chart.series[1].points[0].update({x: x}, false);
										this.chart.redraw();
									},
									drop : (e) => {
										this.snapToClosest({x: (_.values(e.newPoints)[0] as any).newValues.x, y: (_.values(e.newPoints)[0] as any).newValues.y});
										return false;
									}
								}
							},
							{
								x: this.awsInstanceSize,
								y: 0,
								dragDrop:
									{
										draggableX: false,
										draggableY: false
									}
							}
							]
					},
					{
						data: [
							{
								x: this.awsInstanceSize,
								y: maxY,
								dragDrop:
									{
										draggableX: true,
										draggableY: false
									},
								marker: {
									enabled: true,
									fillColor: `rgb(${this.colors["vCpus"]})`,
									symbol: "circle",
									radius: 5
								},
								events: {
									drag: (e) => {
										const x = (_.values(e.newPoints)[0] as any).newValues.x;
										this.chart.series[0].points[1].update({x: x}, false);
										this.chart.series[0].points[2].update({x: x}, false);
										this.chart.redraw();
									},
									drop : (e) => {
										this.snapToClosest({x: (_.values(e.newPoints)[0] as any).newValues.x});
										return false;
									}
								}
							}
						]
					}
				],
				tooltip:     {
					enabled: false
				},
				legend:      {
					enabled: false
				},
				title:       {
					text: undefined
				},
				credits:     {
					enabled: false
				},
				exporting:   {
					enabled: false
				}
			}

			this.chart = new Highcharts.Chart(data as any);

			// Turn off Highcharts error #15 (data unsorted) warning
			this.chart.series.forEach(s => s.requireSorting = false);
			this.chart.redraw();
		}

	}

    componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		let inputOption = this.props.io.getInputOptions().options[this.props.view.name];
		let options = getOption(getOption(inputOption.options, "awsInstances").options, "awsInstanceSize").options.filter(o => o.applicable).map(o => o.name);
		let prevInputOption = prevProps.io.getInputOptions().options[this.props.view.name];
		let prevOptions = getOption(getOption(prevInputOption.options, "awsInstances").options, "awsInstanceSize").options.filter(o => o.applicable).map(o => o.name);
		if (options !== prevOptions) {
			this.updateChartOptionsDebounced();
		}
	}

    snapToClosest(point: {x?: number, y?: number}) {
		const xTickPositions = this.getAwsInstanceSizeOptions().filter(o => o.applicable).map(o => o.name);
		if (!('x' in point)) {
			point.x = this.awsInstanceSize;
		}
		if (!('y' in point)) {
			point.y = this.awsInstanceQuantity;
		}

		this.awsInstanceSize = xTickPositions.reduce((prev, curr) => Math.abs(curr - point.x) < Math.abs(prev - point.x) ? curr : prev);
		this.awsInstanceQuantity = Math.round(point.y);
		if (this.awsInstanceQuantity == 0) {
			this.awsInstanceQuantity = 1;
		}
		this.updateAll();
	}

    @action updateChart(x: number, y: number) {
		this.chart.series[0].points[0].update({y: y}, false);
		this.chart.series[0].points[1].update({x: x, y: y}, false);
		this.chart.series[0].points[2].update({x: x}, false);
		this.chart.series[1].points[0].update({x: x}, false);
		this.chart.redraw();
	}

    updateAll() {
		this.updateChart(this.awsInstanceSize, this.awsInstanceQuantity);
		this.sendUpdate();
	}

    @action updateChartOptions() {
		const xTickPositions = this.getAwsInstanceSizeOptions().filter(o => o.applicable).map(o => o.name);
		const maxX = Math.max(...xTickPositions);
		const maxY = getOption(this.getAwsInstanceOption().options, "awsInstanceQuantity").maximum;
		this.chart.xAxis[0].update({
			max: maxX,
			tickPositions: xTickPositions
		}, false);
		this.chart.xAxis[1].update({
			max: maxX,
			tickPositions: _.range(maxX)
		}, false);
		this.chart.yAxis[0].update({
			max: maxY,
			tickPositions: _.range(maxY + 1)
		}, false);

		this.chart.update({
			plotOptions: {
				area: {
					stickyTracking: false,
					pointStart: 0,
					dragDrop: {
						draggableX: true,
						dragMinX: 0,
						dragMaxX: maxX,
						dragMinY: 0,
						dragMaxY: maxY,
					}
				}
			}
		}, false);
		this.chart.redraw();
	}

    updateChartOptionsDebounced = _.debounce(this.updateChartOptions, 50)

    get path() {
		return `optimizationResources`;
	}

    sendUpdate = _.debounce(() => {
		this.props.io.sendOptimizationInputsUpdate({
			optimizationResources: {
				awsInstances: {
					awsInstanceSize: this.awsInstanceSize,
				},
				awsInstanceQuantity: this.awsInstanceQuantity
			}
		}).then(res => {
			if ('validationMessages' in res) {
				const {io : {optimizationInputs: {optimizationResources: {awsInstanceQuantity, awsInstances: {awsInstanceSize}}}}} = this.props;
				this.awsInstanceQuantity = awsInstanceQuantity;
				this.awsInstanceSize = awsInstanceSize;
				this.updateChart(awsInstanceSize, awsInstanceQuantity)
			}
		});
	}, 100);

    getAwsInstanceOption() {
		return this.props.io.getInputOptions().options[this.props.view.name];
	}

    getAwsInstanceSizeOptions() {
		let inputOption = this.getAwsInstanceOption();
		return getOption(getOption(inputOption.options, "awsInstances").options, "awsInstanceSize").options;
	}

    onChange(e, type) {
		if (type == "awsInstanceQuantity"){
			this.awsInstanceQuantity =  parseInt(e.target.value);
		}
		else if (type == "awsInstances.awsInstanceSize") {
			this.awsInstanceSize = e.value;
		}

		this.updateAll();
	}

    onValueChanged(value, type) {
		this.snapToClosest({y: _.clamp(value, 1, getOption(this.getAwsInstanceOption().options, "awsInstanceQuantity").maximum)});
	}

    render() {
		const {io, io : {optimizationInputs: {optimizationResources: {awsInstanceQuantity, awsInstances: {awsInstanceSize, awsInstanceClass}}}}} = this.props;
		const awsInstanceQuantityOption = getOption(this.getAwsInstanceOption().options, "awsInstanceQuantity");

		return <div className={css.root}>
				<div className={css.optimizationResources}>
					<div className={css.columns}>
						<div className={classNames(css.column, css.optimizers)}>
							<span className={css.titles}>{"Number of Optimizers"}</span>
							<Validator path={`${this.path}.awsInstanceQuantity`} validations={io.validations}>
								<ResizeableInput
									defaultValue={this.awsInstanceQuantity}
									minimum={awsInstanceQuantityOption.minimum}
									maximum={awsInstanceQuantityOption.maximum}
									inputType={awsInstanceQuantityOption.inputType}
									onChange={(value) => this.onValueChanged(value, "awsInstanceQuantity")}
								/>
							</Validator>
						</div>
						<div className={css.spacer}>
							<span/>
							<span className={css.multiply}>⬤</span>
						</div>
						<div className={classNames(css.column, css.vcpusPerOptimizer)}>
							<span className={css.titles}>
								<div>
									<span>vCPUs</span>
									<span className={css.spacer} style={{width: "90px", border: "1px white solid"}}></span>
									<span>Optimizer</span>
								</div>
							</span>
							<span className={css.dropdown}>
								<DropdownOptions validations={io.validations} path={this.path + ".awsInstanceSize"} items={mapToUIOptions(this.getAwsInstanceSizeOptions().filter(o => o.applicable))} selectedValue={this.awsInstanceSize} onChange={(item) => this.onChange(item, "awsInstances.awsInstanceSize")}/>
							</span>
						</div>
						<div className={css.spacer}>
							<span/>
							<span>=</span>
						</div>
						<div className={classNames(css.column, css.totalVcpus)}>
							<span className={css.titles}>{"Total vCPUs"}</span>
							<span>
								{this.awsInstanceSize * this.awsInstanceQuantity}
							</span>
						</div>
						<div className={css.spacer}>
							<span/>
							<span className={css.multiply}>⬤</span>
						</div>
						<div className={classNames(css.column)}>
							<span className={css.titles}>
								<div>
									<span>Price</span>
									<span className={css.spacer} style={{width: "90px", border: "1px white solid"}}></span>
									<span>vCPU-Hour</span>
								</div>
							</span>
							<span>
								{`$${this.prices[awsInstanceClass]}`}
							</span>
						</div>
						<div className={css.spacer}>
							<span/>
							<span>=</span>
						</div>
						<div className={classNames(css.column)}>
							<span className={css.titles}>
								<div>
									<span>Price</span>
									<span className={css.spacer} style={{width: "90px", border: "1px white solid"}}></span>
									<span>Hour</span>
								</div>
							</span>
							<span>
								{`$${(this.awsInstanceSize * this.awsInstanceQuantity * this.prices[awsInstanceClass]).toFixed(3)}`}
							</span>
						</div>
					</div>
					<div style={{width: "600px", height: "100%"}} ref={c => this.chartDiv = c} className={css.chart}>
					</div>
				</div>
		</div>
	}
}

function mapToUIOptions(options) {
	return options.map(o => ({...o, value: o.name, label: o.title}));
}