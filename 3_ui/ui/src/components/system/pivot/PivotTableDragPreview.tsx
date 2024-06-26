import {AppIcon} from "components";
import {api, utility} from 'stores';
import { QueryResult } from 'stores/queryResult';
import { observer } from 'mobx-react'
import { computed } from 'mobx'
import { appIcons } from "../../../stores/site/iconography/icons";
import { viewDescriptors } from "../../../stores/report/constants";

interface MyProps {
    name?: string;
    queryResult?: QueryResult;
}

@observer
export class PivotTableDragPreview extends React.Component<MyProps, {}> {
    render() {
        const {queryResult: {pivotMetadata}, name} = this.props;
        

        const rowAxes    = pivotMetadata ? pivotMetadata.rowAxes.map(a => pivotMetadata.axes[a]) : [];
        const columnAxes = pivotMetadata ? pivotMetadata.columnAxes.map(a => pivotMetadata.axes[a]) : [];
        // style={{maxWidth:350, maxHeight:200}}>
        return (
            <div key="drag-summary" className={classNames("ui card")}>
                <div className="content">
                    <div className="center aligned header">
	                    <AppIcon icon={appIcons.queryTool.views.pivot}/>
                        {name}
                    </div>
                </div>

                <div className="content">
                    <span className="ui header center aligned">Size</span>
                    <div className="ui center aligned attached list">
                         <div className="item">
                             {pivotMetadata != null ? `${utility.numberWithCommas(pivotMetadata.rows)} x ${utility.numberWithCommas(pivotMetadata.columns)} Cells` : '---'}
                         </div>
                    </div>
                </div>
                <div className="content">
                    <span className="ui header center aligned">Arrangement</span>

                    <div className="ui two column centered grid">
                        <div className="center aligned column">
                            <span className="ui sub header">Rows</span>
                            <div className="ui list">
                                {rowAxes.map((a,index) => <div key={index} className="item">{a.groupName.label}</div>)}
                            </div>
                        </div>
                        <div className="center aligned column">
                            <span className="ui sub header">Columns</span>
                            <div className="ui attached list">
                                {columnAxes.map((a, index) => <div key={index} className="item">{a.groupName.label}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <span className="ui header center aligned">Available Views</span>
                    <div className="center aligned">
                        {pivotMetadata.availableViews.map(available => available.name).join(', ')}
                    </div>
                </div>
            </div>)
    }
}
