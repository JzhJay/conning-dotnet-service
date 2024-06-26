import * as css from './SuperPanelComponent.css'
import { AccordionPanelComponent } from './AccordionPanel/index'
import { AppIcon, bp } from 'components';
import {api, appIcons, i18n} from 'stores/index';
import { QueryPart, Query, Accordion, AccordionPanel, AccordionValue } from 'stores/query';

const allowExpandCollapse = false;

import { observer } from 'mobx-react';
import { observable, action, computed, runInAction, makeObservable } from 'mobx';

const animateExpandCollapseMs = 1000;
const DEFAULT_PANEL_WIDTH = 275;

interface MyProps {
	query: Query;
	part?: QueryPart;
	panels?: AccordionPanel[];
	className?: string;
	title?: string;
	onAddPanel?: () => Promise<any>;
	onDeletePanel?: (panel: AccordionPanel) => Promise<any>;
	onAccordionPanelTitle?: (panel: AccordionPanel) => string;
}

@observer
export class SuperPanelComponent extends React.Component<MyProps, {}> {
    @observable isAddingPanel = false;
    @observable isDeletingPanel = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    get collapsed() {
		return this.props.part == 'variables' && this.props.query._variables.collapsed
	}

    get maxChildWidth() {
		const { $panels, node } = this;
		if (!$panels[0]) return 0;

		const maxChildWidth = _.max([..._.toArray($panels[0].children).map(c => c.clientWidth), node.clientWidth]);
		//console.log(`maxChildWidth: ${maxChildWidth}`);
		return maxChildWidth;
	}

    get panelsWidth() {
		const { collapsed, $panels, props: { panels } } = this;

		if ($panels) {
			const panelWidth = this.maxChildWidth
			return collapsed
				? panelWidth
				: panelWidth * panels.length;
		}
		else {
			return null;
		}
	}

    render() {
		const { query, className, title, onAddPanel, part } = this.props;
		const { collapsed, isAddingPanel, isDeletingPanel } = this;

		const panels = this.props.children ? null : this.props.panels;

		return (
			<div className={classNames(css.superPanel, className, {
				[css.collapsed]: collapsed,
				[css.layoutHorizontally]: query.isVariablesPage
			})}
			     data-part={part}>
				<div className={classNames(css.header, { [css.hasSuperPanelButtons]: onAddPanel != null })}>
					<div className={css.caption}>
						<span className={css.title}>{title}</span>
					</div>

					<div className={classNames(css.headerButtons, bp.Classes.MINIMAL, bp.Classes.BUTTON_GROUP)}>
						{allowExpandCollapse && onAddPanel &&
						 <bp.Tooltip content={`${collapsed ?
						                         i18n.common.SELECTION.EXPAND :
						                         i18n.common.SELECTION.COLLAPSE
						 }`}>
							 <button className={classNames(css.expandCollapse, "ui icon button", { [css.canCollapse]: panels != null && panels.length > 1 })}
							         onClick={this.onToggleCollapsed}>
								 <AppIcon icon={appIcons.queryTool.queryBuilder.collapseSuperPanel}/>
							 </button>
						 </bp.Tooltip>}

						{onAddPanel &&
						 <bp.Tooltip content={i18n.intl.formatMessage({defaultMessage: 'Add Variable Clause', description: "[SuperPanelComponent] a add new clause button text"})}>
							 <button className="ui icon button" onClick={this.onAddPanel}>
								 <AppIcon icon={appIcons.queryTool.queryBuilder.addPanel}
								          className={classNames({ spin: isAddingPanel || isDeletingPanel })}/>
							 </button>
						 </bp.Tooltip>}
					</div>
				</div>

				{/* {{from: {transform: 'scale(1, 1)', opacity: 1}, to: { transform: 'translateX(-100%) scale(0, 1)', opacity:.4}}} */}

				{this.props.children ? <div className={css.content}>{this.props.children}</div> : <div
					className={classNames(css.subPanels, "scrollable")}
					ref={r => this.$panels = $(ReactDOM.findDOMNode(r))}>
					{panels != null && panels.length !== 0
						? panels.map(panel =>
							             <AccordionPanelComponent
								             key={`panel-${panel.id.toString()}`}
								             tabIndex={panel.index}
								             onDelete={this.props.onDeletePanel ? this.onDeleteVariablePanel : null}
								             panel={panel}
							             />)
						: <div key="empty-panels">Empty Panels for {part}!!!</div>}
				</div>}

				{collapsed ? <div
					className={css.collapsedRightBorder}
					title={i18n.intl.formatMessage({defaultMessage: "Double click to Expand", description: "[SuperPanelComponent] a mouse shortcut which can show the drawer content"})}
					onDoubleClick={this.onToggleCollapsed}
				/> : null}
			</div>
		);
	}

