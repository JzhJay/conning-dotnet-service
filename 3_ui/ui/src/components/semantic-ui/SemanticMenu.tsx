import * as css from './SemanticMenu.css';
require('./SemanticMenu.css')
import {AppIcon} from "components";
import {Link} from 'react-router';
import type {IApplicationIcon} from 'stores';
import {settings, api, appIcons} from 'stores';
import type {MenuOpenOn} from 'stores/site'
import {observer} from 'mobx-react';
import LocationDescriptor = HistoryModule.LocationDescriptor;
require("lib/semantic/dist/components/transition.js")
require("lib/semantic/dist/components/dropdown.js")
import * as PropTypes from 'prop-types';

interface MenuProps {
	id?: string;
	className?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	key?: string;
	labeled?: boolean;
	onClick?: React.MouseEventHandler<HTMLElement>;
	buttonBar?: boolean;
	isSubmenu?: boolean;
	openOn?: MenuOpenOn;
}

export {MenuOpenOn};

export class Menu extends React.Component<MenuProps, {}> {
	render() {
		const {children} = this.props;
		return (<div style={this.props.style} id={this.props.id} onClick={this.props.onClick}
		             className={classNames("ui", "menu", this.props.className, {hidden: this.props.isSubmenu, labeled: this.props.labeled, 'button-bar': this.props.buttonBar})}>
			{children}
		</div>);
	}

	getChildContext() {
		return {openOn: this.props.openOn}
	}

	static childContextTypes = {openOn: PropTypes.string}
}

export class DropdownIcon extends React.Component<any, any> {
	render() {
		return  <i className="ui dropdown icon"/>;
	}
}

export class Divider extends React.Component<{},{}> {
	render() {
		return <div className="divider"/>
	}
}

export type DropdownAction = 'auto' | 'activate' | 'select' | 'combo' | 'nothing' | 'hide';

interface MenuItemProps extends React.AllHTMLAttributes<any> {
	key?: string;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
	onClick?: (e) => void;
	onMouseEnter?: (e) => void;
	header?: boolean;
	onMouseLeave?: (e) => void;
	menuItemLabel?: string | React.ReactNode;
	systemIcon?: IApplicationIcon;
	iconicDataAttribute?: any;
	iconicAddonClassNames?: any;
	to?: LocationDescriptor;
	dropdownAction?: DropdownAction;
	hideDropdownIcon?: boolean;
	openOn?: MenuOpenOn;
	bold?: boolean;
}

export class MenuItem extends React.Component<MenuItemProps,{}> {
	$node: JQuery;
	node: Element;

	declare context: { $body: JQuery, openOn?: string }

	static defaultProps = {
		dropdownAction: 'hide',
	}

	static contextTypes = {
		$body:  PropTypes.object,
		openOn: PropTypes.string
	}

	get isDropdown() {
		return React.Children.toArray(this.props.children).length > 0;
	}

	componentDidMount() {
		this.setupDropdown()
	}

	componentDidUpdate(prevProps: MenuItemProps, prevState: any, prevContext: any) {
		if (this.isDropdown && this.props.openOn !== prevProps.openOn || this.context.openOn !== prevContext.openOn) {
			const {openOn} = this.props;
			this.$node.dropdown({
				on: openOn
					    ? openOn
					    : this.context.openOn
					    ? this.context.openOn
					    : settings.menuOpenOn
			});
		}
	}

	setupDropdown = () => {
		if (this.isDropdown) {
			this.node  = ReactDOM.findDOMNode(this) as Element;
			this.$node = $(this.node);

			const isInContextMenu = $(this.node.parentNode).hasClass('context-menu');

			// Only hook the event handler if we're not already in another dropdown
			if (this.$node.parents('.ui.dropdown').length === 0) {
				//console.log('added hover handler', $node)

				const {dropdownAction, openOn} = this.props;

				// http://semantic-ui.com/modules/dropdown.html#/settings
				let dropdownConfig = {
					on:           openOn
						              ? openOn
						              : this.context.openOn
						              ? this.context.openOn
						              : settings.menuOpenOn,
					keepOnScreen: false,
					action:       dropdownAction,
					duration:     400,
					onHide:       () => {
						if (this.contextShowing) return false;

						return true;
					},
					onShow:       () => {
						// If we're currently displaying a context menu, we need to hide it
						// if (!isInContextMenu && this.props.contextMenuShowing) {
						//     console.warn
						// }

						if (isInContextMenu) {
							// If showing the menu would result in an overflow, move it.
							const nodeRect = this.node.getBoundingClientRect();
							const $menu    = this.$node.children('.ui.menu');

							const submenuRect = $menu.get(0).getBoundingClientRect();

							if (nodeRect.right + submenuRect.width > $(document).outerWidth()) {
								// Move the menu
								const left = `-${submenuRect.width}px`;

								$menu.css('left', left)
							}
							else {
								$menu.css('left', 'auto')
							}
						}
					}
				};
				this.$node.dropdown(dropdownConfig);
			}
		}
	}

