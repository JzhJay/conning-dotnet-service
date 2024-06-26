import {Icon} from '@blueprintjs/core';
import {AppIcon, bp} from 'components';
import { action, observable, makeObservable, flow } from 'mobx';
import {observer} from 'mobx-react';
import type {IApplicationIcon} from 'stores';
import * as css from './FloatProcess.css';

interface MyProps {
	icon?: IApplicationIcon,
	title?: string,
	closeable?: boolean;
	confirmClose?: () => boolean | Promise<boolean> | Generator<Promise<boolean>>;
	onClose?: (event?) => void;
	className?: string;
}

@observer
export default class FloatProcess extends React.Component<MyProps, {}> {

	$el;
	$floatWindowContainer;
	mutationObserver = null;
	mutationObserverTargetIsToaster: boolean = null;

	@observable minimize = false;

	@action toggleContent = () => {
		this.minimize = !this.minimize;
		const afterFunc = () => { this.$el.toggleClass(css.minimizeWindow,this.minimize); };
		if (!this.minimize) {
			this.$el.find(`.${css.body}`).show(200, afterFunc);
		} else {
			this.$el.find(`.${css.body}`).hide(200, afterFunc);
		}
	}

	constructor(props) {
        super(props);
        makeObservable(this);
        this.$el = $('<div>')
			.addClass(css.window)
			.addClass(bp.Classes.POPOVER_DISMISS_OVERRIDE)
			.click((e) => {e.preventDefault();});

        this.props.className && this.props.className.split(" ").forEach(cl => this.$el.addClass(cl));

        $('#conning-float-process').remove();
        this.$floatWindowContainer = $('<div>').attr('id','conning-float-process').addClass(css.container).append(this.$el).appendTo(document.body);
    }

	componentDidMount() {
		this.countPosition();

		this.mutationObserver = new MutationObserver(this.countPosition);
		this.mutationObserver.observe(document.body, {childList: true, subtree: true});
	}

	componentWillUnmount() {
		this.mutationObserver.disconnect();
		this.$floatWindowContainer.remove();
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (prevProps.className != this.props.className) {
			prevProps.className && prevProps.className.split(" ").forEach(cl => this.$el.removeClass(cl));
			this.props.className && this.props.className.split(" ").forEach(cl => this.$el.addClass(cl));
		}
	}

	countPosition = () => {
		const toaster = $('.site-toaster');
		const widthArray = toaster.find('.bp3-toast').map((i, e) => $(e).width()).get();
		if (widthArray.length ) {
			this.$floatWindowContainer.css('padding-right', (Math.max.apply(Math, widthArray) || 0));
		} else {
			this.$floatWindowContainer.css('padding-right', 0);
		}
	}

	@flow.bound
	*onClose(event) {
		if (this.props.confirmClose && !(yield this.props.confirmClose())) {
			return;
		}
		this.$el.hide( 200 , this.props.onClose ? () => this.props.onClose(event) : null )
	}

	render() {
		return ReactDOM.createPortal( <>
				<div className={css.header} onClick={ (e) => { e.stopPropagation(); }}>
					{this.props.icon && <AppIcon icon={this.props.icon} iconningSize={20} />}
					<span className={css.title}>{this.props.title == undefined ? '' : this.props.title}</span>
					<Icon className={css.actionIcon} icon={this.minimize?"chevron-up" : "chevron-down"} title={this.minimize?"Show" : "Minimize window"} iconSize={24} onClick={this.toggleContent}></Icon>
					{this.props.closeable !== false && <Icon className={css.actionIcon} icon={"cross"} title={"close"} iconSize={24} onClick={this.onClose}></Icon>}
				</div>
				<div className={css.body}>
					{this.props.children}
				</div>
			</>,
			this.$el[0]
		);
	}
}