import * as React from "react";
import { Props } from "@blueprintjs/core";
import { QuadrantType } from "../quadrants/tableQuadrant";
import { Region } from "../regions";
export declare type RegionStyler = (region: Region, quadrantType?: QuadrantType) => React.CSSProperties;
export interface RegionLayerProps extends Props {
    /**
     * The array of regions to render.
     */
    regions?: Region[];
    /**
     * The array of CSS styles to apply to each region. The ith style object in this array will be
     * applied to the ith region in `regions`.
     */
    regionStyles?: React.CSSProperties[];
}
export declare class RegionLayer extends React.Component<RegionLayerProps> {
    shouldComponentUpdate(nextProps: RegionLayerProps): boolean;
    render(): JSX.Element;
    private renderRegionChildren;
    private renderRegion;
}
