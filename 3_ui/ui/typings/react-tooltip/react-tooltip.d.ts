// Type definitions for react-treebeard v0.9.10
// Project: https://github.com/wwayne/react-tooltip
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace __ReactTooltip {
    interface TooltipProps {
        id?: string;
        type?: 'error' | 'warning' | 'success' | 'info' | 'dark' | 'light';
        effect?: 'float' | 'solid';
        place?: 'top' | 'left' | 'right' | 'bottom'
	    getContent?: () => React.ReactNode;
        multiline?: boolean;
        disable?: boolean;

    }

    interface TooltipClass extends React.ComponentClass<TooltipProps> {

    }
}

declare const ReactTooltip : __ReactTooltip.TooltipClass


declare module "react-tooltip" {
    export = ReactTooltip;
}
