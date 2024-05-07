import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import * as React from 'react';
import {sem, siteActions, LinkMenuItem, dialogs, SortableCardsPanel, NewSimulationDialog} from 'components';
import type { SiteLocation } from 'stores';
import {
	Simulation,
	utility,
	routing,
	simulationStore,
	site,
	simulationTestData,
	SimulationSlot,
	mobx,
	JuliaSimulation,
	repositoryStore,
	user,
	api,
	rsSimulationStore,
	i18n,
	Query,
	appIcons
} from 'stores';
import {observer} from 'mobx-react';
import { observable, makeObservable } from 'mobx';
import {Menu, MenuDivider, MenuItem} from '@blueprintjs/core';

interface MyProps {
	simulation?: JuliaSimulation;
	slot?: SimulationSlot;
	location?: SiteLocation | 'browser' | 'card'
	onRename?: () => void;

	panel?: SortableCardsPanel;
}

@observer
export class SimulationContextMenu extends React.Component<MyProps, {}> {
    static defaultProps = {
		location: 'header'
	}

    @observable isImportingTestData = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		let {panel, simulation, location, onRename, slot} = this.props;
		if (slot) {
			simulation = slot.simulation
		}

		let useCase;
	    if (routing.query.useCase && rsSimulationStore.useCases) {
		    useCase = _.find(rsSimulationStore.useCases, uc => uc.name == routing.query.useCase);
	    }

		const translate_queryTitle = (following:string) => i18n.intl.formatMessage({defaultMessage: `{query} {following}`, description: "[SimulationContextMenu] create query by selected simulations"}, {following, query: Query.OBJECT_NAME_SINGLE})