	contextShowing = false;

	onMouseMove = (e) => {
		this.contextShowing = false;
	}

	onContextMenu = (e) => {
		this.contextShowing = true;
	}

	render() {
		const {id, bold, disabled, href, header, menuItemLabel, systemIcon, to, iconicDataAttribute, iconicAddonClassNames, className, onClick, checked, hideDropdownIcon} = this.props;

		const children   = React.Children.toArray(this.props.children)
		const isDropdown = children.length > 0;

		let addMenuChild = false;
		if (isDropdown && !_.some(children, (c: React.ReactElement<any>) => c.type === Menu)) {
			addMenuChild = true;
		}

		const tooltipTitle = typeof menuItemLabel === 'string' ? menuItemLabel : '';

		const topLevelProps = Object.assign({
			onMouseMove:   this.onMouseMove,
			onContextMenu: this.onContextMenu,
			id:            id,
			className:     classNames('ui', 'item', className, {
				header:   header,
				disabled: disabled,
				bold:     bold,
				dropdown: isDropdown
			}),
			onClick:       onClick,
		}, _.omit(this.props, [
			'bold', 'className', 'enabled', 'menuItemLabel', 'header', 'dropdown', 'iconicDataAttribute', 'iconicAddonClassNames', 'systemIcon',
			'dropdownAction', 'openOn', 'hideDropdownIcon', 'to'
		]));

		const finalChildren = [
			systemIcon != null ? <AppIcon key="icon" icon={systemIcon} className={iconicAddonClassNames} title={tooltipTitle}
			                          iconicDataAttribute={iconicDataAttribute}/> : null,
			checked != null ? checked
				                ? <AppIcon key="checkbox" icon={appIcons.widgets.checkbox.checked} title={tooltipTitle}/>
				                : <AppIcon key="checkbox" icon={appIcons.widgets.checkbox.unchecked} title={tooltipTitle}/>
				: null,
			menuItemLabel ? typeof menuItemLabel === 'string'
				              ? <span key="menuItemLabel" className="text" dangerouslySetInnerHTML={{__html: menuItemLabel}}/>
				              : <span key="menuItemLabel" className="text">{menuItemLabel}</span>
				: null,
			menuItemLabel && isDropdown && !hideDropdownIcon ? <DropdownIcon key="dropdown-icon"/> : null,
			addMenuChild ? <Menu key="sythentic">{children}</Menu> : children
		];

		if (to) {
			return (<Link {...topLevelProps} to={to}>
					{finalChildren}
				</Link>
			);
		}
		else if (href) {
			return (<a {...topLevelProps}>
					{finalChildren}
				</a>
			);
		}
		else {
			return (<div {...topLevelProps}>
					{finalChildren}
				</div>
			);
		}
	}
}

interface DropdownMenuProps extends React.HTMLAttributes<HTMLElement> {
	key?: string;
	dropdownLabel?: JSX.Element | string;
	children?: React.ReactNode;
	className?: string;
	systemIcon?: IApplicationIcon;
	image?: JSX.Element | string;
	isButton?: boolean;
	dropdownAction?: DropdownAction;
	systemIconStyle?: any;
}

export class DropdownMenu extends React.Component<DropdownMenuProps,{}> {
	$node: JQuery;

	componentDidMount() {
		this.$node = $(ReactDOM.findDOMNode(this) as Element);
		this.$node.dropdown({
			on:           'hover',
			action:       this.props.dropdownAction != null ? this.props.dropdownAction : "select",
			keepOnScreen: false,
			direction:    'downward',
			onShow:       () => {
				// If we're currently displaying a context menu, we need to hide it

			}
		});
	}

	isShowing;  // WIP - programmatic show

	show = () => {
		this.$node.dropdown('show');
		this.isShowing = true;
		// Highlight and focus the first item
	}

	hide = () => {
		this.$node.dropdown('hide');
		this.isShowing = false;
	}

	render() {
		const {children, systemIcon, dropdownLabel, isButton, image} = this.props;

		return (
			<div
				className={classNames("ui dropdown", this.props.className, {icon: image != null, button: isButton})}>

				{image}
				{systemIcon != null ? <AppIcon icon={systemIcon} style={this.props.systemIconStyle}/> : null}

				{dropdownLabel ? <span className="text">{dropdownLabel}</span> : null}
				{isButton ? null : <i className="dropdown icon"/> }

				{children}
			</div>);
	}
}
