import {dialogs} from './dialogs';
import type { SimulationGuid } from "../../stores/simulation";
import { queryStore, routing, site, user } from "../../stores";

interface NewQueryOptions {
	isNavigateTo?: boolean;
}

class SiteActions {
	newQuery = async (sims?: SimulationGuid[], options: NewQueryOptions = {}) => {
		const { isNavigateTo = true } = options;

		try {
			site.busy = true;
			if (_.isEmpty(sims)) {
				dialogs.newQuery();
				return '';
			}

			const queryId = await queryStore.createQuerySessionDescriptor(`${user.profile.name}'s Query`, sims, null, false);
			if (isNavigateTo) {
				queryStore.navigateTo(queryId);
			}
			return queryId;
		} finally {
			site.busy = false;
		}
	}

	showImportSimulationDialog = () => dialogs.importSimulation();
}

export const siteActions = new SiteActions();