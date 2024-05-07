import {ButtonGroup} from '@blueprintjs/core';
import {SortableContainer, SortableElement, SortableHandle, arrayMove, SortEnd} from 'react-sortable-hoc';
import { appIcons, ReportItem, reportStore, Report, ReportDescriptor, ReportPage, ReportQuery, ReportText, SimulationSlot, Link, user } from "stores";
import { observer } from 'mobx-react'
import { sem, bp, ReportPageContextMenu} from 'components';
import * as css from './Page.css';
import { action, observable, makeObservable } from "mobx";

import { QuerySlotComponent } from "./QuerySlot";
import { ReportTextSummary } from "./Text";
import { IconButton } from "../../../blueprintjs/IconButton";
import FlipMove from 'react-flip-move';

@observer
class PageNumber extends React.Component<{ page: ReportPage }, {}> {
	render() {
		const { page } = this.props;
		return <div className={css.pageNumber}>
			<bp.Tooltip
			            content={`${page.index + 1} of ${page.report.pages.length + 1}`}>
				<sem.Label>Page {page.index + 1}</sem.Label>
			</bp.Tooltip>
		</div>
	}
}

const PageNumberDragHandle = SortableHandle(PageNumber)

const PageDragHandle = SortableHandle(() => <sem.Icon className='draggable' size='large' fitted name="file text outline"/>)

const PageTitleDragHandle = SortableHandle(({ page }) => <span className={css.titleDragHandle}>{page.name ? page.name : <i>Untitled Page</i>}</span>);

@observer
@bp.ContextMenuTarget
export class ReportCardPage extends React.Component<{ page: ReportPage }, {}> {
    @observable isEditing;
    @observable disableAnimation = false;
    @observable dragging = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { dragging, disableAnimation, isEditing, props: { page, page: { children, reportQueries, id, name, index } } } = this;

		return (
			<div className={classNames(css.page, { [css.noDrag]: page.report.pages.length < 2, [css.hasContent]: children.length > 0 })}>
				<div className={css.header}>
					<PageDragHandle />
					{/*<bp.Tooltip disabled content={`Page ${page.index + 1} of ${page.report.pages.length + 1}`}>*/}
						{/**/}
					{/*</bp.Tooltip>*/}
					<span className={css.title} data-is-editing={isEditing} onDoubleClick={() => page.navigateTo()}>
						{isEditing == null
							? (
							 <span className={css.editableTitle}>
								    <Link to={page.clientUrl}
								          className={css.titleDragHandle}>
									 {page.name ? page.name : <i>Untitled Page</i>}
								    </Link>
								 <bp.Tooltip content="Rename" className={css.renameTitle}>
								<bp.AnchorButton icon="edit"
								                 active={isEditing}
								                 onClick={() => this.isEditing = isEditing ? null : true}/>
								</bp.Tooltip>
							 </span>)
							: <bp.EditableText isEditing={isEditing}
							                   disabled={isEditing == null}
							                   selectAllOnFocus
							                   placeholder={page.label}
							                   defaultValue={name ? name : ''}
							                   onCancel={() => this.isEditing = null}
							                   onConfirm={newValue => {
								                   if (newValue != page.name) {
									                   page.name = newValue;
								                   }

								                   this.isEditing = null;
							                   }}/>}
					</span>

					<ButtonGroup className={classNames(css.actions)}>
						<bp.Popover
							interactionKind={bp.PopoverInteractionKind.HOVER}
							content={
								<bp.Menu>
									<bp.MenuItem text="Add Query" icon="search" onClick={() => page.addReportQuery()}/>
									<bp.MenuItem text="Add Text Block" icon="new-text-box" onClick={() => page.addText()}/>
								</bp.Menu>}>
							<bp.AnchorButton icon='plus'/>
						</bp.Popover>

						<bp.Tooltip content="Duplicate" >
							<bp.AnchorButton icon='duplicate' onClick={() => page.duplicate()}/>
						</bp.Tooltip>
						<bp.Tooltip content="Delete" >
							<IconButton icon={appIcons.report.remove} onClick={() => page.delete()}/>
						</bp.Tooltip>
					</ButtonGroup>
				</div>

				{/* Turned off sorting due to MCE not veing able to render */}
				<SortablePageContents disableAnimation={disableAnimation} page={page}
				                      useDragHandle axis='xy'
				                      onSortStart={() => {
					                      this.dragging = true;
					                      this.disableAnimation = true
				                      }}
				                      onSortEnd={(sort) => {
										  this.dragging = false;
										  this.onReorderContents(sort);
									  }}
				/>

				<PageNumberDragHandle page={page}/>
			</div>)
	}

    renderContextMenu() {
		return <ReportPageContextMenu location='builder' onRename={() => this.isEditing = true} page={this.props.page}/>
	}

    @action onReorderContents = (sort: SortEnd) => {
		const { newIndex, oldIndex } = sort;
		//console.log(order, sortable, event);
		this.props.page.children.move(oldIndex, newIndex);
		this.dragging = false;
		this.disableAnimation = false;
	}
}

export class AddAPage extends React.Component<{ report: Report, className?: string }, {}> {
	render() {
		const { report, className } = this.props;
		return <div className={classNames(className, css.addAPage, css.page)}
		            onClick={(e) => {
			            e.stopPropagation();
			            report.addPage()
		            }}>
			<div className={css.title}>Add a Page</div>
		</div>
	}
}

@observer
@bp.ContextMenuTarget
export class EmptyReportPageMessage extends React.Component<{ className?: string, page: ReportPage }, {}> {
	render() {
		const { page, className } = this.props;
		return <div className={classNames(css.emptyPage, className)}>
			<sem.Message>
				<sem.Message.Header>This page is empty.</sem.Message.Header>
				<sem.Message.Content>
					<sem.Message.List>
						<sem.Message.Item>
							<a onClick={() => page.addReportQuery()}>Add a query</a>
						</sem.Message.Item>
						<sem.Message.Item>
							<a onClick={() => page.addText()}>Add descriptive text</a>
						</sem.Message.Item>
					</sem.Message.List>
				</sem.Message.Content>
			</sem.Message>
		</div>
	}

	renderContextMenu() {
		return <ReportPageContextMenu location='builder' page={this.props.page}/>
	}
}

const PageContentItemDragHandle = SortableHandle(({ page }) => <span className='bp3-icon bp3-icon-drag-handle-vertical'/>)

@observer
class PageContentItem extends React.Component<{ item: ReportItem }, {}> {
	render() {
		const { item } = this.props;

		if (item instanceof ReportQuery) {
			return <QuerySlotComponent reportQuery={item as ReportQuery}/>
		}
		else if (item instanceof ReportText) {
			return <ReportTextSummary item={item as ReportText}/>;
		}
		else {
			return <div>
				{item}
			</div>
		}
	}
}

const SortablePageContentItem = SortableElement(PageContentItem);

@observer
class PageContents extends React.Component<{ disableAnimation: boolean, page: ReportPage, isTooltip?: boolean }, {}> {
	render() {
		const { disableAnimation, isTooltip, page, page: { children } } = this.props;

		return <FlipMove disableAllAnimations={disableAnimation} maintainContainerHeight className={css.pageContents}>
			{children.length == 0 && (
				<div key='empty' className="content" style={{ paddingLeft: 52 }}>
					<EmptyReportPageMessage page={page}/>
				</div>)}
			{children.map((c, i) => <SortablePageContentItem index={i} key={c.id} item={c}/>)}
		</FlipMove>
	}
}

const _SortablePageContents = SortableContainer(PageContents);
export const SortablePageContents = _SortablePageContents;
