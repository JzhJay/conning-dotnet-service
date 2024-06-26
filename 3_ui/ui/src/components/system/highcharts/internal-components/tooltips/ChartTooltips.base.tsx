import {CSSProperties} from 'react';

export class ChartTooltipBox extends React.Component<{}, {}>{
	render() {
		return this.props.children;
	}
}

export class ChartTooltipTitle extends React.Component<{text?: string, style?: CSSProperties}, {}>{
	style: CSSProperties = Object.assign({
		textAnchor: "middle",
		textDecoration: "underline",
		fontStyle: "italic",
	}, this.props.style);

	render() {
		return <>
			<tspan style={this.style} dy={2}>{this.props.text != null ? this.props.text : this.props.children}</tspan>
			<br/>
		</>;
	}
}

export class ChartTooltipValueSet extends React.Component<{customFront?: any, label?: any, value: any, labelStyle?: CSSProperties, valueStyle?: CSSProperties, hiddenIfEmptyValue?: boolean}, {}>{
	titleStyle: CSSProperties = Object.assign({
		textAnchor: "start",
		fontWeight: 'bold'
	}, this.props.labelStyle);
	valueStyle: CSSProperties = Object.assign({
		textAnchor: "end",
	}, this.props.valueStyle);

	render() {
		if (this.props.hiddenIfEmptyValue !== false && !this.props.value ) {
			return null;
		}
		return <>
			{this.props.customFront}
			<tspan dy={2} style={this.titleStyle}>{this.props.label}</tspan>
			<tspan style={{color: "transparent"}}>&#9608;&#9608;</tspan>
			<tspan style={this.valueStyle}>{this.props.value}</tspan>
			<br/>
		</>

	}
}
