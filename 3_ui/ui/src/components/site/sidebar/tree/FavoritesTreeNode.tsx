import * as css from './FavoritesTreeNode.css';

import {SidebarTreeNode, SidebarTreeNodeType} from './SidebarTreeNode';
import {autorun} from 'mobx';
import {settings, queryStore, queryResultStore, simulationStore, appIcons} from 'stores';
import {QueryTreeNode} from './QueryTreeNodes';
import {SimulationTreeNode} from './SimulationTreeNodes';

export class FavoritesTreeNode extends SidebarTreeNode {
	constructor() {
		super({
			id: 'favorites',
			className: css.favorites,
			label: "Favorites",
			icon: 'star',
			canRename: false,
			isExpanded: true,
			type: SidebarTreeNodeType.folder
		})

		autorun( () => {
			const {favorites} = settings;

			try {
				const simulations  = favorites.simulation.map(id => simulationStore.simulations.get(id));
				const queries      = favorites.query.map(id => queryStore.descriptors.get(id));

				this.childNodes = [
					...simulations.filter(s => s != null).map(s => new SimulationTreeNode(s, {icon: 'database'})),
					...queries.filter(q => q != null).map(q => new QueryTreeNode(q, {icon: 'search'})),
				]
			}
			catch (err) {
				debugger;
				console.log(err);

			}
		}, {name: `Update favorites tree node`})
	}
}