		return <Menu>
			{slot ? /* Report Simulation Slot */
			 <>
				 <MenuDivider key="slotLabel" title={`${slot.label}`}/>

				 {<MenuItem key="query-report-sim"
				            text={translate_queryTitle(Simulation.OBJECT_NAME_SINGLE)}
				            disabled={!slot.simulation}
				            icon="search"
				            onClick={() => slot.report.newQueryForSimulation(slot)}/>}

				 {/*{<MenuItem text={`Duplicate Slot`}*/}
				 {/*icon="duplicate"*/}
				 {/*onClick={() => slot.duplicate()}/>}*/}

				 {<MenuItem key="remove-slot"
				            text={i18n.intl.formatMessage({defaultMessage: `Remove Slot`, description: "[SimulationContextMenu] remove the selected slots"})}
				            icon={appIcons.file.delete.name as any}
				            onClick={() => slot.delete()}/>}

			 </>
			      : simulation && !panel && <>
				{!slot && simulation && <MenuItem text={translate_queryTitle(Simulation.OBJECT_NAME_SINGLE)}
				                                  icon="search"
				                                  onClick={() => this.querySimulations([simulation])}/>}

				<MenuItem text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(Simulation.OBJECT_NAME_SINGLE)}
				          icon='trash'
				          onClick={() => this.deleteSimulations([simulation])}/>
			</>}

			{panel && <>
				{panel.selectedItems.size > 0 && (() => {
					const {selectedItems: sims} = panel;

					var onlySim = sims.size == 1 && sims.values()[0];

					return sims.size > 0 && <>
						{onlySim && <>
							{location == 'card' && <MenuItem
								key="open" icon='link' onClick={() => onlySim.navigateTo()}
                                text={i18n.intl.formatMessage({defaultMessage: `Open "{simName}"`, description: "[SimulationContextMenu] open selected simulation"}, {simName: onlySim.name})}
                            />}
							<MenuItem
								key="open-in-new-tab" icon='link' onClick={() => utility.openInNewTab(onlySim.clientUrl)}
                                text={i18n.intl.formatMessage({defaultMessage: `Open "{simName}" in New Tab`, description: "[SimulationContextMenu]  open selected simulation in a new browser tab"}, {simName: onlySim.name})}
							/>
							<MenuDivider/>
						</>}

						<MenuItem key="query-multiple" text={translate_queryTitle(sims.size < 2 ? Simulation.OBJECT_NAME_SINGLE : `${sims.size} ${Simulation.OBJECT_NAME_MULTI}`)}
						          icon="search" disabled={sims.size == 0}
						          onClick={() => this.querySimulations(Array.from(sims.values()))}/>

						<MenuItem key="delete-multiple"
						          text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(sims.size < 2 ? Simulation.OBJECT_NAME_SINGLE : `${sims.size} ${Simulation.OBJECT_NAME_MULTI}`)}
						          icon='trash'
						          onClick={() => this.deleteSimulations(Array.from(sims.values()))}/>

					</>
				})()}

				<MenuDivider title={i18n.intl.formatMessage({defaultMessage: "Selection", description: "[SimulationContextMenu] group title - include the shorts to select items"})}/>
				<MenuItem text={i18n.common.SELECTION.SELECT_ALL}
				          onClick={() => panel.selectAll()}/>
				<MenuItem text={i18n.common.SELECTION.CLEAR_SELECT}
				          onClick={() => panel.selectedItems.clear()}/>
			</>}

			{/*{mutableTags.length > 0 && <>*/}
				{/*<MenuDivider title="User-Defined Tags"/>*/}
				{/*{simulation && mutableTags.map(tag => <MenuItem key={tag.name} text={tag.displayName}>*/}
					{/*{tag.values.map(v => {*/}
						{/*var tagValue = simulation[tag.name];*/}
						{/*var selected = !tagValue ? false : tagValue.length != null ? _.includes(tagValue, v.id) : tagValue == v.id;*/}
						{/*return <MenuItem key={v.id}*/}
						                 {/*text={<div className={css.tagValue} style={{background: v.background, color: v.color}}>{v.value}</div>}*/}
						                 {/*icon={selected ? 'tick' : 'blank'}*/}
						                 {/*onClick={() => {*/}
							                 {/*let field = {*/}
								                 {/*tag_id:   tag._id,*/}
								                 {/*tag_name: tag.name,*/}
								                 {/*value:    null*/}
							                 {/*};*/}

							                 {/*let record: IOmdbUpdateRecord = {*/}
								                 {/*_id:        simulation.id,*/}
								                 {/*collection: Simulation.ObjectType,*/}
								                 {/*tags:       [*/}
									                 {/*field*/}
								                 {/*]*/}
							                 {/*};*/}

							                 {/*if (tag.multiple) {*/}
								                 {/*var newValues = tagValue;*/}
								                 {/*if (newValues == null) {*/}
									                 {/*newValues = observable.array([]);*/}
								                 {/*}*/}

								                 {/*if (selected) { // Unselect*/}
									                 {/*newValues.replace(newValues.filter(tv => tv != v.id));*/}
								                 {/*}*/}
								                 {/*else { // Select*/}
									                 {/*newValues.push(v.id);*/}
								                 {/*}*/}
								                 {/*newValues.replace(newValues.sort());*/}
								                 {/*field.value = newValues;*/}
							                 {/*}*/}
							                 {/*else {*/}
								                 {/*if (!selected) {*/}
									                 {/*field.value = observable(v.id);*/}
								                 {/*}*/}
								                 {/*else {*/}
									                 {/*return;*/}
								                 {/*}*/}
							                 {/*}*/}

							                 {/*// Optimistic update*/}
							                 {/*simulation[tag.name] = field.value;*/}

							                 {/*omdb.update(record);*/}
						                 {/*}}*/}
						{/*/>*/}
					{/*})}*/}
				{/*</MenuItem>)}*/}
				{/*<MenuDivider/>*/}
			{/*</>}*/}

			{(!useCase && (location == 'header' || location == 'browser')) && <>
				{panel && <MenuDivider/>}
				{DEV_BUILD && <MenuItem
					text={i18n.common.FILE_CTRL.WITH_VARIABLES.IMPORT(Simulation.OBJECT_NAME_SINGLE)}
					icon="import" onClick={siteActions.showImportSimulationDialog}/>}
				{!routing.isActive(simulationStore.browserUrl) && <LinkMenuItem
					href={simulationStore.browserUrl} icon={appIcons.file.import.name as any}
					text={i18n.intl.formatMessage({defaultMessage: 'Browse Simulations...', description: "[SimulationContextMenu] action for change to the object browser"})}
				/>}

				{/*{panel && <AnchorButton text={`Delete ${panel.selectedItems.size < 2 ? 'Simulation' : 'Simulations'}`}*/}
				{/*icon="trash" disabled={panel.selectedItems.size == 0}*/}
				{/*onClick={this.deleteSelectedSimulations}/>}*/}

				{DEV_BUILD
				&& simulationStore.hasLoadedDescriptors
				&& simulationTestData.testSimulations.some(s => !mobx.values(simulationStore.simulations).some(v => v.path == s.path))
				&& <MenuItem text="Import Test Simulations" disabled={this.isImportingTestData}
				             icon={appIcons.file.import.name as any}
				             onClick={async () => {
					             this.isImportingTestData = true;
					             await simulationTestData.registerTestSimulations();
					             this.isImportingTestData = false;
				             }}/>}
			</>}
			<> </>
			{(!useCase && panel) && <>
				{user.enableGEMSOnlyMode ?
				<MenuItem
					text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(Simulation.OBJECT_NAME_SINGLE)}
					icon="document" onClick={() => site.setDialogFn(() => <NewSimulationDialog type={'GEMS'}/>)}/> :
				<MenuItem
					 text={i18n.intl.formatMessage({defaultMessage: "New Simulation Data Source:", description: "[SimulationContextMenu] a group title about create different type of Simulations"})}
					 icon="document" popoverProps={{usePortal: false, hoverCloseDelay: 100}}
				 >
					 {user.isRSSimulationLicensed && <MenuItem
						 text={Simulation.translateSourceType(Simulation.SOURCE_TYPE.GEMS)}
						 onClick={() => site.setDialogFn(() => <NewSimulationDialog type={'GEMS'}/>)}/>}
					 {user.isFIRMLicensed && <MenuItem
						 text={Simulation.translateSourceType(Simulation.SOURCE_TYPE.FIRM)}
						 onClick={() => site.setDialogFn(() => <NewSimulationDialog type={'FIRM'}/>)}/>}
					 <MenuItem
						 text={Simulation.translateSourceType(Simulation.SOURCE_TYPE.REPOSITORY)}
						 onClick={() => routing.push(simulationStore.clientRoute + "?createRepository=true")}/>
				</MenuItem>}
			</>}

			{useCase && panel && <>
				<MenuDivider/>
				<MenuItem
					text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(useCase.title)}
					onClick={() => rsSimulationStore.createNewObject("FIRM", "Untitled", null, null, null, null, useCase.name)}
				/>
			</>}
		</Menu>
	}

    querySimulations = (simulations: JuliaSimulation[]) => {
		dialogs.newQuery(simulations.map(sim => sim._id));
	}

    deleteSimulations = async(simulations: JuliaSimulation[]) => {
		if (simulations) {
			const sim_title_text = simulations.length == 1 ? simulations[0].name : `${simulations.length} ${Simulation.OBJECT_NAME_MULTI}`;
			const sim_btn_text = simulations.length == 1 ? Simulation.OBJECT_NAME_SINGLE : Simulation.OBJECT_NAME_MULTI;
			if (await site.confirm(
				i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(sim_title_text),
				i18n.intl.formatMessage({defaultMessage: 'This action cannot be undone.', description: "[SimulationContextMenu] a confirm dialog message - when the selected items change"}),
				<sem.Icon size='large' name='trash'/>,
				i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(sim_btn_text)
			)) {
				simulations.forEach(sim => Simulation.delete(sim));
			}
		}
	}
}

