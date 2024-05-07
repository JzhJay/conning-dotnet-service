import {Keys} from '@blueprintjs/core';
import {InputTable} from 'components/system/userInterfaceComponents/Table/InputTable';
import { action, computed, observable, reaction, toJS, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {bp, LoadingUntil} from 'components';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import { RWRecalibration } from '../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

import * as css from "./OptimizationAlgorithm.css";

interface OptimizationAlgorithmProps {
	recalibration: RWRecalibration;
}

interface OptimizationAlgorithmSorterProps {
	optimizationAlgorithm: OptimizationAlgorithm;
}

interface OptimizationAlgorithmTableProps {
	index: number;
	indexString: string;
	optimizationAlgorithm: OptimizationAlgorithm;
}

const TagDragHandle = SortableHandle(() => <bp.Icon icon='drag-handle-vertical' title='Move this tag' className={classNames(css.dragHandle, 'draggable')}/>)

@observer
class OptimizationAlgorithmNameEditor extends React.Component<OptimizationAlgorithmTableProps, {}> {
    @observable isEditing = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    get tableName() {
		return this.props.optimizationAlgorithm.axisValues[this.props.indexString];
	}

    updateName = (e) => {
		const newName = e.target?.value;
		if(newName == null || newName === "" ) { return; }
		this.props.optimizationAlgorithm.renameAxis(this.props.indexString ,newName);
		this.isEditing = false;
	}

    keyDown = (e) => {
		if (e.keyCode === Keys.ENTER || e.keyCode === Keys.TAB) {
			e.preventDefault();
			this.updateName(e);
		}
	}

    render(){
		return <div className={css.itemTitleEditor}>{
			this.isEditing ?
			<input type={"text"} className={"bp3-input"} defaultValue={this.tableName} onBlur={this.updateName} onKeyDown={this.keyDown}/> :
			<div className={css.display}>
				{this.tableName}
				<bp.Tooltip position={bp.Position.BOTTOM_LEFT} content={"Rename"}>
					<bp.Button icon={"edit"} onClick={() => this.isEditing = true}/>
				</bp.Tooltip>
			</div>
		}</div>
	}
}

@observer
class OptimizationAlgorithmTable extends React.Component<OptimizationAlgorithmTableProps, {}> {
    recalibration: RWRecalibration = this.props.optimizationAlgorithm.props.recalibration;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    get tableName() {
		return this.props.optimizationAlgorithm.axisValues[this.props.indexString];
	}

    @computed get data() {
		const index = parseInt(this.props.indexString);
		return this.recalibration.userInterface.userInputs.optimizers[index];
	}

    @computed get isCollapse() {
		return this.props.optimizationAlgorithm.isCollapse(this.props.indexString);
	}

    @action toggleCollapse = () => {
		this.props.optimizationAlgorithm.toggleCollapse(this.props.indexString);
	}

    onDeleteItem = () => {
		const {props: {optimizationAlgorithm, indexString}} = this;
		optimizationAlgorithm.removeAxis(indexString);
	}

    onUpdate = async (update_values: object, update_path: string) => {
		// console.log(`update ${indexString} on row ${rowIndex} value: ${JSON.stringify(update_values)}`);
		this.recalibration.editOptimizersRow(this.props.indexString, update_values);
	}

    onInsert = async (index: number, newRowsCount: number) => {
		// console.log(`insert ${indexString} row`);
		await this.recalibration.insertOptimizersRow(this.props.indexString, index, newRowsCount);
	}

    onDelete = async (records: object[]) => {
		const index = _.indexOf(this.data, records[0]);
		await this.recalibration.deleteOptimizersRow(this.props.indexString, index, records.length);
	}

    render() {
		const {tableName, props: {optimizationAlgorithm, indexString}} = this;

		return <li className={css.itemRoot}>
			<TagDragHandle />
			<bp.Icon icon={this.isCollapse ? "chevron-right" : "chevron-down"} className={css.collapseHandle} onClick={this.toggleCollapse}/>
			<div className={css.itemBody}>
				<bp.Collapse isOpen={this.isCollapse} className={css.titleCollapse}>
					<span className={css.itemTitle}>
						<OptimizationAlgorithmNameEditor {...this.props} />
					</span>
					<bp.Tooltip content={`Delete Optimization Algorithm '${tableName}'`} position={bp.Position.BOTTOM_RIGHT}>
						<bp.Button className={css.removeItemButton} icon={"trash"} onClick={this.onDeleteItem}/>
					</bp.Tooltip>
				</bp.Collapse>
				<bp.Collapse isOpen={!this.isCollapse} className={css.tableCollapse}>
					<div style={{display: 'flex'}}>
						<InputTable
							userInterface={this.props.optimizationAlgorithm.userInterface}
							globalLists={null}
							data={this.data}
							dataWithIndex={true}
							flipPrimary={true}
							axes={null}

							title={<OptimizationAlgorithmNameEditor {...this.props} />}
							onUpdateValue={this.onUpdate}
							onDeleteRows={this.onDelete}
							onInsertRows={this.onInsert}
							sortableColumns={false}
							extendToolbarMenus={<bp.Menu>
								<bp.MenuItem icon={'trash'} text={`Delete Optimization Algorithm '${tableName}'`} onClick={this.onDeleteItem}/>
							</bp.Menu>}
						/>
					</div>
				</bp.Collapse>
			</div>

		</li>
	}
}
const OptimizationAlgorithmTableWrapper = SortableElement(OptimizationAlgorithmTable);

@observer
class OptimizationAlgorithmTableContainer extends React.Component<OptimizationAlgorithmSorterProps, {}> {
	render() {
		const optimizationAlgorithm = this.props.optimizationAlgorithm;
		const optimizerAxisValues = this.props.optimizationAlgorithm.axisValues;
		const tableKeys = Object.keys(optimizerAxisValues).sort();
		return <ul className={css.containerRoot}>
			{tableKeys.map( (indexString, i) =>
				<OptimizationAlgorithmTableWrapper key={`OptimizationAlgorithmTable${i}`} index={i} indexString={indexString} optimizationAlgorithm={optimizationAlgorithm} />
			)}
		</ul>
	}
}
const OptimizationAlgorithmTableContainerWrapper = SortableContainer(OptimizationAlgorithmTableContainer);

@observer
export class OptimizationAlgorithm extends React.Component<OptimizationAlgorithmProps, {}> {

	@observable collapseStatus: string[] = [];

	constructor(props) {
        super(props);
        makeObservable(this);
        this.props.recalibration.getUserInterface();
    }

	@computed get userInterface() {
		const recalibration = this.props.recalibration;
		const optimizersOptions = recalibration?.userInterface?.inputOptions?.optimizers

		let userInterface = _.find(optimizersOptions?.options, o => o.inputType == 'expandable');
		if (!userInterface)
			return;

		userInterface = toJS(userInterface);
		userInterface.hints.dimension = 2;
		userInterface.options?.forEach((o: any) => {
			o.isExpandable = true;
			o.isExpandableOnAlternate = true;
		});

		return userInterface;
	}

	@computed get isLoading() {
		return this.props.recalibration.isUserInterfaceLoading;
	}

	@computed get axisValues() {
		return this.props.recalibration.userInterface?.axes.optimizerAxis.values || {};
	}

	addAxis = () => {
		this.props.recalibration.insertAxisCoordinate("optimizerAxis");
	}

	removeAxis = (indexString: string) => {
		this.props.recalibration.deleteAxisCoordinate("optimizerAxis", parseInt(indexString)).then(() => {
			_.remove(this.collapseStatus, n => !_.some(Object.values(this.axisValues), v => v == n));
		});
	}

	renameAxis = (indexString: string, newName: string) => {
		const isCollapse = this.isCollapse(indexString);
		this.props.recalibration.renameAxisCoordinate("optimizerAxis", parseInt(indexString), newName).then( () => {
			if (!isCollapse) {
				_.remove(this.collapseStatus, n => !_.some(Object.values(this.axisValues), v => v == n));
				this.toggleCollapse(indexString);
			}
		});
	}

	// set axis new index
	onSortEnd = ({oldIndex, newIndex}) => {
		this.props.recalibration.setAxisCoordinateIndex("optimizerAxis", oldIndex, newIndex);
	};



	isCollapse = (indexString: string) => {
		const tableName = this.axisValues[indexString];
		return !!(tableName && !_.some(this.collapseStatus, n => n == tableName));
	}

	toggleCollapse = (indexString: string, expectStatus?: boolean) => {
		const tableName = this.axisValues[indexString];
		if (!tableName) {
			return;
		}
		const currentStatus = this.isCollapse(indexString);
		if (currentStatus === expectStatus) {return;}
		if (currentStatus) {
			this.collapseStatus.push(tableName);
		} else {
			_.remove(this.collapseStatus, n => n == tableName);
		}
	}

	render() {
		const { isLoading } = this;

		return <div className={css.dialogBody}> {
			!(isLoading) ? <>
				<div className={css.dialogCtrls}>
					<bp.Button className={css.addButton} icon={"plus"} text={"Add Optimization Algorithm"} onClick={this.addAxis} />
				</div>
				<OptimizationAlgorithmTableContainerWrapper onSortEnd={this.onSortEnd} optimizationAlgorithm={this} useDragHandle/>
            </> : <LoadingUntil loaded={false} />
		} </div>
	}
}