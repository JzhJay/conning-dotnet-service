import {IconNames} from '@blueprintjs/icons';
import {IOBrowser, IOCard} from 'components/system/IO';
import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {autorun, computed, observable, IReactionDisposer, makeObservable, action} from "mobx";
import { observer } from 'mobx-react'
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import * as sem from 'semantic-ui-react';
import type {IApplicationIcon} from 'stores';
import {appIcons, i18n, IO, ObjectCatalogContext, Simulation, UserFile} from 'stores';
import { site } from 'stores';
import { Dialog, Classes, Button, AnchorButton, Intent } from '@blueprintjs/core';
import {AppIcon, bp, IconButton, SimulationBrowser, SimulationCard} from '../..';
import { SortableCardsPanel } from 'components/widgets/SmartBrowser/SortableCardsPanel';
import { UserFileBrowser } from '../UserFile/UserFileBrowser';
import * as css from "./ObjectChooser.css";

interface MyProps<T extends Simulation|IO|UserFile> {
	objectType: typeof Simulation | typeof IO | typeof UserFile;
	selections: T[];
	chooseItemFilters?: {[key:string]: string[]};
	canMultiSelect?: boolean;
	disabled?: boolean;
	isOpen?: boolean;
	isConfirmBeforeChange?: boolean;

	onSave: (selections: T[]) => void;

	// UI related
	rootClassName?: string;
	tooltipPosition?: bp.Position;

	// UI related (dialog)
	dialogTitle?: string;
	dialogClassName?: string;
	onDialogClose?: () => void;

	// UI related (Launcher input)
	showLauncher?: boolean;
	launcherClassName?: string;
	launcherPlaceholder?: string;
	launcherOpenIcon?: IApplicationIcon;
	showLauncherOpenIcon?: boolean;

	includeNameInTooltipCard?: boolean;
}

@observer
export class ObjectChooser<T extends Simulation|IO|UserFile> extends React.Component<MyProps<T>, {}> {
	_disposers: IReactionDisposer[] = [];
	//@observable isForceClose = false;
	@observable browser = null;
	@observable panel: SortableCardsPanel = null;
	@observable dialogIsOpen = false;

	constructor(props, state) {
        super(props, state);

		this.dialogIsOpen = props.defaultIsOpen || false;

        makeObservable(this);

        this._disposers.push(
			autorun(() => {
				if (this.browser && this.browser.panel && this.panel == null && this.dialogIsOpen) {
					action(() => {
						this.panel = this.browser.panel;

						if (this.props.selections) {
							let selections           = observable.map({});
							this.props.selections.forEach(s => selections.set(s._id, s));
							this.panel.selectedItems = selections;
						}

						const {chooseItemFilters} = this.props;
						if (chooseItemFilters) {
							let catalogContext: ObjectCatalogContext = this.browser.catalogContext;
							Object.keys(chooseItemFilters).forEach(k => catalogContext.selectedTagValues.set(k, observable(chooseItemFilters[k])));
							catalogContext.hiddenFilters = Object.keys(chooseItemFilters);
						}
					})();
				}
			})
		);
    }

	componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

	get icon(): IApplicationIcon {
		switch (this.props.objectType) {
			case UserFile:
				return appIcons.tools.userFiles;

			case Simulation:
				return appIcons.tools.simulations;

			case IO:
				return appIcons.tools.ios;

			default:
				return {type: 'blueprint', name: 'document-open'};
		}
	}

	@computed get canMultiSelect() {
		return this.props.canMultiSelect === true;
	}

	@computed get disabled() {
		return this.props.disabled === true;
	}

	@computed get launcherPlaceholder() {
		const {props: {objectType}, canMultiSelect} = this;
		const placeholder = this.props.launcherPlaceholder || i18n.intl.formatMessage(
			{defaultMessage: `No {objectName} Selected`, description: "[ObjectChooser] the placeholder on the selected item list"},
			{objectName: canMultiSelect ? objectType.OBJECT_NAME_MULTI :objectType.OBJECT_NAME_SINGLE}
		);
		return <bp.Tag minimal>{placeholder}</bp.Tag>;
	}

