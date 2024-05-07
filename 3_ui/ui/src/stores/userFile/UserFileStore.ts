import {julia} from 'stores/julia';
import {xhr} from 'stores/xhr';
import {site} from 'stores/site';
import {
	i18n,
	omdb,
	routing, settings, user
} from 'stores';
import { action, observable, computed, runInAction, makeObservable, flow } from 'mobx';
import {UserFile} from './UserFile';
import type {FileItem} from '../../components/system/UserFile/UserFileUploadComponent';

export interface FileItemUploadProgress {
	id: string;
	objectName: string;
	fileType: string;
	files: {
		fullName: string;
		totalParts: number;
		totalSize: number;
		parts: number[];
		isFileUploaded?: boolean;
	}[],
	lastUploadTime: number;
	status?: string;
}

const UPLOADING_FILE_LIST_KEY = "UPLOADING_USER_FILE_LIST";

export class UserFileStore {
	constructor() {
        makeObservable(this);
    }

	@observable userFiles = observable.map<string, UserFile>({}, {deep: false});

	get browserUrl() { return routing.urls.userFileBrowser }

	navigateToBrowser = () => routing.push(this.browserUrl)
	navigateToID = (id) => routing.push(`${this.browserUrl}/${id}`);

	@observable loadError            = false;
	@observable hasLoadedDescriptors = false;
	@observable loading              = false;

	get apiRoute() {
		return `${julia.url}/v1/files`;
	}

	get apiRouteUpload() {
		return `${julia.url}/v1/upload`;
	}

	get juliaRoute() {
		return `${julia.url}/v1/files`;
	}

	get clientRoute() {
		return routing.urls.userFileBrowser;
	}

	@flow.bound
	*uploadFileInit(name, type, numberFiles, userTagValues?) {
		const id: string = yield xhr.putUntilSuccess(`${this.apiRouteUpload}/init`, {
			name: name,
			type: type,
			numberFiles: numberFiles,
			userTagValues: userTagValues
		}, "id");
		yield this.loadDescriptor(id);
		return id;
	}

	async uploadFile(fileId, piece, name, part, totalParts, resumeUpload = "0") {
		let formdata = new FormData();
		formdata.append('file', piece, name);
		formdata.append('part', part);
		formdata.append('totalParts', totalParts);
		formdata.append('fileId', fileId);
		formdata.append('resumeUpload', resumeUpload);
		return await xhr.post(`${this.apiRouteUpload}`, formdata);
	}

	@computed get isActivePage() { return routing.isActive(routing.urls.ioBrowser)}

	deleteFile = async (userFile: UserFile, force = false) => {
		const {name, _id} = userFile;
		if (force || KARMA || (await site.confirm(i18n.common.MESSAGE.WITH_VARIABLES.DELETE_CONFIRMATION(UserFile.OBJECT_NAME_SINGLE, name)))) {
			// runInAction: Deleting File
			return runInAction(async () => {
				try {
					site.busy = true;
					await xhr.delete(userFile.apiUrl || UserFile.apiUrlFor(userFile._id));

					if (this.userFiles.has(_id))
						this.userFiles.delete(_id); // only delete entry after server deletes
					return true;
				}
				catch (err) {
					throw err
				}
				finally {
					site.busy = false;
				}
			})
		}
	}

	@action loadDescriptor = async (id: string): Promise<UserFile> => {
		var userFile = await omdb.findSingle<UserFile>('UserFile', id);

		if (!userFile) {
			throw new Error(`Unable to locate user file with id: '${id}'`);
		}

		this.userFiles.set(id, userFile);
		return userFile;
	}

	getUploadingList(): FileItemUploadProgress[] {
		const uploadingList = localStorage.getItem(UPLOADING_FILE_LIST_KEY);
		return uploadingList ? JSON.parse(uploadingList) : [];
	}

	updateUploadingList(uploadList) {
		localStorage.setItem(UPLOADING_FILE_LIST_KEY, JSON.stringify(uploadList));
	}

	addUploadingFile(fileId: string, fileType: string, objectName: string, fileItems: FileItem[]) {
		const uploadList = this.getUploadingList();
		if (!uploadList.some((file) => file.id === fileId)) {
			uploadList.push({
				id: fileId,
				objectName,
				fileType,
				files: fileItems.map(f => ({
					fullName: f.fullName,
					totalSize: f.totalSize,
					totalParts: f.totalParts,
					parts: [] as number[],
					isFileUploaded: false
				})),
				lastUploadTime: Date.now()
			});
			localStorage.setItem(UPLOADING_FILE_LIST_KEY, JSON.stringify(uploadList));
		}
	}

	deleteUploadingFile = (fileId) => {
		const uploadList = this.getUploadingList();
		const index = uploadList.findIndex((file) => file.id === fileId);
		if (index !== -1) {
			uploadList.splice(index, 1);
			localStorage.setItem(UPLOADING_FILE_LIST_KEY, JSON.stringify(uploadList));
		}
	}

	deleteAllFailedUploadingFiles = () => {
		localStorage.setItem(UPLOADING_FILE_LIST_KEY, JSON.stringify([]));
	}

	getUploading = (fileId, index) => {
		const uploadList = this.getUploadingList();
		const file = uploadList.find((file) => file.id === fileId);
		return _.get(file, ['files', index, 'parts'], []);
	}

	getUploadingFileProgress = (fileId, index) => {
		const uploadList = this.getUploadingList();
		const file = uploadList.find((file) => file.id === fileId);
		return _.get(file, ['files', index, 'parts'], []);
	}

	updateUploadingFileProgress = (fileId, index, { isFileUploaded = false, part = null }) => {
		const uploadList = this.getUploadingList();
		const uploadFile = uploadList.find((file) => file.id === fileId);
		if (uploadFile) { // uploadFile could be cancelled and removed in the list
			const file = uploadFile.files[index];

			if (file) {
				uploadFile.lastUploadTime = Date.now();
				if (isFileUploaded) {
					file.isFileUploaded = true;
				} else if (part) {
					const parts = file.parts || [];
					parts.push(part);
					file.parts = parts;
				}
				localStorage.setItem(UPLOADING_FILE_LIST_KEY, JSON.stringify(uploadList));
			}
		}
	}

	@flow.bound
	*cancelUpload(fileId) {
		const userFile = this.userFiles.get(fileId);
		if (userFile) {
			yield (new UserFile(userFile)).cancel();
			this.deleteUploadingFile(fileId);
		}
	}
}

export const userFileStore = new UserFileStore();
