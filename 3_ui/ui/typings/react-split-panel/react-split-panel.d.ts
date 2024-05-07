// Type definitions for react-split-panel 2.x
// Project: https://github.com/oheard/react-split-panel
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module ReactSplitPanel {
    interface SplitPanelProps {
        direction?: "horizontal" | "vertical";
        defaultWeights?: any;
    }

    interface SplitPanelClass extends React.ComponentClass<SplitPanelProps>{}
    export var SplitPanel: SplitPanelClass;
}

declare module "react-split-panel" {
    export = ReactSplitPanel;
}
