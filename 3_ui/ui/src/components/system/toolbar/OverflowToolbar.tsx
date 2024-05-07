// import './toolbar.scss'
import * as css from './toolbar.css';
import {ResizeSensorComponent, semanticMenu} from '../../index'
import {observer} from 'mobx-react';
import { observable, action, makeObservable } from 'mobx';

export interface ToolbarProps extends React.HTMLProps<any> {
	theme?: string;
	handleOverflow?: boolean;
}

/**
 * Our toolbar component
 *
 * Features:
 *      - Responsiveness:  Ability to collapse and hide individual semantic menu items if there's not enough space to display them
 *                         a la Google Docs
 *
 */
@observer
export class OverflowToolbar extends React.Component<ToolbarProps, {}> {
	static initialProps = {
		handleOverflow: false
	}

	constructor(props) {
		super(props);

		if (this.props.handleOverflow) { this.overflowHandler = new ToolbarOverflowHandler(this)}
	}

	overflowHandler?: ToolbarOverflowHandler;

	render() {
		const {MenuItem} = semanticMenu;
		const {
			      props: {className, ref, handleOverflow, theme, children, ...props},
			      overflowHandler
		      }          = this;

		return (
			<div className={classNames(className, this.props.theme, "ui borderless menu", css.react, css.toolbar)}
			     {...props}
			     onClick={this.onClick}>
				{overflowHandler ? <ResizeSensorComponent onResize={overflowHandler.onToolbarResize} parentDepth={2}/> : null}
				{children}
				{overflowHandler && overflowHandler.showOverflowButton
					? <MenuItem onClick={overflowHandler.toggleOverflow}
					            menuItemLabel="More"
					            className={classNames(css.moreButton, "pointing", {active: overflowHandler.showingOverflow})}>
				 </MenuItem>
					: null}
			</div>)
	}

	componentDidMount() {
		this.node  = ReactDOM.findDOMNode(this) as Element;
		this.$node = $(this.node);

		this.overflowHandler && this.overflowHandler.onToolbarResize();

	}

	componentWillUnmount() {
		this.overflowHandler && this.overflowHandler.componentWillUnmount();
	}

	componentDidUpdate(oldProps: ToolbarProps) {
		if (this.overflowHandler && this.props.children !== oldProps.children) {
			this.overflowHandler.onToolbarResize();
		}
	}

	// If the overflow is showing, hide it if they click on the toolbar whitespace again
	onClick = (e: React.MouseEvent<HTMLElement>) => {
		this.overflowHandler && this.overflowHandler.onClick(e);
	}

	node: Element;
	$node: JQuery;

}

class ToolbarOverflowHandler {
	@observable showingOverflow          = false;
	@observable showOverflowButton       = false;
	@observable overflowElementWidth     = 0;
	@observable overflowElement?: JQuery = null;

	constructor(private toolbar: OverflowToolbar) {
        makeObservable(this);
        document.addEventListener('click', this.onDocumentClick, false);
    }

	componentWillUnmount() {
		document.removeEventListener('click', this.onDocumentClick, false);
	}

	onDocumentClick = (e: MouseEvent) => {
		if (this.showingOverflow && !this.toolbar.node.contains(document.elementFromPoint(e.clientX, e.clientY))) {
			this.hideOverflow();
		}
	}

	@action onToolbarResize = () => {
		//console.log('onToolbarResize');
		const {toolbar: {$node}, showOverflowButton, overflowElementWidth, overflowElement} = this;

		if ($node == null) { return }

		/**
		 * In the highcharts toolbar we have a .left.menu and a .right.menu
		 * The left menu collapses as needed, while the right one does not
		 * The left menu is amended to show a "More" menu item if we run out of room.
		 */

		      //Note: outerWidth(true) takes the margin into account and does not work (atleast in windows). Including the margin
		      //will cause the children width measurement to take up the entire toolbar width. Thus causing the "more" button to always show
		      //except in the situation where there are subpixel differences. e.g. childrenWidths = 1705.5 and toolbarWidth = 1706
		let childrenWidths = _.sum(_.map(this.toolbar.$node.children(':not(.more-button, .overflowing)'), c => {
			      return $(c).outerWidth(false)
		      }));

		// this.$node.children().each((index, elem) => {
		//     console.log(elem);
		// });

		// Do we now have enough space to show the previously hidden bar?
		if (showOverflowButton) {
			if (childrenWidths + overflowElementWidth <= $node.outerWidth()) {
				//console.log(childrenWidths + overflowElementWidth, this.$node.width())
				this.showOverflowButton = false;
				this.overflowElement    = null;

				overflowElement.show().removeClass('overflowing');
			}
		}
		else {
			// Check for overflow
			if (childrenWidths > $node.outerWidth()) {
				//console.log(`overflow ${childrenWidths} > ${this.$node.width()}`)

				const $overflowElem = $node.children().last();

				const overflowElementWidth = $overflowElem.outerWidth();

				$overflowElem.hide().addClass('overflowing');

				this.showOverflowButton   = true;
				this.overflowElement      = $overflowElem;
				this.overflowElementWidth = overflowElementWidth;
			}
		}
	}

	checkChildrenForOverflow(node: Element) {
		// Loop over our children and see who is offscreen
		for (let i = 0; i < node.childNodes.length; i++) {

			const elem  = node.childNodes[i] as Element;
			const $elem = $(elem);

			if ($elem.children('.menu').length > 0) {
				this.checkChildrenForOverflow(elem);
			}
			else {
				if (elem.scrollWidth > elem.clientWidth) {
					console.log('overflowing element: ', elem)
				}
			}
		}
	}

	@action toggleOverflow = () => {
		if (!this.showingOverflow) {
			this.showOverflow();
		}
		else {
			this.hideOverflow();
		}
	}

	@action showOverflow = () => {
		if (!this.showingOverflow) {
			this.overflowElement.show().addClass('showing');
			this.showingOverflow = true;
		}
	}

	@action hideOverflow = () => {
		if (this.showingOverflow) {
			this.overflowElement.removeClass('showing');
			this.showingOverflow = false;
		}
	}

	onClick = (e: React.MouseEvent<HTMLElement>) => {
		if (this.showingOverflow && $(e.target).hasClass('toolbar')) {
			this.hideOverflow();
		}
	}
}