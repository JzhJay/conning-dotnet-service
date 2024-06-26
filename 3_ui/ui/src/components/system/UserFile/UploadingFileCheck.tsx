import { useEffect, useCallback } from 'react';
import { action, observable, flow } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Button, Callout, Dialog, Intent } from '@blueprintjs/core';
import type {FileItem} from 'components/system/UserFile/UserFileUploadComponent';
import { UserFileUploadComponent, normalizeFileList } from 'components/system/UserFile/UserFileUploadComponent';
import { omdb, site, UserFile, userFileStore, i18n } from 'stores';
import type { FileItemUploadProgress } from 'stores/userFile/UserFileStore';
import { filesize } from '../../../utility/filesize';
import { i18nMessages } from './i18nMessages';

import * as css from './UploadingFileCheck.css';

const UploadingFileCheck = observer((props) => {
	const uploadingFilesStore = useLocalObservable(() => ({
			uploading: false,
			uploadingFileItem: null,
			selectedFileItems: null,
			failedUploadingFileList: [],
			isShowFileUploadWindow: false
		})
	);

    function filterFile(file: File) {
		// filter hidden file, name start with '.'
		return file.name.indexOf('.') !== 0;
	}

	const closeDialog = useCallback(action(() => {
		if (!uploadingFilesStore.uploading) {
			uploadingFilesStore.failedUploadingFileList = [];
		}
	}), []);

	const onIgnoreSingleFailedFile = useCallback(action((fileId) => {
		userFileStore.deleteUploadingFile(fileId);
		uploadingFilesStore.failedUploadingFileList = uploadingFilesStore.failedUploadingFileList.filter((file) => file.id !== fileId);
	}), []);

	const onIgnoreAllFailedFiles = useCallback(() => {
		userFileStore.deleteAllFailedUploadingFiles();
		closeDialog();
	}, []);

	const onUploadFile = useCallback(action((fileInputRef) => {
		if (fileInputRef && fileInputRef.current) {
			fileInputRef.current.value = '';
			fileInputRef.current.click();
		}
	}), []);

	const onFileSelected = useCallback(action((e, fileInfo: FileItemUploadProgress) => {
		if (e.target.files.length) {
			const files: FileItem[] = normalizeFileList(e.target.files);
			if(files.length > 0) {
				const resumeFiles = fileInfo.files;
				const isAllMatch = resumeFiles.every((resumeFile, index) => {
					const file = files[index];
					if (file) {
						return file.fullName === resumeFile.fullName && file.totalSize === resumeFile.totalSize && file.totalParts === resumeFile.totalParts;
					}

					return false;
				});

				if (isAllMatch) {
					uploadingFilesStore.uploadingFileItem = observable(fileInfo);
					uploadingFilesStore.selectedFileItems = files;
					uploadingFilesStore.uploading = true;
					uploadingFilesStore.isShowFileUploadWindow = true;
					return;
				}
			}
			site.toaster.show({ message: 'Your selected file(s) or folder doesn\'t match previous one(s).', intent: Intent.DANGER });
		} else {
			site.toaster.show({ message: 'No file(s) detected', intent: Intent.DANGER });
		}
	}), []);

	const onCloseUserFileUploadComponent = useCallback(action((isUploading) => {
		uploadingFilesStore.isShowFileUploadWindow = false;
		if (!isUploading) {
			uploadingFilesStore.uploading = false;
			uploadingFilesStore.uploadingFileItem = null;
		}
	}), []);

	const onFileUploadSuccess = useCallback(action((fileId: string) => {
		const index = uploadingFilesStore.failedUploadingFileList.findIndex(f => f.id === fileId);
		if (index !== -1) {
			uploadingFilesStore.failedUploadingFileList.splice(index, 1);
			uploadingFilesStore.failedUploadingFileList = [...uploadingFilesStore.failedUploadingFileList];
		}

		uploadingFilesStore.isShowFileUploadWindow = false;
		uploadingFilesStore.uploading = false;
		uploadingFilesStore.uploadingFileItem = null;
	}), []);

	const onRefresh = useCallback(action(() => {
		omdb.executeQueryRefreshers(UserFile.ObjectType);
	}), []);

	useEffect(() => {
		flow(function*() {
			const uploadingFileList = userFileStore.getUploadingList();
			if (uploadingFileList.length > 0) {
				// const fileIds = uploadingFileList.map(file => file.id);
				const fileIds = uploadingFileList.map(file => file.id).join(',');

				const resp = yield omdb.runQuery({
					objectTypes: ['UserFile'],
					where: { _id: fileIds }
				});
				const result = _.get(resp, ['result', 'results'], []);
				if (result.length > 0) {
					const newUploadingFileList = uploadingFileList.reduce((acc, file) => {
						// check if file is deleted or completed
						const fileStatus = result.find(f => f._id === file.id);
						if (fileStatus) {
							file.objectName = fileStatus.name;
							file.status = fileStatus.status;
							acc.push(file);
						}
						return acc;
					}, []);

					if (uploadingFileList.length !== newUploadingFileList.length) {
						userFileStore.updateUploadingList(newUploadingFileList);
					}

					const now = Date.now();
					const twoMins = 2 * 60 * 1000;
					uploadingFilesStore.failedUploadingFileList = newUploadingFileList
					    .filter((f) => (now - f.lastUploadTime) > twoMins)
						.map((f) => ({ ref: React.createRef(), ...f }));
				} else {
					userFileStore.deleteAllFailedUploadingFiles();
				}
			}
		}.bind(this))();
	}, []);

	const { formatMessage } = i18n.intl;
	const isOpen = uploadingFilesStore.failedUploadingFileList.length > 0;
	const disabledButton = uploadingFilesStore.uploading;
	return (
		<Dialog icon="warning-sign" className={css.dialog} isOpen={isOpen} title={formatMessage(i18nMessages.uploadInterrupted)} onClose={closeDialog}>
			<div className={css.main}>
				{uploadingFilesStore.failedUploadingFileList.map((file)=> {
					const { id, files, fileType } = file;
					const attrs = fileType === 'FOLDER' ? { multiple: true, webkitdirectory: 'true' } : { multiple: false };
					const uploadTypeText = formatMessage(fileType === 'FOLDER' ? i18nMessages.folderUploadWithBrackets : i18nMessages.fileUploadWithBrackets)

					return (
						<Callout key={`${id}_resume_file_id`} className={css.callout}>
							<div className={css.calloutTop}>
								<div className={css.fileInfo}>
									<b>{`${file.objectName}`}</b>
									<span className={css.uploadType}>{uploadTypeText}</span>
								</div>
								<div className={css.fileButtons}>
									<Button text={formatMessage(i18nMessages.ignore)} disabled={disabledButton} outlined={true} intent={Intent.DANGER} value={file.id} onClick={() => onIgnoreSingleFailedFile(file.id)} />
									<Button text={formatMessage(i18nMessages.upload)} disabled={disabledButton} className={css.uploadButton} value={file.id} intent={Intent.PRIMARY} onClick={() => onUploadFile(file.ref)} />
									<input ref={file.ref} className={css.inputFile} type="file" {...attrs} onChange={(e) => onFileSelected(e, file)} disabled={disabledButton} />
								</div>
							</div>
							<ul>
								{files.map((f, index) => (
									<li key={`${id}_previous_upload_file_${index}`}>{`${f.fullName} (${filesize(f.totalSize || 0)})`}</li>
								))}
							</ul>
						</Callout>
					);
				})}
				{ uploadingFilesStore.uploading &&
				<UserFileUploadComponent
					resumeMode={true}
					resumeFile={uploadingFilesStore.uploadingFileItem}
					resumeFileItems={uploadingFilesStore.selectedFileItems}
					windowMode={true}
					dropEnabled={false}
					windowActive={uploadingFilesStore.isShowFileUploadWindow}
					onClose={onCloseUserFileUploadComponent}
					onFileUploadSuccess={onFileUploadSuccess}
					onRefresh={onRefresh}
				/> }
			</div>
			<div className={css.bottom}>
				<Button text={formatMessage(i18nMessages.ignoreAll)} intent={Intent.DANGER} disabled={disabledButton} onClick={onIgnoreAllFailedFiles} />
			</div>
		</Dialog>
	);
});

export default UploadingFileCheck;