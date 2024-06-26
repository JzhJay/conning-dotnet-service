import * as css from './AccordionComponent.css';

import {api, appIcons, i18n} from 'stores';
import { Accordion } from 'stores/query';
import { AccordionToolbarButtons } from '../AccordionToolbarButtons'
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import {Checkbox, Tooltip, Position} from '@blueprintjs/core';

interface MyProps {
	accordion: Accordion;
	// renderExtraAccordionHeaderContent?: (clause: VariableClause) =>  React.ReactNode[] | React.ReactNode;
	onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
	onHeaderClick?: React.MouseEventHandler<HTMLDivElement>;
	headerCheckboxClicked?: () => void;
	allowExpandCollapse?: boolean;
}

@observer
export class AccordionHeader extends React.Component<MyProps, {}> {
    headerTextRef = null
    checkAllRef = null

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { extraLabel, props: { accordion, onContextMenu, accordion: { expanded, panel }, allowExpandCollapse } } = this;
		const { axis: { label, description }, unavailable, areNoAvailableValuesSelected, areAllAvailableSelected, indeterminate } = accordion;

		return (<div className={classNames(css.accordionToolbar)}
		             onContextMenu={onContextMenu}
		             role="tab">
			<Checkbox className={classNames('check-all')}
			          ref={(o) => {
				          this.checkAllRef = o
			          }}
			          indeterminate={indeterminate}
			          checked={(areAllAvailableSelected || unavailable) && !areNoAvailableValuesSelected}
			          onChange={this.props.headerCheckboxClicked}
			          disabled={unavailable}
			          title={`${indeterminate && areAllAvailableSelected ? `Select All Coordinates in ${label}` : `Unselect All Coordinates in ${label}`}`}
			/>

			<Tooltip
				content={description}
				position={Position.BOTTOM_RIGHT}
				hoverOpenDelay={500}
				className={css.headerTextTooltip}>
				<div ref={(o) => {
					if (o)
						this.headerTextRef = o
				}} className={classNames(css.headerText, { [css.noExtraLabel]: !extraLabel, [css.preventClick]: !allowExpandCollapse })}
				     onClick={this.props.onHeaderClick}
				     onDoubleClick={allowExpandCollapse ? accordion.toggleExpandCollapse : () => {}}>
					{/* <Highlighter searchWords={searchText ? [searchText] : []} textToHighlight={label} /> {extraLabel}*/}
					{label} {extraLabel}
				</div>
			</Tooltip>
			{allowExpandCollapse && <AccordionToolbarButtons model={accordion}/>}
		</div>);
	}

    get displayName() {
		return `AccordionHeader - ${this.props.accordion.axis.label}`;
	}

    @computed
	get extraLabel() {
		const minimumExtraLabelLength = 30;
		const { accordion } = this.props;

		let result: string;
		if (accordion.availableAndSelected === 1) {
			const value = _.find(accordion.values, v => v.available && v.selected);

			if (!value) {
				return '';
				// debugger;
				// throw new Error(`Unable to find any available selectable values`)
			}
			result = `= ${value.label}`;
		}
		else if (accordion.availableAndSelected !== accordion.available) {
			result = `(${i18n.intl.formatMessage({
				defaultMessage: `{count} of {total}`,
				description: "[AccordionPanelToolbarTitle] a panel tool title - display how many item selected"
			}, {count: accordion.availableAndSelected, total: accordion.available})})`
		}
		else {
			result = '';
		}

		return result;
	}
}
