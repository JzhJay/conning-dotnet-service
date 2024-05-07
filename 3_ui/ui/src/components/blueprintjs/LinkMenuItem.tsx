import {observer} from 'mobx-react';
import * as React from 'react';
import {routing} from 'stores';
import {bp} from 'components';

interface MyProps {
	className?: string;
	text?: string,
	href?: string,
	icon?: string;
}

@observer
export class LinkMenuItem extends React.Component<MyProps, {}> {
	render() {
		const {props: {text, href, icon, className}} = this;

		return <bp.MenuItem className={classNames(className,`bp3-icon-${icon}`, {[bp.Classes.ACTIVE]: routing.isActive(href)})} onClick={() => routing.push(href)} text={text} />;
	}
}