import {ioStore, IO} from ".";
import { observable, action, computed, reaction, autorun, runInAction } from 'mobx';
import { reactionToPromise } from "utility";

export class IoTestData {
    testIo = {
		id: "5f9135c81a567cde050f93a0",
		chartId: '5fb4d187647f581e86f0b5d5'
	}

    loadTestData = async (id = '', mockData = null) => {
	    console.log(`loading test data in loadTestData()`);
        ioStore.reset();
		const io = await ioStore.loadDescriptor(id || this.testIo.id, false);
		await io.newConnection(true);
		io.setupListeners();
		await io.reloadUserInput();
		await io.loadInputState();
		await io.disableSaveUserInput();
	    io.setControlFlags_debounced();
	    await (io.setControlFlags_debounced as any).flush(); // Process immediately and await.
		io.book.currentPageNumber = 0;
		if (io.pages == null || io.pages.length == 0){
			await io.book.addPage();
		}


	    if (mockData) {
		    _.merge(io, mockData);
	    }

	    console.log(`loadTestData() complete`);

		return io;
    }
}

export const ioTestData = new IoTestData();