	@action ref = (r) => {
		this.browser = r;
	}

	breadcrumbs = () => {
		let breadcrumbs = [];
		// Note: Passing in catalogContext explicitly because referencing through the panel props (this.panel.props.catalogContext) causes an infinite render loop
		this.browser && !_.isEmpty(this.browser.catalogContext.path) && this.panel && this.panel.addToBreadcrumbs(breadcrumbs, this.browser.catalogContext);
		return breadcrumbs;
	}

	selectedTagContent = (selected:any) => {
		const includeNameInTooltipCard = this.props.includeNameInTooltipCard !== false;
		switch (this.props.objectType) {

			case UserFile:
				return <UserFileCard userFile={selected} showHeader={false} includeNameInBody={!includeNameInTooltipCard} isTooltip/>;

			case Simulation:
				return <SimulationCard sim={selected} showHeader={false} includeNameInBody={!includeNameInTooltipCard} isTooltip/>;

			case IO:
				return <IOCard investmentOptimization={selected} showHeader={false} includeNameInBody={!includeNameInTooltipCard} isTooltip/>;
		}
		return null;
	}

	selectedTags = (selections: T[], isOnLauncher: boolean, onRemove: (rmItem: T) => void) => {
		const {tooltipPosition} = this.props;

		return selections && selections.length > 0 ? selections.map((s: any, i) => {
			return (
                <bp.Popover
                key={s._id}
                interactionKind={bp.PopoverInteractionKind.HOVER}
                hoverCloseDelay={100}
                position={tooltipPosition || bp.Position.BOTTOM_RIGHT}
                modifiers={{
                    keepTogether: {enabled: false},
                    preventOverflow: {enabled: false}
                }}
                content={this.selectedTagContent(s)}
                disabled={this.disabled}
                >
                    <bp.Tag minimal onRemove={async (e) => {
                        e.stopPropagation();
                        const { isConfirmBeforeChange = false } = this.props;
                        if (isConfirmBeforeChange && isOnLauncher) {
                            if(!(await site.confirm(
	                            i18n.intl.formatMessage({defaultMessage: `Are you sure you want to deselect "{itemName}"?`, description: "[ObjectChooser] a confirm dialog title - when user deselect all items"}, {itemName: s.name}),
	                            i18n.intl.formatMessage({defaultMessage: 'This action cannot be undone.', description: "[ObjectChooser] a confirm dialog message - when the selected items change"}),
	                            <sem.Icon size="large" color="red" name="delete"/>,
	                            i18n.intl.formatMessage({defaultMessage: 'Deselect', description: "[ObjectChooser] a confirm dialog deactivate button text - when user deselect all items"})
                            ))) {
                                return;
                            }
                        }
                        onRemove(s);
                    }}>
                        {s.name}
                    </bp.Tag>
                </bp.Popover>
            );
		}) : isOnLauncher ? this.launcherPlaceholder : null;
	}

	renderBrowser = () => {
		const {props: {objectType}, canMultiSelect} = this;
		switch (objectType) {

			case UserFile:
				return <UserFileBrowser ref={this.ref} multiselect={canMultiSelect} showObjectToolbar={false}/>;

			case Simulation:
				return <SimulationBrowser ref={this.ref} multiselect={canMultiSelect} showObjectToolbar={false}/>;

			case IO:
				return <IOBrowser ref={this.ref} multiselect={canMultiSelect} showObjectToolbar={false}/>;

		}
		return null;
	}

