import {IconName, Dialog, Button, Intent, Position, Tooltip, AnchorButton, ControlGroup, MaybeElement} from '@blueprintjs/core';
import {api, i18n} from 'stores';
import {utility} from 'stores'
import {observer} from 'mobx-react';
import { observable, when, IReactionDisposer, makeObservable, action, runInAction } from 'mobx';
import * as bp from '@blueprintjs/core';

interface MyProps extends bp.OverlayableProps, bp.IBackdropProps {
	/**
	 * Name of icon (the part after `bp3-icon-`) to appear in the dialog's header.
	 * Note that the header will only be rendered if `title` is provided.
	 */
	icon?: IconName | MaybeElement;
	/**
	 * Whether to show the close "X" button in the dialog's header.
	 * Note that the header will only be rendered if `title` is provided.
	 * @default true
	 */
	isCloseButtonShown?: boolean;
	/**
	 * CSS Styles to apply to the .bp3-dialog element.
	 * @default {}
	 */
	style?: React.CSSProperties;
	/**
	 * Title of dialog.
	 * If provided, a `.bp3-dialog-header` element will be rendered inside the dialog
	 * before any children elements.
	 * In the next major version, this prop will be required.
	 */
	title?: string | JSX.Element;

	message?: string;
	error?: boolean;
	canCancel?: boolean;
	cancelText?: string;
	ok?: () => Promise<any>;
	okTitle?: string;
	okText?: string;
	loading?: boolean;
	okDisabled?: boolean;
	className?: string;
	wrapBodyInControlGroup?: boolean;
	additionalFooter?: (BlueprintDialog) => JSX.Element;
}

@observer
export class BlueprintDialog extends React.Component<MyProps, {}> {
    @observable result: null | 'cancel' | any = null;
    _disposers: IReactionDisposer[] = [];

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    // TODO: css file is being dropped because its not referenced.
    // Not fixing now to avoid introducing any new issues before 1.0 release.

    render() {
		const {props: {additionalFooter, wrapBodyInControlGroup, loading, children, title, canCancel, error, message, okTitle, cancelText, okText, okDisabled, ok, className, ...dialogProps}} = this;

		//console.log(`canCancel:  ${canCancel}`);
	    const okBtnText = okText || i18n.common.DIALOG.OK;
	    const cancelBtnText = cancelText || i18n.common.DIALOG.CANCEL;

		return (
			<Dialog isOpen={!this.result} title={title}
			        canEscapeKeyClose={canCancel} className={classNames(className)}
			        onClose={action(e => {
				        this.result = e;
			        })}
			        onOpened={this.calInputsAlign}
			        {...dialogProps}>
				<div className={bp.Classes.DIALOG_BODY} onKeyDown={this.onKeyDown} style={{marginBottom: "20px"}}>
					{!wrapBodyInControlGroup ? <div ref={r => this.layoutNode = r} style={{display: 'flex', minHeight: 300, flex: '1 0 auto'}}>
						                         {children}
					                         </div>
					                         : <ControlGroup vertical className={bp.Classes.INLINE}>
						 {children}
					 </ControlGroup>}
				</div>
				<div className={bp.Classes.DIALOG_FOOTER}>
					<div className={bp.Classes.DIALOG_FOOTER_ACTIONS}>
						<label className={classNames(bp.Classes.LABEL, {error: error})}>{message}</label>
						{additionalFooter ? additionalFooter(this) : null}
						{canCancel && <Button text={cancelBtnText} onClick={action(() => this.result = 'cancel')} tabIndex={4}/>}
						{ok != null && <Tooltip content={okTitle} position={Position.BOTTOM}>
							<AnchorButton intent={Intent.PRIMARY}
							              loading={loading}
							              disabled={okDisabled}
							              tabIndex={5}
							              onClick={this.onOk}
							              text={okBtnText}
							/></Tooltip>}
					</div>
				</div>
			</Dialog>
		);
	}

    layoutNode: HTMLDivElement;

    private onKeyDown = (e: React.KeyboardEvent<any>) => {
		if (e.keyCode === api.utility.KeyCode.Enter) {
			this.onOk();
		}
	}

	calInputsAlign = (target?: HTMLElement) => {
		if (!target) {
			target = (ReactDOM.findDOMNode(this) as HTMLElement) || document.body;
		}
		const labels = $(target).find(`.bp3-dialog-body > .bp3-control-group > .bp3-label`);
		if (labels.length) {
			let maxWidth = 0, minWidth = 0;
			labels.css('grid-template-columns', '');
			labels.each((i, elem) => {
				let width = $(elem).children().first().width();
				maxWidth = Math.max(maxWidth, width);
				minWidth = i == 0 ? width : Math.min(minWidth, width);
			});
			if (maxWidth != minWidth) {
				// let the label space width as 10px as a unit to avoid changes in content made size change too often.
				const applyWidth = Math.ceil((maxWidth + 9) / 10) * 10;
				labels.css('grid-template-columns', `minmax(${applyWidth}px, max-content) 1fr`);
			}
		}
	}

	componentDidMount() {
		this._disposers.push(
			when(() => this.result != null, () => setTimeout(() => api.site.setDialogFn(null), api.utility.animation.medium), {name: `Clear dialog function`})
		);

		setTimeout(() => {
			utility.forceReflow($('.bp3-dialog-body'));
		}, 100)
	}

    componentWillUnmount() {
		this._disposers.forEach(f => f());
	}

    static defaultProps = {
		wrapBodyInControlGroup: true,
		ok:                     () => { return 'ok'},
		canCancel:              true
	}

    onOk = () => {
		// Wait a moment to do this - it's jarring otherwise
		setTimeout(async () => {
			const r = await this.props.ok();
			runInAction(()=> {
				this.result = r;
			});
			//console.log('onOK result:', this.result)
		}, api.utility.animation.medium);
	}
}
