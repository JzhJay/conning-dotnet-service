import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {ObjectLink} from 'components/widgets/SmartBrowser/ObjectLink';
import {FormattedMessage} from 'react-intl';
import {UserFile} from 'stores/userFile/UserFile';
import {bp} from 'components';
import {flow, makeObservable, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {api, appIcons, RSSimulation, i18n, userFileStore} from 'stores';
import { Progress } from 'semantic-ui-react';
import { BlueprintDialog } from 'components/widgets/BlueprintDialog';
import { Callout } from '@blueprintjs/core';

import * as css from './BatchExportProgressDialog.css';

interface MyProps {
	rsSimulation: RSSimulation;
	fileID: number;
	isUserFile: boolean;
	isLocalAppend?: boolean;
	downloadFileName?: string;
}

@observer
export class BatchExportProgressDialog extends React.Component<MyProps, {}> {
	_toDispose = [];
	dialogRef: BlueprintDialog;
	@observable isAppending: boolean = null;
	appendFilename = null;

	constructor(props) {
		super(props);
		makeObservable(this);

		this._toDispose.push(reaction(() => this.batchExportMessage?.progress?.numerator, () => {
			if (this.isExportComplete && !props.isUserFile) {

				if (this.props.isLocalAppend)
					this.appendToLocalFile();
				else
					this.props.rsSimulation.downloadBatchExportFile(props.fileID, props.downloadFileName);
			}
		}));
	}

	@flow.bound
	appendToLocalFile = function* (){
		this.isAppending = true;
		this.appendFilename = yield this.props.rsSimulation.downloadAndAppendToExportFile(this.props.fileID);
		this.isAppending = false;
	}

	get isExportComplete() {
		if (this.batchExportMessage?.type == "exception") {
			return false;
		}
		const progress = this.batchExportMessage?.progress;
		return progress && progress?.numerator == progress?.denominator;
	}

	get batchExportMessage() {
		return this.props.rsSimulation.batchExportMessage[this.props.fileID];
	}

	get userFile() {
		return this.props.rsSimulation.batchExportUserFiles[this.props.fileID];
	}

	render() {
		const { batchExportMessage } = this;
		const {rsSimulation} = this.props;

		const numerator = batchExportMessage?.progress?.numerator || 0;
		const denominator = batchExportMessage?.progress?.denominator || 1;

		const error = batchExportMessage?.type == "exception";

		return <BlueprintDialog
			ref={ref => this.dialogRef = ref}
			className={css.root}
			canCancel={false}
			title={i18n.intl.formatMessage({defaultMessage: `Batch Export`, description: "[BatchExportProgressDialog] dialog title"})}
			icon={'cloud-download'}
			canOutsideClickClose={false}
		>
			{batchExportMessage && <Progress
				progress={true}
				value={numerator}
				total={denominator}
				precision={1}
				autoSuccess
				active={true}
				color={error ? "red" : "green"}
				error={error}
				label={batchExportMessage?.currentMessage}
			/> }
			{this.isExportComplete &&
				(this.props.isUserFile ?
					<Callout>
						{this.userFile ? <>
							<b><FormattedMessage defaultMessage={"{userFile} generated."} description={"[BatchExportProgressDialog] file is generated and saved to server"} values={{userFile: UserFile.OBJECT_NAME_SINGLE}}/></b>
							<br/>
							<ObjectLink
								objectType={"UserFile"}
								icon={appIcons.tools.userFiles}
								id={this.userFile?._id}
								modelLoader={(id) => this.userFile}
								popupContent={(model) => <UserFileCard userFile={model} showHeader={false} isTooltip/> }
								linkTo={model => UserFile.urlFor(model._id)}
								linkContent={model => model.name}
								onLinkClick={(e) => this.dialogRef.result = 'closeByLink'}
							/>
						</> : <div>
							<bp.Spinner size={14} />
							<FormattedMessage defaultMessage={"Generating {userFile}..."} description={"[BatchExportProgressDialog] message while system writing export file"} values={{userFile: UserFile.OBJECT_NAME_SINGLE}}/>
							<br/>
							<br/>
						</div>}
					</Callout> :
				this.props.isLocalAppend ?
					this.isAppending !== false ?
						<div>
							<bp.Spinner size={14} />
							<FormattedMessage defaultMessage={"Appending to file..."} description={"[BatchExportProgressDialog] message while system append data to the export file"}/>
							<br/>
							<br/>
						</div> :
						<Callout>
							<FormattedMessage defaultMessage={"{appendFilename} was successfully appended!"} description={"[BatchExportProgressDialog] export file appended"} values={{appendFilename: this.appendFilename}}/>
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

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}
}