	saveSelectedObjects = async () => {
		const { selections = [] } = this.props;
		const currentSelectedIds = selections.map((s) => s._id);
		const newSelectedIds = Array.from(this.panel.selectedItems.values()).map((s) => s.id);
		const isSelectionChanged = !_.isEqual(currentSelectedIds, newSelectedIds);

		if (isSelectionChanged) {
			const { isConfirmBeforeChange = false } = this.props;
			if (isConfirmBeforeChange) {
				// empty current selection doesn't need to confirm
				if (currentSelectedIds.length !== 0 && !(await site.confirm(
					i18n.intl.formatMessage({defaultMessage: `Are you sure you want to replace the current selection?`, description: "[ObjectChooser] a confirm dialog title - when user select new item to replace old one"}),
					i18n.intl.formatMessage({defaultMessage: 'This action cannot be undone.', description: "[ObjectChooser] a confirm dialog message - when the selected items change"}),
					<sem.Icon size="large" color="red" name="warning"/>,
					i18n.intl.formatMessage({defaultMessage: 'Replace', description: "[ObjectChooser] a confirm dialog deactivate button text - when user select new item to replace old one"})
				))) {
					return;
				}
			}

			this.onSave(Array.from(this.panel.selectedItems.values()));
		} else {
			this.onClose();
		}
	}

	@action onOpen = () => {
		if (!this.disabled) {
			this.dialogIsOpen = true;
		}
	}

	@action onClose = () => {
		this.dialogIsOpen = false;
		this.panel = null;
		if (this.props.onDialogClose) {
			this.props.onDialogClose();
		}
	}

	onSave = (selections: Array<T>) => {
		if (!this.disabled) {
			this.props.onSave(selections);
			this.onClose();
		}
	}

	render () {
		const { canMultiSelect, disabled} = this;
		const { objectType, selections, showLauncherOpenIcon, showLauncher } = this. props;
		const { dialogTitle, launcherOpenIcon, rootClassName, launcherClassName, dialogClassName } = this. props;
		
		return <div className={classNames(css.root, rootClassName)}>
			{ showLauncher !== false &&
			<div className={classNames(css.launcher, launcherClassName, { [css.withIcon]: showLauncherOpenIcon !== false })} onClick={this.onOpen}>
				{this.selectedTags(selections, true, (rmItem) => this.onSave(selections.filter((s) => s != rmItem )))}
				{showLauncherOpenIcon !== false && <IconButton className={css.tagIcon} minimal icon={launcherOpenIcon || this.icon} onClick={this.onOpen}/>}
			</div>
			}
			<Dialog
				className={classNames(css.dialog, dialogClassName)}
				isOpen={this.dialogIsOpen}
				title={dialogTitle ? dialogTitle : i18n.intl.formatMessage({defaultMessage: `{objectName} Chooser`, description: "[ObjectChooser] default dialog title"}, {objectName: canMultiSelect ? objectType.OBJECT_NAME_MULTI :objectType.OBJECT_NAME_SINGLE})}
				onClose={this.onClose}
				icon={<div className={bp.Classes.BREADCRUMBS}>{this.breadcrumbs().map((b, i) => <li key={i.toString()}>{b}</li>)}</div>}
			>
				<div className={Classes.DIALOG_BODY}>
					{this.renderBrowser()}
					<div className={css.selection}>
						<span className={css.title}><FormattedMessage defaultMessage={"Selection:"} description={"[ObjectChooser] Indicates a list of object which are user selected"} /></span>
						{this.selectedTags(this.browser && this.panel && Array.from(this.panel.selectedItems.values()), false, (rmItem) => this.panel.selectedItems.delete(rmItem._id))}
					</div>
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={classNames(Classes.DIALOG_FOOTER_ACTIONS)}>
						<Button
							outlined={true}
							onClick={this.onClose}
						>{i18n.common.DIALOG.CANCEL}</Button>
						<AnchorButton
							intent={Intent.PRIMARY}
							onClick={this.saveSelectedObjects}
							disabled={disabled}
						>{i18n.common.DIALOG.OK}</AnchorButton>
					</div>
				</div>
			</Dialog>
		</div>
	}
}
