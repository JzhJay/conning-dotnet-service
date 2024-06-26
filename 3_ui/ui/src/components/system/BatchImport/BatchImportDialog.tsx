import {BlueprintFileInput} from 'components/widgets/BlueprintFileInput';
import * as React from 'react';
import {action, computed, makeObservable, observable, observe} from 'mobx';
import {observer} from 'mobx-react';
import {Progress, Loader} from 'semantic-ui-react';

import {BatchImportResultsDialog} from './BatchImportResultsDialog';
import {bp} from 'components';
import type {FileItem} from 'components/system/UserFile/UserFileUploadComponent';
import {normalizeFileList} from 'components/system/UserFile/UserFileUploadComponent';
import {BlueprintDialog} from 'components/widgets/BlueprintDialog';
import {ObjectChooser} from 'components/system/ObjectChooser/ObjectChooser';
import {appIcons, i18n, site, UserFile} from 'stores';
import { BatchImportMessageTypes, FileImportStatus, FileImportType } from './Types';
import type { BatchImportMessage, BatchImportProgress } from './Types';

import * as css from './BatchImportDialog.css';

interface MyProps {
	batchImport: (importFileId: string, importFileString: string) => Generator<Promise<void>>;
	progressData: BatchImportMessage[];
	title: string;
}

@observer export class BatchImportDialog extends React.Component<MyProps, {}> {
	static CALIBRATION_INPUTS_TITLE = i18n.intl.formatMessage({defaultMessage: "Batch Import Calibration Inputs", description: "[BatchImportDialog] dialog title - Calibration Inputs"});
	static PARAMETERS_TITLE = i18n.intl.formatMessage({defaultMessage: "Batch Import Parameters", description: "[BatchImportDialog] dialog title - Parameters"});

	@observable message: string;
	@observable fileImportType: FileImportType;
	@observable importFile: UserFile;
	@observable uploadFileItem: FileItem;
	@observable fileReader: FileReader;
	@observable batchImportProgress: BatchImportProgress = {
		status: FileImportStatus.preparing,
		importMessage: null,
		importResults: null
	};

	_dispose = [];

	constructor(props) {
		super(props);

		makeObservable(this);
		this.fileImportType = FileImportType.userFile;
	}

