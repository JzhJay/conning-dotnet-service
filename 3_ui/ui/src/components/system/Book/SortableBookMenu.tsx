import {Icon} from '@blueprintjs/core';
import { observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {ReactSortable} from '../../../lib/sortablejs/react-sortablejs';
import {Book} from '../../../stores/book/Book';
import {appIcons} from '../../../stores/site/iconography';
import {bp} from '../../index';
import {AppIcon} from '../../widgets';
import * as css from './SortableBookMenu.css';

@observer
export class SortableBookMenu extends React.Component<{book: Book, isPagesItem: boolean, enableInsert?: boolean, disableSort?: boolean, disableDelete?: boolean}, {}> {
    @observable dataList : any[];

    constructor(
        props: {book: Book, isPagesItem: boolean, enableInsert?: boolean, disableSort?: boolean, disableDelete?: boolean}
    ) {
        super(props);
        makeObservable(this);

		if (this.props.isPagesItem) {
			this.dataList = this.props.book.pages;
		} else {
			this.dataList = this.props.book.currentPage.selectedViews;
		}
	}

    moveItem = (order, sortable, event) => {
		const {newIndex, oldIndex} = event;
		const {book} = this.props;

		if (this.props.isPagesItem) {
			book.reorderPage(oldIndex, newIndex).then(() =>  this.dataList = this.props.book.pages);
		} else {
			book.currentPage.reorderView(oldIndex, newIndex).then( () => this.dataList = this.props.book.currentPage.selectedViews );;
		}
	}

    deleteItem(e , index) {
		const {book, isPagesItem} = this.props;
		e.preventDefault();
		if (isPagesItem) {
			book.deletePage(index).then(() =>  this.dataList = this.props.book.pages);
		} else {
			book.currentPage.deleteView(index).then( () => this.dataList = this.props.book.currentPage.selectedViews );
		}
	}

    navigate(e,index) {
		e.preventDefault();
		this.props.isPagesItem && this.props.book.navigateToPage(index);
	}

    renderSortableMenuItem(data , index) {
		const {book, isPagesItem} = this.props;
		return <div className={css.sortableMenuItem}>
			{this.props.disableSort !== true && <Icon className={css.sortableMenuItemDragIcon} icon="drag-handle-vertical" />}
			<div className={css.sortableMenuItemTitle} onClick={(e) => this.navigate(e,index)}>
				{!isPagesItem && <AppIcon icon={appIcons.book.views[data.name]}/>}
				{isPagesItem ? `${index+1}. ${data.title}.${!book.isPageApplicable(index) ? " (No Visible Content)" : ""}` : data.label}
			</div>
			{this.props.disableDelete !== true && <div className={css.sortableMenuItemRight}>
				<Icon icon="trash" iconSize={14} title={false} onClick={(e) => this.deleteItem(e,index)} />
			</div>}
		</div>
	}

    @observable isDragging: boolean = false;

    render() {
		const {book , enableInsert} = this.props;
		return <>
			<ReactSortable
				className={classNames(css.sortableMenu, {["is-dragging"]: this.isDragging})}
				options={{
					animation:      100,
					forceFallback:  false,
					fallbackOnBody: true,
					onStart: () => this.isDragging = true,
					onEnd: () => this.isDragging = false
				}}
				onChange={this.moveItem}>
				{this.dataList.map( (d,i) => <React.Fragment key={`${i}_${this.props.isPagesItem}`}>{this.renderSortableMenuItem(d,i)}</React.Fragment>)}
			</ReactSortable>
			{enableInsert === true && (
				<>
					<bp.MenuDivider />
					{ this.props.isPagesItem ? <bp.MenuItem text="Insert Page" icon="add" onClick={(e) => book.addPage()}/> :
					  <bp.MenuItem text="Insert View" icon="add" className={css.insertView} shouldDismissPopover={true} popoverProps={{usePortal: false, popoverClassName: bp.Classes.POPOVER_DISMISS_OVERRIDE}}>
						  {[true, false].map(isInput =>
							  <React.Fragment key={isInput.toString()}>
								  <bp.MenuDivider title={isInput?"Input views":"Output views"} />
								  {Object.keys(book.availableViews).filter(name => book.availableViews[name].isInput == isInput).map((name, i) =>
									  <bp.MenuItem
										  key={i}
										  text={book.availableViews[name].label}
										  shouldDismissPopover={false}
										  icon={<AppIcon icon={appIcons.book.views[name]}/> }
										  className={classNames(css.viewMenuItem, bp.Classes.POPOVER_DISMISS_OVERRIDE, {[css.notApplicable]: !book.isViewApplicable(name)})}
										  onClick={(e) => { e.preventDefault(); book.currentPage.insertView(book.availableViews[name].name); }}
									  />
								  )}
							  </React.Fragment>
						  )}
					  </bp.MenuItem> }
				</>
			)}
		</>

	}
}