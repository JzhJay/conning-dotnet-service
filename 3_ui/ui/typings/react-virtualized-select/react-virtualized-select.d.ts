// Type definitions for react-virtualized-select 4.4.1
// Project: https://github.com/bvaughn/react-virtualized-select
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../react-select/react-select.d.ts" />
interface VirtualizedSelectProps<T> extends __ReactSelect.ReactAsyncSelectProps<T> {
    onChange: (value : T) => void;
    value: any;
    maxHeight?: number;
    placeholder?: string;
    optionHeight?: number;
}


interface VirtualizedSelectClass extends React.ComponentClass<VirtualizedSelectProps>{}
declare var VirtualizedSelect: VirtualizedSelectClass;


declare module "react-virtualized-select" {
    export default VirtualizedSelect;
}
