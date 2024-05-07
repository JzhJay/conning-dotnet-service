import { action, computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {utility} from '../../../../../../../stores';
import {AssetClassInput} from '../AssetClassInput';
import {SketchPicker} from 'react-color';

const {KeyCode} = utility;

@observer
export class ColorPicker extends React.Component<{assetClassInput: AssetClassInput}, {}> {
    static DEFAULT_COLORS = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF'];
    static MAX_CUSTOM_COLORS = 8;

    @observable customColors = [];

    constructor(props: {assetClassInput: AssetClassInput}) {
        super(props);
        makeObservable(this);
    }

    @computed get presetColors() {
		return [
			...this.customColors,
			...ColorPicker.DEFAULT_COLORS
		];
	}

    componentDidMount() {
		// Re-render on scroll to keep picker position in-sync with cell
		this.props.assetClassInput.grid.scrollPositionChanged.addHandler(this.scrollPositionChanged);
		document.addEventListener("keyup", this.documentKeyUp, false);
	}

    render() {
		const {assetClassInput} = this.props;
		let colorCellRect = null;

		if (assetClassInput.colorSelectionRow != null) {
			colorCellRect = assetClassInput.grid.cells.getCellBoundingRect(assetClassInput.colorSelectionRow, 3);
			const gridRect = assetClassInput.grid.hostElement.getBoundingClientRect();
			colorCellRect.top = Math.min(colorCellRect.top - gridRect.top, Math.max(gridRect.height - 300, 0));
		}

		return colorCellRect && <div style={{position: "absolute", top: colorCellRect.top, left: colorCellRect.right, zIndex: 10}}>
			<SketchPicker color={assetClassInput.pickerColor} onChange={this.onColorChange} presetColors={this.presetColors} disableAlpha={true}/>
		</div>;
	}

    componentWillUnmount() {
		const {grid} = this.props.assetClassInput;
		grid && grid.scrollPositionChanged.removeHandler(this.scrollPositionChanged);
		document.removeEventListener("keyup", this.documentKeyUp, false);
	}

    scrollPositionChanged = () => {
		if (this.props.assetClassInput.colorSelectionRow)
			this.forceUpdate();
	}

    lastColorChangeTime = 0;
    @action onColorChange = (color, event) => {
		// the color might change very fast (when the user drag the point on the panel)
		// if the current time and last update time < 0.5s, renew the first custom color or push this color into first place.
		const currentTime = new Date().getTime();
		let colorAlreadyInQueue = _.some(this.presetColors, c => c && (c.toUpperCase() == color.hex.toUpperCase()) );
		if (!colorAlreadyInQueue) {
			let newQueue;
			if (currentTime - this.lastColorChangeTime < 500 ) {
				newQueue = [color.hex, ...this.customColors.slice(1,ColorPicker.MAX_CUSTOM_COLORS)];
			} else {
				newQueue = [color.hex, ...this.customColors].slice(0,ColorPicker.MAX_CUSTOM_COLORS);
			}
			this.customColors.splice(0, this.customColors.length, ...newQueue);
		}
		this.lastColorChangeTime = currentTime;
		this.props.assetClassInput.onColorChange(color, event);
	}

    @action private documentKeyUp = (e) => {
		if (e.keyCode === KeyCode.Escape && this.props.assetClassInput.colorSelectionRow) {
			this.props.assetClassInput.grid.select(-1, -1);
			this.props.assetClassInput.colorSelectionRow = null;
		}
	}
}