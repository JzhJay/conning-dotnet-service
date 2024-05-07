import {Menu, MenuItem, ContextMenu} from '@blueprintjs/core/lib/cjs/components';
import {AppIcon, bp} from 'components';
import {computed, observable, makeObservable, action, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {appIcons, ClimateRiskAnalysis, i18n, IO, Query, Simulation, site, UserFile} from 'stores';
import {formatLabelText, unlockInputsConfirm} from 'utility';
import * as css from './ApplicationShortCuts.css';
import * as applicationBarItems from 'styles/ApplicationBarItems.css';

export enum ApplicationShortCutsLockerStatus {
	LOCKED = 'locked',
	UNLOCKED = 'unlocked',
	RUNNING = 'running',
	DISABLED = 'disabled'
}

export interface ApplicationShortCutsProps {
	objectType?: string,
	isBusy?: boolean,
	getName: () => string,
    setName?: (string) => Promise<boolean>,
	updateNameOnlyBlur?: boolean,
	copy?: (MouseEvent) => void,
	copyToNewTab?: (MouseEvent) => void,
    delete?: (MouseEvent) => void,
	exportPDF?: (MouseEvent) => void,
	lockerStatus?: ApplicationShortCutsLockerStatus,
	lockerUpdater?: (locked: boolean) => void
}

@observer
export class ApplicationShortCuts extends React.Component<ApplicationShortCutsProps, {}> {

	@observable	renameIsFocus = false;
	@observable	renameIsDisabled = false;
	@observable	copyIsFocus = false;
	@observable savedName: string;
	@observable	lockerIsFocus = false;

	@computed get name() {
		if(this.renameIsFocus) {
			return this.savedName;
		} else {
			return this.props.getName();
		}
    }

	updateName = async(newName) => {
		if (newName != this.props.getName()) {
			return await runInAction(() => {
				this.renameIsDisabled = true;
				return this.props.setName(newName)
					.finally(action(() => this.renameIsDisabled = false));
			});
		}
	}

	debounceUpdateName = _.debounce(async (newName, input: HTMLInputElement) => {
		if (this.renameIsFocus && newName == this.savedName) {
			if(await this.updateName(newName) === true) {
				this.savedName = this.props.getName();
				input.blur();
			}
		}
	}, 3 * 1000);

	@action renameChange = async (e) => {
		const updatedName = e.target.value;
		this.savedName = updatedName;
		if (this.props.updateNameOnlyBlur !== false) {
			await this.debounceUpdateName(updatedName, e.target);
		}
    }

	@action renameFocus = (e) => {
		this.savedName = this.props.getName();
		this.renameIsFocus = true;
	}

    renameBlur = async(e) => {
		this.updateName(e.target.value)
			.finally(action(() => this.renameIsFocus = false));
	}

	@action renderCopyContextMenu = (e) => {
		if(this.props.isBusy) {return;}
		if(!this.props.copyToNewTab) {return;}

		e.preventDefault();
		let $target = $(e.target);
		!$target.is(`.${css.hoverTooltip}`) && ($target = $target.parents(`.${css.hoverTooltip}`).first());
		const target_offset = $target.offset();
		ContextMenu.show(
			<Menu>
				<MenuItem
					text={i18n.intl.formatMessage({defaultMessage: "Duplicate in same tab", description: "[ApplicationShortCuts] duplicate the object and open it on this browser tab"})}
					onClick={(e) => this.executeEvent(this.props.copy, e) }
				/>
				<MenuItem
					text={i18n.intl.formatMessage({defaultMessage: "Duplicate in new tab", description: "[ApplicationShortCuts] duplicate the object and open it on a new browser tab"})}
					onClick={(e) => this.executeEvent(this.props.copyToNewTab, e) }
				/>
			</Menu>,
			{ left: target_offset.left + $target.width() , top: target_offset.top + $target.height() + 2 },
			action(() =>  (this.copyIsFocus = false ))
		);
		this.copyIsFocus = true;
	}

	@action onLockBtnClick = (e) => {
		if (!this.props.lockerUpdater) { return; }
		switch (this.props.lockerStatus) {
			case ApplicationShortCutsLockerStatus.UNLOCKED:
				this.props.lockerUpdater(true);
				return;
			case ApplicationShortCutsLockerStatus.LOCKED:
				this.lockerIsFocus = true;
				unlockInputsConfirm(this.props.objectType).then((r) => {
					r && this.props.lockerUpdater(false);
				}).finally(action(() => {
					this.lockerIsFocus = false;
				}));
				return;
		}
	}

	executeEvent = (excuteEvent:Function, e) => {
		if (this.props.isBusy || !excuteEvent) { return; }
		if ($(e.currentTarget || e.target).is(`.${css.disabled}`)) { return; }
		excuteEvent(e);
	}

	_dummySpan;
	@computed get inputWidth() {
		return Math.max( $(this._dummySpan.current).html(_.escape(this.name)).width() , 0 ) + 5 || 150;
	}

	constructor(props: any) {
        super(props);
        makeObservable(this);
        this._dummySpan = React['createRef']();
    }

	componentDidMount(): void {
		let input = $(ReactDOM.findDOMNode(this)).find(`.${css.rename} input`);
		if(input) {
			let initWidth = $(ReactDOM.findDOMNode(this)).find(`.${css.rename} #dummySpan`).html(_.escape(this.name)).width();
			input.width(initWidth);
		}
	}

	render() {
		return <div className={classNames(css.root, applicationBarItems.applicationBarItems, {[css.isBusy]: this.props.isBusy})} >

			{this.props.lockerUpdater && <div
				className={classNames([
					css.hoverTooltip,
					css.shortCutItem,
					{[css.showTooltip]: this.lockerIsFocus},
					{[css.running]: this.props.lockerStatus == ApplicationShortCutsLockerStatus.RUNNING},
					{[css.disabled]: this.props.lockerStatus == ApplicationShortCutsLockerStatus.DISABLED}
				])}
				onClick={(e) => this.executeEvent(this.onLockBtnClick, e) }
			>
				<AppIcon icon={{type:'blueprint', name:this.props.lockerStatus != ApplicationShortCutsLockerStatus.UNLOCKED ? 'lock' : 'unlock'}} className={css.iconNormal}/>
				<AppIcon icon={{type:'blueprint', name:this.props.lockerStatus == ApplicationShortCutsLockerStatus.UNLOCKED ? 'lock' : 'unlock'}} className={css.iconWhenHover}/>
				<span className={css.hoverTooltipTarget}>{
					this.props.lockerStatus != ApplicationShortCutsLockerStatus.UNLOCKED ?
					i18n.intl.formatMessage({defaultMessage: "Unlock Inputs", description: "[ApplicationShortCuts] a page lock to avoid the result lost because user change the inputs"}) :
					i18n.intl.formatMessage({defaultMessage: "Lock Inputs", description: "[ApplicationShortCuts] to disable the page lock which is used to avoid the result lost"})
				}</span>
			</div>}

			{!this.props.setName ? <div>{this.name}</div> :
             <div className={classNames([css.rename, css.hoverTooltip, {[css.showTooltip]: !this.props.isBusy && this.renameIsFocus}])}>
	             <span ref={this._dummySpan} id={'dummySpan'} style={{
		             position: 'absolute',
		             whiteSpace: "nowrap",
		             visibility: 'hidden'
	             }}></span>
	             <span className={css.hoverTooltipTarget} onClick={(e) => $(e.target).next().select()}>
		             {this.renameIsDisabled && <bp.Spinner size={15}/>}
		             <span>{i18n.common.OBJECT_CTRL.RENAME}</span>
				 </span>
                 <input value={this.name}
                        style={{width:this.inputWidth}}
                        onFocus={this.renameFocus}
                        onBlur={this.renameBlur}
                        onChange={this.renameChange}
                        onKeyDown={(e)=>{
                        	if(e.key == 'Escape') {
								e.target["value"] = this.props.getName();
		                        e.currentTarget.blur();
		                        return false;
	                        }
                        }}
                        onKeyPress={(e)=>{
                        	if (e.key == 'Enter') {
		                        e.currentTarget.blur();
	                        }
                        }}
                        disabled={ this.renameIsDisabled || this.props.isBusy}
                 />
             </div>
            }

            {this.props.copy && <div
	            className={classNames([css.hoverTooltip, css.shortCutItem, {[css.showTooltip]: this.copyIsFocus}])}
	            onClick={(e) => this.executeEvent(this.props.copy, e) }
	            onContextMenu={this.renderCopyContextMenu}
            >
                <AppIcon icon={appIcons.file.copy}/>
                <span className={css.hoverTooltipTarget}>{i18n.common.OBJECT_CTRL.DUPLICATE}</span>
            </div>}

            {this.props.delete && <div
	            className={classNames([css.hoverTooltip, css.shortCutItem])}
	            onClick={(e) => this.executeEvent(this.props.delete, e) }
	        >
                <AppIcon icon={appIcons.file.delete} />
                <span className={css.hoverTooltipTarget}>{i18n.common.OBJECT_CTRL.DELETE}</span>
            </div>}

            {this.props.exportPDF && <div
	            className={classNames([css.hoverTooltip, css.shortCutItem])}
	            onClick={(e) => this.executeEvent(this.props.exportPDF, e) }
	        >
                <AppIcon className={css.semanticIcon} icon={appIcons.file.pdf} />
                <span className={css.hoverTooltipTarget}>{i18n.common.FILE_CTRL.WITH_VARIABLES.EXPORT(i18n.common.FILE_CTRL.PDF)}</span>
            </div>}

        </div>
    }
}