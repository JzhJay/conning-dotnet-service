import {IconNames} from '@blueprintjs/icons';
import {BlueprintDialog, bp, LoadingIndicator, ResizeSensorComponent} from 'components';
import type {SplitterProps} from 'm-react-splitters';
import Splitter from 'm-react-splitters';
import {action, computed, IReactionDisposer, makeObservable, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {RSSimulation, i18n} from 'stores';

import * as css from './RunningMessageBox.css'

@observer
export class RunningMessageBox extends React.Component<{ rsSimulation: RSSimulation, splitterPage?:PageWithMessageBox, onLoad?: ()=>void}, any> {

	static SEVERITY_CONFIGS: {[severity: string]: {color: string, displayText: string, enabled:boolean, configurable?: boolean}} = {
		debug: {color: bp.Colors.GRAY1,     displayText: i18n.common.LOGS.DEBUG, enabled: false}, //, configurable: DEV_BUILD
		info:  {color: bp.Colors.BLUE1,     displayText: i18n.common.LOGS.INFO, enabled: true },
		warn:  {color: bp.Colors.ORANGE1,   displayText: i18n.common.LOGS.WARNINGS, enabled: true },
		error: {color: bp.Colors.RED1,      displayText: i18n.common.LOGS.ERRORS, enabled: true }
	}

	static BOTTOM_SENSOR_GAP = 29;

	private _disposers: IReactionDisposer[] = [];

	logContainer: HTMLDivElement;

	@observable severityFilter: {[severity: string]: boolean};
	@observable isShowTimestamp: boolean = false;
	@observable isLoaded: boolean = false;
	isFocusOnLastLine: boolean;

	constructor(props) {
		super(props);
		makeObservable(this);

		this.severityFilter = {};
		_.forIn(RunningMessageBox.SEVERITY_CONFIGS, (config, key) => {
			if (config.configurable === false) {
				return;
			}
			this.severityFilter[key] = config.enabled;
		});

		if (this.isViewMode) {
			this.isFocusOnLastLine = false;
			this.getMessage();
			this._disposers.push(reaction(
				() => this.messageIncludeDebug,
				(result) => {
					console.log(`reload message because loading range changed: ${result}`);
					this.getMessage();
				}
			));
		} else {
			this.isFocusOnLastLine = true;
			this.isLoaded = true;
		}
	}

	componentWillUnmount() {
		_.forEach(this._disposers, d=>d());
	}

	@computed get isViewMode() {
		return this.props.rsSimulation.isRunning !== true;
	}

	@computed get messages() {
		return (this.props.rsSimulation?.runningMessage?.textMessages || []).filter(msg => {
			return this.severityFilter[msg.severity] === true;
		});
	}

	@computed get messageIncludeDebug() {
		return this.severityFilter["debug"] === true;
	}

	@computed get filterText() {
		let isAllEnabled = true;
		let isDefault = true;
		let enables = [];
		_.forIn(this.severityFilter, (v, k) => {
			isDefault = (isDefault && v == RunningMessageBox.SEVERITY_CONFIGS[k].enabled);
			isAllEnabled = (isAllEnabled && v);
			if (v) {
				enables.push(RunningMessageBox.SEVERITY_CONFIGS[k].displayText);
			}
		});

		if (isDefault) {
			return i18n.intl.formatMessage({
				defaultMessage: 'Default levels',
				description: '[RSSimulation] Log filter option text - Default levels'
			});
		}

		if (isAllEnabled) {
			return i18n.intl.formatMessage({
				defaultMessage: 'All levels',
				description: '[RSSimulation] Log filter option text - All levels'
			});
		}

		if (enables.length == 0) {
			return i18n.intl.formatMessage({
				defaultMessage: 'Hide all',
				description: '[RSSimulation] Log filter option text - Hide all'
			});
		}

		if (enables.length > 1) {
			return i18n.intl.formatMessage({
				defaultMessage: 'Custom levels',
				description: '[RSSimulation] Log filter option text - Custom levels'
			});
		}

		return i18n.intl.formatMessage({
			defaultMessage: '{logLevel} only',
			description: '[RSSimulation] Log filter option text - Custom Log Level Only'
		}, {logLevel: enables[0]});
	}

	@action getMessage = () => {
		if (!this.isViewMode) {
			return;
		}
		this.isLoaded = false;
		this.props.rsSimulation.loadLogMessages(
			this.messageIncludeDebug ? "debug" : "info"
		).then(
			action(() => this.isLoaded = true)
		);
	}

	@action clearMessage = () => {
		this.props.rsSimulation?.runningMessage?.textMessages && (this.props.rsSimulation.runningMessage.textMessages.length = 0)
	}

	tryFocusOnLastLine = _.debounce((force:boolean = false) => {
		if (force || this.isFocusOnLastLine) {
			const elem = this.logContainer;
			elem.scrollTop = elem.scrollHeight;
		}
	})

	setFilterToDefault = () => {
		_.forEach(Object.keys(this.severityFilter), action( (severity) => {
			const config = RunningMessageBox.SEVERITY_CONFIGS[severity];
			this.severityFilter[severity] = config.enabled;
		}));
		setTimeout(() => this.tryFocusOnLastLine(), 30);
	}

	getFilterMenuItem = (severity: string) => {
		const config = RunningMessageBox.SEVERITY_CONFIGS[severity];
		let current_status = this.severityFilter[severity];
		return <bp.MenuItem shouldDismissPopover={false}
			text={<bp.Switch
				checked={current_status}
				labelElement={<span style={{color: config.color}}>{config.displayText}</span>}
				style={{marginBottom: 0}}
				onChange={action(() => {
					this.severityFilter[severity] = !this.severityFilter[severity];
					setTimeout(() => this.tryFocusOnLastLine(), 30);
				})}
			/>}
		/>
	}

	getStyle = (severity: string): React.CSSProperties => {
		const color = RunningMessageBox.SEVERITY_CONFIGS[severity]?.color;
		return color ? {color: color} : null;
	}

	onListScrolling = _.debounce((e) => {
		const elem = this.logContainer;
		this.isFocusOnLastLine = (elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) < RunningMessageBox.BOTTOM_SENSOR_GAP;
	});

	onToggleIsShowTimestamp = action(() => {
		this.isShowTimestamp = !this.isShowTimestamp;
	})

	componentDidMount() {
		this.tryFocusOnLastLine();
	}

	componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
		this.tryFocusOnLastLine();
	}

	render() {
		const {isViewMode, props:{splitterPage}} = this;
		return <div className={classNames(css.root)} >
			<div className={css.nav}>
				<div>
					{!isViewMode && <bp.Tooltip content={i18n.intl.formatMessage({
									defaultMessage: 'Clear console',
									description: '[RSSimulation] Tooltip for clearing log messages'
								})} openOnTargetFocus={false}>
						<bp.Button icon={"trash"} small={true} minimal={true} onClick={this.clearMessage}/>
					</bp.Tooltip>}
				</div>
				<div>
					<bp.ButtonGroup minimal={true} vertical={false}>
						<bp.Popover position={bp.Position.BOTTOM_RIGHT}>
							<bp.Tooltip content={i18n.intl.formatMessage({
									defaultMessage: 'Log level: {filterText}',
									description: '[RSSimulation] Tooltip for current log level'
								}, {filterText: this.filterText})} openOnTargetFocus={false} position={bp.Position.LEFT} >
								<bp.Button text={this.filterText} rightIcon={"caret-down"} small={true} minimal={true}/>
							</bp.Tooltip>
							<bp.Menu>
								<bp.MenuItem text={i18n.intl.formatMessage({
									defaultMessage: 'Default',
									description: '[RSSimulation] Menu item text for switching log filter to default'
								})} style={{paddingLeft: 45}} onClick={this.setFilterToDefault} />
								<bp.MenuDivider />
								{_.map(Object.keys(this.severityFilter), (s) => <React.Fragment key={`FilterMenuItem_${s}`}>{this.getFilterMenuItem(s)}</React.Fragment>)}
							</bp.Menu>
						</bp.Popover>
						{splitterPage && <>
							<bp.Divider />
							<bp.Popover position={bp.Position.BOTTOM_RIGHT}>
								<bp.Button icon={"cog"} small={true} minimal={true}/>
								<bp.Menu>
									<div className={classNames(bp.Classes.MENU_ITEM, bp.Classes.POPOVER_DISMISS, css.dockSideMenu)}>
										<div>
											<FormattedMessage defaultMessage="Dock side" description="[RSSimulation] Text for controlling simulation running message box's position" />
										</div>
										<bp.ButtonGroup minimal>
											<bp.ButtonGroup>
												<bp.Button text={<div className={classNames(css.icon, css.left)}   />} small={true} minimal={true} onClick={() => splitterPage.setMsgBoxPosition('left')   }/>
												<bp.Button text={<div className={classNames(css.icon, css.bottom)} />} small={true} minimal={true} onClick={() => splitterPage.setMsgBoxPosition('bottom') }/>
												<bp.Button text={<div className={classNames(css.icon, css.right)}  />} small={true} minimal={true} onClick={() => splitterPage.setMsgBoxPosition('right')  }/>
											</bp.ButtonGroup>
										</bp.ButtonGroup>
									</div>

								</bp.Menu>
							</bp.Popover>
						</>}
						<bp.Divider />
							<bp.Tooltip content={i18n.intl.formatMessage({
									defaultMessage: `Show log messages' timestamp`,
									description: '[RSSimulation] Tooltip for switch that toggle timestamp of logs'
								})} openOnTargetFocus={false} position={bp.Position.LEFT}>
								<bp.Switch className={css.timestampSwitch} checked={this.isShowTimestamp} labelElement={
									i18n.intl.formatMessage({
										defaultMessage: 'Show Timestamp',
										description: '[RSSimulation] Button text for switch that toggle timestamp of logs'
									})} onClick={this.onToggleIsShowTimestamp} />
							</bp.Tooltip>
						<bp.Divider />
						<bp.Tooltip content={i18n.intl.formatMessage({
							defaultMessage: 'To latest message',
							description: '[RSSimulation] Tooltip for button that focuses latest log message'
						})} openOnTargetFocus={false} position={bp.Position.LEFT} >
							<bp.Button icon={"double-chevron-down"} small={true} minimal={true} onClick={() => {
								this.isFocusOnLastLine = this.isViewMode;
								this.tryFocusOnLastLine(true);
							}}/>
						</bp.Tooltip>
					</bp.ButtonGroup>
				</div>
			</div>

			{!this.isLoaded && <div><LoadingIndicator smallLoader={true} inline={true} /></div>}

			<div className={css.container} onScroll={isViewMode ? null : this.onListScrolling} ref={ r => this.logContainer = r}>
				<ResizeSensorComponent onResize={() => this.tryFocusOnLastLine() } />
				<div>
					{_.map(this.messages, (m,i) => <div
						key={`message-item-${i}`}
						className={classNames(css.msgItem, {[css.lastMsgItem]: (i+1) == this.messages.length})}
						data-severity={m.severity}
						style={this.getStyle(m.severity)}
					>{this.isShowTimestamp && <span className={css.timestamp}>[<span className={css.timestampText}>{m.timestamp}</span>]</span>} {m.text}</div> )}
				</div>
			</div>
		</div>
	}
}

