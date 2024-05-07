import * as css from './IOSidebar.css';
import { AppIcon, sem, bp, SmartCard } from "components";
import {appIcons, api, Link, routing, ioStore, IOViewTemplate, IO} from 'stores'
import { observer } from 'mobx-react'
import { Menu, MenuDivider, MenuItem, Button, Popover, Position, PopoverInteractionKind, AnchorButton } from '@blueprintjs/core';
import { action, observable, makeObservable } from "mobx";

const { viewDescriptors } = api.constants;

interface MyProps {
	direction?: 'row' | 'column';
	className?: string;
	investmentOptimization: IO
}

@observer
export class IOSidebar extends React.Component<MyProps, {}> {
	static defaultProps = {
		direction     : 'column'
	}

	render() {
		const views = ioStore.views;
		const { direction, className, investmentOptimization } = this.props;

		return (investmentOptimization ? <sem.Menu vertical={direction == 'column'}
		                  className={classNames(css.root, className)}>

			<div className={css.availableViews}>
				{Object.keys(ioStore.views).map(name => <ToolbarItem key={name} view={ioStore.views[name]} investmentOptimization={investmentOptimization}/>)}
			</div>
		</sem.Menu> : null)
	}
}


@observer
export class ToolbarItem extends React.Component<{view: IOViewTemplate, investmentOptimization:IO}, {}> {
    @observable activeSelection = false;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		let { view:{name}, view, investmentOptimization} = this.props;

		let icon = appIcons.investmentOptimizationTool.views[name];
		const active = investmentOptimization.currentPage.isViewActive(name);

		return (<bp.Tooltip content={view.label}
		                    key={`${name}-popover`}
		                    position={bp.Position.LEFT_TOP}
		                    modifiers={{keepTogether: {enabled: false}, preventOverflow: {enabled: false}}}
		                    className={classNames(name, css.viewItem)}
		                    portalClassName={css.tooltip}
		                    transitionDuration={300}
		                    hoverCloseDelay={50} hoverOpenDelay={100}>
			<sem.MenuItem className={classNames(bp.Classes.POPOVER_DISMISS, {["active-selection"]: this.activeSelection})}
			              active={active}
				//onMouseLeave={ (e) => {$(e.target).css("backgroundColor", "red")} }
				          onMouseLeave={ (e) => this.activeSelection = false }
				          onClick={(e) => {
					          e.preventDefault();
					          //investmentOptimization.toggleViewSelection(name);
					          this.activeSelection = true;
					          //io.setView();
				          }}>
				<AppIcon icon={icon} large iconningSize={48}/>

				{/*{query && !query.queryResultId &&*/}
				{/*<sem.Label icon="play" corner="right "/>}*/}
			</sem.MenuItem>
		</bp.Tooltip>);
	}
}
