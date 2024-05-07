import type {LoadingStatusMessage} from 'components';
import {ServerStatus} from 'components/system/ExpireDialog/ExpireDialog';
import {action, computed, observable, makeObservable, when} from 'mobx';
import type {RepositoryTransform, UserOptions} from '../respository';
import {repositoryStore} from '../respository';
import {routing, site, user, xhr} from 'stores';
import {BaseEventSource, buildURL} from '../../utility';

type Status = "Waiting" | "Running" | "Failed" | "Complete";

export class Repository {
	static ObjectType = 'Repository';
	static SUPPORT_FILE_TYPE = ['CSV','ALFA', 'TAS'];

	constructor(id, status, public onUpdateStatus?: (status: string) => void) {
        makeObservable(this);
        this._id = id;
        this.status = status;
    }

	_id;
	get id() { return this._id }

	@observable repositoryTransform: RepositoryTransform;
	@observable userOptions: UserOptions;
	@observable messages = [];
	@observable fileMessages = [];
	@observable isError = false;
	@observable totalFileMessagesLength = 0;
	@observable isApplyingTransform = false;
	@observable doneApplyingTransform = false;
	@observable changingFile = false;
	@observable loadingStatusMessages: LoadingStatusMessage[] = [];
	@observable serverStatus: ServerStatus  = ServerStatus.notInitialized;
	@observable status: Status;
	@observable isReconnecting;

	defaultAxisCoordinates = {};

	eventSource = null;
	sessionID: string = uuid.v4();

	static apiUrlFor(id) {
		return `${repositoryStore.apiRoute}/${id}`;
	}

	get apiUrl() {
		return Repository.apiUrlFor(this.id);
	}

	static urlFor(id) {
		return `${repositoryStore.browserUrl}/${id}?edit`;
	}

	get clientUrl() {
		return Repository.urlFor(this.id)
	}

	get eventSourceUrl() {
		return buildURL(`${this.apiUrl}/status`,
			{sessionId: this.sessionID},
			{[user.VALIDATION_ID]: user.validationId},
			{['accessToken']: user.accessToken});
	}

	@observable isLoaded = false;
	@action async loadExistingRepository() {
		this.initEventSource();
		await this.loadRepository();
		this.isLoaded = true;
	}

	@action async loadRepository() {
		const state = await xhr.get<any>(buildURL(this.apiUrl));
		const repository = state.repository
		this.repositoryTransform = repository.repositoryTransform;
		this.userOptions = repository.userOptions ? JSON.parse(repository.userOptions) : {};
		this.messages = repository.messages;
		this.fileMessages = repository.fileMessages;
		this.isError = repository.isError;
		this.totalFileMessagesLength = repository.totalFileMessagesLength;
		this.defaultAxisCoordinates = state.fieldTypes;

		if (this.status == "Complete")
			this.doneApplyingTransform = true;
	}

	async sessionReconnect() {
		try {
			site.busy = true;
			this.isReconnecting = true;
			this.eventSource.dispose();
			this.eventSource = null;
			this.initEventSource();
			await xhr.get<any>(buildURL(this.apiUrl));
			await when(() => this.serverStatus == ServerStatus.created); // Proceed after server is started so that subsequent request is less likely to timeout
			await this.sessionExtend();
			this.isReconnecting = false;
		}
		finally {
			site.busy = false;
		}
	}

	async sessionExtend() {
		try {
			site.busy = true;
			this.sessionID = await xhr.post(this.apiUrl + `/extend-session?sessionId=${this.sessionID}`, {}, {allowRetry: true});
		}
		finally {
			site.busy = false;
		}
	}

	initEventSource = () => {
		this.loadingStatusMessages = [];
		if (!this.eventSource) {
			this.eventSource = new BaseEventSource({
				url: this.eventSourceUrl,
				onMessage: this.onRecieveEventSourceMessage,
				onError: () => {
					this.eventSource.setEventSourceUrl(this.eventSourceUrl);
				}
			});
		}
	}

