import {IconName} from '@blueprintjs/core';
import * as classnames from 'classnames';
import type {InputSpecification} from 'components';
import {bp, LoadingIndicator, Option} from 'components';
import {AllParameters} from 'components/system/rsSimulation/internal/AllParameters';
import {action, computed, makeObservable, observable, toJS} from 'mobx';
import {observer} from 'mobx-react';
import {RSSimulation, i18n, xhr} from 'stores';
import { BlueprintDialog } from 'components/widgets/BlueprintDialog';

import * as css from './ModuleSelectionDialog.css';

@observer
export class ModuleSelectionDialog extends React.Component<{rsSimulation: RSSimulation}, any> {

	static TITLE: string = i18n.intl.formatMessage({defaultMessage: "Module Selection", description: "[ModuleSelectionDialog] dialog title"});
	static ICON: IconName = "panel-stats";
	static PATH = [AllParameters.FIRST_PATH_NAME, "super"];

	@observable message: string;
	@observable errorMessage: string;
	@observable inputOptions: InputSpecification;
	@observable userInputs: {[key: string]: boolean};
	defaultUserInputs: {[key: string]: boolean};

	constructor(props) {
		super(props);

		makeObservable(this);

		this.message = i18n.intl.formatMessage({defaultMessage: "Loading Module Information...", description: "[ModuleSelectionDialog] message when loading"});
		xhr.post(this.props.rsSimulation.apiUrl + "/user-interface/select-tree-node", {path: ModuleSelectionDialog.PATH}).then(((resp) => {
			this.inputOptions = _.get(resp, "inputOptions");
			this.defaultUserInputs = _.get(resp, ["userInputs", ...ModuleSelectionDialog.PATH.slice(1)]);
			this.reset();
		})).finally(action(() => {
			this.message = null;
		}));
	}

	@computed get isLoaded() {
		return this.inputOptions != null;
	}

	@computed get actionDisabled() {
		return this.message != null;
	}

	@computed get layersDeep() {
		if (!this.isLoaded) { return 0; }

		return Math.max(..._.map(this.inputOptions.options, option => {
			return option.title.split(".").length;
		}))
	}

	setAll = (status: boolean) => {
		_.forEach(Object.keys(this.userInputs), action((key) => { this.userInputs[key] = status; }));
	}

	@action reset = () => {
		this.userInputs = _.clone(this.defaultUserInputs);
	}

	@action onOK = async () => {
		if (_.isEqual(this.userInputs, this.defaultUserInputs)) {
			return 'ok';
		}
		const data = [];
		_.forEach(this.userInputs, (status, key) => { status === true && data.push(key) });

		this.errorMessage = null;
		this.message = i18n.common.MESSAGE.SAVING;
		return await xhr.post(`${this.props.rsSimulation.apiUrl}/active_modules`, data).then((response: any) => {
			if (response) {
				// Replace the parameter tree wholesale to reflect nodes being added or deleted.
				this.props.rsSimulation.parametersUserInterface.inputOptions.allParameters = response;
				this.props.rsSimulation.invalidateParameters();
			}
			return 'ok';
		}).catch((reason) => {
			this.errorMessage = reason;
			this.reset();
			return null;
		}).finally(action(()=>{
			this.message = null;
		}));
	}

