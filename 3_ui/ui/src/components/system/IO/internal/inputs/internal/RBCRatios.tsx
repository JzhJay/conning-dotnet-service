import {IO, IOPage, IOView} from 'stores/io';
import {Option} from 'components/system/inputSpecification/InputSpecification';
import {ResizeableInput, Validator} from 'components/system/inputSpecification/internal/CommonInputs';
import {findOption} from '../utility'
import * as css from './RBCRatios.css';
import {HTMLTable, Navbar} from '@blueprintjs/core';
import { action, computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react'
import * as React from 'react';
import InlineSVG from 'svg-inline-react';

interface MyProps {
	io: IO;
	page: IOPage;
	view: IOView;
	verboseMode: boolean;
	control: Option;
}

@observer
export class RBCRatios extends React.Component<MyProps, {}> {
    colors = {minimum: "193, 23, 23", target: "11, 172,88", maximum: "0, 112, 192"};
    chartDiv: Element;
    chart;
    @observable minimum = .5;
    @observable target = .667;
    @observable maximum = .9;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
		const {ratios} = this.props.io.optimizationInputs.surplusManagement;

		if (ratios) {
			this.minimum = ratios.minimum.excessSurplusShare;
			this.target = ratios.target.excessSurplusShare;
			this.maximum = ratios.maximum.excessSurplusShare;
		}

		if (this.props.verboseMode) {
			const rect            = this.chartDiv.getBoundingClientRect();
			const x2TickPositions = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 2.5, 3, 4, 5, 10, 20].map(this.X2ToX1).concat([1]);

			const tickMarks = () => {
				let ticks      = [];
				const longTick = .15;

				// Primary axis tick marks
				for (let n = 0; n <= 100; n++) {
					const i = n * .01;
					ticks.push({x: i, low: .3, high: .3 + longTick * (n % 10 == 0 ? 1 : n % 5 == 0 ? 2 / 3 : 1 / 3), dragDrop: {draggableX: false}});
				}

				// Secondary axis tick marks
				for (let n = 10; n <= 500; n++) {
					const i   = n * .1;
					let scale = n == 10 || n % 100 == 0 ? 1 : n % 10 == 0 && n < 100 ? 3 / 4 : n % 5 == 0 && n < 50 ? 2 / 4 : n < 30 ? 1 / 4 : 0;

					scale != 0 && ticks.push({x: n == 500 ? 1 : this.X2ToX1(i), low: .7 - longTick * scale, high: .7, dragDrop: {draggableX: false}});
				}

				return {xAxis:   0,
					name:        "minRange",
					type:        'columnrange',
					fillColor:   `black`,
					color:       "black",
					borderColor: "black",
					pointWidth:  2,
					borderWidth: 0,
					data:        ticks,
					marker:      {enabled: false},
					zIndex:      -1
				}
			}

			const data = {
				chart:       {
					renderTo:      this.chartDiv,
					events:        {
						redraw: (events) => {
							this.redraw();
						}
					},
					marginLeft:    0,
					marginRight:   0,
					marginTop:     0,
					marginBottom:  0,
					spacing:       [0, 0, 0, 0],
					spacingBottom: 0
				},
				boost:       {
					enabled: false
				},
				plotOptions: {
					series: {
						stickyTracking: false,
						dragDrop:       {
							draggableX: true,
							dragMinX:   0,
							dragMaxX:   1,
							groupBy:    'groupId'
						},
						boostThreshold: 0,
						point:          {
							events: {
								drag: (e) => {
									const {chart}  = this;
									const newValue = (_.values(e.newPoints)[0] as any).newValues.x;
									//console.log("dragging")

									newValue != null && this.updateAll(e.target.series.name, newValue);
								},
								drop: (e) => {
								}
							}
						},
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
						max:            1,
						tickWidth:      0,
						minorTickWidth: 0,
						gridLineWidth:  0,
						lineWidth:      1,
						lineColor:      "black",
						labels:         {
							y:     11,
							style: {
								fontSize: "12px"
							}
						}
					}, {
						min:            0,
						max:            1,
						opposite:       true,
						tickWidth:      0,
						minorTickWidth: 0,
						gridLineWidth:  0,
						lineWidth:      2,
						lineColor:      "black",
						labels:         {
							formatter: (v) => {
								return v.value == 1 ? `<span style="font-size: 14px">∞</span>` : this.X1ToX2(v.value).toFixed(1);
							},
							y:         -2,
							style:     {
								fontSize: "12px"
							}
						},
						tickPositions:  x2TickPositions,
					}
				],
				yAxis:       {
					min:           0,
					max:           1,
					visible:       false,
					gridLineWidth: 0
				},
				series:      [
					{xAxis:        0,
						name:      "minRange",
						type:      'arearange',
						fillColor: `rgba(${this.colors["minimum"]}, .2)`,
						data:      [{x: 0, low: .3, high: .7, dragDrop: {draggableX: false}}, {x: this.minimum, low: .3, high: .7, dragDrop: {draggableX: false}}],
						marker:    {enabled: false}
					},
					{xAxis:        0,
						name:      "maxRange",
						type:      'arearange',
						fillColor: `rgba(${this.colors["maximum"]}, .2)`,
						data:      [{x: this.maximum, low: .3, high: .7, dragDrop: {draggableX: false}}, {x: 1, low: .3, high: .7, dragDrop: {draggableX: false}}],
						marker:    {enabled: false}
					},
					...["minimum", "target", "maximum"].map((type, i) => {
						const startX   = [.15, .5, .85][i];
						const currentX = this[type];
						const color    = `rgb(${this.colors[type]})`;

						return {
							xAxis: 0, name: type, type: "line", lineColor: color, data: [
								{x: startX, y: 1, dragDrop: {draggableX: false}},
								{x: startX, y: .9, dragDrop: {draggableX: false}},
								{x: currentX, y: .8, groupId: type},
								{x: currentX, y: .5, groupId: type, marker: {enabled: true, fillColor: color, symbol: "diamond", radius: 10}},
								{x: currentX, y: .2, groupId: type},
								{x: startX, y: .1, dragDrop: {draggableX: false}},
								{x: startX, y: 0, dragDrop: {draggableX: false}}
							]
						}
					}),
					tickMarks(),
					{xAxis: 1, data: [[0, 0]], visible: false}
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
			this.redraw();
		}
	}

    redraw() {
		let newOffset = - this.chart.plotHeight * .3;

		if (this.chart.xAxis[0].userOptions.offset != newOffset) {
			this.chart.xAxis[0].update({offset: newOffset});
			this.chart.xAxis[1].update({offset: newOffset});
			this.forceUpdate();
		}
	}

    @action updateAll(type: "minimum" | "maximum" | "target", value: number, animate: boolean = false) {
		if (type == "minimum") {
			this.chart && this.chart.series[0].points[1].update({x: value}, true, animate);
			this.minimum = value;

			if (value > this.target)
				this.updateAll("target", value, true);
		}
		else if (type == "maximum") {
			this.chart && this.chart.series[1].points[0].update({x: value}, true, animate);
			this.maximum = value;

			if (value < this.target)
				this.updateAll("target", value, true);
		}
		else if (type == "target") {
			this.target = value;

			if (value > this.maximum)
				this.updateAll("maximum", value, true);

			if (value < this.minimum)
				this.updateAll("minimum", value, true);
		}

		this.chart && this.chart.series.find(s => s.name == type).points.slice(2, 5).forEach(p => p.update({x: this[type]}, true, animate));
		this.sendUpdate();
	}

    sendUpdate = _.debounce(() => {
		this.props.io.sendOptimizationInputsUpdate({
			surplusManagement: {
				ratios: {
					minimum: {excessSurplusShare: this.minimum},
					target: {excessSurplusShare: this.target},
					maximum: {excessSurplusShare: this.maximum}
				}
			}
		});
	}, 1000);


    X2ToX1 = (v) => {
		return v == 1 ? 0 : (v - 1) / v;
	}

    X1ToX2 = (v) => {
		return 1 / (1 - v);
	}

    get minimumSeries() {
		return this.chart.series[1];
	}

    @observable activeInput = {}
    onValueChanged(e, type, isPrimary) {
		this.activeInput[type + isPrimary] = e.target.value;
	}

    onBlur(value, type, isPrimary) {
		//this.activeInput[type + isPrimary] = null;
		//const parsedValue = e.target.value == null || e.target.value == "" ? e.target.value :  parseFloat(e.target.value);
		this[type] = _.clamp(isPrimary ? value : this.X2ToX1(value), 0, 1);

		this.updateAll(type, this[type], true);
	}

    onKeyPress = (e, type, isPrimary) => {
		if (e.key === 'Enter') {
			this.onBlur(e, type, isPrimary)
		}
	}

    displayValue = (type, isPrimary) => this.activeInput[type + isPrimary] != null ? this.activeInput[type + false] : (isPrimary ? this[type] : this.X1ToX2(this[type])).toFixed(2).toString();

    render() {
		const {verboseMode, control} = this.props;

		const renderInput = (isPrimary, type, color) => {
			const option = findOption(control, [type, isPrimary ? "excessSurplusShare" : "surplusToRbc"]);
			return <Validator validations={this.props.io.validations} path={`surplusManagement.surplusRBC.${type}`}>
				<ResizeableInput
					className={css.extremeInput}
				    defaultValue={this.displayValue(type, isPrimary)}
					inputType={option.inputType}
					minimum={option.minimum}
					maximum={option.maximum}
					animateChanges={false}
					style={{borderColor: color}}
					onChange={(e) => this.onBlur(e, type, isPrimary)}/>
			</Validator>
		}

		return <div className={css.root} style={{height: verboseMode ? "350px" : null}}>
			{verboseMode == true ?
			 <>
				<div className={css.formulas}>
					<div>
						<span>Surplus</span>
						<span className={css.spacer} style={{width: "90px"}}></span>
						<span>RBC</span>
					</div>
					<div>
						<span>Surplus - RBC</span>
						<span className={css.spacer} style={{width: "140px"}}></span>
						<span>Surplus</span>
					</div>
				</div>
				<div className={css.rightPane}>
					<div style={{width: "600px", height: "100%"}} ref={c => this.chartDiv = c} className={css.chart}/>

					{this.chart && [{type: "minimum", title: "Minimum", series: this.chart.series[2]}, {type: "target", title: "Target", series: this.chart.series[3]}, {type: "maximum", title: "Maximum", series: this.chart.series[4]}].map(({type, title, series}) => {
						const color = `rgb(${this.colors[type]})`;
						return <React.Fragment key={type}>
							<div style={{top: this.chart.plotTop + series.points[0].plotY - 70, left: this.chart.plotLeft + series.points[0].plotX - 95 }}>
								<div style={{backgroundColor: color}}> <span>{title}</span> </div>
								{renderInput(false, type, color)}
							</div>
							<div style={{top: this.chart.plotTop + series.points.slice(-1)[0].plotY, left: this.chart.plotLeft + series.points.slice(-1)[0].plotX - 95 }}>
								{renderInput(true, type, color)}
							</div>
						</React.Fragment>})}
				</div>
			</> :
			<>
				 <div className={css.column}>
					 <div></div>
					 <div className={css.compactFormula}>Surplus / RBC: </div>
					 <div className={css.compactFormula}>(Surplus - RBC) / RBC: </div>
				 </div>
				 {[{type: "minimum", title: "Minimum"}, {type: "target", title: "Target"}, {type: "maximum", title: "Maximum"}].map(({type, title}) => {
					 const color = `rgb(${this.colors[type]})`;
					 return <div className={css.column} key={type}>
						 <div style={{backgroundColor: color}} className={css.extremeLabel}> <span>{title}</span> </div>
						 <div>{renderInput(false, type, color)}</div>
						 <div>{renderInput(true, type, color)}</div>
					 </div>})}
			</>}
		</div>
	}
}