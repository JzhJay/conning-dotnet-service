import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import {computed, observable, makeObservable, action, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {BlueprintDialog} from 'components';
import {Label, MaybeElement} from '@blueprintjs/core';
import type {ObjectNameCheckerResult} from 'stores'
import {
	api, i18n,
	Simulation,
	site,
	utility
} from 'stores';
import {ObjectNameChecker} from 'stores/objectMetadata/ObjectNameChecker';

import * as dialogCss from '../../site/dialogs.css';

interface Model {
	__typename: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis" | "UserTag" | "UserTagValue";
	_id: string;
	name: string;
}

interface ObjectNameCheckerDialogProps {
	model: Model;
	newName: string;
	onRename: (newName: string, result: ObjectNameCheckerResult, model: Model) => Promise<void>;
	onClosed?: (node: HTMLElement) => void;

	canDuplicate?: boolean;
	objectNameChecker?: ObjectNameChecker;

	dialogTitle?: string;
	dialogIcon?: MaybeElement;

	helpText?: (
		result: ObjectNameCheckerResult,
		applySuggestNameElementCreator: (suggestNameWithoutPath:string, suggestName:string) => React.ReactElement
	) => React.ReactElement;
}

@observer
export class ObjectNameCheckerDialog extends React.Component<ObjectNameCheckerDialogProps, {}> {

	@observable hasValidName: boolean;
	@observable nameInputFieldResult: ObjectNameCheckerResult;
	@observable updating: boolean;
	@observable message: string;

    constructor(props: ObjectNameCheckerDialogProps) {
        super(props);
        makeObservable(this);
    }

	get name() {
		return this.nameInputFieldResult ? this.nameInputFieldResult.input : this.props.newName;
	}

	@computed get actionsDisabled() {
		return this.updating;
	}

    @computed get OkDisabled() {
		return this.actionsDisabled || this.hasValidName !== true;
	}

    render() {
		const {actionsDisabled, OkDisabled, updating, message} = this;
	    const {model, dialogIcon, dialogTitle, canDuplicate, objectNameChecker} = this.props;

		let title = dialogTitle || (model ? i18n.common.OBJECT_CTRL.WITH_VARIABLES.RENAME(i18n.translateObjectName(model.__typename)) : i18n.common.OBJECT_CTRL.RENAME);

		return (
			<BlueprintDialog
				className={classNames(dialogCss.newObjectDialog)}
				icon={ dialogIcon || "edit" }
				title={title}
				message={message}
				isCloseButtonShown={!actionsDisabled}
				canCancel={!actionsDisabled}
				okDisabled={OkDisabled}
				ok={this.ok}
				canEscapeKeyClose={!actionsDisabled}
				canOutsideClickClose={!actionsDisabled}
				onClosed={this.props.onClosed}
			>
				<Label tabIndex={0}>
					<span className={classNames(dialogCss.requiredField, dialogCss.fieldLabelAlignTop)}>{i18n.common.WORDS.NAME}</span>
					<NameInputField
						value={this.name}
						objectType={model?.__typename}
						canDuplicate={canDuplicate}
						objectNameChecker={objectNameChecker}
						excludeCheckObjectId={model?._id}
						disabled={updating}
						autoFocus={true}
						onChange={action((e, component) => this.hasValidName = component.hasValidName)}
						onUpdateResult={action((result, component) => {
							this.hasValidName = component.hasValidName;
							this.nameInputFieldResult = result;
						})}
						helpText={this.props.helpText}
					/>
				</Label>
			</BlueprintDialog>);
	}

    @action ok = async () => {
		const {name, props: { model, onRename } } = this;
		if (this.OkDisabled) {
			throw new Error("Cannot call ok() when disabled")
		}

		this.updating = true;
		site.busy = true;
		try {
			this.message = i18n.common.MESSAGE.SAVING;
			await onRename(name, this.nameInputFieldResult, model);
			return "ok";
		}
		catch (e) {
			runInAction(() => {
				this.message = `Error: ${e.message}`;
			});
		}
		finally {
			runInAction(() => {
				this.updating = false;
				site.busy = false;
			});
		}
	}

	/*
	return: is input duplicated and open dialog
	*/
	static saveUniqueNameOrDialog = async (props: ObjectNameCheckerDialogProps, objectNameCheckerConfig?): Promise<boolean> => {
		const {newName, model, onRename, onClosed} = props;
		if (model && newName == model.name) {
			onClosed && onClosed(null);
			return null;
		}
		const objectNameChecker = props.objectNameChecker ? props.objectNameChecker : new ObjectNameChecker(objectNameCheckerConfig);
		const checkResult = await objectNameChecker.isDuplicated(model?.__typename, newName, model?._id, props.canDuplicate);
		if (checkResult.isDuplicated) {
			api.site.setDialogFn(() => <ObjectNameCheckerDialog {...Object.assign({}, props, {objectNameChecker:objectNameChecker})} />);
			return true;
		}
		await onRename(newName, checkResult, model);
		onClosed && onClosed(null);

		return false;
	}
}
