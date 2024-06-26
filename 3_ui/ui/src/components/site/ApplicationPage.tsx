import {action, makeObservable} from 'mobx';
import {observer} from 'mobx-react';
import * as css from './ApplicationPage.css';
import {user, site, ApplicationPageGlobals, defaultAppGlobals} from 'stores';
import {LoadingUntil} from 'components'

export interface MyProps extends ApplicationPageGlobals {

}

/**
 * Standardized look and feel for demo pages
 **/
@observer
export class ApplicationPage extends React.Component<MyProps | any, any> {

	constructor(props) {
		super(props);

		makeObservable(this, {
			updateSiteElements: action
		});

		this.updateSiteElements();
	}

	render() {
		const {loaded, className, activeTool, activeItem, tag, renderApplicationMenuItems, renderHeaderToolbarItemsRight, renderHeaderToolbarItems,
			      renderTitle, renderExtraSettingsMenuItems, applicationButtonText, headerContextMenuProps, afterBreadcrumbs, breadcrumbsRight, title,
			      children, breadcrumbs, renderToolbar, loadingMessage, ...props} = this.props;

		return (<div {...props} className={classNames(className, 'transition-item', css.applicationPage)}>
			<LoadingUntil loaded={loaded != false} message={loadingMessage}>
				{user.isLoggingIn
				 ? <div/>
				 : children}
			</LoadingUntil>
		</div>)
	}

	componentDidUpdate() {
		this.updateSiteElements();
	}

	updateSiteElements = () => {
		const {className, children, ...props} = this.props;
		site.activeTool = Object.assign({}, defaultAppGlobals, props);
	}
}

