import { autorun, computed, reaction, IReactionDisposer, makeObservable } from 'mobx';
const css = require('./AccordionPanelToolbar.css') as any;

import {IndeterminateCheckbox, AppIcon} from 'components';
import {api, appIcons, i18n} from 'stores';
import {AccordionPanel, Accordion} from 'stores/query';
import {Checkbox} from '@blueprintjs/core'
import {AccordionToolbarButtons} from '../AccordionToolbarButtons'
import {observer} from 'mobx-react'
import {ContextMenuTarget, Menu, MenuItem, MenuDivider} from '@blueprintjs/core';

interface MyProps {
	panel: AccordionPanel;
	impliedAxes?: Array<Accordion>;
	isAxisCheckAllIndeterminate?: boolean;
	checkAllTitle?: string;
	indeterminate?: boolean;
	deleteTitle?: string;
	onDelete?: (panel: AccordionPanel) => void;
	onAccordionPanelTitle?: (panel: AccordionPanel) => React.ReactNode;
}

@observer
export class AccordionPanelToolbar extends React.Component<MyProps, {}> {
    static defaultProps = {
		showAccordionButtons: true,
		deleteTitle:          i18n.common.OBJECT_CTRL.DELETE
	}

    _disposers: IReactionDisposer[] = [];

	constructor(props) {
		super(props);

        makeObservable(this);

		this._disposers.push(
			autorun(() => {
				// Animate the text change to make it less abrupt
				const {title} = this;
				$(this.titleElement).fadeOut(api.utility.animation.medium, () => this.titleElement.innerText = title).fadeIn(api.utility.animation.medium);
			}, {name: `Update panel title when selection changes`})
		);
    }

    renderContextMenu() {
		const {props: {panel: {query}}} = this;
		return (
			<Menu>
				<MenuItem text="Reset Query" icon="step-backward" onClick={() => query.reset()}/>
			</Menu>
		);
	}

    @computed get title() {
		const {panel, panel: {part, query, selected}} = this.props;

		switch (part) {
			case 'scenarios': {
				return query._variables.scenarios.panelTitle;
			}

			case 'time-steps': {
				return query._variables.timesteps.panelTitle;
			}

			case 'variables': {
				return i18n.intl.formatMessage({
					defaultMessage: `{count} of {total}`,
					description: "[AccordionPanelToolbarTitle] a panel tool title - display how many item selected"
				}, {count: selected.toString(), total: query._variables.total});
			}

			default: {
				return `${part} NYI`;
			}
		}
	}

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

    render() {
		const {panel, checkAllTitle, deleteTitle, ...props} = this.props;

		return (
			<div className={classNames(css.root,
				{[css.noAccordionButtons]: panel.accordions.length === 1 && panel.accordions[0].axis.label === ''})}
			     role="toolbar">

				<Checkbox className={css.checkAll}
				                       checked={panel.areAllChecked}
				                       onChange={panel.checkAll}
				                       disabled={panel.areAllChecked}
				                       indeterminate={panel.areSomeButNotAllSelected}/>

				<label ref={r => this.titleElement = r} className={css.title} title={checkAllTitle}/>

				<AccordionToolbarButtons {...props} model={panel}/>
			</div>);
	}

    /** We manage the inner text ourselves to handle fading.
	 *  TODO - investigate using keyframes instead to play a CSS animation
	 **/
    titleElement: HTMLLabelElement;

    componentDidMount() {
		this.titleElement.innerText = this.title;
	}
}
