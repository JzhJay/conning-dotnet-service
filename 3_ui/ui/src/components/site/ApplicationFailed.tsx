import * as css from './ApplicationFailed.css';
import {bp} from 'components'

export interface MyProps {
	failureMessage: string
	reloadBtnClick?: () => void
}

export class ApplicationFailed extends React.Component< MyProps, any> {
	render() {
		const {failureMessage, reloadBtnClick} = this.props;
		return (<div className={css.root}>
			<bp.Icon icon={"warning-sign"} iconSize={60}/>
			<div>{failureMessage}</div>
			{reloadBtnClick && <div><bp.Button onClick={() => reloadBtnClick()}>Retry</bp.Button></div>}
		</div>)
	}
}