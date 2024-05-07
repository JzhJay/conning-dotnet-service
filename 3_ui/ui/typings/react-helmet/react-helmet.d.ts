// Type definitions for react-helmet v2.0.3
// Project: https://github.com/redux-simple-router
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module __ReactHelmet {
    interface ReactHelmetProps extends React.Props<ReactHelmetClass> {
        title?: string;
        meta?: string;
    }

    interface ReactHelmetClass extends React.ComponentClass<ReactHelmetProps> {
    }
}

declare var Helmet : __ReactHelmet.ReactHelmetClass;

declare module "react-helmet" {
    export {Helmet};
}

declare module __ReactCollapse {
	interface ReactCollapseProps extends React.Props<ReactCollapseClass> {
		isOpened: boolean;
		className?: string;
		springConfig?: any;
	}

	interface ReactCollapseClass extends React.ComponentClass<ReactCollapseProps> {
	}
}

declare var Collapse : __ReactCollapse.ReactCollapseClass;

declare module "react-collapse" {
	export = Collapse;
}

