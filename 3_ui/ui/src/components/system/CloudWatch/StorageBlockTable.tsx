import * as css from './StorageBlockTable.css'
import {observer} from 'mobx-react';
import { observable, makeObservable } from 'mobx';
import {CloudWatchPageContext, IStorageBlock} from './CloudWatchPageContext';
import * as ReactDOMServer from 'react-dom/server';

interface MyProps {
	context: CloudWatchPageContext;
}

interface IColumn {
	header: string,
	align?: 'left' | 'center' | 'right';
	width?: number,
	className?: string,
	renderCell: (CloudWatchStreamEvent) => React.ReactNode
}

@observer
export class StorageBlockTable extends React.Component<MyProps, {}> {
    @observable columnWidths = []

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {props: {context, context: {storageBlocksSorted}}} = this;

		return (
			<div className={css.root}>
				<Wj.FlexGrid
					isReadOnly
					selectionMode={wijmo.grid.SelectionMode.None}
					autoGenerateColumns={false}
					columns={[
						{header: 'Block', binding: 'block', dataType: 'Number'},
						{header: 'Progress', width: '*'},
					]}
					itemFormatter={(panel: wijmo.grid.GridPanel, row: number, column: number, cell: HTMLElement) => {
						if (panel.cellType == wijmo.grid.CellType.Cell && column == 1) {
							const block = storageBlocksSorted[row];
							if (block) {
								cell.innerHTML = ReactDOMServer.renderToStaticMarkup(<ProgressCellContent block={block}/>);
							}
							else {
								console.warn(`Unable to find storage block for row ${row}`)
							}
						}
					}}
					itemsSource={storageBlocksSorted}
				/>
			</div>
		);
	}
}

@observer
class ProgressCellContent extends React.Component<{ block: IStorageBlock }, {}> {
	render() {
		const {block} = this.props;
		return <div className={css.progressCellContent}>
			{block.progress.min > 0
			 ? <>
				 <span data-value={block.progress.min} style={{width: `${block.progress.min}%`}} className={css.min}/>
				 <span data-max={block.progress.max} data-value={block.progress.max - block.progress.min} style={{width: `${block.progress.max - block.progress.min}%`}} className={css.max}/>
			 </>
			 : null}
		</div>
	}
}