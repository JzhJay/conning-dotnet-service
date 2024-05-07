export {Checkbox} from '@blueprintjs/core';

export const ReactSelect = require('react-select') as ReactSelect.ReactSelectAsyncClass;

export enum AnimationSpeed {
    Off    = 0,
    Slow   = 1,
    Medium = 2,
    Fast   = 3
}

const sliderMarks = ['off', 'slow', 'medium', 'fast'];

export const animationSliderHelpers = {
    speedToMs: function (speed: AnimationSpeed, modifier = 1) {
        switch (speed) {
            case AnimationSpeed.Off:
                return 0;
            case AnimationSpeed.Slow:
                return 600 * modifier;
            case AnimationSpeed.Medium:
                return 400 * modifier;
            case AnimationSpeed.Fast:
                return 200 * modifier;
        }
    },

    msToSpeed: function (ms: number | undefined, modifier = 1) {
        if (ms === 0 || ms == null)  return AnimationSpeed.Off
        else if (ms <= 200 * modifier) return AnimationSpeed.Fast
        else if (ms <= 400 * modifier) return AnimationSpeed.Medium
        else return AnimationSpeed.Slow
    },

    sliderProps: {
        min:   0,
	    max: sliderMarks.length - 1,
	    renderLabel: (index:number) => sliderMarks[index]
    }
};