@observer
export class PageWithMessageBox extends React.Component<{rsSimulation: RSSimulation, title?: string, disabled?: boolean}, any> {

	static DEFAULT_MESSAGE_BOX_SIZE = {MAX_HEIGHT: 120, MIN_HEIGHT: 65, MAX_WIDTH: 300, MIN_WIDTH: 240};
	splitter;
	@observable messageBoxDisabled;
	@observable messageBoxPosition: 'left' | 'right' | 'bottom';
	savedMessageBoxSize: {height?: number, width?: number} = {};

	constructor(props) {
		super(props);
		this.messageBoxDisabled = false;
		this.messageBoxPosition = 'bottom';

		makeObservable(this);
	}

	componentWillUnmount() {
		this.unregister();
	}

	register = (splitter) => {
		this.unregister();
		this.splitter = splitter;
	}

	unregister = () => {
		// Bug in Splitter library that adds resize listener but doesn't remove it on unmount
		// https://github.com/martinnov92/React-Splitters/issues/9
		if (this.splitter) {
			window.removeEventListener('resize', this.splitter.getSize);
			document.removeEventListener('mouseup', this.splitter.handleMouseUp);
			document.removeEventListener('touchend', this.splitter.handleMouseUp);
			document.removeEventListener('mousemove', this.splitter.handleMouseMove);
			document.removeEventListener('touchmove', this.splitter.handleMouseMove);
		}
	}

