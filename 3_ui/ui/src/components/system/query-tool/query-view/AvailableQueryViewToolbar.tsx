import {ButtonGroup} from '@blueprintjs/core';
import { AppIcon, semanticMenu, bp, sem} from "components";
import { appIcons, api, routing } from 'stores/index';
import { QueryResult, Query, QueryDescriptor, QueryViewAvailability, ReportQuery } from 'stores'
import { observer } from 'mobx-react'
import { QueryViewRequirementsTooltip } from './QueryViewRequirementsTooltip';
import * as css from './AvailableQueryViewToolbar.css';

const { viewDescriptors } = api.constants;

interface MyProps {
	reportQuery?: ReportQuery;
	query?: QueryDescriptor;
	currentView?: string;
	className?: string;
	style?: React.CSSProperties;
	showIcon?: boolean;
	showMenuLabel?: boolean;
	//includeQueryBuilder?: boolean;
	useSemantic?: boolean;
	onSetCurrentView?: (view: string) => void;
}

@observer
export class AvailableQueryViewToolbar extends React.Component<MyProps, {}> {
	static defaultProps = {
		showIcon           : true,
		showMenuLabel      : true,
		includeQueryBuilder: true
	}

	popover: bp.Popover;

	render() {
		let { onSetCurrentView, currentView, reportQuery, query, query: { queryResult: qr }, className, showIcon, showMenuLabel, style } = this.props;

		const currentDescriptor = currentView && viewDescriptors[currentView];

		let availableViews = qr ? qr.availableViews : query ? query.availableViews : [];
		if (qr) {
			availableViews = [{ name: 'query', description: 'Query Builder', available: true }, ...availableViews.slice()];
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
			<ButtonGroup className={classNames(className)}>
				{availableViews.map((avail, i) => {
					const { name, description, available, requirements, bootstrappable, sensitivity } = avail;
					const descriptor                                                     = viewDescriptors[name];

					const bootstrapNotSupported = (!bootstrappable && qr.bootstrapEnabled)
					const sensitivityNotSupported = (!sensitivity && qr.sensitivityEnabled)
					const disabled              = !available || (query && query.isRunning) || bootstrapNotSupported || sensitivityNotSupported;

					// isActive={currentView == name}
					return <bp.Tooltip content={<QueryViewRequirementsTooltip bootstrapNotSupported={bootstrapNotSupported} view={avail}/>}
					                 key={`${name}-tooltip`}
					                 position={bp.Position.BOTTOM}>
						<bp.AnchorButton disabled={disabled} active={currentView == name}
						                 href={qr.routeFor(name)}
						                 className={css.button}
						                 onClick={(e) => {
							                 qr && qr.setCurrentView(name);
							                 if (query && !qr) {
								                 query.desiredView = name
							                 }
							                 onSetCurrentView && onSetCurrentView(name);
							                 e.preventDefault();
						                 }}>
							<AppIcon fitted={!showMenuLabel} className={css.menuIcon} icon={appIcons.queryTool.views[name]}/>
						</bp.AnchorButton>
					</bp.Tooltip>
				})}
			</ButtonGroup>)
	}
}