	render() {
		const {actionDisabled, isLoaded, message,errorMessage} = this;
		return <BlueprintDialog
			className={css.root}
			title={ModuleSelectionDialog.TITLE}
			icon={ModuleSelectionDialog.ICON}
			additionalFooter={() => isLoaded && <>
				<bp.Button disabled={actionDisabled} icon={'confirm'} onClick={() => this.setAll(true)} >{i18n.common.SELECTION.ALL}</bp.Button>
				<bp.Button disabled={actionDisabled} icon={'circle'}  onClick={() => this.setAll(false)}>{i18n.common.SELECTION.CLEAR}</bp.Button>
				<bp.Button disabled={actionDisabled} icon={'refresh'} onClick={() => this.reset()}      >{i18n.common.OBJECT_CTRL.RESET}</bp.Button>
			</>}
			message={errorMessage || message}
			isCloseButtonShown={!actionDisabled}
			canCancel={!actionDisabled}
			okDisabled={actionDisabled}
			ok={this.onOK}
		>
			{isLoaded && <div className={css.moduleSelection}>
				<ModuleSelectionGridCellGroup
					options={this.inputOptions.options}
					column={0}
					rowShift={0}
					dialog={this}
				/>
			</div>}
			{actionDisabled && <LoadingIndicator />}
		</BlueprintDialog>
	}
}

class ModuleSelectionGridCellGroup extends React.Component<{options: Option[], column: number, rowShift: number, dialog: ModuleSelectionDialog}, any> {
	get optionGroups() {
		const {column} = this.props;

		const options = _.filter(this.props.options, option => {
			const names = option.title.split(".");
			return names.length >= column + 1;
		});

		return _.groupBy(options, option => {
			const names = option.title.split(".");
			return names[column];
		});
	}

	render() {
		const {column} = this.props;

		let rowShift = this.props.rowShift;
		return <>{
			_.map(this.optionGroups, (options, name) => {
				try {
					return <ModuleSelectionGridCell
						key={`${name}_${column}_${rowShift}`}
						name={name}
						options={options}
						rowShift={rowShift}
						group={this}
					/>
				} finally {
					rowShift += options.length;
				}
			})
		}</>;
	}
}

@observer
class ModuleSelectionGridCell extends React.Component<{name: string, options: Option[], rowShift: number, group: ModuleSelectionGridCellGroup}, any> {

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	get targetOptions() {
		const {options, group:{ props:{ column}}} = this.props;
		if (options.length == 1 ) {
			return options;
		}

		const targetOption = _.filter(this.props.options, option => {
			const names = option.title.split(".");
			return names.length == column + 1;
		});

		return targetOption.length ? targetOption : options;
	}

	@computed get active() {
		const {group: { props: {dialog: {userInputs}}}} = this.props;
		let status = true;
		_.forEach(this.targetOptions, option => {
			status = status && _.get(userInputs, option.name, !!option.defaultValue);
		})
		return status;
	}

	getRelated(trigger: "on"|"off") {
		const triggers = _.map(this.targetOptions, option => _.get(option,["trigger", trigger]));
		return _.uniq(_.flatten(triggers));
	}

	onClick = (e) => {
		const {group: { props: {dialog: {userInputs, actionDisabled}}}} = this.props;
		if (actionDisabled) {
			return;
		}
		const active = !this.active;
		const triggers = this.getRelated(active ? 'on' : 'off');
		_.forEach(triggers, action((trigger) => {
			userInputs[trigger] = active;
		}))
	}

	render() {
		const {name, options, group:{ props:{ column, dialog}}} = this.props;

		const columnSpan = dialog.layersDeep - column;
		let rowShift = this.props.rowShift;
		const optionLength = options.length;
		const isLastCell = optionLength == 1;

		return <React.Fragment>
			<div
				className={classnames(bp.Classes.BUTTON, bp.Classes.ALIGN_LEFT, {[bp.Classes.INTENT_PRIMARY]: this.active}, css.moduleSelectionCell)}
				style={{
					gridColumnStart: column + 1,
					gridColumnEnd: column + 1 + (isLastCell ? columnSpan : 1),
					gridRowStart: rowShift + 1,
					gridRowEnd: rowShift + 1 + optionLength,
					justifyContent: "flex-start"
				}}
				onClick={this.onClick}
			>
				{name}
			</div>

			{ !isLastCell && <ModuleSelectionGridCellGroup
				options={options}
				column={column + 1}
				rowShift={rowShift}
				dialog={dialog} />}
		</React.Fragment>
	}
}