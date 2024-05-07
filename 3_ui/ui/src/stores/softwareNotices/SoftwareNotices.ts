import { observable, makeObservable } from 'mobx'; 
import { xhr } from 'stores';


export interface LibrariesByFirstChar {
	displayName: string,
	libraries: LibraryInfo[]
}

export interface LibraryInfo {
	copyrights: string,
	customAttribute?: Object,		
	itemNumber: number,
	library: string,
	licenses: string[],
	notices: string,
	primaryAttribute?: Object,
	productName: string,
	projectOccurrences: string[]		
}

class SoftwareNoticesStore {
    @observable isLoading = false;

    loadSoftwareNotices = async (): Promise<LibrariesByFirstChar[]> => {
		this.isLoading = true;
		const url = '/ui/softwareNotices/softwareNotices.json';
		try {
			return await xhr.get<LibrariesByFirstChar[]>(url);
		} catch(e) {
			return [];
		}
		finally {
			this.isLoading = false;
		}
	}

    constructor() {
        makeObservable(this);
    }
}

export const softwareNoticesStore = new SoftwareNoticesStore();

