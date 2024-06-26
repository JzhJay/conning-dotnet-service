import { AppIcon, semanticMenu, bp, sem } from "components";
import { appIcons, api, routing } from 'stores/index';
import { QueryResult, Query, QueryDescriptor, QueryViewAvailability, ReportQuery } from 'stores'
import { observer } from 'mobx-react'
import { QueryViewRequirementsTooltip } from './QueryViewRequirementsTooltip';
import * as css from './AvailableQueryViewDropdown.css';
import {utility} from 'stores';

const { viewDescriptors } = api.constants;

interface MyProps {
	reportQuery?: ReportQuery;
	query?: QueryDescriptor;
	queryResult?: QueryResult;
	openInNewTab?: boolean;
	currentView?: string;
	className?: string;
	style?: React.CSSProperties;
	showIcon?: boolean;
	showMenuLabel?: boolean;
	position?: bp.Position;
	//includeQueryBuilder?: boolean;
	vertical?: boolean;
	useSemantic?: boolean;
	onSetCurrentView?: (view: string) => void;
}

@observer
export class AvailableQueryViewDropdown extends React.Component<MyProps, {}> {
	static defaultProps = {
		showIcon: true,
		showMenuLabel: true,
		includeQueryBuilder: true,
		position: 'bottom'
	}

	popover: bp.Popover;

	render() {
		let { onSetCurrentView, currentView, reportQuery, vertical, position, query, queryResult: qr, className, showIcon, showMenuLabel, style } = this.props;

		const currentDescriptor = currentView && viewDescriptors[currentView];

		if (!qr) { qr = query.queryResult };

		let availableViews = qr ? qr.availableViews : query ? query.availableViews : [];
		if (qr) {
			availableViews = [{ name: 'query', description: 'Modify Query', available: true }, ...availableViews.slice()];
		}

		availableViews = availableViews.filter(({ name }) => {
			const descriptor = viewDescriptors[name];

			//!descriptor && console.log(`No descriptor for '${name}'`);

			return descriptor && !descriptor.hide;
		}).sort((a, b) => {
			return viewDescriptors[a.name].ordinal - viewDescriptors[b.name].ordinal;
		});


		/*
		 interactionKind={PopoverInteractionKind.HOVER}
		 hoverCloseDelay={30000}
		 */
		return (
			<bp.Popover
				ref={p => this.popover = p}
				className={className}
				position={position}
				interactionKind={bp.PopoverInteractionKind.HOVER}
				content={
					<sem.Menu className={css.menu} vertical={vertical}>
						{availableViews.map((avail, i) => {
							const { name, description, available, requirements, bootstrappable } = avail;
							const descriptor = viewDescriptors[name];
							const bootstrapNotSupported = (!bootstrappable && qr.bootstrapEnabled)
							const disabled = !available || (query && query.isRunning) || bootstrapNotSupported;

							// isActive={currentView == name}
							return <bp.Tooltip content={<QueryViewRequirementsTooltip bootstrapNotSupported={bootstrapNotSupported} view={avail}/>}
							                   key={`${name}-tooltip`}
							                   hoverCloseDelay={0}>
								<sem.Menu.Item disabled={disabled} className={css.item} active={currentView == name}
								               onClick={() => {
									               qr && qr.setCurrentView(name);
									               if (query && !qr) { query.desiredView = name }
									               onSetCurrentView && onSetCurrentView(name)
								               }}>
									<AppIcon fitted={!showMenuLabel && !vertical} className={css.menuIcon} icon={appIcons.queryTool.views[name]} style={{ float: !vertical ? 'left' : null }}/>
									{showMenuLabel && <span className={css.menuLabel}>{descriptor.label}</span>}
								</sem.Menu.Item>
							</bp.Tooltip>
						})}
					</sem.Menu>
				}>
				<bp.Button minimal key={currentView} rightIcon="caret-down">
					{currentView && showIcon && <AppIcon className={css.menuIcon} icon={appIcons.queryTool.views[currentView]}/>}
					{currentView && showMenuLabel && currentDescriptor.label}
					{!currentView && showMenuLabel && <span style={style}>Open view...</span>}
				</bp.Button>
			</bp.Popover>)
	}
}


