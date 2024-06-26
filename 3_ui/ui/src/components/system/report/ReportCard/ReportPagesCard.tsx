import {ButtonGroup} from '@blueprintjs/core';
import * as css from './ReportPagesCard.css';
import { ReactSelect, sem, bp, ReportCard, ReactSortable, EmptyReportPageMessage } from 'components';
import { observer } from "mobx-react";
import { SimulationSlot, Report, ReportPage, simulationStore, ReportText, ReportQuery, Link } from 'stores';
import { computed, observable, makeObservable } from "mobx";
import { ReportItemContextMenu, ReportPageContextMenu } from "../widgets";
import { sortable } from 'react-sortable';
import { ReportTextSummary } from "./Text";
import { QuerySlotComponent } from "./QuerySlot";
import FlipMove from 'react-flip-move';

@observer
class PageRow extends React.Component<{ page: ReportPage }, {}> {
	render() {
		const { page } = this.props;
		return <div className="row">
			<ReportPageCardContent page={page}/>
		</div>
	}
}

interface MyProps {
	report: Report;
	style?: React.CSSProperties;
	showTitle?: boolean;
}

@observer
export class ReportPagesCard extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed
	get allExpanded() {
		return _.every(this.props.report.pages, p => p.expanded)
	}

    @computed
	get allCollapsed() {
		return _.every(this.props.report.pages, p => !p.expanded)
	}

    updateSortingState = (stateUpdate) => {
		if (!this.animating) {
			console.log(stateUpdate);
		}
	};

    @observable animating     = false;
    @observable draggingIndex = null;

    render() {
		const { allExpanded, allCollapsed, props: { style, showTitle, report, report: { children, areAllPagesExpanded, pages } } } = this;

		return <FlipMove style={style} className={classNames(css.root, "ui card fluid")}>
			{showTitle && <div key="title" className="content">
				<sem.Card.Header>
					<sem.Icon name="file text outline"/>
					Pages

					{pages.length > 1 && <a className={css.toggleExpandCollapseAll}
					                        onClick={() => report.toggleExpandAll()}>{areAllPagesExpanded ? 'Collapse All' : 'Expand All'}</a>}

					<bp.Tooltip className="right floated" content="Add a Page">
						<bp.AnchorButton icon="plus" onClick={() => report.addPage()}/>
					</bp.Tooltip>
				</sem.Card.Header>
			</div>}

			<div>
				{pages.length == 0
				 ? <NoPagesCardContent key="no-pages" {...this.props} />
				 : (
					 <ReactSortable options={{
						 animation        : 400,
						 draggable        : `.${css.pageCard}`,
						 group            : 'pages',
						 handle           : css.pageDragHandle,
						 //sort:          true,
						 //filter:        `.no-drag`,
						 forceFallback    : true,
						 fallbackOnBody   : true,
					 }} onChange={this.pageOrder_onChange}>
						 {pages.map((p, i) => <ReportPageCardContent key={i} page={p}/>)}
					 </ReactSortable>
				 )}
			</div>
		</FlipMove>
	}

    pageOrder_onChange = (order, sortable, event) => {
		const { newIndex, oldIndex } = event;
		const { report }             = this.props;
		report.movePage(oldIndex, newIndex);
	}
}

interface ReportPageCardContentProps {
	page: ReportPage;
}

class NoPagesCardContent extends React.Component<MyProps, {}> {
	render() {
		const { report } = this.props;

		return <sem.Card.Content>
			<sem.Message className={css.emptyPage} warning>
				<sem.Message.Header>Your report is empty.</sem.Message.Header>
				<sem.Message.Content>
					<sem.Message.List>
						<sem.Message.Item>
							<a onClick={() => report.addPage()}>Add a Page</a>
						</sem.Message.Item>
					</sem.Message.List>
				</sem.Message.Content>
			</sem.Message>
		</sem.Card.Content>
	}
}

