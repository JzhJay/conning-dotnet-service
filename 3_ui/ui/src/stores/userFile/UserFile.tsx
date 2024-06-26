import { action, computed, observable, makeObservable, flow } from 'mobx';
import {userFileStore} from '../userFile';
import {i18n, omdb, OmdbUserTagValue, routing, xhr} from 'stores';

export enum UserFileStatus {
	waiting = 'Waiting',
	saving = 'Saving',
	complete = 'Complete',
	failed = 'Failed',
	cancelled = 'Cancelled'
}

export class UserFile {
	static ObjectType = 'UserFile';
	static get OBJECT_NAME_SINGLE() { return i18n.intl.formatMessage({defaultMessage: "User File", description: "objectName - UserFile (single)"}) };
	static get OBJECT_NAME_MULTI() { return i18n.intl.formatMessage({defaultMessage: "User Files", description: "objectName - UserFile (multi)"}) };
 
	constructor(userFile) {
        makeObservable(this);
        Object.assign(this, userFile);
    }

	_id;
	get id() { return this._id }

	@observable name: string;
	@observable userTagValues: OmdbUserTagValue[];
	@observable comments: string;

	static apiUrlFor(id) {
		return `${userFileStore.apiRoute}/${id}`;
	}

	get apiUrl() {
		return UserFile.apiUrlFor(this.id);
	}

	static get browserUrl() { return routing.urls.userFileBrowser; }

	static urlFor(id) {
		return `${UserFile.browserUrl}/${id ? id : ''}`;
	}

	@action rename = async (name: string) => {
		this.name = name;
		const updates = await omdb.updatePartial(UserFile.ObjectType, this._id, {name});
		const model = userFileStore.userFiles.get(this._id);
		if (this.name == model?.name && updates?.name == model?.name) {
			_.assign(model, updates);
		}
	}

	@computed get downloadLinkUrl() {
		return xhr.createAuthUrl(`${userFileStore.apiRoute}/${this.id}`)
	}

	@action delete = async (force = false) => {
		return await userFileStore.deleteFile(this, force);
	}

	@flow.bound
	*cancel() {
		const updates = yield omdb.updatePartial(UserFile.ObjectType, this._id, { status: UserFileStatus.cancelled });
		const model = userFileStore.userFiles.get(this._id);

		if (updates.status === UserFileStatus.cancelled) {
			_.assign(model, updates);
		}
	}
}
