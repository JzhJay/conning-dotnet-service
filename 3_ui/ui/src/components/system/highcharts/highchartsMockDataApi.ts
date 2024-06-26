export interface AvailableMockCharts {
    [key: number]: Array<ChartDataDescriptor>;
}

export interface ChartDataDescriptor {
    id: number;
    description: string;
    guid?: string;
}
