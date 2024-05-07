import React from 'react';
import {action, computed, makeObservable, observe, observable, runInAction,toJS} from 'mobx';
import {Observer, observer} from 'mobx-react';
import * as bpTable from '@blueprintjs/table';
import classNames from 'classnames';

import {BlueprintDialog, bp, LoadingIndicator} from 'components';
import {FormattedMessage} from 'react-intl';
import {i18n} from 'stores';
import {BatchImportMessageTypes, MessageLevel} from './Types';
import type {BatchImportMessage, Block, Message, NavigationMode, MessageOrder} from './Types';
import {KeyCode} from 'utility';

import * as css from './BatchImportResultsDialog.css';

interface MyProps {
	progressData: BatchImportMessage[];
}

@observer
export class BatchImportResultsDialog extends React.Component<MyProps, {}> {
	@observable selectedMessages: Message[];
	@observable selectedBlock: Block;

	@observable navigationMode: NavigationMode = "Blocks";
	@observable messageOrder: MessageOrder = "SR";
	@observable.ref importResults = null;

	_rowInputRef: HTMLInputElement;
	_dispose = [];
	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get blocks(): Block[] {
		const results = this.importResults;
		const blocks = results?.blocks?.length ? toJS(_.get(results, "blocks")) as any : [];
		return blocks.map((b,i) => _.set(b, "_index", i));
	}

	@computed get messages(): Message[] {
		const results = this.importResults;
		const messages = results?.messages?.length ? toJS(_.get(results, "messages")) as Message[] : [];

		const cError = _.filter(messages, m => m?.level == "Error")?.length || 0;
		const cWarning = _.filter(messages, m => m?.level == "Warning")?.length || 0;

		let infoMessage: Message;
		const infoMessageCommonProps: {line: number, level: MessageLevel, locations: {column: number, row: number}[]} =
			{line: 1, level: 'Information', locations: [{ row: 1, column: 1 }]};
		if (cError > 0) {
			infoMessage = {
				...infoMessageCommonProps,
				message: i18n.intl.formatMessage({defaultMessage: `Batch Import failed; no blocks imported`, description: "[BatchImportResultsDialog] default message title when no data imported"}),
				details: [i18n.intl.formatMessage({defaultMessage: `Batch import file contains {cError} errors and {cWarning} warnings`, description: "[BatchImportResultsDialog] default message description when data imported"}, {cError, cWarning})]
			}
		} else if (cWarning > 0) {
			infoMessage = {
				...infoMessageCommonProps,
				message: i18n.intl.formatMessage({defaultMessage: `Batch Import succeeded with warnings; all blocks imported`, description: "[BatchImportResultsDialog] default message title when data imported but had warnings"}),
				details: [i18n.intl.formatMessage({defaultMessage: `Batch import file contains {cError} errors and {cWarning} warnings`, description: "[BatchImportResultsDialog] default message description when data imported but had warnings"}, {cError, cWarning})]
			}
		} else {
			infoMessage = {
				...infoMessageCommonProps,
				message: i18n.intl.formatMessage({defaultMessage: `Batch Import succeeded without warnings; all blocks imported`, description: "[BatchImportResultsDialog] default message title when data imported"}),
				details: [i18n.intl.formatMessage({defaultMessage: `Batch import file contains no errors or warnings`, description: "[BatchImportResultsDialog] default message description when data imported"})]
			}
		}

		return [infoMessage, ...messages].map(m=> _.set(m, "__id", uuid.v4()));
	}


	getBlockByLine = (line: number): Block => {
		return _.find(
			this.blocks,
			b => _.indexOf(b.original_lines, line) >= 0
		)
	}

	getMessagesByLine = (line: number): Message[] => {
		return this.getMessagesByBlock(this.getBlockByLine(line));
	}

	getMessagesByBlock = (block: Block): Message[] => {
		return _.filter(
			this.messagesWithOrder,
			m => block.original_lines.indexOf(m.line) >= 0
		);
	}

	@action setByMessage = (m: Message) => {
		this.selectedMessages = [m];
		this.selectedBlock = this.getBlockByLine(m.line);
		this._rowInputRef && (this._rowInputRef.value = _.toString(_.first(this.selectedBlock.original_lines)));
	}

