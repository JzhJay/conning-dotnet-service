// Type definitions for react-component-resizable
// Project: https://github.com/react-component-resizable
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module __ReactComponentResizable {
    interface ResizableClassProps extends React.Props<ResizableClass>  {
        onResize: Function;
        triggersClass?: string;
        expandClass?: string;
        contractClass?: string;
        embedCss?: string;
    }

    interface ResizableClass extends React.ComponentClass<ResizableClassProps> {

    }
}

declare var Resizable : __ReactComponentResizable.ResizableClass

declare module "react-component-resizable" {
    export = Resizable;
}



