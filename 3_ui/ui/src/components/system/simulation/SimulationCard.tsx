import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import * as css from './SimulationCard.css'
import {
	appIcons,
	Simulation,
	copyToClipboard,
	SimulationSlot,
	JuliaSimulation,
	repositoryStore,
	site, simulationStore, routing, rsSimulationStore, i18n, Query
} from "stores";
import {observer} from 'mobx-react'
import {bp, SmartCard, SmartCardProps, SimulationContextMenu, dialogs,} from 'components';
import { observable, makeObservable } from "mobx";
import { IconButton } from "../../blueprintjs/IconButton";
import {AnchorButton} from "@blueprintjs/core/lib/cjs/components";
import { FormattedMessage } from 'react-intl';


interface MyProps extends SmartCardProps {
	sim?: JuliaSimulation;
	slot?: SimulationSlot;
}

@observer
@bp.ContextMenuTarget
export class SimulationCard extends React.Component<MyProps, {}> {
	objectType = Simulation.ObjectType;

	render() {
		const { objectType, props, props: { className, loading, isTooltip, onDelete, onDuplicate } } = this;

		const model = this.props.sim;


		let appIcon = this.props.appIcon;
		if (!appIcon) {
			appIcon = appIcons.cards.simulation.cardIcon;
			if (_.has(model,"useCase") && rsSimulationStore.useCases) {
				const useCase = _.find(rsSimulationStore.useCases, uc => uc.name == _.get(model,"useCase"));
				useCase?.icon && (appIcon = useCase.icon);
			}
		}

		const overrideProps = {
			model: model,
			appIcon: appIcon,
			className: classNames(css.root, className),
			readonly: !Simulation.editable(model)
		}

		return <SmartCard
			{...props}
			{...overrideProps}

			title={{name: 'name'}}
			titleIcons={<SimulationCardToolbarButtons disabled={loading} sim={model} isTooltip={isTooltip} onDelete={onDelete} onDuplicate={onDuplicate}/>}
			onRename={async value => await Simulation.rename(model, value)}

		/>
	}

	renderContextMenu(e) {
		const { sim, panel } = this.props;
		return <SimulationContextMenu location='card' simulation={sim} panel={panel}/>
	}
}

@observer
export class SimulationCardToolbarButtons extends React.Component<{ disabled?: boolean, isTooltip?: boolean, sim: JuliaSimulation, className?: string, onDelete: (id:string) => void, onDuplicate: (sim) => void }, {}> {
	constructor(props) {
		super(props);
	}

	render() {
		const { props: { isTooltip, className, disabled, onDelete, onDuplicate } } = this;
		const sim = this.props.sim;
		const isQueryable = sim.status === "Complete" && sim.scenarios != null;
		const queryTooltip = isQueryable ? i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Query.OBJECT_NAME_SINGLE) : i18n.intl.formatMessage({defaultMessage: "{simulation} Not Complete", description: "[SimulationCard] tooltip that indicates that the simulation object has not been run and is incomplete"}, {simulation: Simulation.OBJECT_NAME_SINGLE});
		const queryIntent = isQueryable ? bp.Intent.NONE : bp.Intent.DANGER;
		const isEditable = Simulation.editable(sim);
		return <bp.ButtonGroup className={classNames(className)}>
			 {isEditable && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.OPEN(Simulation.OBJECT_NAME_SINGLE)}>
				 <IconButton icon={appIcons.cards.open} className={"open-simulation"}  onClick={(e) => {
					repositoryStore.navigateToID(sim._id);
					e.preventDefault()
				}}/>
			</bp.Tooltip>}

			{<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({defaultMessage: "Linked Objects", description: "[SimulationCard] tooltip for a button which shows what other objects are currently linked to (referencing) this object"})}>
				<bp.Button icon={"one-to-many"} onClick={(e) => {
					routing.push(Simulation.urlForRelatedObjectPage(sim._id));
					e.preventDefault()
				}}/>
			</bp.Tooltip>}

			{isEditable && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DUPLICATE(Simulation.OBJECT_NAME_SINGLE)}>
                <IconButton icon={appIcons.cards.clone} disabled={disabled} onClick={async () => {
					try {
						site.busy = true;
						let r = await Simulation.duplicate(sim) as string;
						onDuplicate && onDuplicate(r);
					}
					finally {
						site.busy = false;
					}
				}}/>
            </bp.Tooltip>}

			<bp.Tooltip position={bp.Position.BOTTOM} content={queryTooltip} intent={queryIntent}>
				<AnchorButton icon="search" disabled={disabled || !isQueryable} onClick={() => {
					OmdbTagForm.hasRequiredUserTagsByObjectType("Query").then( hasRequired => {
						if (hasRequired) {
							dialogs.newQuery([sim._id]);
						} else {
							Simulation.newQuery(sim);
						}
					});
				}}/>
			</bp.Tooltip>

			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(Simulation.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.delete} disabled={disabled} onClick={async () => {
					let r = await Simulation.delete(sim);
					r != null && onDelete && onDelete(sim._id);
				}}/>
			</bp.Tooltip>}
		</bp.ButtonGroup>;
	}
}
