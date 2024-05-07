// Type definitions for react-split-pane 2.x
// Project: https://github.com/tomkp/react-split-pane
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module __ReactSplitPane {
    interface SplitPaneProps {
        split?: "horizontal" | "vertical";
        minSize?: number;
        defaultSize?: number;
    }

    interface SplitPaneClass extends React.ComponentClass<SplitPaneProps>{}   
}

declare var SplitPane : __ReactSplitPane.SplitPaneClass;

declare module "react-split-pane" {
    export = SplitPane;
}
