import * as React from 'react';
import { makeObservable, observable, reaction, flow } from 'mobx';
import { observer } from 'mobx-react';
import {FormattedMessage} from 'react-intl';
import { Progress } from 'semantic-ui-react';
import { Callout } from '@blueprintjs/core';

import { bp } from 'components';
import { UserFileCard } from 'components/system/UserFile/UserFileCard';
import { ObjectLink } from 'components/widgets/SmartBrowser/ObjectLink';
import { BlueprintDialog } from 'components/widgets/BlueprintDialog';
import {appIcons, i18n} from 'stores/api';
import { UserFile } from 'stores/userFile/UserFile';
import { BatchExportObject, BatchExportResultStatus } from './BatchExportTypes';

import * as css from './BatchExportProgressDialog.css';

interface MyProps {
	object: BatchExportObject;
	fileID: number;
	isUserFile: boolean;
	download: (fileID:string, downloadFileName: string) => {};
	downloadFileName?: string;
	appendToLocalFile?: (fileID:number) => {}
	isLocalAppend?: boolean;
}

@observer
export class BatchExportProgressDialog extends React.Component<MyProps, {}> {
	@observable isAppending: boolean = null;
	@observable appendFilename = "";

	_toDispose = [];
	dialogRef: BlueprintDialog;

	constructor(props) {
		super(props);
		makeObservable(this);

		this._toDispose.push(reaction(() => this.isExportComplete, async (isExportComplete) => {
			if (isExportComplete && !props.isUserFile) {
				if (this.props.isLocalAppend) {
					await this.appendToLocalFile();
				} else {
					this.props.download(props.fileID, props.downloadFileName);
				}
			}
		}, { fireImmediately: true }));
	}

	get isExportComplete() {
		const progress = this.batchExportMessage?.progress;
		return progress && progress?.numerator == progress?.denominator && this.props.object.batchExportResult[this.props.fileID] === BatchExportResultStatus.complete;
	}

	get isExportFail() {
		return this.props.object.batchExportResult[this.props.fileID] === BatchExportResultStatus.error;
	}

	get batchExportMessage() {
		return this.props.object.batchExportMessage[this.props.fileID];
	}

	get userFile() {
		return this.props.object.batchExportUserFiles[this.props.fileID];
	}

	@flow.bound
	*appendToLocalFile() {
		this.isAppending = true;
		this.appendFilename = yield this.props.appendToLocalFile(this.props.fileID);
		this.isAppending = false;
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

	render() {
		const { batchExportMessage } = this;
		const { isLocalAppend = false } = this.props;

		const numerator = batchExportMessage?.progress?.numerator || 0;
		const denominator = batchExportMessage?.progress?.denominator || 1;
		const color = this.isExportFail ? 'red' : 'green';

		return <BlueprintDialog
			ref={ref => this.dialogRef = ref}
			className={css.root}
			canCancel={false}
			title={i18n.intl.formatMessage({defaultMessage: `Batch Export`, description: "[BatchExportProgressDialog] dialog title"})}
			icon={'cloud-download'}>
			{batchExportMessage ?
			  <Progress
				progress={true}
				value={numerator}
				total={denominator}
				precision={1}
				autoSuccess
				active={true}
				color={color}
				error={this.isExportFail}
				label={batchExportMessage?.currentMessage} />
			: <Callout>
				<div>
					<bp.Spinner size={14} />
					<FormattedMessage defaultMessage={"Export initializing..."} description={"[BatchExportProgressDialog] default message when export info not come in yet"}/>
					<br/>
					<br/>
				</div>
			  </Callout>}
			{this.isExportComplete &&
				(this.props.isUserFile ?
				<Callout>
					{this.userFile ?
					<>
						<b><FormattedMessage defaultMessage={"{userFile} generated."} description={"[BatchExportProgressDialog] file is generated and saved to server"} values={{userFile: UserFile.OBJECT_NAME_SINGLE}}/></b>
						<br/>
						<ObjectLink
							objectType={"UserFile"}
							icon={appIcons.tools.userFiles}
							id={this.userFile?._id}
							modelLoader={(id) => this.userFile}
							popupContent={(model) => <UserFileCard userFile={model} showHeader={false} isTooltip/>}
							linkTo={model => UserFile.urlFor(model._id)}
							linkContent={model => model.name}
							onLinkClick={(e) => this.dialogRef.result = 'closeByLink'}
						/>
					</> :
					<div>
						<bp.Spinner size={14} />
						<FormattedMessage defaultMessage={"Generating {userFile}..."} description={"[BatchExportProgressDialog] message while system writing export file"} values={{userFile: UserFile.OBJECT_NAME_SINGLE}}/>
						<br/>
						<br/>
					</div>}
				</Callout> :
				isLocalAppend ?
					this.isAppending !== false ?
						<div>
							<bp.Spinner size={14} />
							<FormattedMessage defaultMessage={"Appending to file..."} description={"[BatchExportProgressDialog] message while system append data to the export file"}/>
							<br/>
							<br/>
						</div> :
						<Callout>
							{this.appendFilename ?
							<FormattedMessage defaultMessage={"{appendFilename} was successfully appended!"} description={"[BatchExportProgressDialog] export file appended"} values={{appendFilename: this.appendFilename}}/> : 
							<FormattedMessage defaultMessage="Appending file fails!" description="[BatchExportProgressDialog] append export file fils" />}
						</Callout>
				: <Callout>
					<b><FormattedMessage defaultMessage={"Download initiated."} description={"[BatchExportProgressDialog] file is ready to download message box title"}/></b>
					<br/>
					<FormattedMessage
						defaultMessage={`If your browser setting prevents showing a "save as" dialog, then the file will automatically be downloaded to the browser's designated download folder.`}
						description={"[BatchExportProgressDialog] the direction if file not download automatically"}/>
				</Callout>)}
		</BlueprintDialog>
	}
}