	@action setByBlock = (b: Block) => {
		this.selectedBlock = b;
		this.selectedMessages = this.getMessagesByBlock(b);
		this._rowInputRef && (this._rowInputRef.value = _.toString(_.first(b.original_lines)));
	}

	@action setByLine = (line: number) => {
		line = _.isFinite(line) ? Math.min(this.lastLine, Math.max(0, line)) : 0;
		this.selectedBlock = this.getBlockByLine(line);
		this.selectedMessages = this.getMessagesByLine(line);
		this._rowInputRef && (this._rowInputRef.value = _.toString(line));
	}

	@computed get lastLine() {
		return Math.max(..._.map(this.blocks, b => Math.max(...b.original_lines)));
	}

	@computed get messagesWithOrder() {
		let messages = this.messages;

		// order by row
		if (this.messageOrder.indexOf("R") >= 0) {
			messages = _.sortBy( messages,m => Math.min(..._.map(m.locations, l => l.row)));
		}

		// order by Severity
		if (this.messageOrder.indexOf("S") >= 0) {
			messages = _.sortBy(messages, m => {
				switch (m.level) {
					case 'Information': return 3;
					case 'Warning': return 2;
					case 'Error': return 1;
					default: return 99;
				}
			})
		}
		return messages;
	}

	@computed get navigateBlocks(): Block[] {
		switch (this.navigationMode) {
			case 'Blocks':
				return this.blocks;
			case 'Messages':
				return _.map(this.messagesWithOrder, m => this.getBlockByLine(m.line));
			case 'Errors':
				return _.map(
					_.filter(this.messagesWithOrder, m => m.level == 'Error'),
					m => this.getBlockByLine(m.line)
				);
			default: return [];
		}
	}

	@computed get selectedMessageDetails(): string[] {
		if (!this.selectedMessages?.length) {
			return [""];
		}
		return _.flatten(_.map(this.selectedMessages , m => {
			if (m.details) {
				return m.details;
			}
			const block = this.getBlockByLine(m.line);
			const locations = _.map(m.locations, location => `Row ${block.original_lines[location.row - 1]}, Column ${this.getColumnName(location.column - 1)}`)
			return [`${m.message}: ${locations.join("; ")}`];
		}));
	}

	getColumnName = (c: number) => {
		return String.fromCharCode(65 + c);
	}

	renderNavigationBtn = (type: "F"|"U"|"D"|"L") => {
		const {navigateBlocks, selectedBlock:{_index: selectedBlockIndex}} = this;
		let intent: bp.Intent, icon: bp.IconName, navBlock: Block;
		switch (this.navigationMode) {
			case 'Blocks':
				intent = bp.Intent.SUCCESS;
				break;
			case 'Messages':
				intent = bp.Intent.WARNING;
				break;
			case 'Errors':
				intent = bp.Intent.DANGER;
				break;
			default:
				intent = bp.Intent.NONE;
		}

		switch (type) {
			case 'F':
				navBlock = _.find(navigateBlocks, b => b._index < selectedBlockIndex);
				icon = `double-chevron-up`;
				break;
			case 'U':
				navBlock = _.findLast(navigateBlocks, b => b._index < selectedBlockIndex);
				icon = `chevron-up`;
				break;
			case 'D':
				navBlock = _.find(navigateBlocks, b => b._index > selectedBlockIndex);
				icon = `chevron-down`;
				break;
			case 'L':
				navBlock = _.findLast(navigateBlocks, b => b._index > selectedBlockIndex);
				icon = `double-chevron-down`;
				break;
		}

		return <bp.Button intent={intent} disabled={!navBlock} icon={icon} onClick={() => this.setByBlock(navBlock)} />

	}

