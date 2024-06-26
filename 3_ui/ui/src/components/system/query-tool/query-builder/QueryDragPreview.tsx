import { utility, api, appIcons } from 'stores';
import { Query } from 'stores/query'
import { AppIcon } from 'components';
import { observer } from 'mobx-react'

interface Props {
	query: Query;
	name: string;
	isLayoutDragging: boolean;
}

@observer
export class QueryDragPreview extends React.Component<Props,{}> {
	render() {
		const { query, isLayoutDragging, name } = this.props;

		if (!isLayoutDragging) { return null; }

		const { simulations} = api.simulationStore;
		const selectedSimulations                            = simulations && query ? query.simulationIds.map(id => simulations[id]) : null;

		return (
			<div key="drag-summary" className={classNames("ui card", {hidden: !isLayoutDragging})}>
				<div className="content image">
					<div className="center aligned header">
						<AppIcon icon={appIcons.queryTool.views.query}/>
						{name}
					</div>
				</div>
				
				{query ?
				 <div className="content">
					 <div className="content">
						 <h4 className="ui sub header">Simulations</h4>
						 <div className="description">
							 {query.simulationIds.length > 0
								 ? selectedSimulations.map(sim => sim.name).join(', ')
								 : 'No Simulations selected' }
						 </div>
					 </div>
					
					 <div className="content">
						 <AppIcon icon={appIcons.cards.simulation.variables}/>
						 <span className="ui sub header">Variables:</span>
						 <span className="right floated">
                             {utility.numberWithCommas(query._variables.selected)}
							 / {utility.numberWithCommas(query._variables.total)}
                         </span>
					 </div>
					 <div className="content">
						 <AppIcon icon={appIcons.cards.simulation.timesteps}/>
						 <span className="ui sub header">Time-Steps:</span>
						 <span className="right floated">
                                 {utility.numberWithCommas(0)}
                             </span>
					 </div>
					 <div className="content">
						 <AppIcon icon={appIcons.cards.simulation.scenarios}/>
						 <span className="ui sub header">Scenarios:</span>
						 <span className="right floated">
                             NYI
							 {/*{/utility.numberWithCommas(queryState.scenarios.status.selected.length)}*/}
							 {/*/ {utility.numberWithCommas(queryState.scenarios.numbers.length)}*/}
                         </span>
					 </div>
				 </div>
					: null}
			</div>);
		
		// return (
		//     <div className="ui container drag-preview">
		//         <span className="ui center aligned attached header">Query Builder</span>
		//
		//     </div>
		// )
	}
	
}