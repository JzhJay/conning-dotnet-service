import {IconName} from '@blueprintjs/core';
import classNames from 'classnames';
import {BlueprintDialog, bp, LoadingIndicator} from 'components';
import {action, computed, makeObservable, observable, reaction, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {Progress} from 'semantic-ui-react';
import {RSSimulation, i18n, site, xhr} from 'stores';

import * as css from './RollForwardDialog.css'


@observer
export class RollForwardDialog extends React.Component<{rsSimulation: RSSimulation}, any> {
	static TITLE: string = i18n.intl.formatMessage({defaultMessage: "Roll Forward", description: "[RollForwardDialog] dialog title"});
	static ICON: IconName = "fast-forward";

	_dispose: Function[] = []
	inputRefs:{year: HTMLInputElement, month: HTMLInputElement, updateTemplate: bp.Checkbox} = {year: null, month: null, updateTemplate: null}
	@observable suggestBoxOpened: {year: boolean, month: boolean} = {year: false, month: false};

	@observable availableTemplates: string[] = null;
	@observable currentDate: {year: number, month: number} = null; //availableTemplates
	@observable userInputs: {year: number, month: number, updateTemplate:boolean} = null;

	@observable errMessage: any = null;

	constructor(props) {
		super(props);
		runInAction(() => this.props.rsSimulation.rollForwardProgress = null);
		makeObservable(this);

		this._dispose.push(reaction(() => this.status, s => {
			if (s == 'finished') {
				site.setDialogFn(null);
			}
		}));


		xhr.get<{year: number, month: number, availableTemplates: string[]}>(`${this.props.rsSimulation.apiUrl}/roll-forward`).then(action((result) => {

			this.availableTemplates = _.map(result.availableTemplates, v => `${v}`);
			this.currentDate = {year: result.year, month: result.month};
			this.userInputs = {year: result.year, month: result.month, updateTemplate: true}
		}));

	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	@computed get status(): ('preparing' | 'initial' | 'running' | 'finished' | 'exception') {
		if (this.currentDate == null) {
			return 'preparing';
		}
		const rollForwardProgress = this.props.rsSimulation.rollForwardProgress;
		if (!rollForwardProgress) {
			return 'initial';
		}
		return (rollForwardProgress.progress.denominator != rollForwardProgress.progress.numerator) ?
		       'running': (rollForwardProgress.type != "exception") ? 'finished': 'exception' ;
	}


	@computed get year_suggestionBox() {
		const years = _.map(this.availableTemplates, d => parseInt(d.substring(0,4)));
		years.push(new Date().getFullYear());
		years.push(this.currentDate.year+2);

		return <bp.Menu className={css.suggestBox}>{_.map(_.range(this.currentDate.year, Math.max(...years) + 1), year => {
			return <bp.MenuItem key={`year_suggestion_${year}`} active={year == this.userInputs.year} text={year} onClick={(e) => {
				this.inputRefs.year.value = `${year}`;
				this.userInputs.year = year;
				this.errMessage = null;
				this.inputRefs.year.focus();
			}}  />
		})}</bp.Menu>
	}

	@computed get month_suggestionBox() {
		return <bp.Menu className={css.suggestBox}>{_.map(_.range(1, 13), month => {
			return <bp.MenuItem key={`month_suggestion_${month}`} active={month == this.userInputs.month} text={month} onClick={(e) => {
				this.inputRefs.month.value = `${month}`;
				this.userInputs.month = month;
				this.errMessage = null;
				this.inputRefs.month.focus();
			}}  />
		})}</bp.Menu>
	}

	isTriggerBySuggestBox = (e: React.FocusEvent) => {
		return !!(e.relatedTarget && (
			$(e.relatedTarget).is(`.${css.suggestBox}`) ||
			$(e.relatedTarget).parents(`.${css.suggestBox}`).length)
		);
	}

	@computed get isApplyTemplateDisabled() {
		return !_.includes(this.availableTemplates, `${this.userInputs.year}${_.padStart(`${this.userInputs.month}`, 2, '0')}`);
	}

	@action onOK = async () => {
		this.errMessage = null;
		if (this.status == 'initial') {
			if (
				(
					this.currentDate.year == this.userInputs.year &&
					this.currentDate.month == this.userInputs.month
				) || (
					((this.currentDate.year * 100) + this.currentDate.month) >
					((this.userInputs.year * 100) + this.userInputs.month)
				)
			) {
				this.errMessage = i18n.intl.formatMessage({defaultMessage: "The roll-forward date selected is not after the current model date.", description: "[RollForwardDialog] the validation message - the input dates not supported"});
			} else {
				await this.props.rsSimulation.sendRollForward({
					...this.userInputs,
					updateTemplate: this.isApplyTemplateDisabled ? false : this.userInputs.updateTemplate
				});
			}
			return null;
		} else {
			return 'OK';
		}
	}

	render() {
		const status = this.status;
		const rollForwardProgress = this.props.rsSimulation.rollForwardProgress;

		const popoverProps: bp.IPopoverProps = {
			autoFocus:false,
			enforceFocus:false,
			usePortal:false,
			hasBackdrop:false,
			canEscapeKeyClose:false,
			captureDismiss:true,
			position:bp.Position.BOTTOM_LEFT
		}

		return <BlueprintDialog
			className={css.root}
			title={RollForwardDialog.TITLE}
			icon={RollForwardDialog.ICON}
			ok={this.onOK}
			okText={_.includes(['finished','exception'], status) ? i18n.common.DIALOG.OK : RollForwardDialog.TITLE}
			okDisabled={_.includes(['preparing','running'], status) || !!this.errMessage}
			canCancel={status == "initial"}
			isCloseButtonShown={!_.includes(['preparing','running'], status)}
			canOutsideClickClose={!this.suggestBoxOpened.year && !this.suggestBoxOpened.month && !_.includes(['preparing','running'], status)}
		>
			{status == 'preparing' && <div><LoadingIndicator /></div>}
			{status == 'initial' && <div>
				<br/>
				<div className={classNames(bp.Classes.FORM_GROUP)}>
					<div className={css.inputGroup}>
						<span>
							<FormattedMessage
								defaultMessage={"Roll forward to"}
								description={"[RollForwardDialog] input group title for setting target forward date"}/>
						</span>
						<bp.ControlGroup>
							<bp.Popover
								{...popoverProps}
								isOpen={this.suggestBoxOpened.year}
								content={this.year_suggestionBox}
							>
								<input
									size={4}
									type={"number"}
									className={classNames(bp.Classes.INPUT, css.dateInput)}
									style={{width: 60}}
									defaultValue={`${this.currentDate.year}`}
									onChange={action((e) => {
										this.userInputs.year = parseInt(e.target.value) || this.currentDate.year;
										this.errMessage = null;
									})}
									onFocus={action(() => {
										this.suggestBoxOpened.year = true;
										this.suggestBoxOpened.month = false;
									})}
									onBlur={action((e) => this.suggestBoxOpened.year = this.isTriggerBySuggestBox(e))}
									ref={(r) => this.inputRefs.year = r}
								/>
							</bp.Popover>
							<bp.Popover
								{...popoverProps}
								isOpen={this.suggestBoxOpened.month}
								content={this.month_suggestionBox}
							>
								<input
									size={2}
									type={"number"}
									className={classNames(bp.Classes.INPUT, css.dateInput)}
									style={{width: 40}}
									defaultValue={`${this.currentDate.month}`}
									onChange={action((e)=> {
										let m = parseInt(e.target.value) || this.currentDate.month;
										m = Math.max(1, Math.min(12, m));
										this.userInputs.month = m;
										this.errMessage = null;
									})}
									onFocus={action(() => {
										this.suggestBoxOpened.year = false;
										this.suggestBoxOpened.month = true;
									})}
									onBlur={action((e) => this.suggestBoxOpened.month = this.isTriggerBySuggestBox(e))}
									ref={(r) => this.inputRefs.month = r}
								/>
							</bp.Popover>
						</bp.ControlGroup>
					</div>
					{this.errMessage && <div className={bp.Classes.FORM_HELPER_TEXT} style={{color:"red"}}>{this.errMessage}</div>}
				</div>

				<br />
				<div className={bp.Classes.FORM_GROUP}>
					<bp.Checkbox
						disabled={this.isApplyTemplateDisabled}
						checked={this.isApplyTemplateDisabled ? false : this.userInputs.updateTemplate}
						onChange={action((e) => this.userInputs.updateTemplate = (e.target as any).checked)}
					>
                        <FormattedMessage
	                        defaultMessage={"Apply latest template as part of roll-forward process"}
	                        description={"[RollForwardDialog] action about apply latest template to the simulation"}
                        />
					</bp.Checkbox>
					<div className={bp.Classes.FORM_HELPER_TEXT}>{
						!this.isApplyTemplateDisabled ?
						<FormattedMessage
							defaultMessage={"If checked, the template information for the latest template on or before the roll-forward date will be included in the roll-forward process."}
							description={"[RollForwardDialog] message to describe what is apply latest template"}
						/> :
						<React.Fragment>
							<FormattedMessage
								defaultMessage={"This option is only available if the roll forward"}
								description={"[RollForwardDialog] message to describe why apply latest template not working (before)"}
							/>&nbsp;
							<bp.Popover
								{...popoverProps}
								interactionKind={bp.PopoverInteractionKind.HOVER}
								onOpening={action(() => {
									this.suggestBoxOpened.year = false;
									this.suggestBoxOpened.month = false;
								})}
								content={<bp.Menu>{_.map(this.availableTemplates, v => <bp.MenuItem
									key={`availableTemplates_${v}`}
									text={v.replace(/^\d{4}/, (v) => v+"/")}
									onClick={action(() => {
										this.errMessage = null;
										this.userInputs.year = parseInt(v.substring(0,4));
										this.userInputs.month = parseInt(v.substring(4,6));
										this.inputRefs.year.value = v.substring(0,4);
										this.inputRefs.month.value = v.substring(4,6);
									})}
								/>)}</bp.Menu>}
							>
								<span style={{textDecoration: 'underline dotted'}}>
									<FormattedMessage
										defaultMessage={"target date"}
										description={"[RollForwardDialog] message to describe why apply latest template not working (target dates hits)"}
									/>
								</span>
							</bp.Popover>&nbsp;
							<FormattedMessage
								defaultMessage={"corresponds to a template."}
								description={"[RollForwardDialog] message to describe why apply latest template not working (after)"}
							/>
						</React.Fragment>
					}</div>
				</div>
			</div>}

			{(status != 'preparing' && status != 'initial') && <Progress
				progress={true}
				value={rollForwardProgress.progress.numerator}
				total={rollForwardProgress.progress.denominator}
				precision={1}
				error={status == "exception"}
				color={status == "exception" ? "red" : "green"}
				autoSuccess
				active={true}
				label={rollForwardProgress.currentMessage}
			/>}

			{status == 'finished' && <div>
				<FormattedMessage
					defaultMessage={"Roll Forward Finished."}
					description={"[RollForwardDialog] message when roll forward executed"}/>
			</div>}
		</BlueprintDialog>;
	}

}