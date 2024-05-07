import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { appIcons, simulationStore, queryStore, reportStore, Report, ReportDescriptor, ReportPage, ReportQuery, ReportText, SimulationSlot, Link, user } from "stores";
import { observer } from 'mobx-react'
import { sem, bp, ReactSelect, AppIcon, dialogs, SmartCard, SmartCardProps, SortableCardsPanel, SimulationCard, QueryCard, ReportPageContextMenu, ReportSimulationSlotContextMenu, ReactSortable } from 'components';
import { action, observable, makeObservable } from "mobx";
import { AddAPage, ReportCardPage } from "./Page";
import * as css from './Pages.css';
import { ReportCardPanel } from "./ReportCardPanel";
import { ReportContextMenu } from "../widgets/ReportContextMenu";
import { ReportPagesContextMenu } from "../widgets/ReportPageContextMenu";
import FlipMove from 'react-flip-move';

const SortablePage = SortableElement(ReportCardPage);

@observer
class PagesContainer extends React.Component<{ disableAnimation: boolean, report: Report, className: string }, {}> {
	render() {
		const { disableAnimation, report: { pages } } = this.props;

		return <FlipMove maintainContainerHeight disableAllAnimations={disableAnimation} className={classNames(this.props.className, css.pages)}>
			{/*{pages.length == 0 && <NoPages report={report} />}*/}
			{pages.map((page, i) => <SortablePage index={i} key={page.index} page={page}/>)}
			{/*{false && !readonly && !isTooltip && <AddAPage key='add-a-page' report={report}/>}*/}
		</FlipMove>;
	}
}

class NoPages extends React.Component<{report: Report}, {}> {
	render() {
		const { report } = this.props;

		return <sem.Card.Content>
			<sem.Message className={css.emptyPage} warning>
				<sem.Message.Header>Your report does not have any pages defined.</sem.Message.Header>
				<sem.Message.Content>
					<sem.Message.List>
						<sem.Message.Item>
							<a
								onClick={() => report.addPage()}>Add a page</a>
						</sem.Message.Item>
					</sem.Message.List>
				</sem.Message.Content>
			</sem.Message>
		</sem.Card.Content>
	}
}


const SortablePages = SortableContainer(PagesContainer);

@observer
@bp.ContextMenuTarget
export class ReportPages extends React.Component<{ style?: React.CSSProperties, report: Report }, {}> {
    @observable disableAnimation = false;
    @observable dragging = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { dragging, props: { style, report }, disableAnimation } = this;
		return (
			<sem.Card style={style} className={classNames(css.root, { [css.dragging]: dragging })}>
				<sem.Card.Content>
					<sem.Card.Header className={css.header}>
						<span className={css.title}>Pages</span>
						<span className={bp.Classes.BUTTON_GROUP}>
							<bp.Button icon="plus" text="Add a Page" onClick={() => report.addPage()}/>
						</span>

						{/*<bp.Tooltip className="right floated" content="Add a Page" position={bp.Position.BOTTOM_RIGHT}>*/}
							{/*<bp.AnchorButton icon="plus" onClick={() => report.addPage()}/>*/}
						{/*</bp.Tooltip>*/}
					</sem.Card.Header>
				</sem.Card.Content>

				<sem.Card.Content extra>
					<SortablePages useDragHandle
					               axis='xy'
					               disableAnimation={disableAnimation}
					               transitionDuration={600}
					               distance={5}
					               onSortStart={this.onSortStart}
					               onSortEnd={this.onSortEnd}
					               shouldCancelStart={() => report.pages.length < 2}
					               className={css.pages}
					               {...this.props}
					/>
				</sem.Card.Content>
			</sem.Card>);
	}

    renderContextMenu() {
		return <ReportPagesContextMenu report={this.props.report}/>
	}

    @action onSortStart = () => {
		this.dragging = true;
		this.disableAnimation = true
	}

    @action onSortEnd = (e: { oldIndex: number, newIndex: number }) => {
		this.props.report.movePage(e.oldIndex, e.newIndex);
		this.dragging = false;
		this.disableAnimation = false;
	}
}