export class SimulationFileControl {
	getName(simulation: Simulation) {
		return simulation.name;
	}

	async setName(s:string, simulation: Simulation) {
		if (!simulation.editable) { return; }
		return await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			model: Object.assign({__typename: Simulation.ObjectType }, simulation),
			newName: s,
			onRename: async (newName) => await Simulation.rename(simulation, newName)
		});
	}

	async promptRename(simulation: Simulation) {
		if (!simulation.editable) { return; }
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={Object.assign({__typename: Simulation.ObjectType }, simulation)}
			newName={simulation.name}
			onRename={async (newName) => await Simulation.rename(simulation, newName)}
		/>);
	}

	async delete (simulation: Simulation){
		try {
			site.busy = true;
			if (await Simulation.delete(simulation)) {
				routing.push(`${simulationStore.clientRoute}${simulation.useCase ? `?useCase=${simulation.useCase}` : ''}`);
			}
		} finally {
			site.busy = false;
		}
	}

	async copy (simulation: Simulation, openInNewTab: boolean = false) {
		if (!simulation.editable) { return; }
		try {
			site.busy = true;
			let r = await Simulation.duplicate(simulation) as string;
			if (openInNewTab) {
				window.open(Simulation.urlFor(r));
			} else {
				repositoryStore.navigateToID(r);
			}
		}
		finally {
			site.busy = false;
		}
	}
}

export const simulationFileControl = new SimulationFileControl();
