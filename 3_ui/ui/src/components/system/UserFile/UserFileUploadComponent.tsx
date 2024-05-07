import {FormattedMessage} from 'react-intl';
import {bp, dialogs, LoadingUntil, sem} from 'components'
import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import FloatProcess from 'components/system/UserFile/FloatProcess';
import {action, flow, flowResult, computed, makeObservable, observable, reaction, runInAction, when} from "mobx";
import type {IObservableArray} from 'mobx';
import {observer} from "mobx-react";
import * as React from "react";

import type {ObjectNameCheckerResult, IApplicationIcon} from "stores";
import {api, omdb, repositoryStore, routing, site, UserFile, userFileStore, i18n} from "stores";
import {waitCondition} from '../../../utility';
import {filesize} from '../../../utility/filesize';
import {FileItemUploadProgress} from '../../../stores/userFile/UserFileStore';
import {i18nMessages} from './i18nMessages';

import * as css from './UserFileUploadComponent.css';

const { Progress } = sem;

interface MyProps {
	windowMode?: boolean;
	windowActive?: boolean;
	dropEnabled?: boolean;
	showChooseTypeItems?: boolean;
	resumeMode?: boolean;
	resumeFile?: FileItemUploadProgress;
	resumeFileItems?: FileItem[];
	onClose?: (isUploading: boolean) => void;
	onRefresh?: () => void;
	onFileUploadSuccess?: (fileId: string) => void;
}

export interface FileItem {
	file: File;
	fullName: string;
	totalParts?: number;
	partsUploaded?: number;
	isFileUploaded?: boolean;
	uploadedSize?: number;
	totalSize?: number;
}

export interface QueueUploadFile {
	name: string;
	fileItemList: FileItem[];
	tagValues: string[];
}

export const MAX_SIMULTANEOUS_UPLOADS_NUM = 4;

const SLICE_SIZE = 1024 * 1024 * 5;

export function normalizeFileList(files, parentPath = ''): FileItem[] {
	return _.values(files).filter(file => file.name.indexOf('.') !== 0).map((file) => {
		const size = file.size;
		const totalParts = Math.ceil(size / SLICE_SIZE);
		let fullName = file.webkitRelativePath || file.name;
		if (parentPath) {
			fullName = `${parentPath}${fullName}`
		}
		return observable({
			file: file,
			fullName,
			totalParts: totalParts,
			partsUploaded: 0,
			uploadedSize: 0,
			totalSize: file.size,
			isFileUploaded: false
		})
	});
}

@observer
export class UserFileUploadComponent extends React.Component<MyProps, {}> {
    _toDispose = [];

    typeOptions = [
		{label: i18n.intl.formatMessage(i18nMessages.file), value: "File", icon:"document", ref: React.createRef<HTMLInputElement>()}, 
		{label: i18n.intl.formatMessage(i18nMessages.folder), uploadFolder: true, ref: React.createRef<HTMLInputElement>()}
	];

    // windows control
    @observable isWindowActive = this.props.windowActive;
    @observable isMiniUploadWindowOpen = false;
    @observable loadingMessage = "";
    toastId: string;

	// name information
	nameInputFieldRef = React.createRef<NameInputField>();
	@observable hasValidName: boolean;
	@observable nameInputFieldResult: ObjectNameCheckerResult;

    // file information
	@observable uploadFilesQueue: IObservableArray<QueueUploadFile> = observable.array();
	@observable.ref candidateUploadFile: FileItem[] = null;
	@observable uploadObjectName: string = '';
	@observable fileId = "";
	@observable fileType = "";
	@observable.ref fileItem: FileItem;
    @observable.ref fileItemList: FileItem[];
	