    node: HTMLDivElement;

    componentDidMount() {
		this.node = ReactDOM.findDOMNode(this) as HTMLDivElement;
		//this.animateSuperPanelContentWidthChange();
	}

    $panels: JQuery;
    lastPanelsWidth = null;

    // animateSuperPanelContentWidthChange() {
    // 	const {$panels} = this;
    //
    // 	if (!$panels) { return; }
    //
    // 	return new Promise((res, rej) => {
    // 		$(this.node).css('max-width', '');
    // 		if (this.collapsed) {
    // 			// Set the superpanel's width to be that of the first rectangle
    // 			const firstNode   = $panels[0].childNodes[0] as HTMLElement;
    // 			let subpanelWidth = firstNode.getBoundingClientRect().width;
    // 			//console.log('-> after', width)
    // 			$panels.velocity({maxWidth: subpanelWidth}, {
    // 				duration: animateExpandCollapseMs,
    // 				easing:   'ease-in-out',
    // 				complete: () => {
    // 					// If the collapsed superpanel is larger than our first accordion panel, increase the subpanel's width to match
    //
    // 					const superPanelWidth = this.node.getBoundingClientRect().width;
    // 					if (superPanelWidth > subpanelWidth) {
    // 						subpanelWidth = superPanelWidth;
    // 						$panels.css('maxWidth', subpanelWidth);
    // 					}
    //
    // 					this.lastPanelsWidth = subpanelWidth;
    // 					res();
    // 				}
    // 			});
    // 		}
    // 		else {
    // 			// Expansion due to clicking expand button or from adding a panel
    // 			$panels.css('width', '').css('max-width', '');
    //
    // 			let after = $panels[0].getBoundingClientRect().width;
    //
    // 			// Remove the sizes for any deleting
    // 			after -= _.sum(this.props.panels.map(p => !p.isDeleting ? 0 : p.component.node.getBoundingClientRect().width));
    //
    // 			if (this.lastPanelsWidth == null || this.lastPanelsWidth > after) {
    // 				this.lastPanelsWidth = after;
    // 				res();
    // 			}
    // 			else if (this.lastPanelsWidth !== after) {
    // 				$panels.css('maxWidth', this.lastPanelsWidth + 'px');     // Reset to the previous width we recorded
    // 				$panels.velocity(
    // 					{maxWidth: after},
    // 					{
    // 						duration: animateExpandCollapseMs,
    // 						easing:   'ease-in-out',
    // 						complete: () => {
    // 							$panels.css('width', '').css('max-width', '')
    // 							this.lastPanelsWidth = after;
    // 							res();
    // 						}
    // 					});
    // 			}
    // 			else {
    // 				res();
    // 				//this.subpanelsElem.style.width = after + 'px';
    // 			}
    // 		}
    // 	});
    // }

    // freezeSuperPanelWidth = () => {
    // 	const {node} = this;
    // 	$(node).css('max-width', node.getBoundingClientRect().width);
    // }

    get query(): Query {
		return this.props.query;
	}

