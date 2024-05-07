import { observer } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {i18n} from 'stores';

import AxisCategory from './AxisCategory';
import { bp, LoadingIndicator } from 'components';
import { RWRecalibration } from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

import * as css from "./AxisOrganizer.css";

interface MyProps {
	recalibration: RWRecalibration;
}

@observer
export class AxisOrganizer extends React.Component<MyProps, {}> {
	static get DIALOG_TITLE(){ return i18n.intl.formatMessage({defaultMessage: "Axis Organizer", description: "[AxisOrganizer] dialog title"}); };
	static DIALOG_ICON: bp.IconName = "control";

	constructor(props) {
		super(props);

		if (!props.recalibration.axisOrganization) {
			props.recalibration.getAxisOrganization();
		}
	}

	render() {
		const { recalibration, recalibration: { axisOrganization } } = this.props;
		const isLoadingComplete = !!axisOrganization;

		return <div className={css.popoverContainer}>
			{ isLoadingComplete &&
			<DndProvider backend={HTML5Backend}>
				<div className={css.popoverContentPanel}>
					<AxisCategory recalibration={recalibration} category="tree" title={i18n.intl.formatMessage({defaultMessage: "Tree Hierarchy", description: "[AxisOrganizer] axis organization group title"})}
					              isSortable={true} axisValues={axisOrganization.treeHierarchy} />
					<AxisCategory recalibration={recalibration} category="table" title={i18n.intl.formatMessage({defaultMessage: "Available Axes", description: "[AxisOrganizer] axis organization group title"})}
					              isSortable={true} axisValues={axisOrganization.tableColumns} />
				</div>
				<div className={css.separator} />
				<div className={css.popoverContentPanel}>
					<AxisCategory recalibration={recalibration} category="separate_always" title={i18n.intl.formatMessage({defaultMessage: "Always Separate Tables", description: "[AxisOrganizer] axis organization group title"})}
					              isSortable={false} axisValues={axisOrganization.separateAlways} />
					<AxisCategory recalibration={recalibration} category="separate_by_default" title={i18n.intl.formatMessage({defaultMessage: "Separate Tables by Default", description: "[AxisOrganizer] axis organization group title"})}
					              isSortable={false} axisValues={axisOrganization.separateByDefault} />
					<AxisCategory recalibration={recalibration} category="combine_by_default" title={i18n.intl.formatMessage({defaultMessage: "Same Table by Default", description: "[AxisOrganizer] axis organization group title"})}
					              isSortable={false} axisValues={axisOrganization.combineByDefault} />
					<AxisCategory recalibration={recalibration} category="combine_always" title={i18n.intl.formatMessage({defaultMessage: "Always Same Table", description: "[AxisOrganizer] axis organization group title"})}
					              isSortable={false} axisValues={axisOrganization.combineAlways} />
				</div>
			</DndProvider>
			}
			<LoadingIndicator active={!isLoadingComplete} />
		</div>
	}
}