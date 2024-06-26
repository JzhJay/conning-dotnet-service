import * as css from './IOToolbar.css'
import {ButtonGroup, Menu, MenuDivider, NavbarDivider, Popover, Switch} from '@blueprintjs/core';
import {bp, SmartCard, sem, LinkMenuItem} from 'components'
import * as React from 'react';
import {featureToggles, IO, julia, omdb, routing, settings, slugs, user} from '../../../stores';
import {appIcons} from "../../../stores/site/iconography/icons";
import {AppIcon} from "../../widgets/AppIcon";
import {IconButton} from "../../blueprintjs/IconButton";
import {observer} from "mobx-react";

interface MyProps {
	io: IO;
}

@observer
export class IOToolbar extends React.Component<MyProps, {}> {
	render() {
		const {io} = this.props;
		const page = io.currentPage;

		return (
			<nav className={classNames(bp.Classes.NAVBAR)}>
				<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
					<div/>

					<div className={bp.Classes.NAVBAR_DIVIDER}/>

					{(<div>
							<ButtonGroup minimal>
								<bp.AnchorButton
								                 icon='step-backward' text={"Reset"}
								                 onClick={() => {
								                 }}/>
							</ButtonGroup>
						</div>).props.children}
				</div>

				<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
					<bp.Tooltip position={bp.Position.BOTTOM} content='Download'>
						<bp.AnchorButton icon="database"
						                 text='Download'
						                 onClick={() => {}}/>
					</bp.Tooltip>

					<NavbarDivider/>

					<Popover
						position={bp.Position.BOTTOM_RIGHT}
						interactionKind={bp.PopoverInteractionKind.HOVER}
						popoverClassName={'header-popover'}
						canEscapeKeyClose={true}
						content={
							<Menu className={classNames(css.menu)}>
								<Switch checked={page.showHoverPoint} label="Show hover point across views" onChange={() => page.showHoverPoint = !page.showHoverPoint}/>
								<Switch checked={page.showViewToolbars} label="Show view toolbars" onChange={() => page.showViewToolbars = !page.showViewToolbars}/>
							</Menu>}>

						{<bp.AnchorButton minimal icon='menu'/>}
					</Popover>

				</div>
			</nav>)
	}
}

