// Type definitions for rc-slider
// Project: https://github.com/react-component/slider
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare namespace  __ReactSlider {
	export interface ReactSliderProps {
		min?: number;
		max?: number;
		step?: number;
		range?: boolean | number;
		allowCross?: boolean;
		pushable?: number | boolean;
		vertical?: boolean;
		defaultValue?: number | number[];
		value?: number | number[];
		handle?: React.ReactChild;
		included?: boolean;
		disabled?: boolean;
		tipTransitionName?: string;
		tipFormatter?: Function;
		dots?: boolean;
		onChange?: Function;
		onAfterChange?: Function;
		marks?: {[mark: number]: string}
	}

	export const ReactSlider: React.ComponentClass<ReactSliderProps>
}

declare module "rc-slider" {
	export = __ReactSlider.ReactSlider;
}



