import { observable, makeObservable } from 'mobx';
import {Book} from './Book';

export class BookView {
	constructor(book: Book, public name: string, userOptions?: {[key: string]: any}) {
        makeObservable(this);
        this.id = uuid.v4();
        this.label = book.availableViews[this.name].label;
        this.userOptions = userOptions;
        const defaultOptions = book.defaultUserOptions(this.name);

        if (this.userOptions == null)
			this.userOptions = defaultOptions;
		else // Pick up new defaults and merge in.
			this.userOptions = Object.assign({}, defaultOptions, userOptions);
    }

	id: string;
	@observable userOptions?: {[key: string]: any};
	label: string;
	oldIndex: number; // transient property used during re-order
}