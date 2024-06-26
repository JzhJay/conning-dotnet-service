import * as css from './ArrangementPanel.css';
import type {PartProps} from '../';
import {SuperPanelComponent} from '../';
import {AppIcon, ReactSortable} from 'components';
import {utility, appIcons, api, settings, i18n} from 'stores/index';
import { action, reaction, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {Query} from 'stores/query';
import {bp} from 'components';
import {PanelSearchBar} from '../SuperPanel/searchers';
import FlipMove from 'react-flip-move';

class AxisRow extends React.Component<{ query: Query, axis: number }, {}> {
	render() {
		const {axis, query} = this.props;

		return <div className={css.axesRow}>
			<span className={css.dragHandle}><img src="/ui/images/20x20_dnd_grip.png"/></span>
			<span className={css.axis}> {query.axisById(axis).label}</span>
		</div>;
	}
}

@observer
export class ArrangementPanel extends React.Component<PartProps, {}> {
    private _dispose = [];

    @observable _showAnimationContainer = false;
    @observable _animating              = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidMount() {
		this._dispose.push(reaction(() => this.props.query.busy, (busy: boolean) => {
			if (busy) {
				this._showAnimationContainer = true;
			}
			else if (!this._animating) {
				this._showAnimationContainer = false;
			}
		}));
	}

    componentWillUnmount() {
		this._dispose.forEach(f => f());
	}

    render() {
		const {query}             = this.props;
		const {rows, columns}     = query.arrangement;
		const {updateArrangement} = query.arrangement;

		const icons = appIcons.queryTool.arrangement;

		return <SuperPanelComponent
			title={i18n.intl.formatMessage({defaultMessage: `Arrangement`, description: "[ArrangementPanel] the query input panel title"})}
		    query={this.props.query}
            part='arrangement'
		>
			<PanelSearchBar part="arrangement"/>
			<div className={css.toolbar} role="toolbar">
				<div className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)}>
					<bp.Tooltip
						content={i18n.intl.formatMessage({defaultMessage: "All to Rows", description: "[ArrangementPanel] the query's arrangement inputs panel action shortcut"})}
						position={bp.Position.BOTTOM}
					>
						<AppIcon className={bp.Classes.BUTTON} icon={icons.allToRows} iconningSize={24}
						   onClick={() => updateArrangement("Rows")}
						   disabled={columns.length === 0} />
					</bp.Tooltip>

					<bp.Tooltip
						content={i18n.intl.formatMessage({defaultMessage: "Swap rows and columns", description: "[ArrangementPanel] the query's arrangement inputs panel action shortcut"})}
						position={bp.Position.BOTTOM}
					>
						<AppIcon className={bp.Classes.BUTTON} icon={icons.flip} iconningSize={24}
						      onClick={() => updateArrangement("Transpose")}
						      data-toggle="tooltip"
						/>
					</bp.Tooltip>

					<bp.Tooltip
						content={i18n.intl.formatMessage({defaultMessage: "All to columns", description: "[ArrangementPanel] the query's arrangement inputs panel action shortcut"})}
						position={bp.Position.BOTTOM}
					>
						<AppIcon className={bp.Classes.BUTTON} icon={icons.allToColumns} iconningSize={24}
						   onClick={() => updateArrangement("Columns")}
						   disabled={rows.length === 0}/>
					</bp.Tooltip>
				</div>
			</div>

			<div className={css.arrangementPanel}>
				{/*<Tooltip position={Position.BOTTOM} content="Transpose Arrangement"><AnchorButton icon="swap-horizontal" text="" disabled={columns.length === 0}*/}
				{/*onClick={query.arrangement.flip}/></Tooltip>*/}

				{this.renderGroup('column')}
				{this.renderGroup('row')}
			</div>

		</SuperPanelComponent>
	}

    moveAxis = (order, sortable, event) => {
		// Multiple events will come through when dragging between rows and columns,
		// so lets restrict processing to a single location.
		if (sortable.el === event.to) {
			const {newIndex, oldIndex}                                            = event;
			const {query, query: {arrangement, arrangement: {updateArrangement}}} = this.props;
			const rows                                                            = [...arrangement.rows]
			const columns                                                         = [...arrangement.columns]
			const isDestinationRows                                               = $(event.to).hasClass("rows");
			const from                                                            = $(event.from).hasClass("rows") ? rows : columns;
			const to                                                              = isDestinationRows ? rows : columns;
			const targetAxis                                                      = from.splice(oldIndex, 1)[0];

			if (newIndex === 0) {
				if (isDestinationRows)
					updateArrangement("FirstRow", targetAxis)
				else
					updateArrangement("FirstColumn", targetAxis)
			}
			else {
				updateArrangement("MoveAfter", targetAxis, to[newIndex - 1])
			}
		}
	}

    renderGroup(group: 'row' | 'column') {
		const isRow = group == 'row';

		const {props: {query}} = this;
		const {rows, columns}  = query.arrangement;
		const collection       = isRow ? rows : columns;
		const heading          = isRow ?
		                         i18n.intl.formatMessage({defaultMessage: "Row Axes", description: "[ArrangementPanel] a arrangement group title"}) :
		                         i18n.intl.formatMessage({defaultMessage: "Column Axes", description: "[ArrangementPanel] a arrangement group title"});
		const {animate}        = settings.query;

		const children          = collection.map(axis => <AxisRow key={axis} query={query} axis={axis}/>);
		const containerCssClass = classNames(css.sortableContainer, isRow ? "rows" : "columns");

		// These are react-collapse so that we get our heights set so that when it changes later due to selection the height change will animate
		return <div
		                 className={css.axesGroup}
		                 data-group={group}>
			<span className={css.axesGroupHeading}>
				{/*<Tooltip position={Position.LEFT} content={`All to ${isRow ? 'Rows' : 'Columns'}`}><AnchorButton icon={isRow ? "add-row-top" : "add-column-left"} onClick={isRow ? query.arrangement.allToRows : query.arrangement.allToColumns }/></Tooltip>*/}
				{heading} ({collection.length})

			</span>
			{this._showAnimationContainer
				? (<FlipMove className={containerCssClass}
				                  onStart={() => this._animating = true}
				                  disableAllAnimations={!animate}
				                  onFinishAll={action(() => {
					                  this._animating              = false;
					                  this._showAnimationContainer = false;
				                  })}>
					{children}
				</FlipMove>)
				: (<ReactSortable className={containerCssClass}
				                  options={{
					                  animation:      100,
					                  group:          'arrangementAxes',
					                  forceFallback:  true,
					                  fallbackOnBody: true
				                  }}
				                  onChange={this.moveAxis}>
					{children}
				</ReactSortable>)}
		</div>

		/*
		 {this._showAnimationContainer
		 ? (<ReactFlipMove className={containerCssClass}
		 onStart={() => this._animating = true}
		 onFinishAll={action(() => {
		 this._animating = false;
		 this._showAnimationContainer = false;
		 })}>
		 {children}
		 </ReactFlipMove>)
		 : (<ReactSortable className={containerCssClass}
		 options={{
		 animation:      400,
		 group:          'arrangementAxes',
		 forceFallback:  true,
		 fallbackOnBody: true,
		 sort: true
		 }}
		 onChange={this.moveAxis}>
		 {children}
		 </ReactSortable>)}
		 */
	}
}