    @action onToggleCollapsed = async () => {
		const { $panels, query, panelsWidth } = this;

		// Add a max-width to each of the children panels so we can animate it everybody except the first panel down to 0;
		if (!query._variables.collapsed) {
			this.freezeChildrenWidths();
			$panels.children().first().css('minWidth', '').css('maxWidth', '');
		}
		else {
			// capture the current max-width as we have none set when first rendered
			this.$panels.css('maxWidth', this.panelsWidth)
		}

		query._variables.toggleCollapsed();
	}

    freezeChildrenWidths = () => {
		// Fix each child panel's width to be what they are right now
		this.$panels.children().each((i, c) => {
			const width = c.getBoundingClientRect().width;
			$(c).css('min-width', width).css('max-width', width);
		})
	}

    onAddPanel = async () => {
		api.site.busy = true;
		this.isAddingPanel = true;

		//this.freezeSuperPanelWidth();

		const { collapsed, $panels, props: { query } } = this;

		if (!collapsed && !query?.shouldExpandVariables) {
			// We need to animate the total width to handle the new panel
			let subpanelWidth = $panels[0].getBoundingClientRect().width;
			let maxPanelWidth = _.max(_.toArray($panels[0].children).map(c => c.getBoundingClientRect().width));
			this.freezeChildrenWidths();

			$panels.css('maxWidth', subpanelWidth);

			await this.props.onAddPanel();

			$panels.children().last().width(maxPanelWidth);
			subpanelWidth += maxPanelWidth;
			$panels.css('maxWidth', subpanelWidth);

			// runInAction: Add Panel animation complete
			setTimeout(() => runInAction(() => {
				$panels.css('maxWidth', '')
				$panels.children().each((i, c) => {
					const width = c.getBoundingClientRect().width;
					$(c).css('min-width', width).css('max-width', '');
				});
			}), animateExpandCollapseMs);
		}
		else {
			await this.props.onAddPanel();
		}

		this.isAddingPanel = false;
		api.site.busy = false;
	}

    onDeleteVariablePanel = async (panel: AccordionPanel) => {
	    if (this.props.query.shouldExpandVariables) {
		    const clauseIndex = this.query.pages.findIndex(page => page.clause == panel.id);
		    this.props.query.navigateToPage(this.query.pages[clauseIndex + 1]);
		    await this.props.onDeletePanel(panel);
		    this.props.query.navigateToPage(this.query.pages[clauseIndex]);
	    } else {
		    api.site.busy        = true;
		    this.isDeletingPanel = true;

		    // Fade out and delete the panel
		    panel.isDeleting = true;

		    //this.animateSuperPanelContentWidthChange();

		    const {$panels} = this;
		    let panelsWidth = $panels[0].getBoundingClientRect().width;

		    const $panel     = $(panel.component.node);
		    const panelWidth = $panel[0].getBoundingClientRect().width;

		    // Fix each child panel's width to be what they are right now
		    $panels.children().each((i, c) => {
			    const width = c.getBoundingClientRect().width;
			    $(c).css('minWidth', width).css('max-width', width);
		    })

		    // Reduce the overall size of the superpanel to hide the item
		    $panels.css('maxWidth', panelsWidth);

		    $panels.velocity({maxWidth: panelsWidth - panelWidth}, {duration: animateExpandCollapseMs});

		    // Shrink down the deleting panel
		    $panel.velocity(
			    {minWidth: 0, maxWidth: 0, width: 0, opacity: 0, padding: 0, flexBasis: 0},
			    {
				    duration: animateExpandCollapseMs,
				    easing:   'ease-in-out',
				    complete: async () => {
					    await this.props.onDeletePanel(panel);

					    $panels.css('maxWidth', '')
					    $panels.children().each((i, c) => {
						    const width = c.getBoundingClientRect().width;
						    $(c).css('min-width', width).css('max-width', '');
					    });

					    this.isDeletingPanel = false;
					    api.site.busy        = false;
				    }
			    }
		    );
	    }
    }
}


