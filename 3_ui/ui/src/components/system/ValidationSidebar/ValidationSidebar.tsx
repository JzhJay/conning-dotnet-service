import {MaybeElement} from '@blueprintjs/core';
import { computed, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {CSSProperties} from 'react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {ClimateRiskAnalysis, ClimateRiskAnalysisStore, RSSimulation, i18n, IO, IOStore, ValidationMessage} from 'stores';
import * as css from './ValidationSidebar.css'
import {bp} from 'components'
import {UseCaseViewer} from 'stores/rsSimulation/useCaseViewer/UseCaseViewer';


interface CommonValidationSidebarProps {
	canClose?: boolean;
	onClose?: () => void;
	display?: boolean;
	displayWhenNoMessage?: boolean;
	style?: CSSProperties;
	className?: string;
	reload?: {
		onReload: () => void;
		icon?: bp.IconName;
		enabled?: boolean;
		tooltip?: string;
	}
}

interface ValidationSidebarProps extends CommonValidationSidebarProps{
	validationMessages: ValidationMessage[];
	extraContentRender?: (message: ValidationMessage) => MaybeElement;
}

@observer
export class ValidationSidebar extends React.Component<ValidationSidebarProps, {}> {
    constructor(props: ValidationSidebarProps) {
        super(props);
        makeObservable(this);
    }

    @computed get validationMessages(): ValidationMessage[] {
		return _.values(this.props.validationMessages) || [];
	}

    @computed get display(): boolean {
		const {display, displayWhenNoMessage} = this.props;
		if (displayWhenNoMessage !== true && this.validationMessages.length == 0) {
			return false;
		}
		return display !== false;
	}

    @computed get canClose(): boolean {
		const {canClose, onClose} = this.props;
		return canClose !== false && onClose != null;
	}

    getIntent(errorType) {
		switch (errorType) {
			case "Info": return bp.Intent.PRIMARY;
			case "Warning": return bp.Intent.WARNING;
			case "Error": return bp.Intent.DANGER;
			default: throw new Error("Invalid error type in ValidationSidebar::getIntent()");
		}
	}

    render() {
		const {validationMessages, canClose, display, props: {onClose, reload, extraContentRender, className, style}} = this;

		if (!display) {
			return null;
		}

		return <div className={classNames(css.root, className)} style={style}>
			<div className={css.header}>
				<span className={css.title}>
					<FormattedMessage defaultMessage={"Validation Detail"} description={"[ValidationSidebar] sidebar title"}/>
				</span>
				{reload != null && <bp.Tooltip disabled={!reload.tooltip} content={reload.tooltip}>
					<bp.Button className={css.reload} minimal icon={reload.icon || "refresh"} onClick={reload.onReload} disabled={reload.enabled === false}/>
				</bp.Tooltip>}
				{canClose && <bp.Button className={css.close} minimal icon={"cross"} onClick={onClose}/>}
			</div>
			<div className={css.validations}>
				{validationMessages.length > 0 ? validationMessages.map((validation: ValidationMessage, i) => {
					const extraContent = extraContentRender ? extraContentRender(validation) : null;
					return <div className={css.validation} key={`ValidationMessage_${i}`}>
						<bp.Callout title={validation.messageType} intent={this.getIntent(validation.messageType)}>
							<div>
								<span className={css.validationTitle}>Description: </span>
								<span>{validation.messageText}</span>
							</div>
							{extraContent &&
							<div className={css.component}>
								{extraContent}
							</div>}
						</bp.Callout>
					</div>
				}) : <span><FormattedMessage defaultMessage={"No errors or warnings"} description={"[ValidationSidebar] no any message this time"}/></span>}
			</div>
		</div>
	}
}

interface BookValidationSidebarProps extends CommonValidationSidebarProps{
	method: IO | ClimateRiskAnalysis | UseCaseViewer;
	store: IOStore | ClimateRiskAnalysisStore | UseCaseViewer;
}

@observer
export class BookValidationSidebar extends React.Component<BookValidationSidebarProps, {}> {
    constructor(props: BookValidationSidebarProps) {
        super(props);
        makeObservable(this);
    }

    @computed get validationMessages() {
		return this.props.method.validationMessages;
	}

    extraContentRender = (message) => {
		let validationPaths = _.filter(message.paths, path => path?.length > 0);
		let componentNames = _.uniq(_.map(validationPaths, path => path[0] == "constraintsAndDuration" ? "assetClasses" : path[0]));

		const store = this.props.store;
		const book = this.props.method.book;
		let pages = [], views = [];
		componentNames.forEach( componentName => {
			pages = pages.concat(book.pages.filter(page => page.selectedViews.find(view => view.name == componentName)));
			store.views[componentName] && views.push(store.views[componentName].label);
		});
		pages = _.uniqBy(pages, page => page.pageId);

		return <>
			<div>
				<span className={css.validationTitle}>{i18n.common.OBJECT_CTRL.VIEW}: </span>
				<span>{views.join(', ')}</span>
			</div>
			<div>
				<span className={css.validationTitle}>{i18n.common.OBJECT_CTRL.PAGE}: </span>
				<span>
                    {_.isEmpty(pages) ? "None" : pages.map((page, i) => <React.Fragment key={i}>
                        <span>{i == 0 ? "" : ", "}</span>
                        <bp.Button minimal onClick={() => book.navigateToPage(page.pageNumber)}>{page.title}</bp.Button>
                    </React.Fragment>)}
				</span>
			</div>
		</>
	}

    render() {
		return <ValidationSidebar
			{...this.props}
			validationMessages={this.validationMessages}
			extraContentRender={this.extraContentRender}
		/>
	}
}
