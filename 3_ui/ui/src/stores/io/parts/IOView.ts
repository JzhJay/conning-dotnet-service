import { action, observable, computed, makeObservable } from 'mobx';
import type {IOViewName, IOViewUserOptions} from 'stores';
import {Book} from '../../book/Book';
import {BookView} from '../../book/BookView';

export class IOView extends BookView {
	constructor(book: Book, name: IOViewName, userOptions?: IOViewUserOptions) {
        super(book, name, userOptions);
        makeObservable(this);
    }

	@observable private _plotExtremes: {marginLeft:number, marginRight:number};

	@computed get plotExtremes() {
		return this._plotExtremes;
	}

	set plotExtremes(newSettings) {
		action(() => this._plotExtremes = newSettings)();
	}
}