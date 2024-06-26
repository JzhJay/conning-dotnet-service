import {AppIcon, bp} from 'components';
import {action, makeObservable, observable, flow} from 'mobx';
import {observer} from 'mobx-react';
import {IApplicationIcon, Link} from 'stores';
import {formatLabelText} from 'utility';

import * as css from './ObjectLink.css';

export interface ObjectLinkProps<T> {
	id: string | T;
	className?: string;
	popupDisabled?: boolean;
	popupClassName?: string;
	linkDisabled?: boolean;
	linkClassName?: string;
	linkTo?: (model: T) => string;
	linkContent?: (model: T) => (string | JSX.Element);
	onLinkClick?: (e: React.MouseEvent) => void;
	loadingMessage?: (model: T) => (string | JSX.Element);
}

export interface InnerObjectLinkProps<T> extends ObjectLinkProps<T>{
	objectType: string;
	icon: IApplicationIcon;
	modelLoader: (id: string) => Promise<T>;
	popupContent:(model: T) =>  (string | JSX.Element);
	linkTo: (model: T) => string;
	linkContent: (model: T) => (string | JSX.Element);
}


@observer
export class ObjectLink<T> extends React.Component<InnerObjectLinkProps<T>, {}> {

	@observable loaded: boolean = false;
	id: string;
	model: T;

	constructor(props) {
		super(props);
		makeObservable(this);

		if (!this.props.id) {
			this.loaded = true;
			return;
		}

		if(!_.isString(this.props.id)) {
			this.model = this.props.id;
			this.id = _.get(this.model, "_id", _.get(this.model, "id"));
			this.loaded = true;
		} else {
			this.id = this.props.id;
			this.loadModel();
		}
	}

	@flow.bound
	loadModel = function* () {
		try {
			this.model = yield this.props.modelLoader(this.props.id);
		} catch (e) {
			this.model = null;
		} finally {
			this.loaded = true;
		}
	}

	render() {
		const {id, model} = this;
		const {objectType, loadingMessage, popupContent, icon, linkContent, linkTo, className, popupClassName, linkClassName, popupDisabled} = this.props;

		if (!this.loaded) {
			return <bp.Tooltip content={`${formatLabelText(objectType)}: ${id}`} position={bp.Position.BOTTOM_LEFT} minimal>
				<span className={classNames(css.root, className)}>
					<bp.Spinner size={14} className={css.icon} />
					<span className={css.text}>{loadingMessage ? loadingMessage(model) : "Loading..."}</span>
				</span>
			</bp.Tooltip>
		}

		if (!this.id) {
			return null;
		}

		if (!this.model) {
			return <bp.Tooltip content={id} position={bp.Position.BOTTOM_LEFT} minimal>
				<span className={classNames(css.notFound, className)}>{formatLabelText(objectType)} Not Found</span>
			</bp.Tooltip>;
		}

		const linkToUrl = linkTo && linkTo(model);
		const linkDisabled = this.props.linkDisabled || (!linkToUrl);
		const linkClassnames = classNames(css.root, className, linkClassName);
		const linkChildElements = <>
			<AppIcon icon={icon} className={css.icon} iconningSize={20} size={"small"} small />
			<span className={css.text}>{linkContent(model)}</span>
		</>

		return <bp.Popover
			className={popupClassName}
			disabled={popupDisabled}
			interactionKind={bp.PopoverInteractionKind.HOVER}
			position={bp.Position.TOP_LEFT}
			modifiers={{
				keepTogether:    {enabled: false},
				preventOverflow: {enabled: false}
			}}
			content={popupContent(model)}
		>{
			linkDisabled ?
			<span className={classNames(linkClassnames, css.disabledLink)}>{linkChildElements}</span> :
			<Link to={linkToUrl} onClick={this.props.onLinkClick} className={linkClassnames}>{linkChildElements}</Link>
		}</bp.Popover>
	}
}