    // during uploading
    @observable isUploading = false;
    @observable addFilesByDrop = false;
	@observable estimateUploadSpeed: number = 0;
	@observable uploadedSize: number = 0;
	@observable totalUploadSize: number = 0;
	@observable.ref uploadGeneratorPromise = null;
	@observable allRequiredTagSelected;
	omdbTagFormRef = null;
	fileDropElemRef = null;
	currentRunningUploads = 0;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);

		const { resumeMode = false } = props;
		if (resumeMode) {
			const { resumeFileItems } = props;
			this.hasValidName = true;
			this.fileItemList = resumeFileItems;
		}
    }

    @computed get isLoading() {
		return !!this.loadingMessage;
	}

	getNameByFirstFile = (fileItemList): string => {
		if (!fileItemList?.length) {
			return null;
		}
		const file = fileItemList[0].file;
		return file.name.substr(0, file.name.lastIndexOf('.'));
	}

	@computed get name() {
		if (this.props.resumeMode) {
			return this.props.resumeFile.objectName;
		}

		return this.uploadObjectName;
	}

    get isCreateRepository() {
		return routing.query.createRepository == 'true';
	}

    get isWindowMode() {
		return this.props.windowMode === true;
	}

    @computed get isInitialized () {
		return !!this.fileId;
	}

    @computed get canDropFiles() {
		return !(this.props.dropEnabled === false || this.isLoading);
	}

    @computed get hasFile() {
		return this.fileItemList && this.fileItemList.length > 0;
	}

    @computed public get allFileUploaded() {
		const uploadingCount = this.fileItemList ? this.fileItemList.filter((fi)=>fi.isFileUploaded).length : 0;
		return uploadingCount > 0 && uploadingCount == this.fileItemList.length;
	}

    @computed get uploadingTitle():string {
		const totalFilesCount = this.fileItemList.length;
		if (!this.isInitialized) {
			return i18n.intl.formatMessage(i18nMessages.initialization);
		} else if (this.allFileUploaded) {
			return i18n.intl.formatMessage(totalFilesCount > 1 ? i18nMessages.otherFileUploaded : i18nMessages.oneFileUploaded, {
				totalFilesCount
			});
		} else {
			const uploadedFilesCount = this.fileItemList.filter((fi)=>fi.isFileUploaded).length;
			return i18n.intl.formatMessage(totalFilesCount > 1 ? i18nMessages.otherFileUploading : i18nMessages.oneFileUploading, {
				uploadedFilesCount: uploadedFilesCount,
				totalFilesCount: totalFilesCount
			});
		}
	}

    @computed get uploadingRemainingEstimateTimeTitle() :string {
		const { fileItem, estimateUploadSpeed, totalUploadSize, uploadedSize } = this;
		
		if (fileItem && estimateUploadSpeed > 0) {
			let title = '';
			let hrTitle = ''
			let minuteTitle = ''
			let secondTitle = ''
			const remainingTimeSecond = Math.floor((totalUploadSize - uploadedSize)/estimateUploadSpeed);
			let mins = Math.floor(remainingTimeSecond / 60);
			const seconds = remainingTimeSecond % 60;
			if (mins > 0) {
				const hrs = Math.floor(mins / 60);
				if (hrs > 0) {
					mins = mins % 60;
					hrTitle = i18n.intl.formatMessage(hrs > 1 ? i18nMessages.hourOther : i18nMessages.minuteOne, { hour: hrs})
				}
				minuteTitle = i18n.intl.formatMessage(mins > 1 ? i18nMessages.minuteOther : i18nMessages.minuteOne, { minute: mins});
			}

			if (seconds > 0) {
				secondTitle = i18n.intl.formatMessage(seconds > 1 ? i18nMessages.secondOther : i18nMessages.secondOne, { second: seconds});
			}

			if (hrTitle || minuteTitle || secondTitle) {
				title = i18n.intl.formatMessage(i18nMessages.leftUploadTime, {
					hour: hrTitle,
					minute: minuteTitle,
					second: secondTitle
				});
			}

			return (title || i18n.intl.formatMessage(i18nMessages.uploadIsAlmostFinished));
		}
		return i18n.intl.formatMessage(i18nMessages.estimatingUploadTime);
	}

    @computed get uploadingIcon():IApplicationIcon {
		if (!this.isInitialized) {
			return {type: 'blueprint', name: 'property'};
		} else if (this.allFileUploaded) {
			return {type: 'blueprint', name: 'tick'};
		} else {
			return {type: 'blueprint', name: 'cloud'};
		}
	}

	@computed get uploadingFileName(): string {
		const { fileItemList, fileItem } = this;
		if (fileItem) {
			if (fileItemList.length > 0) {
				const index = fileItemList.findIndex(f => f == fileItem);
				return `${fileItem.fullName} (${index + 1}/${fileItemList.length})`
			}

			return fileItem.fullName;
		} 

		return '';
	}

	updateEstimateNetworkSpeed = action((uploadPart?, uploadStartTime?) => {
		const downlink = _.get(navigator, ['connection', 'downlink'], null);

		if (uploadPart) {
			const { size } = uploadPart;
			this.estimateUploadSpeed = size / ((Date.now() - uploadStartTime)/1000); // byte per seconds
		} else if (downlink) { // 1 megabit https://wicg.github.io/netinfo/#dfn-mbit-s
			this.estimateUploadSpeed = downlink * 125000;
		} else {
			this.estimateUploadSpeed = 0;
		}
	})

    renderFileSelector = (option) => {
		const myAttr = option.uploadFolder ? {'webkitdirectory':'true', 'data-type':option.value } : {'data-type':option.value};
		return (
			<div
				className={classNames([css.fileSelector])}
				title={`Upload ${option.label}`}
			>
				<bp.Icon icon={option.icon} iconSize={40} />
				<span>{option.label}</span>
				<input type="file" multiple={option.uploadFolder} ref={option.ref} onChange={this.fileSelected} title={`upload ${option.label}`} {...myAttr}/>
			</div>
		);
	}

    renderMessageDetails(m) {
		return <p>{`${m.code == 'I'?'Info':m.code == 'W'?'Warning':'Error'}: ${m.message} ${m.rowNumber >= 0 ? `in row ${m.rowNumber}` : ""} ${m.columnName != "" ? `in column "${m.columnName}"` : ""} ${m.fileName != "" ? `in file "${m.fileName}"` : ""}`}</p>
	}

	@flow.bound
	*confirmCancelUpload() {
		if (this.isUploading && !(yield site.confirm(i18n.intl.formatMessage(i18nMessages.cancelUploadConfirm)))) {
			return false;
		}
		return true;
	}

	@flow.bound 
	*cancelUploadingProcess() {
		if (this.isUploading && this.uploadGeneratorPromise) {
			this.uploadGeneratorPromise.cancel();
			yield userFileStore.cancelUpload(this.fileId);
			this.clearProgressInactivityTimer();
		}
	}

	@flow.bound
	*onMiniUploadWindowClose () {
		yield this.cancelUploadingProcess();
		this.clear();
		this.isMiniUploadWindowOpen = false;
	}

	cancelCandidateUploadFile = action(() => {
		this.candidateUploadFile = null;
	})

	addUploadFileQueue = action(() => {
		this.uploadFilesQueue.push({
			name: this.nameInputFieldResult.input,
			fileItemList: this.candidateUploadFile,
			tagValues: this.omdbTagFormRef?.getSelectedTagValues() || []
		});
		this.candidateUploadFile = null;
		this.closeWindow();
	})

	onNameInputFieldChange = action((e, component) => this.hasValidName = component.hasValidName)

	onNameInputFieldUpdateResult = action((result, component) => {
		this.hasValidName = component.hasValidName;
		this.nameInputFieldResult = result;
	})

	onTagSelectionStatusUpdate = action((status) => this.allRequiredTagSelected = status)

	renderUploadFilesForm = () => {
		const { resumeMode, resumeFile } = this.props;
		const { candidateUploadFile } = this;
		let isNameInputFieldDisabled;
		let isTagFormDisabled;
		let fileItemList;

		if (candidateUploadFile) {
			fileItemList = this.candidateUploadFile;
			isNameInputFieldDisabled = false;
			isTagFormDisabled = false;
		} else {
			fileItemList = this.fileItemList;
			isNameInputFieldDisabled = this.isUploading || this.isInitialized;
			isTagFormDisabled = this.isUploading && !this.allFileUploaded;
		}

		if (fileItemList && fileItemList.length > 0) {
			return (
				<>
					{candidateUploadFile && <bp.FormGroup label={i18n.intl.formatMessage(i18nMessages.uploadInProgress)} />}
					<bp.FormGroup label={i18n.intl.formatMessage(i18nMessages.name)} className={css.formInput}>
						{ resumeMode ? 
						<bp.InputGroup disabled={true} defaultValue={_.get(resumeFile, 'objectName', '')} /> :
						<NameInputField
							objectType={UserFile.ObjectType}
							value={this.getNameByFirstFile(fileItemList)}
							disabled={isNameInputFieldDisabled}
							ref={this.nameInputFieldRef}
							onChange={this.onNameInputFieldChange}
							onUpdateResult={this.onNameInputFieldUpdateResult}
						/>}
					</bp.FormGroup>
					<bp.FormGroup>
						<OmdbTagForm
							objectType={"UserFile"}
							ref={r => this.omdbTagFormRef = r}
							selectionStatusUpdate={this.onTagSelectionStatusUpdate}
							requiredTagsOnly={false}
							disabled={isTagFormDisabled}
						>{(tag, selector,index) => {
							return <bp.Label key={`${tag.name}_index`}>
								<div>{tag.name}</div>
								{selector}
							</bp.Label>
						}}</OmdbTagForm>
					</bp.FormGroup>
					<bp.FormGroup
						label={i18n.intl.formatMessage(fileItemList.length > 1 ? i18nMessages.selectFilesCount : i18nMessages.selectOneFileCount, {
							count: fileItemList.length
						})}
						labelInfo={this.isInitialized ? this.uploadingTitle : null}
						intent={this.allFileUploaded ? bp.Intent.SUCCESS : null}
						className={css.fileList}
					>
						{fileItemList.map((fi,i) => <div key={`fileItem_${i}`} className={css.fileItem}>
							<div className={css.fileName}>{fi.fullName}</div>
							<div className={css.fileSize}>{filesize(fi.file.size)}</div>
							{this.isCreateRepository && <div className={css.fileStatus}>{
								fi.isFileUploaded ?
								<div><bp.Icon icon={"tick"} intent={bp.Intent.SUCCESS} /><FormattedMessage {...i18nMessages.uploadComplete}/></div> :
								!fi.totalParts ?
									<div style={{color: "grey"}}><FormattedMessage {...i18nMessages.waitingForUpload} /></div> :
									<Progress value={fi.partsUploaded || 0}
											total={fi.totalParts || 1}
											autoSuccess
											active={fi.isFileUploaded === false}
											color='green'
											label={`${(!fi.partsUploaded || !fi.totalParts) ? '0' : Math.round(fi.partsUploaded / fi.totalParts * 100)}%`}
									/>
							}</div>}
						</div>)}
					</bp.FormGroup>
				</>
			);
		}
		return null;
	}

    render() {
		const { resumeMode } = this.props;
		const title = i18n.intl.formatMessage(resumeMode ? i18nMessages.resume : i18nMessages.uploadFile);
		
		return <>
			<div
				ref={ r => this.fileDropElemRef = r }
				className={classNames([
					css.dropFileElem,
					{[css.disableDrop]: !this.canDropFiles},
					{[css.windowModeActive]: this.isWindowMode && this.isWindowActive}
				])}
				onDrop={this.fileDrop}
				onDragLeave={this.dragEnd}
				onDragExit={this.dragEnd}
				onClick={this.closeWindowByBackground}
			>
				<div className={css.dropMsgOuter}>
					<bp.Icon icon="cloud-upload" iconSize={80}/><br/>
					<div className={css.dropMsg}>
						<FormattedMessage {...i18nMessages.dropToUpload} />
					</div>
				</div>
			</div>

			<div className={classNames([
				css.block,
				{[css.windowMode]: this.isWindowMode},
				{[css.active]: this.isWindowActive},
				{[css.loading]: this.isLoading}
			])}>
				<LoadingUntil loaded={!this.isLoading} message={this.loadingMessage} >
					<div className={css.inputForm}>
						{this.isWindowMode && <bp.Icon className={css.closeWindeow} icon={'cross'} onClick={this.closeWindow} title={'close'} />}
						<bp.FormGroup label={title} className={ classNames([ css.fileSelectors, {[css.hide]: this.props.showChooseTypeItems === false}])} >
							{!resumeMode && this.typeOptions.map((v, i) => <React.Fragment key={`fileSelector${i}`}>{this.renderFileSelector(v)}</React.Fragment>)}
							{this.canDropFiles && <div className={css.dropFileNotice}>
								<bp.Icon icon="cloud-upload" iconSize={40}/>
								<span><FormattedMessage {...i18nMessages.dropFileUpload} /></span>
							</div>}
						</bp.FormGroup>

						{this.renderUploadFilesForm()}
						{!this.isUploading &&
						<bp.FormGroup className={classNames([css.ctrls])}>
							{this.isCreateRepository && !this.isInitialized && <bp.Button text={i18n.intl.formatMessage(i18nMessages.createSimulation)} onClick={()=>this.createSimulation(false)} minimal={this.hasFile} />}
							{this.props.windowMode == true && <bp.Button text={i18n.intl.formatMessage(this.isInitialized ? i18nMessages.closeWindow : i18nMessages.cancel)} onClick={this.closeWindow} disabled={this.isUploading} />}
							{this.hasFile && !this.allFileUploaded && <bp.Button text={i18n.intl.formatMessage(i18nMessages.upload)} intent={bp.Intent.PRIMARY} onClick={this.onUpload} disabled={!this.hasValidName || this.allRequiredTagSelected !== true || this.isUploading} />}
							{this.isCreateRepository && this.allFileUploaded && <bp.Button text={i18n.intl.formatMessage(i18nMessages.continue)} intent={bp.Intent.SUCCESS} onClick={()=>this.createSimulation(true)} />}
						</bp.FormGroup>}
						{this.candidateUploadFile &&
						<bp.FormGroup className={classNames([css.ctrls])}>
							<bp.Button text={i18n.intl.formatMessage(i18nMessages.cancel)} onClick={this.cancelCandidateUploadFile}  />
							<bp.Button text={i18n.intl.formatMessage(i18nMessages.addToQueue)} disabled={!this.hasValidName} intent={bp.Intent.PRIMARY} onClick={this.addUploadFileQueue} />
						</bp.FormGroup>}
					</div>
				</LoadingUntil>
			</div>
			{this.isMiniUploadWindowOpen && 
			<FloatProcess
				title={this.uploadingTitle}
				icon={this.uploadingIcon}
				confirmClose={this.confirmCancelUpload}
				onClose={this.onMiniUploadWindowClose}
				className={this.allFileUploaded ? bp.Classes.INTENT_SUCCESS : null}
			>
				<div className={css.uploadStatus}>
					{ !this.fileId && <div className={css.uploadStatusGroup}>
						<div className={css.uploadStatusIcon}><sem.Loader className='icon' active inline/></div>
						<div className={css.uploadStatusTitle}>
							<div><b>{this.name}</b></div>
							<div><FormattedMessage {...i18nMessages.initializing} /></div>
						</div>
					</div> }

					{ this.fileId && <>
						<div className={css.uploadStatusGroup}>
							<div className={css.uploadStatusIcon}><sem.Icon name='checkmark' color='green'/></div>
							<div className={css.uploadStatusTitle}>
								<div><b>{this.name}</b></div>
								<div><FormattedMessage {...i18nMessages.initialized} /></div>
							</div>
						</div>
						{this.isUploading &&
						<div className={css.uploadStatusGroup}>
							<div className={css.uploadStatusIcon}><sem.Icon name='cloud'/></div>
							<div className={css.uploadStatusTitle}>
								<div className={css.estimateRemainingTime}>
									<b>{this.uploadingRemainingEstimateTimeTitle}</b>
									<b className={css.totalUploadSizeText}><FormattedMessage {...i18nMessages.totalSize} values={{size: filesize(this.totalUploadSize)}} /></b>
								</div>
								<div>
									{`${filesize(this.estimateUploadSpeed)}/s`}
								</div>
							</div>
						</div> }
						<sem.Segment>
							<div className={css.uploadStatusGroup}>
								<div className={css.uploadStatusIcon}>{
									this.uploadedSize === 0 || (this.uploadedSize != this.totalUploadSize) ?
									<sem.Loader className='icon' active inline/> :
									<sem.Icon name='checkmark' color='green'/>
								}</div>
								<div className={css.uploadStatusTitle}>
									<div><b>{this.uploadingFileName}</b></div>
									<div>
										<Progress value={this.uploadedSize}
										          total={this.totalUploadSize}
										          autoSuccess
										          active={this.isUploading}
										          color='green'
										          label={`${(!this.uploadedSize || !this.totalUploadSize) ? '0' : Math.round(this.uploadedSize / this.totalUploadSize * 100)}%`}
										/>
									</div>
								</div>
							</div>
						</sem.Segment>
					</>}
					{this.uploadFilesQueue.length > 0 && <div className={css.pendingUpload}><FormattedMessage {...i18nMessages.pendingUploadCount} values={{count: this.uploadFilesQueue.length}}/></div> }
				</div>
			</FloatProcess>}
		</>
	}

    windowDrag = (e) => {
		// stop the event, let drop element is the only one to start the drag event.
		// because there had a drop sensor on the file browser. we should not start that event.
		e.preventDefault();
		if (this.props.dropEnabled !== false && e.dataTransfer && e.dataTransfer.types[0] == 'Files') {
			api.site.setDialogFn(null);
			$(this.fileDropElemRef).toggleClass(css.dragging, true);
		}
	};

    componentDidMount() {
		console.log("Load Repository Upload");
		document.body.addEventListener('dragover',this.windowDrag);
		this._toDispose.push(reaction(() => this.allFileUploaded, () => {
			this.allFileUploaded && this.props.onRefresh && this.props.onRefresh();
		}))
	}

    componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, prevContext: any): void {
		if (this.isWindowActive && this.addFilesByDrop) {
			return;
		}
		if (this.isWindowActive != this.props.windowActive) {
			runInAction(() => {
				this.isWindowActive = this.props.windowActive;
				if (this.isWindowActive) {
					// this.fileItemList = [];
					this.nameInputFieldResult && (this.nameInputFieldResult.isAutoGenerated = true);
				}
			});
		}
	}

    componentWillUnmount(): void {
		this._toDispose.forEach(f => f());
		document.body.removeEventListener('dragover',this.windowDrag);
		this.clearProgressInactivityTimer();
		this.clear();
	}

	@flow.bound
    *deleteCurrentFile() {
		if (this.fileId) {
			yield this.cancelUploadingProcess();
			const userfile = yield userFileStore.loadDescriptor(this.fileId);
			userFileStore.deleteFile(userfile, true);
		}
		this.clear();
	}

	@action clear = () => {
		this.isUploading = false;
		this.fileId = null;
		this.fileItemList = [];
		this.resetFileInputs();
		this.uploadFilesQueue.clear();
		if (this.toastId) {
			site.toaster?.dismiss(this.toastId);
			this.toastId = null;
		}
	}

	@flow.bound
    *createSimulation(usingFile: boolean) {
		if (usingFile && !this.fileId) {
			return;
		} else if (!usingFile){
			yield this.deleteCurrentFile();
		}

		const message = i18n.intl.formatMessage(i18nMessages.createNewSimulation);
		const defaultRepoName = routing.query.repositoryName ? _.toString(routing.query.repositoryName) : undefined;
		const defaultUserTagValues = routing.query.tagValues ? (routing.query.tagValues as string).split(",") : undefined;
		const hasRequired = yield OmdbTagForm.hasRequiredUserTagsByObjectType("Simulation");
		if (hasRequired && !defaultUserTagValues) {
			dialogs.newRespository(this.fileId, defaultRepoName, () => this.loadingMessage = message);
		} else {
			this.loadingMessage = message;
			repositoryStore.createNewRespository(this.fileId, defaultRepoName, defaultUserTagValues);
		}
	}

    @action closeWindow = () => {
		if (this.addFilesByDrop) {
			this.addFilesByDrop = false;
			this.isWindowActive = false;
		}
		if (this.props.windowMode && this.isWindowActive ) {
			if (this.props.onClose) {
				this.props.onClose(this.isUploading);
			} else {
				this.isWindowActive = false;
			}
		}
	}

	@flow.bound
    *fileDrop(e) {
		if (!$(e.target).hasClass(css.dragging)) { return; }

		// cancel the event, the default action will make the browser try to open the drop file.
		// because there had a drop sensor on the file browser. we should not trigger that event.
		e.preventDefault();
		$(e.target).toggleClass(css.dragging, false);

		// get all files in folder tree.
		const processItem = async (items, parentPath: string = '', result = []) => {
			const files = items.filter(item => item.isFile);
			if (files.length > 0) {
				const filesPromise = files.map((file) => {
					return new Promise((resolve) => {
						file.file(resolve);
					});
				});
				const loadedFiles = await Promise.all(filesPromise);
				result.push(...normalizeFileList(loadedFiles, parentPath));
			}

			const directories = items.filter(item => item.isDirectory);
			if (directories) {
				await Promise.all(directories.map((dir) => {
					return new Promise((resolve) => {
						const dirReader = dir.createReader();
						dirReader.readEntries((entries) => {
							processItem(Array.prototype.slice.call(entries), `${parentPath}${dir.name}/`, result).then(resolve);
						});
					});
				}));
			}
		
			return result;
		}

		if (e.dataTransfer.items.length) {
			const items = Array.prototype.slice.call(e.dataTransfer.items).map(item => item.webkitGetAsEntry());
			if (this.isCreateRepository) {
				yield this.deleteCurrentFile();
			}

			const fileItemList = yield processItem(items);
			if (fileItemList.length) {
				this.addFilesByDrop = true;
				this.isWindowActive = true;	
				if (this.isUploading) {
					this.candidateUploadFile = fileItemList;
				} else {
					this.fileItemList = fileItemList;
				}
				this.updateDefaultName(fileItemList);
			} else {
				site.toaster.show({message: i18n.intl.formatMessage(i18nMessages.noFilesDetected), intent: bp.Intent.DANGER});
			}
		}
	}

	@flow.bound
    *fileSelected(e) {
		const selectedFiles:FileItem[] = normalizeFileList(e.target.files);
		if (selectedFiles.length) {
			if (this.isCreateRepository) {
				yield this.deleteCurrentFile();
			}

			this.addFilesByDrop = false;
			if (this.isUploading) {
				this.candidateUploadFile = selectedFiles;
			} else {
				this.fileItemList = selectedFiles;
			}
			this.updateDefaultName(selectedFiles);
		} else {
			site.toaster.show({message: i18n.intl.formatMessage(i18nMessages.noFilesDetected), intent: bp.Intent.DANGER});
		}
	}

    updateDefaultName = (fileItemList: FileItem[]) => {
		if ((this.nameInputFieldResult?.isAutoGenerated) || this.fileId) {
			if (this.nameInputFieldRef.current) {
				this.nameInputFieldRef.current.updateName(this.getNameByFirstFile(fileItemList)).then((result) => {
					result.isAutoGenerated = true;
					this.nameInputFieldResult = result;
				});
			}
		}
	}

    dragEnd = (e) => {
		// sometimes the drag start event will be triggered again if the user puts their mouse on the edge of the drop element.
		// delay the action can make the element hidden correctly.
		const $target = $(e.target);
		setTimeout(() => $target.toggleClass(css.dragging, false) , 20);
	};

    closeWindowByBackground = (e) => {
		e.preventDefault();
		if ($(e.target).hasClass(css.windowModeActive)) {
			this.closeWindow();
		}
	}

	resetFileInputs() {
		this.typeOptions.forEach(({ref}) => {
			if (ref.current) {
				ref.current.value = '';
			}
		});
	}

	onUpload = (e) => {
		this.resetFileInputs();
		this.startUpload();
	}

	startUpload = action((queueUploadFile: QueueUploadFile = null) => {
		this.uploadGeneratorPromise = flowResult(this.upload(queueUploadFile));
		this.uploadGeneratorPromise.catch(e => {
			if (_.get(e, 'message', '') === 'FLOW_CANCELLED') {
				return;
			}
			throw e;
		});
	})

    // ====================== upload =========================
	@flow.bound
	*upload(queueUploadFile: QueueUploadFile) {
		const { resumeMode } = this.props;
		this.fileId = '';
		this.isUploading = true;
		this.isWindowMode && (this.isMiniUploadWindowOpen = true);
		let failureCounts = {};
		let tagValueIds;
		this.closeWindow();

		let fileType = '';
		let fileName = '';
		if (resumeMode) {
			const { resumeFile } = this.props;
			this.fileId = resumeFile.id;
			this.uploadObjectName = resumeFile.objectName;
			fileName = resumeFile.objectName;
			fileType = resumeFile.fileType;
			this.fileType = fileType;
		} else {
			if (queueUploadFile) {
				this.uploadObjectName = queueUploadFile.name;
				tagValueIds = queueUploadFile.tagValues;
			} else {
				this.uploadObjectName = this.nameInputFieldResult.input;
				tagValueIds =this.omdbTagFormRef?.getSelectedTagValues() || [];
			}

			if(this.fileItemList.length == 1 ){
				fileName = this.fileItemList[0].fullName;
				fileType = (fileName.substr(fileName.lastIndexOf('.')+1) || '').toUpperCase();
			} else {
				fileType = 'FOLDER';
			}

			try {
				this.fileId = yield userFileStore.uploadFileInit(this.name, fileType, this.fileItemList.length, tagValueIds)
				this.props.onRefresh && this.props.onRefresh();
			} catch(e) {
				site.toaster.show({ message: e.message , intent: bp.Intent.DANGER });
			}
			
			this.fileType = fileType;
		}

		if(!this.fileId){
			this.isUploading = false;
			return;
		}
		
		if (!resumeMode) {
			userFileStore.addUploadingFile(this.fileId, fileType, this.name, this.fileItemList);
		}

		when(() => this.allFileUploaded).then(action(() => {
			if (!this.isWindowMode) {
				this.toastId = site.toaster.show({
					intent:  bp.Intent.SUCCESS,
					timeout: 10 * 1000,
					message: <div><b>{this.uploadingTitle}</b></div>
				});
			}

			userFileStore.deleteUploadingFile(this.fileId);
			this.isUploading = false;
			const { onFileUploadSuccess } = this.props;
			if (onFileUploadSuccess) {
				onFileUploadSuccess(this.fileId);
			}

			if (this.uploadFilesQueue.length > 0) {
				const uploadFile = this.uploadFilesQueue.shift();
				this.fileId = '';
				this.fileItemList = uploadFile.fileItemList;
				this.startUpload(uploadFile);
			}
		}));

		const { fileItemList } = this;
		this.uploadedSize = 0;
		this.totalUploadSize = fileItemList.reduce((accu, fi) => accu + _.get(fi, ['file', 'size'], 0), 0);
		this.estimateUploadSpeed = 0;

		for (let i = 0, length = fileItemList.length; i < length; i++) {
			const fi = fileItemList[i];
			this.fileItem = fi;
			if (resumeMode) {
				if (fi.isFileUploaded) {
					this.uploadedSize += fi.totalSize;
				} else {
					yield this.resumeMultiPartUpload(i, fi, failureCounts);
				}
			} else {
				yield this.startMultiPartUpload(i, fi, failureCounts);
			}
		}
	}

	@flow.bound
	*startMultiPartUpload(fileIndex: number, fileItem: FileItem, failureCounts) {
		const fi = fileItem;
		const file = fi.file;
		const size = file.size;
		const totalParts = Math.ceil(size / SLICE_SIZE);
		
		fi.totalParts = totalParts;
		fi.partsUploaded = 0;
		fi.isFileUploaded = false;
		fi.uploadedSize = 0;
		fi.totalSize = size;
		
		let start = 0;
		let part = 0;

		while (start < size) {
			if(this.currentRunningUploads >= MAX_SIMULTANEOUS_UPLOADS_NUM)
			{
				yield waitCondition(() => this.currentRunningUploads < MAX_SIMULTANEOUS_UPLOADS_NUM);
			}
			this.currentRunningUploads += 1;

			part++;

			let end = start + SLICE_SIZE;
			if (size - end < 0) {
				end = size;
			}

			let s = this.slice(file, start, end);

			// Wrap upload in function to retry failed uploads
			let currentPart = part;
			this.uploadFile(this.fileId, fileIndex, fi, s, currentPart, totalParts, failureCounts);

			start += SLICE_SIZE;
		}
	}

	@flow.bound
	*resumeMultiPartUpload(fileIndex: number, fi: FileItem, failureCounts) {
		const { file } = fi;
		const size = file.size;
		let start = 0;
		let part = 0;

		const uploadedParts = userFileStore.getUploadingFileProgress(this.fileId, fileIndex);
		while (start < size) {
			part++;

			let end = start + SLICE_SIZE;
			if (size - end < 0) {
				end = size;
			}

			let s = this.slice(file, start, end);

			// Wrap upload in function to retry failed uploads
			let currentPart = part;
			if (!uploadedParts.some((p) => p === part)) {	// not upload yet
				if(this.currentRunningUploads >= MAX_SIMULTANEOUS_UPLOADS_NUM)
				{
					yield waitCondition(() => this.currentRunningUploads < MAX_SIMULTANEOUS_UPLOADS_NUM);
				}
				this.currentRunningUploads += 1;
				this.uploadFile(this.fileId, fileIndex, fi, s, currentPart, fi.totalParts, failureCounts);
			} else {
				this.uploadedSize += s.size;
				this.updateProgress(this.fileId, fileIndex, fi);
			}
			start += SLICE_SIZE;
		}
	}

	@flow.bound
    *uploadFile(fileId: string, fileIndex: number, fi: FileItem, s, currentPart, totalParts, failureCounts) {
		const uploadStartTime = Date.now();
		try {
			const splitFileNameByDir = fi.fullName.split('/');
			const uploadFileName = splitFileNameByDir.length > 1 ? splitFileNameByDir.slice(1).join('-') : fi.fullName; // ignore root folder name in folder upload
			const res = yield userFileStore.uploadFile(fileId, s, uploadFileName, currentPart, totalParts, this.props.resumeMode ? '1' : '0');
			const { part, success } = res;
			if (res && part == currentPart && success)
			{
				const uploadedSize = s.size;
				fi.uploadedSize += uploadedSize;
				this.uploadedSize += uploadedSize;
				this.updateEstimateNetworkSpeed(s, uploadStartTime);
				this.updateProgress(fileId, fileIndex, fi);
				userFileStore.updateUploadingFileProgress(fileId, fileIndex, { part: currentPart});
				this.currentRunningUploads -= 1;
			}
			else
				throw new Error(`Invalid response from server for part: ${currentPart}. Server response: ${JSON.stringify(res)}`);
		} catch (e) {
			const retryInterval = 30 * 1000;
			failureCounts[currentPart] = failureCounts[currentPart] != null ? failureCounts[currentPart] + 1 : 1;

			if (e.status != 400 && failureCounts[currentPart] < 5) {
				site.toaster.show({message: i18n.intl.formatMessage(i18nMessages.errorAttemptRetry, { message: e.message, retryCount: failureCounts[currentPart] }), intent: bp.Intent.WARNING, timeout: retryInterval});
				setTimeout(() => this.uploadFile(fileId, fileIndex, fi, s, currentPart, totalParts, failureCounts), retryInterval);
			}
			else {
				site.raiseError(e, "julia", null, true, 0);
			}

			this.clearProgressInactivityTimer();
		}
	}

    slice(file, start, end) {
		if (file.slice) {	// slice is supported by most browsers now, so move it to top
			return file.slice(start, end);
		}

		let slice = file.mozSlice ? file.mozSlice :
					(file.webkitSlice ? file.webkitSlice : this.noop);

		return slice.bind(file)(start, end);
	}

    noop() {
	}

    progressInactivityTimer = null;
    clearProgressInactivityTimer = () => clearTimeout(this.progressInactivityTimer);

    updateProgress = (fileId, fileIndex, fileItem:FileItem) => {
		fileItem.partsUploaded += 1;
		if (fileItem.partsUploaded == fileItem.totalParts) {
			fileItem.isFileUploaded = true;
			userFileStore.updateUploadingFileProgress(fileId, fileIndex, { isFileUploaded: true });
		}

		this.clearProgressInactivityTimer();

		if (!fileItem.isFileUploaded) {
			const timeoutMinutes = 5;
			this.progressInactivityTimer = setTimeout(() => {
				site.toaster.show({
					message: i18n.intl.formatMessage(i18nMessages.noProgressUpdateWarning, {miniutes: timeoutMinutes}),
					intent:  bp.Intent.WARNING,
					timeout: 0
				});
			}, timeoutMinutes * 60 * 1000);
		}
	}
}

@observer
export class UserFileDialog extends React.Component<any, any> {
	_disposers = [];
	isWindowActive: boolean;
	userFileUpload: UserFileUploadComponent;

	constructor(props) {
		super(props);

		makeObservable(this,{
			isWindowActive: observable
		});
		this.isWindowActive = true;

	}

	componentDidMount() {
		this._disposers.push(
			reaction(() => [this.userFileUpload, this.userFileUpload?.isWindowActive, this.userFileUpload?.isMiniUploadWindowOpen], (result) => {
				if (!result[1] && !result[2]) {
					setTimeout(() => api.site.setDialogFn(null), api.utility.animation.medium);
				}
			})
		);
	}

	componentWillUnmount() {
		this._disposers.forEach(f => f());
	}

	render() {
		return <bp.Overlay isOpen={true} hasBackdrop={false}>
				<UserFileUploadComponent
					ref={ r => r && (this.userFileUpload = r) }
					windowMode={true}
					dropEnabled={false}
					windowActive={this.isWindowActive}
					onClose={action(() => this.isWindowActive = false )}
					onRefresh={() => {
						omdb.executeQueryRefreshers(UserFile.ObjectType);
					}}
				/>
			</bp.Overlay>
		;
	}
}
