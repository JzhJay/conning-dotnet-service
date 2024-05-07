import {ProgressStep} from 'components/system/Progress/ProgressStep';
import { computed, makeObservable } from 'mobx';
import { observer } from "mobx-react";
import * as React from 'react';
import {ProgressStepMessage} from 'components';
import {formatLabelText} from 'utility';
import * as css from './Loading.css'
import {Dimmer, Loader} from 'semantic-ui-react'
import {i18n} from 'stores';

interface MyProps {
	active?: boolean;
	smallLoader?: boolean;
	inline?: boolean;
	showText?: boolean;
	className?: string;
	text?: string;
	image?: string;
	inverted?: boolean;
	loader?: boolean;
}

@observer
export class LoadingIndicator extends React.Component<MyProps, {}> {
	static defaultProps: MyProps = {
		active: true, smallLoader: false, showText: true, inverted: true,
		text: i18n.common.MESSAGE.LOADING
	}

	render() {
		const {active, loader, className, image, smallLoader, inline, inverted, text, showText, children} = this.props;

		return (
			<Dimmer inverted={inverted} style={{display: active ? 'inherit' : 'none'}} active={active !== false}
			            className={classNames(className, css.root, {[css.inline]: inline, [css.imageDimmer]: image != null})}>
				{image ? <div className={classNames(css.imageContainer)}>
					         <img className={css.splash} src={image}/>
							 {children && children}
				         </div>
					: loader != false && <Loader inline={inline} size={smallLoader ? "small" : "large"} className={classNames({ text: showText })}>
					 {!children && showText && text && text}
					 {children && children}
				 </Loader>
				}
			</Dimmer>)
	}
}

export interface LoadingStatusMessage {
	type: string;
	label?: string;
	currentMessage?: string;
	data?: string;
	progress?:{
		denominator:number;
		numerator:number;
	}
	showCurrentMessage?: boolean;
}

export interface LoadingIndicatorWithStatusModel {
	isReady?: boolean
	loadingStatusMessages: LoadingStatusMessage[];
}

interface LoadingIndicatorWithStatusProps extends MyProps {
	titlePredicate?: (model: LoadingIndicatorWithStatusModel) => (string | Element | React.ReactNode);
	showStatusMsg?: boolean;
	model?: LoadingIndicatorWithStatusModel;
}

@observer
export class LoadingIndicatorWithStatus extends React.Component<LoadingIndicatorWithStatusProps, {}> {
    constructor(props: LoadingIndicatorWithStatusProps) {
        super(props);
        makeObservable(this);
    }

    @computed get title(): string | Element | React.ReactNode{
		const {titlePredicate, model, text, children, showText} = this.props;

		let returnTitle;
		if (titlePredicate) {
			returnTitle = titlePredicate(model);
		}

		return returnTitle || (showText !== false ? text : null) || children;
	}

    @computed get statusMag(){
		const {model, showStatusMsg} = this.props;
		if (showStatusMsg === false) {
			return null;
		}
		const status_msg = _.findLast(model?.loadingStatusMessages, data => data.type == 'status')?.data;
		return status_msg ? formatLabelText(status_msg) : " ";
	}

    @computed get progressStepMessages(): ProgressStepMessage[] {
		const rtnAry: ProgressStepMessage[] = [];
		_.forEach(this.props.model?.loadingStatusMessages, data => {
			const {label, currentMessage, progress} = data;
			if (!progress || progress.denominator <= 0) {
				return;
			}

			const showCurrentMessage = data.showCurrentMessage === true && currentMessage && currentMessage != label;

			const existObj = _.find(rtnAry, d => d.label == label) as ProgressStepMessage;
			if (existObj) {
				if (existObj.denominator != progress.denominator || existObj.numerator < progress.numerator ) {
					existObj.denominator = progress.denominator;
                    existObj.numerator = progress.numerator;
					existObj.description = showCurrentMessage ? currentMessage : null;
				}
			} else {
				rtnAry.push(new ProgressStepMessage({
					label: label,
					denominator: progress.denominator,
		            numerator: progress.numerator,
					description: showCurrentMessage ? currentMessage : null
				}));
			}
		});

		return rtnAry;
	}

    render() {
		const {statusMag, progressStepMessages, title} = this;
		return (
			<LoadingIndicator {...this.props}>
				{ title && <div className={css.propChildren}>{title}</div>}
				{ statusMag && <div className={css.statusMag}>{statusMag}</div>}
				{ progressStepMessages && progressStepMessages.length > 0 && <div className={css.progressGroup} >
					{progressStepMessages.map( (progressStepMessage, i) => <ProgressStep key={`progressStepMessage${i}`} progress={progressStepMessage} />)}
				</div>}
			</LoadingIndicator>)
	}
}


