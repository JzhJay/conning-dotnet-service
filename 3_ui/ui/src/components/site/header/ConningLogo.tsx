import * as css from './SiteHeader.css';
import {Link} from 'react-router'
import {iconUrls, api} from 'stores';
import InlineSVG  from 'react-inlinesvg';

interface MyProps extends React.HTMLAttributes<Link> {
	hide?: boolean;
}

export class ConningLogo extends React.Component<MyProps, {}> {
	render() {
		const {hide, children, ...props} = this.props;

		return (<Link data-component="ConningLogo"
		              to={api.routing.urls.home} className={classNames("conning-logo", {[css.hide]: hide})}
		              title={`Conning and Company`} {...props}>
			<InlineSVG src={iconUrls.conningLogo}/>
		</Link>);
	}
}
