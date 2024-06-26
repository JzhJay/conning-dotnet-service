import {bp} from 'components';
import {action, makeObservable, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {site} from 'stores';
import {unlockInputsConfirm} from 'utility';
import * as css from './LockCover.css';

interface LockCoverProps {
	isLocked: boolean;
	isSilentLock?: boolean;
	tooltipContent?: string | JSX.Element;
	small?: boolean;

	objectType?: string;
	canUnlock?: boolean;
	unlockInputs?: () => void;
}

@observer
export class LockCover extends React.Component<LockCoverProps, any> {

	private dispose: Function[] = [];

	@observable coverTop: number = 0;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

	componentDidMount() {
		const parent = $(ReactDOM.findDOMNode(this)).parent();
		if(parent.css('position') == 'static') {
			parent.css('position', 'relative');
		}

		this.dispose.push(reaction(() => this.props.isLocked, this.updateTop));
		parent[0].addEventListener('scroll', this.updateTop);
		this.updateTop();
	}

	componentWillUnmount() {
		const parent = $(ReactDOM.findDOMNode(this)).parent();
		parent[0].removeEventListener('scroll', this.updateTop);
		this.dispose.forEach(f => f());
	}

	updateTop = _.debounce(action(() => {
		this.props.isLocked && (this.coverTop = $(ReactDOM.findDOMNode(this)).parent()[0].scrollTop);
	}), 10)

	unlockConfirm = () => {
		const {unlockInputs} = this.props;
		if (!unlockInputs) { return; }
		unlockInputsConfirm(this.props.objectType, unlockInputs);
	}

	render() {
		const {isLocked, isSilentLock, tooltipContent, small, unlockInputs} = this.props;
		const canUnlock = isLocked && !isSilentLock && unlockInputs != null && this.props.canUnlock === true;

		return <div className={classNames(
			css.root,
			{[css.hide]: !isLocked},
			{[css.silentLock]: isSilentLock === true},
			{[css.small]: small === true},
			{[css.canUnlock]: canUnlock}
		)} style={{top: this.coverTop}}>
			<div className={css.watermark} onClick={canUnlock ? this.unlockConfirm : null}>
				<bp.Icon icon="lock"/>
				<bp.Icon icon="unlock"/>
				<span>{tooltipContent}</span>
			</div>
		</div>;
	}
}