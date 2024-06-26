import {observer} from 'mobx-react';
import * as React from 'react';
import {appIcons, i18n} from 'stores';
import {Repository} from 'stores/respository';
import * as css from 'styles/ApplicationBarItems.css';
import {bp} from '../../index';
import {ArrowNavigation} from '../../widgets/navigation/ArrowNavigation';
import {RepositoryBookMenu} from './RepositoryContextMenu'

@observer
export class RepositoryApplicationBarItems extends React.Component<{repository: Repository; location: HistoryModule.LocationDescriptorObject;}, {}> {
	render() {
		const {repository, location} = this.props;

		return <div className={css.applicationBarItems}>
			<ArrowNavigation canNavigateLeft={location.query.page != "1"}
			                 canNavigateRight={location.query.page != "3"}
			                 currentItem={location.query.page}
			                 pageMenu={<RepositoryBookMenu repository={repository}/>}
			                 onNext={() => repository.navigateToPage(parseInt(location.query.page) + 1)}
			                 onPrevious={() => repository.navigateToPage(parseInt(location.query.page) - 1)} />
			<bp.Tooltip
				position={bp.Position.BOTTOM}
				content={repository.hasError ?
				         i18n.intl.formatMessage({defaultMessage: "Errors exist below", description: "[RepositoryApplicationBarItems] simulation had error during generate the result"}) :
				         repository.doneApplyingTransform ?
				         i18n.intl.formatMessage({defaultMessage: "Simulation results is now ready to use", description: "[RepositoryApplicationBarItems] simulation already run"}) :
				         ""}
			>
				<bp.AnchorButton icon={appIcons.action.run.name as any}
				                 text={repository.doneApplyingTransform ? i18n.common.OBJECT_CTRL.DONE : i18n.common.OBJECT_CTRL.RUN}
				                 className={css.run}
				                 minimal
				                 onClick={repository.applyRepositoryTransform.bind(repository)}
				                 disabled={!repository.canApplyTransform}/>
			</bp.Tooltip>
		</div>
	}
}
