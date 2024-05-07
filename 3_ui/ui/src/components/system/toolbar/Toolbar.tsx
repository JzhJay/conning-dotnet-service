import {Navbar} from '@blueprintjs/core';
import * as React from 'react';
import {bp} from '../../index';
import * as highchartsToolbarCss from '../highcharts/toolbar/highchartsToolbar.css';
import * as css from "./Toolbar.css";


interface ToolbarProps {
	left?: JSX.Element;
	right?: JSX.Element;
	className?: string;
}

export class Toolbar extends React.Component<ToolbarProps, {}> {

	render() {
		const {left, right, className} = this.props;


		return <Navbar className={classNames(className, css.root, "wrap")}>
			<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
				{left || this.props.children}
			</div>

			{right && <div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
				{right}
			</div>}

		</Navbar>
	}

}