@observer
export class AvailableQueryViewDropdownBp extends React.Component<MyProps, {}> {
	static defaultProps = {
		showIcon: true,
		showMenuLabel: true,
		includeQueryBuilder: true,
		position: bp.Position.BOTTOM
	}

	popover: bp.Popover;

	render() {
		let { onSetCurrentView, currentView, reportQuery, vertical, position, query, queryResult: qr, className, showIcon, showMenuLabel, style } = this.props;

		currentView = currentView ? currentView : reportQuery ? reportQuery.view : 'query';

		const currentDescriptor = currentView && viewDescriptors[currentView];

		if (!qr) { qr = query.queryResult };

		let availableViews = qr ? qr.availableViews : query ? query.availableViews : [];
		if (qr) {
			availableViews = [{ name: 'query', description: 'Modify Query', available: true }, ...availableViews.slice()];
		}

		if (!onSetCurrentView && reportQuery) {
			onSetCurrentView = reportQuery.setView;
		}

		availableViews = availableViews.filter(({ name }) => {
			const descriptor = viewDescriptors[name];

			//!descriptor && console.log(`No descriptor for '${name}'`);

			return descriptor && !descriptor.hide;
		}).sort((a, b) => {
			return viewDescriptors[a.name].ordinal - viewDescriptors[b.name].ordinal;
		});

		/*
		 interactionKind={PopoverInteractionKind.HOVER}
		 hoverCloseDelay={30000}
		 */
		return (
			<bp.Popover
				ref={p => this.popover = p}
				className={classNames(className, css.availableQueryViewDropdownMenu)}
				popoverClassName={css.availableQueryViewPopover}
				position={position}
				interactionKind={bp.PopoverInteractionKind.HOVER}
				content={
					<bp.Menu className={css.menu} >
						{availableViews.map((avail, i) => {
							const { name, description, available, requirements, bootstrappable } = avail;
							const descriptor = viewDescriptors[name];
							const bootstrapNotSupported = (!bootstrappable && qr.bootstrapEnabled)
							const disabled = !available || (query && query.isRunning) || bootstrapNotSupported;

							// isActive={currentView == name}
							return <bp.Tooltip content={<QueryViewRequirementsTooltip bootstrapNotSupported={bootstrapNotSupported} view={avail}/>}
							                 disabled={!avail} position={bp.Position.RIGHT}
							                 key={`${name}-tooltip`}
							                 hoverCloseDelay={0}>
								<bp.MenuItem text={descriptor && descriptor.label}
								             active={name == currentView}
								             className={classNames(name, css.availableQueryViewMenuItem)}
								             labelElement={<AppIcon icon={appIcons.queryTool.views[name]}/>}
								             disabled={disabled}
								             onClick={() => onSetCurrentView(name)}/>
							</bp.Tooltip>
						})}
					</bp.Menu>
				}>
				<bp.Button minimal key={currentView} rightIcon="caret-down">
					{currentView && showIcon && <AppIcon className={css.menuIcon} icon={appIcons.queryTool.views[currentView]}/>}
					{currentView && showMenuLabel && currentDescriptor.label}
					{!currentView && showMenuLabel && <span style={style}>Open view...</span>}
				</bp.Button>
			</bp.Popover>)
	}
}


@observer
export class AvailableQueryViewMenuItems extends React.Component<MyProps, {}> {
	popover: bp.Popover;

