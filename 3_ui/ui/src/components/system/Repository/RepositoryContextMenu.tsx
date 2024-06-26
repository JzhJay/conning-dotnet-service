import {AppIcon, dialogs, sem, simulationFileControl} from 'components';
import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import {appIcons, Repository, Simulation, JuliaSimulation, routing, repositoryStore, simulationStore, site, i18n} from 'stores';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Menu, MenuDivider, MenuItem} from '@blueprintjs/core';

interface MyProps {
	simulation?: Simulation;
}

@observer
export class RepositoryContextMenu extends React.Component<MyProps, {}> {
	render() {
		let {simulation: {repository}, simulation} = this.props;

		return <Menu>
                    <MenuItem text={i18n.common.OBJECT_CTRL.BOOK} icon={<AppIcon icon={appIcons.investmentOptimizationTool.pages}/>} popoverProps={{hoverCloseDelay: 100}}>
                        <RepositoryBookMenu repository={repository}/>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem text={i18n.intl.formatMessage({
	                    defaultMessage: "Run (Generate Results)",
	                    description: "[RepositoryContextMenu] execute simulation for result - with description"
					})} icon={appIcons.action.run.name as any} disabled={!repository.canApplyTransform}/>
                    <MenuDivider/>
	                    <MenuItem text={i18n.common.OBJECT_CTRL.NEW} icon={appIcons.file.create.name as any} onClick={() => {OmdbTagForm.hasRequiredUserTagsByObjectType("Simulation").then( hasRequired => {
		                    if (hasRequired) {
			                    dialogs.newRespository();
		                    } else {
			                    repositoryStore.createNewRespository();
		                    }
	                    });}}/>
                    <MenuItem text={i18n.common.OBJECT_CTRL.RENAME} icon={appIcons.file.rename.name as any} onClick={() => simulationFileControl.promptRename(simulation)}/>
                    <MenuItem text={i18n.common.OBJECT_CTRL.DUPLICATE} icon={appIcons.file.copy.name as any} onClick={() => simulationFileControl.copy(simulation)}/>
                    <MenuItem text={i18n.common.OBJECT_CTRL.DELETE} icon={appIcons.file.delete.name as any} onClick={() => simulationFileControl.delete(simulation)}/>
		</Menu>
	}
}


@observer
export class RepositoryBookMenu extends React.Component<{repository: Repository}, {}> {
	render() {
		const {repository} = this.props;

		return <Menu>
			<MenuItem text={i18n.intl.formatMessage({defaultMessage: "1. General", description: "[RepositoryContextMenu] book page title"})} onClick={() => repository.navigateToPage(1)}/>
			<MenuItem text={i18n.intl.formatMessage({defaultMessage: "2. Variables", description: "[RepositoryContextMenu] book page title"})} onClick={() => repository.navigateToPage(2)}/>
			<MenuItem text={i18n.intl.formatMessage({defaultMessage: "3. Messages", description: "[RepositoryContextMenu] book page title"})} onClick={() => repository.navigateToPage(3)}/>
		</Menu>
	}
}
