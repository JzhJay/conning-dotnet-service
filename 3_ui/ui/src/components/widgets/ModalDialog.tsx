import { utility} from 'stores'
import {ModalConfig} from 'stores/site'

interface MyProps extends ModalConfig {
}

interface MyState {

}

export class ModalDialog extends React.Component<ModalConfig, MyState> {
	render() {
		const {buttons, onRenderContent, onRenderActions, header, children, className} = this.props;

		return (
			<div ref={modal => this.$modal = $(modal)} className={classNames("ui modal", className)}>
				<div className="header">{header}</div>
				<div className="content">
					{onRenderContent ? onRenderContent() : children}
				</div>
				{onRenderActions ?
				 <div className="actions">{onRenderActions()}</div>
					: buttons === 'okCancel'
					 ? <div className="actions">
						  <div className={classNames("ui approve button", {disabled: this.props.okDisabled})}>OK</div>
						  <div className={classNames("ui cancel button", {disabled: this.props.cancelDisabled})}>Cancel</div>
					  </div>
					 : buttons === 'close'
						  ? <div className="actions">
						   <div className={classNames("ui approve button", {disabled: this.props.okDisabled})}>{this.props.buttonLabel ? this.props.buttonLabel : 'Close'}</div>
					   </div>
						  : null}
			</div>)
	}

	static defaultProps = {
		buttons:  'close',
		closable: true
	}

	private $modal: JQuery;

	show = () => {
		this.$modal.modal({closable: this.props.closable, onShow: this.props.onShow, onApprove: this.props.onApprove, onDeny: this.props.onDeny}).modal('show');
		setTimeout(() => {
		    utility.forceReflow(this.$modal);
        },0)
	}

	hide = () => {
		this.$modal.modal('hide');
	}
}
