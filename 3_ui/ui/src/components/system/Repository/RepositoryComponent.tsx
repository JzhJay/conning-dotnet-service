import {bp, LoadingIndicator, LoadingIndicatorWithStatus} from 'components';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {i18n} from 'stores';
import {Repository} from 'stores/respository';
import * as css from './RepositoryComponent.css';
import {RepositoryGridHandler} from './RepositoryGridHandler';
import {RepositoryInputCellFormatter} from './RepositoryInputCellFormatter';
import {RepositoryGeneralView} from './RepositoryGeneralView';
import {RepositoryVariablesView} from './RepositoryVariablesView';
import {RepositoryMessagesView} from './RepositoryMessagesView';
import {Switch, Checkbox, InputGroup, Button} from '@blueprintjs/core';
import {ExpireDialogComponent} from 'components/system/ExpireDialog/ExpireDialog';


interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	repository: Repository
}

@observer
export class RepositoryComponent extends React.Component<MyProps, {}> {
	render() {
		const {repository, location} = this.props;
		return repository.isLoaded ? <div className={css.root}>
			{
				location.query.page == 1 ? <RepositoryGeneralView repository={repository}/> :
				location.query.page == 2 ? <RepositoryVariablesView repository={repository}/> :
				<RepositoryMessagesView repository={repository}/>
			}
			<ExpireDialogComponent app={repository} />
		</div> :
		<LoadingIndicatorWithStatus
			model={repository}
			titlePredicate={(model ) => model.isReady ?
			                            i18n.intl.formatMessage({defaultMessage: `Initializing Session`, description: "[RepositoryComponent] loading message"}) :
			                            i18n.intl.formatMessage({defaultMessage: `Starting Simulation Process`, description: "[RepositoryComponent] loading message"})
		} />
	}

	async componentDidMount() {
		// console.log("Load Repository");
		await this.props.repository.loadExistingRepository();
	}

	componentWillUnmount() {
		this.props.repository.cleanup();
	}
}
