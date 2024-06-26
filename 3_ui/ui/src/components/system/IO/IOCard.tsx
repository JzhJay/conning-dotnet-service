import {IOBrowser} from 'components/system/IO/IOBrowser';
import {Link} from "react-router";
import {IOmdbTag, OmdbCardTag} from '../../../stores/objectMetadata/OmdbTag';
import * as css from './IOCard.css'
import {
	api,
	appIcons,
	omdb,
	Simulation,
	copyToClipboard,
	SimulationSlot,
	ObjectTypesQuery,
	JuliaSimulation,
	ObjectTypeQuery,
	JuliaIO,
	IO,
	site, ioStore, OmdbCardSection, apolloStore, IOmdbQueryGraph, GetSimulationQuery, i18n
} from "stores";
import { observer } from 'mobx-react'
import {sem, bp, dialogs, SmartCard, SmartCardProps, SortableCardsPanel, SimulationContextMenu, QueryListItem, SimulationCard, Highlighter, utility,} from 'components';
import {computed, observable, makeObservable, action} from "mobx";
import { IconButton } from "../../blueprintjs/IconButton";


interface MyProps extends SmartCardProps {
	investmentOptimization?: IO;
	//showAssociatedQueries?: boolean;
}

@observer
//@bp.ContextMenuTarget
export class IOCard extends React.Component<MyProps, {}> {
	@observable _sections = null;

	constructor(props) {
        super(props);

        if (this.props.sections) {
			this._sections = this.props.sections;
		} else {
			const settingsFromPanel = this.props.panel?.props.catalogContext?.getObjectType(IO.ObjectType);
			if (settingsFromPanel?.ui?.card?.sections) {
				this._sections = settingsFromPanel.ui.card.sections;
			} else {
				apolloStore.client.query<IOmdbQueryGraph>({
					query:     omdb.graph.objectType,
					variables: {objectType: IO.ObjectType}
				}).then(action(result => {
					this._sections = result.data?.omdb.objectType.ui.card.sections;
				}));
			}
		}

		makeObservable(this);
    }

	@computed get isLoading(){
		return this._sections == null;
	}

	@computed get sections() {
		if (this.isLoading) {
			return [];
		}
		const newSections: OmdbCardSection[] = [];
		_.forEach( this._sections , (section: OmdbCardSection) => {
			const newTags: OmdbCardTag[] = [];
			_.forEach(section.tags , (tag:OmdbCardTag) => {
				if (_.some(IOBrowser.SIMULATION_TAG, t => t == tag.name)) {
					newTags.push({
						...tag,
						type: Simulation.ObjectType
					});
				} else {
					newTags.push(tag);
				}
			})
			if (newTags.length) {
				newSections.push({
					label: section.label,
					tags: newTags
				})
			}
		});
		return newSections;
	}

	render() {
		const { isLoading, props: { className, panel, isTooltip, investmentOptimization, onDelete, onDuplicate, ...props } } = this;

		return <SmartCard
			loading={isLoading}
			className={classNames(css.root, className)}
			appIcon={appIcons.cards.ios.cardIcon}
			panel={panel}
			isTooltip={isTooltip}
			{...props}
			onRename={async value => await investmentOptimization.rename(value)}
			model={investmentOptimization}
			titleIcons={<IOCardToolbarButtons disabled={isLoading} investmentOptimization={investmentOptimization} isTooltip={isTooltip} onDelete={onDelete} onDuplicate={onDuplicate}/>}
			title={{name: 'name'}}
			sections={this.sections}
		/>
	}
}

@observer
export class IOCardToolbarButtons extends React.Component<{ disabled?: boolean, isTooltip?: boolean, investmentOptimization: IO, className?: string, onDelete: (id:string) => void, onDuplicate: (io) => void}, {}> {
    @observable linkCopied = false;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const { linkCopied, props: { isTooltip, className, investmentOptimization, disabled, onDelete, onDuplicate } } = this;
		const IO_title = IO.OBJECT_NAME_SINGLE;

		return <bp.ButtonGroup className={className}>

			<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.OPEN(IO_title)}>
				<IconButton icon={appIcons.cards.open} onClick={(e) => {
					investmentOptimization.navigateTo();
					e.preventDefault()
				}}/>
			</bp.Tooltip>

			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DUPLICATE(IO_title)}>
                <IconButton icon={appIcons.cards.clone} disabled={disabled} onClick={async () => {
					try {
						site.busy = true;
						let r = await IO.duplicate(investmentOptimization) as string;
						onDuplicate && onDuplicate(r);
					}
					finally {
						site.busy = false;
					}
				}}/>
            </bp.Tooltip>}

			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(IO_title)}>
				<IconButton icon={appIcons.cards.delete} disabled={disabled} onClick={async () => {
					let r = await IO.delete(investmentOptimization);
					r != null && onDelete && onDelete(investmentOptimization._id);

				}}/>
			</bp.Tooltip>}
		</bp.ButtonGroup>;
	}
}