	componentDidMount() {
		this.props.progressData.splice(0);	// clear previous result
		this._dispose.push(observe(this.props.progressData, this.onProgressDataChange));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	@action onProgressDataChange = () => {
		if (this.props.progressData.length > 0) {
			const data = _.last(this.props.progressData);
			if (data.subtype == BatchImportMessageTypes.progress) {
				this.batchImportProgress.importMessage = {
					type: data.subtype,
					label: data.currentMessage,
					currentMessage: data.currentMessage,
					progress: data.progress,
					...(data.additionalData ? { additionalData: JSON.parse(data.additionalData)} : {})
				};
			} else if (data.subtype == BatchImportMessageTypes.exception) {
				this.batchImportProgress.importMessage = {
					type: data.subtype,
					label: data.data,
					currentMessage: data.data,
					progress: _.assign({denominator: 1, numerator: 1}, this.batchImportProgress.importMessage)
				};
			} else if (data.subtype  == BatchImportMessageTypes.results) {
				this.batchImportProgress.status = FileImportStatus.done;
				site.setDialogFn(() => <BatchImportResultsDialog progressData={this.props.progressData} /> );
			}

			const { status, importMessage } = this.batchImportProgress;
			if (status == FileImportStatus.importing) {
				const type = _.get(importMessage, "type");
				const value = _.get(importMessage, "progress.numerator", 0);
				const total = _.get(importMessage, "progress.denominator", 1);
				if (type == "exception") {
					this.batchImportProgress.status = FileImportStatus.failed;
				}
			}
		}
	}

	@action importFileChange = (e) => {
		this.fileImportType = e.target.value;
		if (this.fileImportType != FileImportType.upload) {
			this.uploadFileItem = null;
		}
	}

	@computed get okDisabled() {
		return _.includes([
			FileImportStatus.loadFile,
			FileImportStatus.importing,
			FileImportStatus.done
		], this.batchImportProgress.status);
	}

	@computed get canCancel() {
		return this.batchImportProgress.status == FileImportStatus.preparing;
	}

	@computed get render_preparing() {
		if (this.batchImportProgress.status != FileImportStatus.preparing)
			return null;

		return <bp.FormGroup>
			<bp.RadioGroup
				label={i18n.intl.formatMessage({defaultMessage: "Import file", description: "[BatchImportDialog] a dialog group title - choose the file source"})}
				selectedValue={this.fileImportType}
				onChange={this.importFileChange}
			>
				<bp.Radio
					label={i18n.intl.formatMessage(
						{defaultMessage: "Import {uf} from server", description: "[BatchImportDialog] file source - choose from uploaded files"},
						{uf: UserFile.OBJECT_NAME_SINGLE})}
					value={FileImportType.userFile}
				/>
				{this.fileImportType == FileImportType.userFile && <bp.FormGroup>
					<ObjectChooser<UserFile>
						objectType={UserFile}
						chooseItemFilters={{status: ["Complete"], type:["CSV"]}}
						onSave={action((selected) => {
							this.importFile = selected[0];
						})}
						selections={this.importFile ? [this.importFile] : []}
						rootClassName={bp.Classes.INPUT}
					/>
				</bp.FormGroup> }
				<bp.Radio
					label={i18n.intl.formatMessage({defaultMessage: "Upload local file", description: "[BatchImportDialog] file source - upload a file form user machine"})}
					value={FileImportType.upload}
				/>
				{this.fileImportType == FileImportType.upload && <bp.FormGroup>
					<BlueprintFileInput
						accept={".csv"}
						onfileListChange={(fileList) => {
							const selectedFiles:FileItem[] = normalizeFileList(fileList);
							this.uploadFileItem = selectedFiles.length ? selectedFiles[0] : null;
						}}
						blueprintFileInputProps={{fill: true}}
					/>
				</bp.FormGroup>}
			</bp.RadioGroup>
		</bp.FormGroup>
	}

	@computed get render_progress() {
		if (this.batchImportProgress.status == FileImportStatus.preparing)
			return null;

		let label, value, total, error;
		let isTimeConsuming = false;
		if (this.batchImportProgress.status == FileImportStatus.loadFile) {
			label = i18n.intl.formatMessage({defaultMessage: "Reading file...", description: "[BatchImportDialog] progressing - uploading file"});
			value = _.get(this.fileReader, "loaded", 0);
			total = _.get(this.fileReader, "total", 1);
		} else {
			const { batchImportProgress: { importMessage }} = this;
			if (!importMessage) {
				label = i18n.intl.formatMessage({defaultMessage: "Starting...", description: "[BatchImportDialog] progressing - import data starting"});
				value = 0;
				total = 1;
			} else {
				label = importMessage.currentMessage;
				value = _.get(importMessage, "progress.numerator", 0);
				total = _.get(importMessage, "progress.denominator", 1);
				error = importMessage.type == "exception";

				if (importMessage.additionalData) {
					isTimeConsuming = _.get(importMessage.additionalData, "isTimeConsuming", false);
				}
			}
		}

		return ( 
			<>
				<Progress
					progress={true}
					value={value}
					total={total}
					precision={1}
					autoSuccess
					active={true}
					color={error ? "red" : "green"}
					error={error}
					label={label}
				/>
				{ isTimeConsuming && <Loader active inline='centered'/>}
			</>
		);
	}

	@action setMessage(m: string) {
		this.message = m;
	}

	@action
	ok = async () => {
		switch (this.batchImportProgress.status) {
			case FileImportStatus.preparing:
				this.setMessage(null);
				if (this.fileImportType == FileImportType.userFile) {
					if (this.importFile) {
						this.batchImportProgress.status = FileImportStatus.importing;
						this.batchImportProgress.importMessage = null;
						this.props.batchImport(this.importFile._id, null);
					} else {
						this.setMessage(i18n.common.MESSAGE.FILE_MUST_BE_SELECTED);
						return;
					}
				} else if (this.fileImportType == FileImportType.upload) {
					if (this.uploadFileItem) {
						this.batchImportProgress.status = FileImportStatus.loadFile;
						this.fileReader = null;
						const promise = new Promise<string>((res, rej) => {
							const reader = new FileReader();
							reader.onloadend = action(async (loaded) => {
								const csvContent = loaded.target['result'] as string;
								this.batchImportProgress.status = FileImportStatus.importing;
								this.props.batchImport(null, csvContent);
							});

							reader.onprogress = action((e) => {
								this.fileReader = e.target;
							});

							reader.onerror = action((error: any) => {
								this.batchImportProgress.status = FileImportStatus.failed;
								this.message = error.message;
								site.raiseError(error.error);
							});

							reader.readAsText(this.uploadFileItem.file);
						});

						await promise;
					} else {
						this.setMessage(i18n.common.MESSAGE.FILE_MUST_BE_SELECTED);
						return;
					}
				}

				return null;
			case FileImportStatus.failed:
				this.batchImportProgress.importMessage = null;
				return this.batchImportProgress.status;
			case FileImportStatus.done:
				// this.props.rsSimulation.batchImportMessage = null;
				// return 'ok';
			default:
				return null;
		}
	}

	render() {
		const { title } = this.props;
		return <BlueprintDialog
			className={css.root}
			title={title}
			icon={'cloud-upload'}
			ok={this.ok}
			okDisabled={this.okDisabled}
			canCancel={this.canCancel}
			isCloseButtonShown={this.canCancel}
			message={this.message}
			canOutsideClickClose={this.canCancel}
		>
			{this.render_preparing}
			{this.render_progress}
		</BlueprintDialog>;
	}
}
