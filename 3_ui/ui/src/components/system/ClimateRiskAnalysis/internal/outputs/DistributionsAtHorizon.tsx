import {AnchorButton, ButtonGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position} from '@blueprintjs/core';
import { action, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {BookPage} from '../../../../../stores/book/BookPage';
import {BookView} from '../../../../../stores/book/BookView';
import {ClimateRiskAnalysis, climateRiskAnalysisStore, DistributionsAtHorizonOptions} from '../../../../../stores/climateRiskAnalysis';
import {bp, IconButton, LoadingIndicator} from '../../../../index';
import {HighchartsComponent} from '../../../highcharts';
import {appIcons} from "../../../../../stores/site/iconography/icons";
import { PdfExporter, ignoreCssInPrintPDF } from 'utility';
import { asyncSiteLoading } from 'stores';
import {positionToolbarNextToPlaceholder} from "./internal/Helpers";

import * as css from './DistributionsAtHorizon.css';
import * as craPageCss from '../../ClimateRiskAnalysisPage.css';
import * as reportCss from '../../../../../utility/pdfExport.css';
import FlipMove from 'react-flip-move';

interface MyProps {
	climateRiskAnalysis: ClimateRiskAnalysis;
	page: BookPage;
	view: BookView;
}

@observer
export class DistributionsAtHorizon extends React.Component<MyProps, {}> {
	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        this.props.climateRiskAnalysis.getDistributionsAtHorizonData();
    }

	@observable selectedView = null;
	toolbarPlaceholderRef = null;
	reportContainerRef = React.createRef<HTMLDivElement>();
	pdfExporter = new PdfExporter();

	exportPDF = asyncSiteLoading(async () => {
		if (this.reportContainerRef.current && this.reportContainerRef.current) {
			const craName = this.props.climateRiskAnalysis.name;
			await this.pdfExporter.print(this.reportContainerRef.current.querySelector(`.${css.views}`), `${craName}-market-value-distribution`);
		}
	})

	renderToolbar() {
		const {viewCount} = this.props.view.userOptions;

		return <nav className={classNames(bp.Classes.NAVBAR, ignoreCssInPrintPDF.default)}>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
				<ButtonGroup>
					<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>Number of Views:</label>
					<Popover position={Position.BOTTOM_RIGHT}
					         interactionKind={PopoverInteractionKind.CLICK}
					         content={<Menu>
						         {_.range(1, 6).map( (option) =>
							         <MenuItem
								         key={option}
								         active={option === viewCount}
								         text={option}
								         onClick={() => this.setViewCount(option)}>
							         </MenuItem>
						         )}
					         </Menu>}
					         popoverClassName={css.horizonMenu}>
						<AnchorButton
							className={css.button}
							text={viewCount}
							rightIcon="caret-down"/>
					</Popover>
				</ButtonGroup>
				<span className={bp.Classes.NAVBAR_DIVIDER}/>
				<div style={{visibility: "hidden", marginBottom: "auto", width: 0}} ref={r => this.toolbarPlaceholderRef = r} />
			</div>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
				<ButtonGroup>
					<bp.Tooltip position={bp.Position.BOTTOM} content="Download PDF">
						<IconButton  icon={appIcons.investmentOptimizationTool.download} onClick={this.exportPDF}/>
					</bp.Tooltip>
				</ButtonGroup>
			</div>
		</nav>
	}

	setViewCount = (viewCount: number) => {
		const {view, page, climateRiskAnalysis} = this.props;
		let userOptions = this.props.view.userOptions as DistributionsAtHorizonOptions;

		this.selectedView = null;

		setTimeout(() => {

			let previousLength = userOptions.views.length;
			for (let i = 0; i < viewCount - previousLength; i++) {
				userOptions.views.push(climateRiskAnalysisStore.charting.defaultUserOptions("distributionsAtHorizon"));
			}
			userOptions.views.length = viewCount;

			page.updateUserOptions(view.id, {...userOptions, viewCount});
		}, 1)
	}

	updateUserOptions(viewIndex, newUserOptions) {
		const {page, view} = this.props;
		let userOptions = this.props.view.userOptions as DistributionsAtHorizonOptions;
		userOptions.views[viewIndex] = newUserOptions;
		page.updateUserOptions(view.id, userOptions)
	}

	selectView = (e, viewIndex) => {
		const boundingBox = e.currentTarget.getBoundingClientRect();

		if (e.clientY > boundingBox.top && !(this.isInMenu(e.target)))
			this.selectedView = this.selectedView == viewIndex ? null : viewIndex;

		this.computedNavBarOpacity();
	}

	isInMenu(element) {
		do {
			if (typeof element?.className === "string" && element.className.includes("bp3-popover"))
				return true;
		} while (element = element.parentNode)
	}

	@action onViewCaptionChange = (val: string) => {
		const { page, view } = this.props;
		const userOptions = page.getViewUserOptions(view.id);
		userOptions.viewCaption = val;
		page.updateUserOptions(view.id, userOptions)
	}

	render() {
		const {climateRiskAnalysis, page, view} = this.props;
		const userOptions = this.props.view.userOptions as DistributionsAtHorizonOptions;
		const viewIndex = climateRiskAnalysis.getViewSerialNumberByViewType(view.id);
		return <div className={css.root} ref={this.reportContainerRef}>
			{this.renderToolbar()}
			{ page.showViewCaption &&
			<div className={craPageCss.viewCaption}>
				<div className={craPageCss.viewCaptionIndex}>
					{`Figure ${viewIndex} `}
				</div>
				<div className={craPageCss.viewCaptionInput}>
					<bp.EditableText value={userOptions.viewCaption} onChange={this.onViewCaptionChange} multiline={true} />
				</div>
			</div>
			}
			{climateRiskAnalysis.output?.distributionsAtHorizon ?
			<FlipMove className={`${css.views} ${reportCss.viewMainBlock}`} onFinishAll={this.computedNavBarDisplay}>
				{userOptions.views.map((v, i) =>
					<div key={i} className={classNames(css.view, {[css.selected]: this.selectedView == i})} onClick={(e) => this.selectView(e, i)}>
						<HighchartsComponent
							guid={climateRiskAnalysis.id}
							key={view.name}
							inlineToolbar={true}
							disableSelections={this.selectedView !== i}
							allowScrollwheelZoom={!page.scrollMode}
							className={css.viewComponent}
							chartType={view.name}
							userOptions={page.getViewUserOptions(view.id).views[i]}
							onUserOptionsUpdated={userOptions => this.updateUserOptions(i, userOptions)}
							chartingResult={climateRiskAnalysis}
							id={view.id}/>
					</div>
				)}
			</FlipMove> : <LoadingIndicator active={true}>Loading {climateRiskAnalysisStore.views[view.name].label} Chart...</LoadingIndicator>}
		</div>
	}

	computedNavBarOpacity = () => {
		const thisDOM = $(ReactDOM.findDOMNode(this));
		if(thisDOM.parents('.BookComponent__hover-toolbars').length) {
			const mainBar = thisDOM.children('.bp3-navbar');
			const viewBars = thisDOM.find(`.bp3-navbar`);
			const currentOpacity =  mainBar.css('opacity');
			viewBars.css('transition-delay', '1ms').css('opacity', currentOpacity);
			setTimeout( () => {
				viewBars.css('transition-delay', '').css('opacity', '')
			} , 1);
		}
	}

	computedNavBarDisplay = () => {
		const userOptions = this.props.view.userOptions as DistributionsAtHorizonOptions;

		// Position selected chart's toolbar
		if (userOptions.viewCount == 1 || this.selectedView != null) {
			let $viewToolbar = $(ReactDOM.findDOMNode(this)).find(`.${css.view}`).eq(userOptions.viewCount == 1 ? 0 : this.selectedView).find(".bp3-navbar");
			positionToolbarNextToPlaceholder($viewToolbar, this.toolbarPlaceholderRef);
		}
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		const userOptions = this.props.view.userOptions as DistributionsAtHorizonOptions;

		this.computedNavBarDisplay();

		$(ReactDOM.findDOMNode(this)).find('.bp3-navbar')
			.not('.set-mouse-event').addClass('set-mouse-event')
			.on('mouseover',(e)=> {
				let selector = this.selectedView == null ? '.bp3-navbar' : `.${css.selected} .bp3-navbar, .${css.root} > .bp3-navbar`;
				$(e.currentTarget)
					.parents('.BookComponent__hover-toolbars').first().find(selector)
					.css('opacity', 1)
					.css('transition-delay', '100ms');
			}).on('mouseleave' , (e)=> {
			$(e.currentTarget)
				.parents('.BookComponent__hover-toolbars').first().find('.bp3-navbar')
				.css('opacity', '')
				.css('transition-delay', '');
		});
	}
}