	@action onRecieveEventSourceMessage = async (event) => {
		const data = JSON.parse(event.data);

		if (this.serverStatus === ServerStatus.notInitialized)
			this.loadingStatusMessages.push(data);

		if (data.type == "status") {
			if(data.subtype == "Server") {
				this.serverStatus = data.data as ServerStatus;
				if (this.serverStatus === ServerStatus.closed) {
					this.eventSource.dispose();
				}

				this.loadingStatusMessages.splice(0, this.loadingStatusMessages.length);
			} else {
				if (data.data == "Waiting") {
					this.doneApplyingTransform = false;
				} else if (data.data == "Running") {
					this.isApplyingTransform = true;
					this.navigateToPage(3);
				} else {
					this.navigateToPage(3);
					this.isApplyingTransform = false;
					this.doneApplyingTransform = true;
					this.messages = JSON.parse(_.get(data, 'additionalData', '[]'));
				}
				this.status = data.data;
				this.onUpdateStatus && this.onUpdateStatus(this.status);
			}
		}
	}

	@action async sendRepositoryTransformUpdate(update) {
		const res: any = await xhr.post(this.apiUrl, {repositoryTransform: update});
		this.messages = res.messages;
		this.doneApplyingTransform = false;
		// this.repositoryTransform = res.repositoryTransform;
	}

	@action async sendUserOptionsUpdate(update) {
		const res: any = await xhr.post(this.apiUrl, {userOptions: update});
		this.messages = res.messages;
		this.doneApplyingTransform = false;
		// this.userOptions = res.userOptions ? JSON.parse(res.userOptions) : {};
	}

	@action async updateSelectedFileType(fileType) {
		const res: any = await xhr.post(this.apiUrl + '/filetype', fileType);
		this.repositoryTransform = res.repositoryTransform;
		this.userOptions = res.userOptions ? JSON.parse(res.userOptions) : {};
		this.messages = res.messages;
		this.fileMessages = res.fileMessages;
		this.isError = res.isError;
		this.totalFileMessagesLength = res.totalFileMessagesLength;

		return res;
	}

	@action async updateSelectedFile(fileId) {
		const res: any = await xhr.post(this.apiUrl + '/file', fileId, { allowRetry: true, fullResponse: false, timeoutRetry: { limit: 3, count: 0 }});
		this.repositoryTransform = res.repositoryTransform;
		this.userOptions = res.userOptions ? JSON.parse(res.userOptions) : {};
		this.messages = res.messages;
		this.fileMessages = res.fileMessages;
		this.isError = res.isError;
		this.totalFileMessagesLength = res.totalFileMessagesLength;

		return res;
	}

	async applyRepositoryTransform() {
		this.navigateToPage(3);
		return await xhr.putUntilSuccess(this.apiUrl + '/apply', {}, "waiting");
	}

	saveUserOptions_debounced = _.debounce(this.saveUserOptions, 500, { leading: false });

	saveUserOptions() {
		this.sendUserOptionsUpdate(JSON.stringify(this.userOptions));
	}

	saveRepositoryTransform_debounced = _.debounce(this.saveRepositoryTransform, 500, { leading: false });

	saveRepositoryTransform() {
		const update = (({fields, ...others}) => ({...others}))(this.repositoryTransform); // remove fields
		this.sendRepositoryTransformUpdate(update);
	}

	@action navigateToPage = (pageIndex: number) => {
		routing.push(this.clientUrl + "&page=" + pageIndex);
	}

	@computed get hasError() {
		return (this.messages && this.messages.findIndex(m => m.messageLevel == "E") > -1) || (this.fileMessages && this.fileMessages.findIndex(m => m.code == "E") > -1);
	}

	@computed get canApplyTransform() {
		return !(this.hasError || this.doneApplyingTransform || this.isApplyingTransform || this.changingFile || (this.repositoryTransform && this.repositoryTransform.fileId == ""))
	}

	cleanup() {
		this.eventSource && this.eventSource.dispose();
		this.eventSource = null;
	}
}