	get boxWidth() {
		if (this.savedMessageBoxSize?.width) {
			return this.savedMessageBoxSize?.width;
		}
		const sizeByPage = Math.floor($(document.body).width() / 5);
		return Math.max(
			Math.min(sizeByPage, PageWithMessageBox.DEFAULT_MESSAGE_BOX_SIZE.MAX_WIDTH),
			PageWithMessageBox.DEFAULT_MESSAGE_BOX_SIZE.MIN_WIDTH
		);
	}

	get boxHeight() {
		if (this.savedMessageBoxSize?.height) {
			return this.savedMessageBoxSize?.height;
		}
		const sizeByPage = Math.floor($(document.body).height() / 8);
		return Math.max(
			Math.min(sizeByPage, PageWithMessageBox.DEFAULT_MESSAGE_BOX_SIZE.MAX_HEIGHT),
			PageWithMessageBox.DEFAULT_MESSAGE_BOX_SIZE.MIN_HEIGHT
		);
	}

	@computed get splitterProps(): SplitterProps {
		const props: SplitterProps = {
			position: 'horizontal',
			dispatchResize: true,
			postPoned: false,
			maximizedPrimaryPane: this.messageBoxDisabled
		}


		switch (this.messageBoxPosition) {
			case 'left':
				props.position = 'vertical';
				props.primaryPaneMaxWidth = "50%";
				props.primaryPaneMinWidth = "1%";
				props.primaryPaneWidth = `${this.boxWidth}px`;
				props.primaryPaneHeight = `unset`;
				break;

			case 'right':
				props.position = 'vertical';
				props.primaryPaneMaxWidth = "99%";
				props.primaryPaneMinWidth = "50%";
				props.primaryPaneWidth = `calc(100% - ${this.boxWidth-5}px)`;
				props.primaryPaneHeight = `unset`;
				break;

			default:
				props.primaryPaneMaxHeight = "99%";
				props.primaryPaneMinHeight = "50%";
				props.primaryPaneHeight = `calc(100% - ${this.boxHeight-5}px)`;
				props.primaryPaneWidth = `unset`;
				break;
		}
		return props;
	}