	renderMessage = (m: Message, idx?) => {
		let icon: bp.IconName, intent: bp.Intent;
		switch (m.level) {
			case 'Information':
				icon = 'info-sign';
				intent = bp.Intent.PRIMARY;
				break;
			case 'Warning':
				icon = 'issue';
				intent = bp.Intent.WARNING;
				break;
			case 'Error':
				icon = 'ban-circle';
				intent = bp.Intent.DANGER;
				break;
		}

		const block = this.getBlockByLine(m.line);
		return <a key={`Message_${idx}`} className={css.message} href={"#"} onClick={() => this.setByMessage(m)} >
			<bp.Icon icon={icon} intent={intent} className={css.messageIcon} size={18}/>
			<div className={css.messageContent}>
				<span className={css.messageText}>{m.message}</span>
				{_.map(m.locations, (location, i) =>
					<span key={`M${idx}L${i}`} className={css.messageLocation}>
						<FormattedMessage
							defaultMessage={"Row {r}, Col {c}"}
							description={"[BatchImportResultsDialog] message position hits"}
							values={{
								r: block.original_lines[location.row - 1],
								c: this.getColumnName(location.column-1)
							}}
						/>
					</span>
				)}
			</div>
		</a>


	}

	@computed get resultsContent() {
		if (!this.selectedBlock) {
			this.setByBlock(this.blocks[0]);
		}

		return <>
			<bp.Navbar className={css.bodyHeader}>
				<bp.NavbarGroup>
					<bp.ButtonGroup>
						{this.renderNavigationBtn("F")}
						{this.renderNavigationBtn("U")}
						{this.renderNavigationBtn("D")}
						{this.renderNavigationBtn("L")}
					</bp.ButtonGroup>
				</bp.NavbarGroup>
				<bp.NavbarGroup>
					<label><FormattedMessage defaultMessage={"Row"} description={"[BatchImportResultsDialog] import result navigation item title"}/></label>
					<bp.NumericInput
						inputRef={ref => this._rowInputRef = ref}
						size={`${this.lastLine}`.length} min={0} max={this.lastLine}
						defaultValue={`${_.first(this.selectedBlock?.original_lines)}`}
						buttonPosition={"none"} allowNumericCharactersOnly={true}
						onBlur={e => {
							this.setByLine(parseInt(e.target.value))
						}}
						onKeyDown={e=> {
							switch (e.keyCode) {
								case KeyCode.Escape:
								case KeyCode.Enter:
									$(e.target).blur();
									e.stopPropagation();
									return false;
							}
						}}
					/>
					{/* ----- */}
					<label><FormattedMessage defaultMessage={"Navigation Mode"} description={"[BatchImportResultsDialog] import result navigation item title"}/></label>
					<bp.HTMLSelect defaultValue={this.navigationMode} onChange={action(e => this.navigationMode = e.target.value as any)}>
						<option value={"Blocks"}>{i18n.intl.formatMessage({defaultMessage: "Blocks", description: "[BatchImportResultsDialog] one of navigate way for detail result"})}</option>
						<option value={"Messages"}>{i18n.intl.formatMessage({defaultMessage: "Messages", description: "[BatchImportResultsDialog] one of navigate way for detail result"})}</option>
						<option value={"Errors"}>{i18n.intl.formatMessage({defaultMessage: "Errors", description: "[BatchImportResultsDialog] one of navigate way for detail result"})}</option>
					</bp.HTMLSelect>
					{/* ----- */}
					<label><FormattedMessage defaultMessage={"Message Order"} description={"[BatchImportResultsDialog] import result navigation item title"}/></label>
					<bp.HTMLSelect defaultValue={this.messageOrder} onChange={action(e => this.messageOrder = e.target.value as any)}>
						<option value={"SR"}>{i18n.intl.formatMessage({defaultMessage: "by Severity by Row", description: "[BatchImportResultsDialog] one of sort type for detail messages"})}</option>
						<option value={"SM"}>{i18n.intl.formatMessage({defaultMessage: "by Severity by Message", description: "[BatchImportResultsDialog] one of sort type for detail messages"})}</option>
						<option value={"R"}>{i18n.intl.formatMessage({defaultMessage: "by Row", description: "[BatchImportResultsDialog] one of sort type for detail messages"})}</option>
						<option value={"M"}>{i18n.intl.formatMessage({defaultMessage: "by Message", description: "[BatchImportResultsDialog] one of sort type for detail messages"})}</option>
					</bp.HTMLSelect>
				</bp.NavbarGroup>
			</bp.Navbar>
			<div className={css.bodyContent}>
				<bp.Card className={css.messageList} interactive={false} elevation={bp.Elevation.ONE}>
					{_.map(this.messagesWithOrder, this.renderMessage)}
				</bp.Card>

				<bp.Card className={css.details} interactive={false} elevation={bp.Elevation.FOUR}>
					<h5><FormattedMessage defaultMessage={"Message Details"} description={"[BatchImportResultsDialog] title for input detail message"}/></h5>
					<bp.Callout className={css.detailMessageList}>
						{_.map(this.selectedMessageDetails, (d, i) => <div key={`detail_${i}`} className={css.detailMessage}>{d}</div>)}
					</bp.Callout>

					<h5><FormattedMessage defaultMessage={"Import Data"} description={"[BatchImportResultsDialog] title for input detail table"}/></h5>
					<ImportDataTable block={this.selectedBlock} messages={this.selectedMessages} getColumnName={this.getColumnName} />
				</bp.Card>
			</div>
		</>;
	}

