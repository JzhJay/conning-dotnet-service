import * as css from'./contextMenu.css'
import {semanticMenu} from 'components/index'
import {settings} from 'stores/index';
import Portal from './react-portal';
import { action, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';

export interface ContextMenuController {
	onContextMenu: (e: MouseEvent) => void
}

interface MyProps {
	className?: string;
	children?: React.ReactNode;
	contextMenuShowing?: boolean;
	contextMenuCoords?: { x: number, y: number }
	theme?: string;
	buttonBar?: boolean;

	onShow?: () => void;
	onHide?: () => void;

	menuOffsetX?: number;
	menuOffsetY?: number;
}

@observer
export class ContextMenu extends React.Component<MyProps, {}> {
    static defaultProps: MyProps = {
		theme:       'wunderlist',
		menuOffsetX: 0,
		menuOffsetY: 0
	}

    @observable showing = false;
    @observable top     = 0;
    @observable left    = 0;
    @observable isOpen  = false;

    static showing: ContextMenu;
    portal: Portal;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const {className, theme, children, buttonBar} = this.props;
		const {showing, top, left, isOpen}            = this;

		const {contextMenuDuration} = settings;
		const {Menu}              = semanticMenu;

		return (
			<Portal ref={p => this.portal = p} className='context-menu-portal'
			        onOpen={this.onOpenPortal}
			        onClose={this.onPortalClosed} closeOnEsc={true}
			        closeOnOutsideClick
			        beforeClose={this.onBeforePortalClose}
			        isOpened={isOpen}>
				<Menu
					style={{top: top, left: left, transitionDuration: contextMenuDuration}}
					onClick={() => this.hide()}
					openOn="hover"
					buttonBar={buttonBar}
					className={classNames(className, css.conningContextMenu, theme, {showing: showing})}>
					{children}
				</Menu>
			</Portal>
		)
	}

    get element() {
		return this.portal.node as HTMLDivElement;
	}

    keyup = (e) => {
		if (e.keyCode === 27 && this.showing)
			this.hide();
	}

    componentDidMount() {
		$('body').keyup(this.keyup);
	}

    componentWillUnmount() {
		$('body').off('keyup', this.keyup);
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (this.props.contextMenuShowing === false && this.showing) {
			this.hide();
		}
	}

    hide = () => {
		this.isOpen = false;

		if (this.showing) {
			this.showing            = false;
			const {props: {onHide}} = this;
			onHide && onHide();
		}
	}

    onOpenPortal = (node: Node) => {
	}

    onPortalClosed = () => {
		this.hide();
	}

    onBeforePortalClose = (node, fn: Function) => {
		// this.hide();
		// setTimeout(fn, 500);
		fn();
	}

    show = (mouseEvent: MouseEvent) => {
		this.isOpen = true;

		setTimeout(() => {
			// Measure our context menu and adjust our position accordingly
			const contextMenuRect = this.element.firstElementChild.getBoundingClientRect();
			const parent          = this.element.parentElement;

			const offset = $(parent).offset();
			//this.props.debug(mouseEvent, 'contextMenuRect', contextMenuRect, offset);

			let pos = {
				left: mouseEvent.clientX - offset.left + this.props.menuOffsetX,
				top:  mouseEvent.clientY - offset.top + this.props.menuOffsetY
			};

			// Do we have enough space to the right of the mouse to show this menu fully expanded?
			let $body       = $("body");
			const overflowX = contextMenuRect.width + pos.left - $body.width();
			const overflowY = contextMenuRect.height + pos.top - $body.height();

			if (overflowX > 0) {
				pos.left -= contextMenuRect.width - this.props.menuOffsetX;
			}

			if (overflowY > 0) {
				pos.top -= contextMenuRect.height - this.props.menuOffsetY;
			}

			// Make sure we're not positioned off screen
			pos.top  = Math.max(pos.top, 0);
			pos.left = Math.max(pos.left, 0);

			this.showing = true;
			this.top     = pos.top;
			this.left    = pos.left
			//$(this.element).find('.ui.menu').addClass('hidden');
			if (this.props.onShow) { this.props.onShow(); }
		}, 10);
	}
}
