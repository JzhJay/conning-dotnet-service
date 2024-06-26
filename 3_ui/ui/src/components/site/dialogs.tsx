import {CRAPropertiesDialog} from 'components/system/ClimateRiskAnalysis/CRAPropertiesDialog';
import {OmdbTagEditDialog, OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import {UserFileDialog} from 'components/system/UserFile/UserFileUploadComponent';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {
	api,
	QueryDescriptor,
	ReportDescriptor,
	user,
	SUPPORT_EMAIL,
	repositoryStore,
	appIcons,
	site,
	climateRiskAnalysisStore, i18n,
} from 'stores';
import {QueryPropertiesDialog, OpenQueryDefinitionDialog, ImportLegacySimulationDialog, BlueprintDialog, QueryBrowser, AppIcon, bp} from 'components';
import type {SimulationGuid} from 'stores/simulation';
import {NewReportDialog, ReportBrowser} from 'components/system/report';
import {IOPropertiesDialog} from '../system/IO';

const buildDate = new Date(parseInt(BUILD_UTC_TIME));

class Dialogs {

	newUserFile = () => {
		api.site.setDialogFn(null);
		api.site.setDialogFn(() => <UserFileDialog />);
	}

	newRespository = (fileId?: string, defaultName?: string, beforeCreate?: (name)=>void) => { api.site.setDialogFn(() => <OmdbTagEditDialog
		appIcon={<AppIcon icon={appIcons.cards.simulation.cardIcon} />}
		defaultName={defaultName}
		objectType={"Simulation"}
		onCreate={(name, tagValues) => {
			beforeCreate && beforeCreate(name);
			return repositoryStore.createNewRespository(fileId, name, tagValues);
		}}
	/>)}

	newQuery = (simulationIds?: SimulationGuid[], defaultName?: string) => { api.site.setDialogFn(() => <QueryPropertiesDialog simulationIds={simulationIds} defaultName={defaultName} />) }

	newReport = (simulationIds?: SimulationGuid[]) => { api.site.setDialogFn(() => <NewReportDialog simulationIds={simulationIds}/>) }

	openReport = () => {
		let dialog : BlueprintDialog;

		api.site.setDialogFn(() =>
			<BlueprintDialog
				okDisabled={true}
				ref={d => dialog = d}
				title={`Open Report`}
				icon={'book'}>
				<ReportBrowser onSelect={(report : ReportDescriptor) => {
					setTimeout(report.navigateTo, api.constants.dialogAnimationMs);
					dialog.result = report;
				}} />
			</BlueprintDialog>)
	}

	newIO = (assetReturnsSimulationId?:string, defaultName?: string) => {
		api.site.setDialogFn(() => <IOPropertiesDialog defaultName={defaultName} assetReturnsSimulationId={assetReturnsSimulationId}/>)
	}

	newClimateRiskAnalysis = (simulationId?:string, defaultName?: string) => {
		api.site.setDialogFn(() => <CRAPropertiesDialog defaultName={defaultName} simulationId={simulationId}/>)
	}

	openQueryDefinition = () => {
		api.site.setDialogFn(() => <OpenQueryDefinitionDialog />)
	}

	importSimulation = () => {
		api.site.setDialogFn(() => <ImportLegacySimulationDialog />)
	}

	openQuery = () => {
		let dialog : BlueprintDialog;

		api.site.setDialogFn(() =>
			<BlueprintDialog
				okDisabled={true}
				ref={d => dialog = d}
				title={`Open Query Session`}
				icon={'search'}>
				<QueryBrowser
					view="table"
					onSelect={(query : QueryDescriptor) => {
					setTimeout(query.navigateTo, api.constants.dialogAnimationMs);
					dialog.result = query;
				}} />
			</BlueprintDialog>)
	}

	support = () => {
		api.site.confirm(
			i18n.intl.formatMessage({defaultMessage: `Support`, description: "[support dialog] dialog title"}),
			<div><FormattedMessage defaultMessage={"Email:"} description={"[support dialog] Indicates the text before the supports mail address"}/>&nbsp;<span className="right">{SUPPORT_EMAIL}</span></div>,
			<bp.Icon icon={"help"} size={36} />,
			i18n.intl.formatMessage({defaultMessage: `Email`, description: "[support dialog] send mail button text"})
		).then(result => result && ( window.location.href = `mailto:${SUPPORT_EMAIL}`));
	}

	about = () => {
		const { isMultiTenant } = site;
		api.site.messageBox(
			`${i18n.intl.formatMessage({defaultMessage: `About`, description: "[about dialog] dialog title"})} ${site.productName}`,
			<>
				<div>{site.copyrightNotice}</div>
				{user.license ? (isMultiTenant ? <div>{`${i18n.intl.formatMessage({defaultMessage: `Tenant:`, description: "[about dialog] tenant tag"})} ${user.tenantName}`}</div> :
				 <>
					 <div><FormattedMessage defaultMessage={"Licensed to"} description={"[about dialog] Indicates the text before who own the current working license"}/>&nbsp;{user.customerName}</div>
					 {user.license.dates && user.license.dates.length > 1 ? <div><FormattedMessage defaultMessage={"Expires on"} description={"[about dialog] Indicates the text before the current license will expire"}/>&nbsp;{user.license.dates[1]}</div> : null}
				 </>) :
				 <>
					 <br/><i><FormattedMessage defaultMessage={"Unknown License"} description={"[about dialog] Indicates if license information not loaded"}/></i><br/><br/>
				 </>}
				{DEV_BUILD && <>
					<hr />
					<div>Version:<span className="right">{VERSION}</span></div>
					<div>Environment: {NODE_ENV}</div>
					<div>Sprint: {SPRINT}</div>
					<div>Build Date: {buildDate.toString()}</div>
					<div>Language: {i18n.intl.locale}</div>
				</>}
			</>,
			<bp.Icon icon={"info-sign"} size={36} />
		)
	}
}

export const dialogs = new Dialogs();
