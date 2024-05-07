import {observable} from 'mobx';
import type { IObservableArray } from 'mobx';

export class ErrorMessageHandler {
	@observable errorMessages: IObservableArray<string>;

	get isInitialized() {
		return this.errorMessages != null;
	}

	updateErrorMessage(errorMessages: string[]) {
		if (this.errorMessages == null)
			this.errorMessages = observable.array(errorMessages);
		else
			this.errorMessages.replace(errorMessages);
	}
}