@observer
class ReportPageCardContent extends React.Component<ReportPageCardContentProps, {}> {
	render() {
		const {
			      props: {
				      page, page: { report, report: { pages }, index, renamingFrom, orientation, name, layout, children }
			      }
		      } = this;

		return (
			<sem.Card
				data-page-index={page.index}
				className={
					classNames(css.pageCard, {
						[css.expanded] : page.expanded,
						[css.highlight]: report.mousedOverTreeItem == page
					})}>
				<sem.Message>
					<div key="title" className="header"
					     onDoubleClick={(e) => {
						     page.toggleExpanded();
						     e.preventDefault();
					     }}
					     onContextMenu={(e) => {
						     const $target = $(e.target);

						     // Don't override hyperlinks
						     if (!$target.is('a[href]') && $target.parents('a[href]').length == 0) {
							     bp.ContextMenu.show(<ReportPageContextMenu page={page} location='builder'/>, { left: e.clientX - 8, top: e.clientY - 8 });
							     e.preventDefault();
						     }
					     }}>
						<div className="left floated">
							<bp.Icon icon="drag-handle-vertical" className={css.pageDragHandle}/>

							<bp.Tooltip content='Toggle Content View'>
								<bp.AnchorButton icon={page.expanded ? 'chevron-down' : 'chevron-right'}
								                 minimal style={{ marginRight: 5 }}
								                 onClick={() => page.toggleExpanded()}/>
							</bp.Tooltip>

							<bp.Tooltip content={`${page.index + 1} of ${report.pages.length}`} className={css.pageTitle} disabled={renamingFrom == 'builder'}>
								<bp.EditableText
									defaultValue={page.name} placeholder={'Unnamed Page'}
									confirmOnEnterKey
									selectAllOnFocus
									onConfirm={value => {
										if (page.name != value) {
											page.name = value;
										}
										page.renamingFrom = null
									}}
									onCancel={() => page.renamingFrom = null}/>
							</bp.Tooltip>
						</div>

						{/*<bp.EditableText className={css.pageTitle} value={page.name} onConfirm={value => page.name = value}/>*/}
						<div className={classNames("left floated", css.pageToolbar)}>

						</div>


						<div className="right floated" style={{ overflow: 'visible' }}>
							<ButtonGroup minimal className={classNames("left floated")}>
								{/*<bp.Tooltip content='Add Page'*/}
								{/*>*/}
								{/*<bp.AnchorButton text="Add Page" icon="document" onClick={() => report.addPage(page.index + 1)}/>*/}
								{/*</bp.Tooltip>*/}
								<bp.Tooltip content='Add Query'
								>
									<bp.AnchorButton text="Add Query" icon="search" onClick={() => page.addReportQuery()}/>
								</bp.Tooltip>

								<bp.Tooltip content='Add Descriptive Text'
								>
									<bp.AnchorButton text="Add Text Block" icon="new-text-box" onClick={() => page.addText()}/>
								</bp.Tooltip>

								{/*<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
								 <bp.Tooltip content='Row Layout'
								 >
								 <bp.AnchorButton icon="arrows-horizontal" active={layout == 'horizontal'} onClick={() => page.layout = 'horizontal'}/>
								 </bp.Tooltip>
								 <bp.Tooltip content='Column Layout'
								 >
								 <bp.AnchorButton icon="arrows-vertical" active={layout == 'vertical'} onClick={() => page.layout = 'vertical'}/>
								 </bp.Tooltip>
								 </div>

								 <div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
								 <bp.Tooltip content='Portrait'
								 >
								 <bp.AnchorButton icon="portrait" active={orientation == 'portrait'} onClick={() => page.orientation = 'portrait'}>
								 <sem.Icon name='file outline' fitted/>
								 </bp.AnchorButton>
								 </bp.Tooltip>
								 <bp.Tooltip content='Landscape'
								 >
								 <bp.AnchorButton style={{ transform: 'rotate(-90deg)' }} active={orientation == 'landscape'} onClick={() => page.orientation = 'landscape'}>
								 <sem.Icon name='file outline' fitted/>
								 </bp.AnchorButton>
								 </bp.Tooltip>
								 </div>*/}

								<bp.Tooltip content='Go to Page'>
									<Link to={page.clientUrl} className={classNames(bp.Classes.BUTTON, bp.Classes.ICON, 'bp3-icon-link')}/>
								</bp.Tooltip>

								<bp.Tooltip content='Duplicate Page'
								>
									<bp.AnchorButton icon="duplicate" onClick={() => page.duplicate()}/>
								</bp.Tooltip>

								<bp.Tooltip content="Remove Page">
									<bp.AnchorButton icon="cross" onClick={() => page.delete()}/>
								</bp.Tooltip>
							</ButtonGroup>
						</div>
					</div>

					<Collapse isOpened={page.expanded} className={classNames("content", css.pageDetails)}>
						<FlipMove key="children">
							{_.isEmpty(children)
							 ? <EmptyReportPageMessage key="empty" page={page}/>
							 : <FlipMove key="report-children" className={css.reportChildren}>
								 {page.children.map(
									 item =>
										 <div key={item.id} className={classNames('item', { [css.highlight]: report.mousedOverTreeItem == item })}>
											 {item instanceof ReportQuery ? <QuerySlotComponent reportQuery={item}/>
											                              : item instanceof ReportText ? <ReportTextSummary item={item}/>
											                                                           : <span>{item.name} - {typeof item}</span>}
										 </div>)}
							 </FlipMove>}
						</FlipMove>
					</Collapse>
				</sem.Message>
			</sem.Card>)
	}
}

