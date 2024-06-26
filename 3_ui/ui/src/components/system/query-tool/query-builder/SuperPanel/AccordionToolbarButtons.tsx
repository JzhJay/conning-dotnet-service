import * as css from './AccordionToolbarButtons.css';

import { AppIcon, bp } from "components";
import {appIcons, i18n} from "stores";
import { observer } from 'mobx-react';
import type { IApplicationIcon } from 'stores';
import { api, settings } from 'stores';
import { AccordionPanel, Accordion } from 'stores/query';

interface MyProps {
	impliedAxes?: Array<Accordion>;
	model: AccordionPanel | Accordion;
	isEveryAccordionChecked?: boolean;
	isAxisCheckAllIndeterminate?: boolean;
	checkAllTitle?: string;
	indeterminate?: boolean;
	deleteTitle?: string;
	onDelete?: (panel: AccordionPanel) => void;
	onAccordionPanelTitle?: (panel: AccordionPanel) => React.ReactNode;
	verticalScrollbarWidth?: number;
}

@observer
export class AccordionToolbarButtons extends React.Component<MyProps, {}> {
	render() {
		const { model, impliedAxes, deleteTitle, children, onDelete } = this.props;

		let sortOrder: { icon: IApplicationIcon, title: string };
		switch (model.sortOrder) {
			case 'initial': {
				sortOrder = { icon: appIcons.sort.sortDefault, title: i18n.common.SELECTION.SORT_DEFAULT };
				break;
			}

			case 'asc'
			: {
				sortOrder = { icon: appIcons.sort.sortAsc, title: i18n.common.SELECTION.SORT_AZ };
				break;
			}

			case 'desc'
			: {
				sortOrder = { icon: appIcons.sort.sortDesc, title: i18n.common.SELECTION.SORT_ZA };
				break;
			}
		}

		const panel: AccordionPanel = model instanceof AccordionPanel ? model : null;
		const accordion: Accordion = model instanceof Accordion ? model : null;
		const allowExpandCollapse = !panel?.query.isVariablesPage;

		const { expertMode } = settings.query;

		return (
			<div className={classNames(css.toolbarButtons, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP, { [css.accordion]: accordion != null })} role="group">
				{model.showSortOrder && <AppIcon icon={appIcons.sort.sortDefault} title={sortOrder.title}
				                                 className="ui toggle button icon"
				                                 onClick={() => model.toggleSortOrder()}/>}

				{((panel && panel.accordions.length > 1) || (accordion && accordion.panel.accordions.length > 1)) && allowExpandCollapse && (<div>
					{accordion &&
					 <bp.Tooltip content={accordion.expanded
						 ? `${i18n.common.SELECTION.COLLAPSE} '${accordion.axis.label}'`
						: `${i18n.common.SELECTION.EXPAND} '${accordion.axis.label}'`}
					          className={classNames(css.expandCollapse, { [css.expanded]: accordion.expanded })}>
						<AppIcon onClick={() => accordion.toggleExpandCollapse()}
						         icon={appIcons.queryTool.queryBuilder.expandAllAxes}/>
					</bp.Tooltip>}

					{!accordion &&
					 <bp.Tooltip content={i18n.common.SELECTION.COLLAPSE_ALL} className={classNames(css.expandCollapse)}>
						 <AppIcon onClick={() => panel.collapse()}
						          disabled={_.every(panel.accordions, acc => !acc.expanded)}
						          icon={appIcons.queryTool.queryBuilder.collapseAllAxes}/>
					 </bp.Tooltip>}

					{!accordion &&
					 <bp.Tooltip content={i18n.common.SELECTION.EXPAND_ALL} className={classNames(css.expandCollapse)}>
						 <AppIcon onClick={() => panel.expand()}
						          disabled={_.every(panel.accordions, acc => acc.expanded)}
						          icon={appIcons.queryTool.queryBuilder.expandAllAxes}/>
					 </bp.Tooltip>}

			</div>).props.children}

				{children}

				{model.part === 'variables' && panel &&
				 <bp.Tooltip content={i18n.intl.formatMessage({defaultMessage: 'Remove this Clause', description: "[AccordionToolbarButtons] a add remove current clause button text"})}
				           className={classNames(css.deleteButton, { [css.visible]: panel.query._variables.hasMultipleVariableClauses })}>
					 <AppIcon onClick={() => onDelete(panel)}
					          icon={appIcons.queryTool.queryBuilder.deletePanel} title={deleteTitle}/>
				 </bp.Tooltip>}
			</div>
		);
	}
}
