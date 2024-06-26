import {api} from 'stores';
import {observable, when, reaction, computed, action, autorun} from 'mobx'

export class AdminStore {
	julia = {
		clear: () => {
			if (confirm("Delete all object (simulations/queries/query results) in the system?")) {
				api.queryStore.deleteAllQueryDescriptors();
				api.simulationStore.deleteAll();
				api.queryResultStore.deleteAll();

				api.site.toaster.show({message: "Julia Backend Cleared"})
			}
		}
	}
}

export const admin = new AdminStore();