	@action onProgressDataChange = () => {
		if (this.props.progressData.length > 0) {
			const data = this.props.progressData.find(data => data.subtype === BatchImportMessageTypes.results);
			if (data) {
				this.importResults = JSON.parse(data.data);
			}
		}
	}

	closeDialog = async() => {
		runInAction(() => {
			this.props.progressData.splice(0);
			this.importResults = null;
		});
		return 'ok';
	}

	componentDidMount(): void {
		this._dispose.push(observe(this.props.progressData, this.onProgressDataChange, true));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	render() {
		const hasResult = this.importResults != null;
		return (
			<BlueprintDialog
				className={classNames([css.root, {[css.loading]: !hasResult}])}
				title={i18n.intl.formatMessage({defaultMessage: "Batch Import Result", description: "[BatchImportResultsDialog] dialog title"})}
				icon={'cloud-upload'}
				ok={this.closeDialog}
				okDisabled={!hasResult}
				canCancel={false}
				isCloseButtonShown={false}
			>
				{hasResult ?
				 this.resultsContent :
				 <div>
					 <LoadingIndicator active={true} className={css.loadingIndicator} text={i18n.intl.formatMessage({defaultMessage: "Loading Results...", description: "[BatchImportResultsDialog] loading message"})} showText={true} />
				 </div>}
			</BlueprintDialog>
		);
	}
}

@observer
class ImportDataTable extends React.Component<{ block: Block; messages: Message[]; getColumnName: (i: number) => string; }, any>{

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get locationsIdentify(): string {
		return _.flatten(_.map(this.props.messages, m => _.map(m.locations, l => `${m.level}${l.row}${l.column}`))).join("_");
	}


	getCell = (row: number, column: number) => {
		const {block, messages} = this.props;
		let error: boolean, warning: boolean;
		_.each(messages, m => {
			_.each(m.locations, location => {
				if ((location.row == (row + 1) && location.column == (column + 1))) {
					if (m.level == 'Error') {
						error = true;
					} else if(m.level == 'Warning') {
						warning = true;
					}
				}
			});
		})

		let content = block.data.length > row && block.data[row].length > column ? block.data[row][column] : "";
		return <div className={classNames({[css.errorCell]: error, [css.warningCell]: !error && warning})}><span>{content}</span></div>
	}

	@computed get columnNames () {
		const numColumns = Math.max(..._.map(this.props.block.data, d => d.length));
		let columns = [];
		for (let i = 0; i < numColumns; i++ ) {
			columns.push(this.props.getColumnName(i));
		}
		return columns;
	}

	render() {
		const block = this.props.block;
		if (!block) { return null; }

		return <div id={this.locationsIdentify}>
			<bpTable.Table2
				numRows={block.data.length}
				enableRowResizing={false}
				enableColumnResizing={false}
				enableMultipleSelection={false}
				rowHeaderCellRenderer={(rowIndex) => <bpTable.RowHeaderCell
					nameRenderer={() => <>{block.original_lines[rowIndex]}</>}
				/>}
			>{_.map(
				this.columnNames,
				(name, column) => <bpTable.Column
					key={`$Column_${column}`} name={name}
					cellRenderer={(row) => <bpTable.Cell><Observer>{() => this.getCell(row, column)}</Observer></bpTable.Cell>}
				/>
			)}</bpTable.Table2>
		</div>

	}
}
