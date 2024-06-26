import { api} from 'stores'
import {AppIcon, HighchartsComponent} from 'components';

import type {ChartType, ChartUserOptions, PivotMetadata, ChartDescriptors, ChartData} from 'stores';
import {ReportQuery} from 'stores';
import {observer} from 'mobx-react';

export interface MyProps {
    view:ReportQuery;
    chartType: ChartType;
    chartData:ChartData;
    userOptions?:ChartUserOptions;
    pivotMetadata?:PivotMetadata;
}

@observer
export class HighchartsComponentDragPreview extends React.Component<MyProps, {}> {
    render() {
    	const {view, pivotMetadata,  ...props} = this.props;
        return (<div key="drag-summary" className={classNames("ui card")}>
            <div className="content">
                <div className="center aligned header icon">
                    <AppIcon icon={api.queryResultStore.charting.descriptors[props.chartType].icon}/>
                    {this.props.view.name}
                </div>
            </div>
            { /* Breaks rendering for other chart - forces recalulation - how can we retrieve an image instead? */ }
            <HighchartsComponent style={{flexGrow:1}} className="content" {...props} inlineToolbar={false} />
        </div>)
    }
}
