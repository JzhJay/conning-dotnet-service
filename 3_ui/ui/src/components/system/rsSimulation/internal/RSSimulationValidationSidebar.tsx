import {bp} from 'components';
import {ManualValidationProgressDialog} from 'components/system/rsSimulation/internal/progress/ManualValidationProgressDialog';
import {StepNavigationItem} from 'components/system/rsSimulation/StepNavigator';
import {ValidationSidebar} from 'components/system/ValidationSidebar/ValidationSidebar';
import * as validationCss from 'components/system/ValidationSidebar/ValidationSidebar.css';
import {computed, reaction, toJS} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation, site, ValidationMessage} from "stores";
import {formatLabelText} from 'utility';

@observer
export class RSSimulationValidationSidebar extends React.Component<{ rsSimulation: RSSimulation }, any> {

	_toDispose = [];

	constructor(props) {
		super(props);

		const {rsSimulation} = this.props;

		if (!rsSimulation.isFIRM) {
			return;
		}

		// check validation messages if it is a FIRM
		const getManualValidationMessages = () => {
			if (
				rsSimulation.manualValidationMessage == null &&
				rsSimulation.additionalControls.showValidationSetting !== false
			) {
				rsSimulation.getManualValidationMessages();
			}
		}
		getManualValidationMessages();

		this._toDispose.push(reaction(
			() => (rsSimulation.additionalControls.showValidationSetting === false),
			() => getManualValidationMessages()
		));
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
	}

	@computed get isManualValidationProgressComplete() {
		const {rsSimulation} = this.props;
		const manualValidationProgress = rsSimulation.manualValidationProgress;
		const manualValidationMessage = rsSimulation.manualValidationMessage;
		if (manualValidationMessage != null) {
			return true;
		}
		if (manualValidationProgress == null) {
			return false;
		}
		if (manualValidationProgress?.type == "exception") {
			return true;
		}
		const progress = manualValidationProgress?.progress;
		return _.isFinite(progress?.denominator) && progress?.numerator == progress?.denominator;
	}

	@computed get validationMessages(): ValidationMessage[] {
		const rsSimulation = this.props.rsSimulation;
		return [
			...rsSimulation?.validationMessages,
			...(rsSimulation?.activeRecalibration?.userInterface?.validationMessages || []),
			...(rsSimulation.isFIRM ? rsSimulation?.manualValidationMessage?.messages || [] : [])
		];
	}

	extraValidationMessagesContentRender = (message) => {
		return <>{
			_.map(message.paths, (path, i) => {
				const title = message.paths.length == 1 ? `Path` : `Path ${i+1}`;
				const displayPathName = message.titles?.length > i ? message.titles[i] : _.map(path, p => formatLabelText(p));
				return <React.Fragment key={`${title}`}>{
					this.pathRender(path, displayPathName, title)
				}</React.Fragment>;
			})
		}</>
	}

	pathRender = (path, title, pathTitle) => {
		if (!path || _.isEmpty(path)) {
			return null;
		}
		const navCtrl = this.props.rsSimulation.stepNavigationController;
		const recalibration = this.props.rsSimulation.activeRecalibration;
		const messagePaths = toJS(path);

		let testStepItems = navCtrl.stepItems;
		let items: StepNavigationItem[] = [];
		let paths: string[] = [];

		const nameMatcher = (name, path) => name == path || name?.endsWith(`-${recalibration.convertJuliaName(path)}`);
		_.forEach(messagePaths, (path, i) => {
			let matchItem = _.isEmpty(testStepItems) ? null : _.find(testStepItems, item => nameMatcher(item.name, path));
			if (matchItem) {
				if (matchItem.applicable) {
					items.push(matchItem);
					testStepItems = matchItem.items;
				} else {
					paths.push(matchItem.title);
					testStepItems = null;
				}
			} else {
				paths.push(title[i]);
			}
		});

		return <>
			<div>
				<span className={validationCss.validationTitle}>{pathTitle}: </span>
				<span>
					{items.map( (item,i) => <React.Fragment key={`view${i}`}>
						<bp.Button minimal small onClick={() => navCtrl.setActiveByItem(item, true)}>{item.title}</bp.Button>
						{(i != (items.length-1) || !_.isEmpty(paths)) && <span>&nbsp;&gt;&nbsp;</span>}
					</React.Fragment>)}
					{paths.map( (path,i) => <React.Fragment key={`path${i}`}>
						<span>{path}</span>
						{(i != (paths.length-1)) && <span>&nbsp;&gt;&nbsp;</span>}
					</React.Fragment>)}
				</span>
			</div>
		</>
	}

	@computed get display() {
		const activeItem = this.props.rsSimulation.stepNavigationController?.activeItem;
		return this.props.rsSimulation.additionalControls.showValidationSetting !== false && activeItem?.parentItem?.name != "query" && activeItem.name != "download"
	}

	@computed get displayWhenNoMessage() {
		return this.props.rsSimulation.additionalControls.showValidationSetting === true;
	}

	onClose = () => {
		this.props.rsSimulation.updateAdditionalControls({showValidationSetting: false});
	}

	render() {
		const {rsSimulation} = this.props;

		const reloadEnabled = rsSimulation.isFIRM &&
			(rsSimulation.manualValidationMessage?.refreshLocked !== true) &&
			(rsSimulation.manualValidationMessage?.refreshEnabled !== false);

		return <ValidationSidebar
			validationMessages={this.validationMessages}
			extraContentRender={this.extraValidationMessagesContentRender}
			canClose={true}
			onClose={this.onClose}
			display={this.display}
			displayWhenNoMessage={this.displayWhenNoMessage}
			reload={rsSimulation.isFIRM ? {
				onReload: () => site.setDialogFn(() => <ManualValidationProgressDialog rsSimulation={rsSimulation} /> ),
				enabled: reloadEnabled,
				icon: !this.isManualValidationProgressComplete ? ManualValidationProgressDialog.ICON : null,
				tooltip: reloadEnabled ? rsSimulation.manualValidationMessage == null ?
				                         ManualValidationProgressDialog.TITLE :
				                         null :
				         `There are no new parameter changes to validate.`
			} : null}
		/>;
	}
}