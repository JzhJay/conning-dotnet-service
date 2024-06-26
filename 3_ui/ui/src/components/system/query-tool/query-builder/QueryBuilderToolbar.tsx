import {ButtonGroup, NavbarDivider} from '@blueprintjs/core';
import {bp, SimulationCard, QueryPropertiesDialog, SmartCard, sem} from 'components'
import {api, GetSimulationQuery, julia, Query, QueryDescriptor, site, xhr} from 'stores';
import {omdb} from '../../../../stores';
import {appIcons} from "../../../../stores/site/iconography/icons";
import {downloadFile} from '../../../../utility';
import {AppIcon} from "../../../widgets/AppIcon";
import {IconButton} from "../../../blueprintjs/IconButton";
import {observer} from "mobx-react";

interface MyProps {
	query: Query | QueryDescriptor;
}

@observer
export class SingularAxisCoordinates extends React.Component<MyProps, {}> {

	render() {
		const {query} = this.props;

		const hasCoords = query && query.queryResult && query.queryResult.descriptor.singularAxisCoordinate;
		return <bp.Popover
			position={bp.Position.BOTTOM}
			transitionDuration={1}
			interactionKind={bp.PopoverInteractionKind.HOVER}
			content={
				hasCoords ? <SmartCard style={{minWidth: 0}} model={_.reduce(query.queryResult.descriptor.singularAxisCoordinate, (r, v) => {r[v.axis] = v.coordinate; return r}, {})}
				                       showHeader={false}
				                       title="Common Coordinates"
				                       isTooltip
				                       sections={[
					                       {
						                       tags: _.map(query.queryResult.descriptor.singularAxisCoordinate, (o) => o.axis).filter(f => f != 'Simulation').sort().map(k => ({name: k}))
					                       }
				                       ]}/>
				          : <div className={classNames(bp.Classes.TOOLTIP)}>
					<div className={bp.Classes.POPOVER_CONTENT}>
						<span>Common Coordinates</span>
					</div>
				</div>}>
			<bp.Button className={classNames(bp.Classes.MINIMAL, bp.Classes.BUTTON)} disabled={!hasCoords} >
				<AppIcon icon={appIcons.queryTool.queryBuilder.singularAxes} style={{height:14, width: 14}}/>
			</bp.Button>
		</bp.Popover>
	}
}
