import { HotkeyConfig } from "@blueprintjs/core";
import { RegionCardinality } from "./regions";
import type { TableHotkeys } from "./tableHotkeys";
import { TableProps } from "./tableProps";
export declare function isSelectionModeEnabled(props: TableProps, selectionMode: RegionCardinality, selectionModes?: RegionCardinality[]): boolean;
export declare function getHotkeysFromProps(props: TableProps, hotkeysImpl: TableHotkeys): HotkeyConfig[];