	@action onDragFinished = () => {
		switch (this.messageBoxPosition) {
			case 'left':
			case 'right':
				this.savedMessageBoxSize.width = $(`.${css.root}`).first().width();
				break;
			case 'bottom':
				this.savedMessageBoxSize.height = $(`.${css.root}`).first().height();
				break;
		}
	}

	@action setMsgBoxPosition = (position: 'left'|'right'|'bottom') => {
		this.messageBoxPosition = position;
		this.splitter.setState({ primaryPane: null });
	}

	@action toggleMessageBox = () => {
		this.messageBoxDisabled = !this.messageBoxDisabled;
	}

	render() {
		if (this.props.disabled === true) {
			return this.props.children;
		}

		const splitterPanes = [
			<div key={"primary"} className={css.primaryPane}>{this.props.children}</div>
		];
		if (!this.messageBoxDisabled) {
			const msgBox = <RunningMessageBox key={"second"} rsSimulation={this.props.rsSimulation} splitterPage={this} />;

			if (this.messageBoxPosition == 'left') {
				splitterPanes.unshift(msgBox);
			} else {
				splitterPanes.push(msgBox);
			}
		}

		return <div className={css.splitter}>
			<div className={css.header}>
				<span className={css.title}>{this.props.title}</span>
				<bp.Tooltip content={i18n.intl.formatMessage({
					defaultMessage: 'Show log messages',
					description: '[RSSimulation] Tooltip to show Simulation Running Messages'
				})}>
					<bp.Button icon={'changes'} active={!this.messageBoxDisabled} onClick={this.toggleMessageBox}/>
				</bp.Tooltip>
			</div>
			<div className={css.content}>
				<Splitter
					ref={this.register}
					onDragFinished={this.onDragFinished}
					{...this.splitterProps}
				>{splitterPanes}</Splitter>
			</div>
		</div>;
	}


}

export class RunningMessageDialog extends React.Component<{rsSimulation: RSSimulation}, any> {
	static TITLE: string = i18n.intl.formatMessage({
		defaultMessage: 'Simulation Log Messages',
		description: '[RSSimulation] Diaog title of Simulation Running Messages'
	});
	static ICON: bp.IconName = IconNames.SEARCH_TEMPLATE;
	static isDisabled = (rsSimulation: RSSimulation) => !(_.includes(["Complete", "Failed"], rsSimulation.status));

	constructor(props) {
		super(props);
	}

	render() {
		return <BlueprintDialog
			className={css.dialog}
			title={RunningMessageDialog.TITLE}
			icon={RunningMessageDialog.ICON}
			canCancel={false}
		>
			<RunningMessageBox rsSimulation={this.props.rsSimulation} />
		</BlueprintDialog>;
	}
}