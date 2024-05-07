import * as css from './CloudWatchToolbar.css'
import {observer} from 'mobx-react';
import {bp, sem} from 'components'
import {i18n} from 'stores'
import {AnchorButton, Button, ButtonGroup, Classes, Label, MenuItem, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, ProgressBar, Tooltip, Checkbox} from '@blueprintjs/core';
import {KeyCode} from '../../../utility';
import {appIcons} from '../../../stores';
import {AppIcon} from '../../widgets';
import {CloudWatchPageContext, ISimulationEventType} from './CloudWatchPageContext';
import {MultiSelect} from '@blueprintjs/select';
import {CloudWatchStreamNode} from './CloudWatchTree';

const EventTypeMultiSelect = MultiSelect.ofType<ISimulationEventType>()

interface MyProps {
	context: CloudWatchPageContext;
}

@observer
export class CloudWatchToolbar extends React.Component<MyProps, {}> {
	render() {
		const {context, context: {eventsRaw, percentComplete, isPlaying, eventsIndex, settings}} = this.props;

		return (
			<>
				<Navbar className={css.root}>
					<NavbarGroup align={bp.Alignment.LEFT}>
						<ButtonGroup>
							<Button text="Table View" active={context.view == 'table'} icon="th" onClick={() => context.view = 'table'}/>
							<Button text="Raw View" active={context.view == 'raw'} icon="code" onClick={() => context.view = 'raw'}/>
						</ButtonGroup>

						<NavbarDivider/>

						<Checkbox label='Show Alerts Only' checked={!settings.hideNonLogEvents} onClick={() => settings.hideNonLogEvents = !settings.hideNonLogEvents}/>

						{/*<EventTypeMultiSelect selectedItems={context.simulationEventTypes.filter(e => context.selectedEventTypes.has(e.type))}*/}
						{/*items={context.simulationEventTypes}*/}
						{/*onItemSelect={event => {*/}
						{/*const {selectedEventTypes: d} = context;*/}
						{/*if (d.has(event.type)) {*/}
						{/*d.delete(event.type);*/}
						{/*}*/}
						{/*else {*/}
						{/*d.set(event.type);*/}
						{/*}*/}
						{/*}}*/}

						{/*tagInputProps={{placeholder: 'Filter Steps', onRemove: this.onTagRemove}}*/}
						{/*itemRenderer={(event, {modifiers, handleClick}) => {*/}
						{/*if (!modifiers.matchesPredicate) {*/}
						{/*return null;*/}
						{/*}*/}
						{/*// NOTE: not using Films.itemRenderer here so we can set icons.*/}
						{/*const classes = classNames({*/}
						{/*[Classes.ACTIVE]:         modifiers.active,*/}
						{/*[Classes.INTENT_PRIMARY]: modifiers.active,*/}
						{/*});*/}
						{/*return (*/}
						{/*<MenuItem*/}
						{/*className={classes}*/}
						{/*icon={context.selectedEventTypes.has(event.type) ? "tick" : "blank"}*/}
						{/*key={event.type}*/}
						{/*onClick={handleClick}*/}
						{/*text={_.capitalize(event.type)}*/}
						{/*shouldDismissPopover={false}*/}
						{/*/>*/}
						{/*);*/}
						{/*}}*/}
						{/*tagRenderer={event => _.capitalize(event.type)}/>*/}
					</NavbarGroup>

					<NavbarGroup align={bp.Alignment.RIGHT}>
						{DEV_BUILD && context.streamInstance && (
							<>
								<NavbarHeading>Replay Events:</NavbarHeading>
								<ButtonGroup>
									<Tooltip content='Jump to Start' position={bp.Position.BOTTOM}>
										<AnchorButton icon="fast-backward"
										              disabled={eventsIndex == -1}
										              onClick={() => context.eventsIndex = -1}/>
									</Tooltip>
									<Tooltip content='Step Backwards' position={bp.Position.BOTTOM}>
										<AnchorButton icon="step-backward"
													  disabled={context.eventsIndex == -1}
										              onClick={context.debug_stepBackward}/>
									</Tooltip>
								</ButtonGroup>
								<span className={css.timelineLabel}>
									{context.eventsIndex == null ? eventsRaw.length : eventsIndex + 1} of {eventsRaw.length}
								</span>
								<ButtonGroup>
									<Tooltip content='Step Forwards' position={bp.Position.BOTTOM}>
										<AnchorButton icon="step-forward"
										              disabled={eventsIndex == null || eventsIndex + 1 == eventsRaw.length}
										              onClick={context.debug_stepForward}/>
									</Tooltip>
									<Tooltip content='Jump to End' position={bp.Position.BOTTOM}>
										<AnchorButton icon="fast-forward"
										              disabled={eventsIndex == null || eventsIndex + 1 == eventsRaw.length}
										              onClick={() => context.eventsIndex = eventsRaw.length - 1}/>
									</Tooltip>
								</ButtonGroup>

								<NavbarDivider/>

								<Tooltip content='Start/Stop Playback' position={bp.Position.BOTTOM}>
									<AnchorButton disabled={eventsIndex == null || eventsRaw.length - 1 == eventsIndex}
									              icon={isPlaying ? 'stop' : 'play'}
									              onClick={() => context.debug_play()}/>
								</Tooltip>

								<NavbarDivider/>
							</>)}

						<sem.Input
							placeholder={i18n.common.MESSAGE.SEARCHING}
							icon={<AppIcon icon={appIcons.queryTool.search} className="iconic-sm"/>}
							value={context.searchText}
							onKeyDown={e => {
								if (e.keyCode == KeyCode.Escape) {
									context.searchText = ''
								}
							}}
							onChange={(e: any) => context.searchText = e.target.value}
						/>
					</NavbarGroup>
				</Navbar>
			</>
		);
	}

	onTagRemove = (_tag: string, index: number) => {
		this.props.context.selectedEventTypes.delete(_tag.toLowerCase());
	}
}