	render() {
		let { openInNewTab, currentView, query, reportQuery, queryResult: qr, queryResult, useSemantic } = this.props;

		const currentDescriptor = viewDescriptors[currentView];

		if (!query && reportQuery) {
			query = reportQuery.query;
		}

		if (!qr) { qr = query.queryResult };

		let availableViews = qr ? qr.availableViews : [];
		const viewDict = _.keyBy(availableViews, v => v.name);

		// Remove views we either don't know about or have decided not to show
		availableViews = availableViews.filter(({ name }) => {
			const descriptor = viewDescriptors[name];

			!descriptor && console.log(`No descriptor for '${name}'`);

			return descriptor && !descriptor.hide;
		});

		availableViews = availableViews.sort((a, b) => {
			return viewDescriptors[a.name].ordinal - viewDescriptors[b.name].ordinal;
		})

		availableViews = [{ name: 'query', description: 'Modify Query', available: true }, ...availableViews];


		let setCurrentView = (name) => {
			if (name != 'query' && query && !query.queryResult) query.desiredView = name;


			qr && qr.setCurrentView(name);
			reportQuery && reportQuery.setView(name);

			const href = reportQuery ? null : query && query.queryResult ? query.routeFor(name) : qr ? qr.routeFor(name) : null;
			if (href) {
				if (openInNewTab) {
					utility.openInNewTab(href);
				}
				else {
					routing.push(href);
				}
			}
		}

		/*
		 interactionKind={PopoverInteractionKind.HOVER}
		 hoverCloseDelay={30000}
		 */
		if (!useSemantic) {
			return (
				<bp.MenuItem text={openInNewTab ? 'Open View in New Tab...' : `Switch to View...`} icon={<AppIcon icon={appIcons.queryTool.views[currentView]}/>}>
					{availableViews.map((avail, i) => {
						const { name, description, available, requirements, bootstrappable } = avail;
						const descriptor = viewDescriptors[name];
						const bootstrapNotSupported = (!bootstrappable && qr.bootstrapEnabled)
						const disabled = !available || (query && query.isRunning) || bootstrapNotSupported;

						// isActive={currentView == name}
						return <bp.Tooltip content={<QueryViewRequirementsTooltip bootstrapNotSupported={bootstrapNotSupported} view={avail}/>}
						                   disabled={!avail} position={bp.Position.RIGHT}
						                   key={`${name}-tooltip`}
						                   hoverCloseDelay={0}>
							<bp.MenuItem text={descriptor && descriptor.label}
							             active={name == currentView}
							             className={classNames(name, css.availableQueryViewMenuItem)}
							             icon={<AppIcon icon={appIcons.queryTool.views[name]}/>}
							             disabled={disabled}
							             onClick={() => setCurrentView(name)}/>
						</bp.Tooltip>
					})}
				</bp.MenuItem>)
		} else {
			return (<semanticMenu.MenuItem key="switch-view"
			                               className={css.availableQueryViewMenuItem}
			                               systemIcon={currentDescriptor.icon}
			                               iconicAddonClassNames={"iconic-sm"}
			                               label={`Switch View`}>
				<semanticMenu.Menu isSubmenu={true}>
					{availableViews.map((view) => {
						const descriptor = viewDescriptors[view.name];
						const bootstrapNotSupported = (!view.bootstrappable && qr.bootstrapEnabled)
						const disabled = !view.available || (query && query.isRunning) || bootstrapNotSupported;

						return <bp.Tooltip content={<QueryViewRequirementsTooltip bootstrapNotSupported={bootstrapNotSupported} view={view}/>}
						                   key={`${view.name}-tooltip`}
						                   hoverCloseDelay={0}>
							<semanticMenu.MenuItem key={view.name}
							                       disabled={disabled}
							                       label={`${descriptor.label}`}
							                       systemIcon={appIcons.queryTool.views[view.name]}
							                       iconicAddonClassNames={"iconic-sm"}
							                       onClick={() => view.available && setCurrentView(view.name) }/>
						</bp.Tooltip>
					})}

				</semanticMenu.Menu>
			</semanticMenu.MenuItem>)

		}
	}
}