import {IconName} from '@blueprintjs/core';
import * as dialogCss from 'components/site/dialogs.css';
import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import {action, computed, observable, makeObservable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {FlexibleAxis, FlexibleAxisChanges, RSSimulation, i18n, ObjectNameChecker, ObjectNameCheckerConfig, ObjectNameCheckerResult, site, xhr} from 'stores';
import {KeyCode} from 'utility';
import {BlueprintDialog, bp, Highlighter, LoadingIndicator} from '../../../index';

import * as css from './FlexibleAxesEditor.css';
import * as nameEditCss from 'components/widgets/SmartBrowser/SortableCardsPanel.css';

interface AxisCoordinateItemProps {
	axisCoordinate: AxisCoordinate;
	flexibleAxesEditorList: FlexibleAxisEditor;
}

const DragHandle = SortableHandle(() => <bp.Icon icon='drag-handle-vertical' className={classNames(css.dragHandle, 'draggable')}/>)

@observer
@bp.ContextMenuTarget
class AxisCoordinateItem extends React.Component<AxisCoordinateItemProps, any> {

	constructor(props) {
		super(props);

		// makeObservable(this);
	}

	render() {
		const {selected: isSelected, checked: isChecked, readonly} = this.props.axisCoordinate;
		const {flexibleAxesEditorList, axisCoordinate} = this.props;

		return <li
			className={classNames(css.item, {[css.selected]: isSelected})}
			onContextMenu={(e) => {
				if (!isSelected) {
					flexibleAxesEditorList.onSelect(axisCoordinate, false, false);
				}
			}}
			onKeyDown={(e) => {
				if(e.code == "Enter") {
					e.stopPropagation();
					return false;
				}
			}}
			onMouseDown={(e) => {
				if (e.buttons == 1) {
					flexibleAxesEditorList.onSelect(axisCoordinate, e.metaKey, e.shiftKey);
					this.props.flexibleAxesEditorList.onMouseSelect(this.props.axisCoordinate, true)
				}
			}}
			onMouseEnter={action((e) => {
				if (this.props.flexibleAxesEditorList.isMouseSelecting ) {
					this.props.flexibleAxesEditorList.onMouseSelect(this.props.axisCoordinate)
				}
			})}
		>
			<div className={css.itemDragHandle}><DragHandle /></div>
			<bp.Checkbox disabled={readonly} checked={isChecked} onClick={() => flexibleAxesEditorList.onCheck(axisCoordinate)} />
			<AxisCoordinateNameEditor
				axisCoordinate={axisCoordinate}
				flexibleAxesEditorList={flexibleAxesEditorList}
			/>
		</li>;
	}

	renderContextMenu() {
		const {flexibleAxesEditorList, axisCoordinate} = this.props;
		const displayIndex = _.findIndex(flexibleAxesEditorList.sortedCoordinates, c => c == axisCoordinate);

		return <bp.Menu>
			<bp.MenuItem text={i18n.common.SELECTION.ALL}     icon={'blank'} onClick={flexibleAxesEditorList.onCheckAll} />
			<bp.MenuItem text={i18n.common.SELECTION.WITH}    icon={'blank'} onClick={flexibleAxesEditorList.onCheckWith} />
			<bp.MenuItem text={i18n.common.SELECTION.WITHOUT} icon={'blank'} onClick={flexibleAxesEditorList.onCheckWithout} />
			<bp.MenuItem text={i18n.common.SELECTION.ONLY}    icon={'blank'} onClick={flexibleAxesEditorList.onCheckOnly} />
			<bp.MenuItem text={i18n.common.SELECTION.EXPECT}  icon={'blank'} onClick={flexibleAxesEditorList.onCheckExcept} />
			<bp.MenuDivider />
			<bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Insert 1 Axis Coordinate Before", description: "[FlexibleAxesEditor] insert a coordinate to the axis"})}
				icon={FlexibleAxisEditor.ICONS.INSERT_BEFORE}
				onClick={() => flexibleAxesEditorList.insertAxisCoordinates(axisCoordinate, true)}
			/>
			<bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Insert 1 Axis Coordinate After", description: "[FlexibleAxesEditor] insert a coordinate to the axis"})}
				icon={FlexibleAxisEditor.ICONS.INSERT_AFTER}
				onClick={() => flexibleAxesEditorList.insertAxisCoordinates(axisCoordinate, false)}
			/>
			<bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Insert Axis Coordinate(s) Before", description: "[FlexibleAxesEditor] insert multiple coordinates to the axis"})}
				icon={FlexibleAxisEditor.ICONS.INSERT_AFTER}
			>
				{flexibleAxesEditorList.insertMenuItems.map((count) => <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={() => flexibleAxesEditorList.insertAxisCoordinates(axisCoordinate, true, count)}/>)}
			</bp.MenuItem>
			<bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Insert Axis Coordinate(s) After", description: "[FlexibleAxesEditor] insert multiple coordinates to the axis"})}
				icon={FlexibleAxisEditor.ICONS.INSERT_AFTER}
			>
				{flexibleAxesEditorList.insertMenuItems.map((count) => <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={() => flexibleAxesEditorList.insertAxisCoordinates(axisCoordinate, false, count)}/>)}
			</bp.MenuItem>
			<bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Delete Selected Axis Coordinate(s)", description: "[FlexibleAxesEditor] delete one or multiple coordinates to the axis"})}
				icon={FlexibleAxisEditor.ICONS.REMOVE}
				onClick={() => flexibleAxesEditorList.deleteSelectedCoordinates()}
				disabled={flexibleAxesEditorList.deleteDisabled}
			/>
			{!flexibleAxesEditorList.props.editDisabled && <>
				<bp.MenuDivider/>
				<bp.MenuItem
					text={flexibleAxesEditorList.selectedCoordinates.length > 1 ?
					      i18n.intl.formatMessage({defaultMessage: "Sort Selected Coordinates Alphabetically Ascending", description: "[FlexibleAxesEditor] sorting all items"}) :
					      i18n.intl.formatMessage({defaultMessage: "Sort Coordinates Alphabetically Ascending", description: "[FlexibleAxesEditor] sorting selected items"})}
					icon={"sort-alphabetical"}
					onClick={() => flexibleAxesEditorList.sortByAlphabet()}
				/>
				<bp.MenuItem
					text={flexibleAxesEditorList.selectedCoordinates.length > 1 ?
					      i18n.intl.formatMessage({defaultMessage: "Sort Selected Coordinates Alphabetically Descending", description: "[FlexibleAxesEditor] sorting all items"}) :
					      i18n.intl.formatMessage({defaultMessage: "Sort Coordinates Alphabetically Descending", description: "[FlexibleAxesEditor] sorting selected items"})}
					icon={"sort-alphabetical-desc"}
					onClick={() => flexibleAxesEditorList.sortByAlphabet(true)}
				/>
			</>}
			<bp.MenuDivider />
			<bp.MenuItem text={i18n.common.OBJECT_CTRL.COPY}  icon={FlexibleAxisEditor.ICONS.COPY} onClick={flexibleAxesEditorList.onCopy} />
			<bp.MenuItem text={i18n.common.OBJECT_CTRL.PASTE} icon={FlexibleAxisEditor.ICONS.PASTE} onClick={() => flexibleAxesEditorList.onPaste(false)} />
			<bp.MenuItem
				text={i18n.intl.formatMessage({
					defaultMessage: "Append Items from Clipboard",
					description: "[FlexibleAxesEditor] paste items from clipboard"
				})}
				icon={"blank"}
				onClick={() => flexibleAxesEditorList.onPaste(true)}
			/>
			<bp.MenuDivider
				title={i18n.intl.formatMessage(
					{defaultMessage: "(row {displayIndex})", description: "[FlexibleAxesEditor] a information shows what row activate contextmenu"},
					{displayIndex: displayIndex+1}
				)}
			/>
		</bp.Menu>
	}
}

const SortableAxisCoordinateItem = SortableElement(AxisCoordinateItem);
const SortableAxisCoordinateList = SortableContainer(({children}) => <ul className={css.sortableCoordinateList}>{children}</ul>);

interface AxisCoordinate {
	_inputs?: {
		name: string
		checked: boolean;
	};
	name: string;
	checked: boolean;
	readonly: boolean;
	selected?: boolean;
	deleted?: boolean;
}

interface FlexibleAxisEditorProps{
	axesEditor: FlexibleAxesEditorDialog;
	axis: FlexibleAxis;
	editDisabled: boolean;
}

@observer
@bp.ContextMenuTarget
class FlexibleAxisEditor extends React.Component<FlexibleAxisEditorProps, any> {

	static ICONS = {
		ADD: "add" as IconName,
		INSERT_BEFORE: "add-row-top" as IconName,
		INSERT_AFTER: "add-row-bottom" as IconName,
		REMOVE: "delete" as IconName,
		COPY: "clipboard" as IconName,
		PASTE: "duplicate" as IconName
	}

	insertMenuItems = _.range(1, 10).concat(_.range(10, 110, 10));
	_objectNameChecker: ObjectNameChecker;
	tempNames: string[] = [];
	// for filter values
	filterInput: HTMLInputElement;
	@observable _filterText: string;
	// for shift multi-select
	shiftRangeSelectFrom: number;
	// for mouse multi-select
	isMouseSelecting: boolean = false;
	mouseRangeSelectFrom: number = null;

	constructor(props) {
		super(props);
		makeObservable(this);

		const {axis, axesEditor, editDisabled} = this.props;
		const changes = axesEditor.changes[axis.axis];
		let sortedData: AxisCoordinate[]  = _.map(axis.coordinates, (coordinate) => {
			const displayName = _.get(changes, ["rename", coordinate.coordinate], coordinate.coordinate);
			const deleted = _.includes(changes?.delete, coordinate.coordinate);
			const checked = coordinate.active == 1;
			return {name: displayName, checked, deleted, readonly:editDisabled, _inputs: {name: coordinate.coordinate, checked: checked}}
		});

		if (changes) {
			_.forEach(changes.add, name => sortedData.push({name, checked: true, readonly: false}));
			sortedData = _.sortBy(
				sortedData,
				c => _.indexOf(changes.reorder, c.name)
			);
			_.forEach(
				_.filter(sortedData, c => c.deleted !== true),
				(c,i) => {c.checked = changes.active[i]}
			);
		}
		this._sortedData = sortedData;
		this._objectNameChecker = new ObjectNameChecker({
			defaultName: this.props.axis.prototype.replace(/\s&0$/, ""),
			sequenceStartFrom: 1,
			type: 'numeric',
			caseInsensitive: this.props.axis.caseInsensitive,
			alwaysAddSequence: true,
			customizeCompareList: () => this.getCustomizeCompareList()
		});
	}

	getCustomizeCompareList = () => {
		const {axis, axesEditor } = this.props;
		const nameMap: {[axisName: string]: string[]} = {};

		const checkCoordinateNames = (testAxis: FlexibleAxis, includeReserved:boolean) => {
			if (!testAxis || _.has(nameMap, testAxis.axis)) {
				return;
			}
			nameMap[testAxis.axis] = [
				...(axesEditor.getCoordinateNames(testAxis)),
				...((includeReserved ? testAxis.reserved : null) || [])
			];
			_.forEach(testAxis.exclusive, ex => {
				checkCoordinateNames(_.find(axesEditor.axes, a => a.axis == ex), false);
			})
		}
		checkCoordinateNames(axis, true);

		const names = _.flatten(_.values(nameMap));
		return _.uniq(names);
	}

	getHelpText = (
		checkResult: ObjectNameCheckerResult,
		applySuggestNameElementCreator: (suggestNameWithoutPath:string, suggestName:string) => React.ReactElement
	) => {
		const isCaseInsensitive = checkResult.isCaseInsensitive;
		const duplicatedName = checkResult.inputWithoutPath;
		const {axis, axesEditor } = this.props;

		const findIn = (nameList: string[]) => {
			const testName = isCaseInsensitive ? _.toLower(duplicatedName) : duplicatedName;
			return _.find(nameList, name => ((isCaseInsensitive ? _.toLower(name): name) == testName));
		}
		let found = findIn(axesEditor.getCoordinateNames(axis));
		if (found) {
			const suggestName = checkResult.suggestNameWithoutPath;
			const applySuggest = applySuggestNameElementCreator(suggestName, suggestName);
			return <>An object with the name "{found}" already exists. Would you like to use "{applySuggest}" instead?</>;
		}

		found = findIn(this.props.axis.reserved);
		if (found) {
			const suggestName = checkResult.suggestNameWithoutPath;
			const applySuggest = applySuggestNameElementCreator(suggestName, suggestName);
			return <>The name "{found}" has been reserved. Would you like to use "{applySuggest}" instead?</>;
		}

		let exclusiveAxis: string = null;
		let checkedAxis = [axis.axis];
		const findInExclusive = (testAxis: FlexibleAxis) => {
			if (exclusiveAxis) {
				return;
			}
			_.forEach(testAxis.exclusive, exclusive => {
				if (_.includes(checkedAxis, exclusive)) {
					return;
				}
				checkedAxis.push(exclusive);

				let testExclusiveAxis = _.find(axesEditor.axes, a => a.axis == exclusive);
				found = findIn(axesEditor.getCoordinateNames(testExclusiveAxis));
				if (found) {
					exclusiveAxis = testExclusiveAxis.axis;
				}
				findInExclusive(testExclusiveAxis);
			});
		}
		findInExclusive(axis);

		if (exclusiveAxis) {
			let suggestName = checkResult.suggestNameWithoutPath;
			const applySuggest = applySuggestNameElementCreator(suggestName, suggestName);
			return <>The item name "{found}" has been used in Axis "{exclusiveAxis}". Would you like to use "{applySuggest}" instead?</>;
		}

		return null;
	}

	@observable _sortedData: AxisCoordinate[] = null;

	@computed get sortedCoordinates(): AxisCoordinate[] {
		let rtn: AxisCoordinate[] = _.filter(this._sortedData, coordinate => coordinate.deleted !== true);
		if (this.filterText != null ) {
			const regexp = new RegExp(this.filterText, 'i');
			rtn = _.filter(rtn, (c) => {
				const testResult = c.name.match(regexp);
				return !!testResult;
			});
		}
		return rtn;
	}

	@computed get selectedCoordinates(): AxisCoordinate[] {
		return _.filter(this._sortedData, coordinate => coordinate.deleted !== true && coordinate.selected === true);
	}

	@action updateChangesMap = () => {
		const {axis, axesEditor} = this.props;
		let inserts = [], deletes = [], hasRename = false, renames = {};
		_.map(this._sortedData, c => {
			const saveName = c.name;
			if (!c._inputs) {
				inserts.push(saveName);
			} else if (c.deleted === true) {
				deletes.push(c._inputs.name);
			} else if (saveName != c._inputs.name){
				hasRename = true;
				renames[c._inputs.name] = saveName;
			}
		});
		const hasChange =
			inserts.length > 0 || deletes.length > 0 || hasRename ||
			!_.eq(
				_.map(axis.coordinates, c => c.coordinate),
				_.map(this._sortedData, c => c.name)
			) ||
			_.some(this._sortedData, c => {
				return c.checked != c._inputs.checked;
			})


		if (hasChange) {
			const changes: FlexibleAxisChanges = {};
			if (inserts.length > 0) {
				changes.add = inserts;
			}
			if (deletes.length > 0) {
				changes.delete = deletes;
			}
			if(hasRename) {
				changes.rename = renames;
			}
			changes.reorder = _.map(this.sortedCoordinates, (c) => c.name);
			changes.active = _.map(this.sortedCoordinates, (c) => c.checked);

			axesEditor.changes[axis.axis] = changes;
		} else {
			axesEditor.changes[axis.axis] = null;
		}
	}

	@action insertAxisCoordinates = async (targetCoordinate?: AxisCoordinate, isBefore = false, amount: number = 1 ) => {
		this.filterText = "";
		let insertIndex = _.indexOf(this._sortedData, targetCoordinate);
		if (insertIndex < 0) {
			if (isBefore) {
				insertIndex = 0
			} else {
				insertIndex = this._sortedData.length;
			}
		} else if (!isBefore) {
			insertIndex++;
		}

		_.each(this._sortedData, c => { c.selected = false; });

		this.tempNames = [];
		const newItems = [];
		for (let i = 0; i < amount; i++) {
			const newName = await this._objectNameChecker.getAvailableName(null);
			this.tempNames.push(newName);
			newItems.push({
				name: newName,
				checked: true,
				selected: true
			});
		}
		runInAction(() => this._sortedData.splice(insertIndex, 0, ...newItems));
		this.updateChangesMap();
		this.tempNames = [];
		this.shiftRangeSelectFrom = null;
	}

	@action deleteAxisCoordinate = async (targetCoordinate: AxisCoordinate, updateChanges = true) => {
		if (targetCoordinate.readonly) {
			return;
		} else if (targetCoordinate._inputs) {
			targetCoordinate.deleted = true;
		} else {
			_.remove(this._sortedData, c => c == targetCoordinate)
		}
		updateChanges && this.updateChangesMap();
	}

	@action deleteSelectedCoordinates = async () => {
		_.each(this.selectedCoordinates, c => {
			this.deleteAxisCoordinate(c, false);
		})
		this.updateChangesMap();
	}

	@action onSelect = (targetCoordinate: AxisCoordinate, isMultiSelectEnable: boolean, isRangeSelectEnable: boolean) => {
		const isSelected = targetCoordinate.selected === true;
		const targetIndex = _.indexOf(this.sortedCoordinates, targetCoordinate);
		if (isRangeSelectEnable) {
			if (this.shiftRangeSelectFrom == null) {
				this.shiftRangeSelectFrom = targetIndex;
				_.each(this.sortedCoordinates, c => {c.selected = c === targetCoordinate});
				return;
			} else {
				const begin = Math.min(this.shiftRangeSelectFrom, targetIndex);
				const end = Math.max(this.shiftRangeSelectFrom, targetIndex);
				_.each(this.sortedCoordinates, (c, i) => {c.selected = (i >= begin && i <= end)});
			}
			return;
		}

		this.shiftRangeSelectFrom = targetIndex;
		if (!isMultiSelectEnable) {
			const hasMultiSelected = this.selectedCoordinates.length > 2;
			_.each(this.sortedCoordinates, (c, i) => { c.selected = ((i == targetIndex) ? hasMultiSelected ? true : !isSelected : false); });
		} else {
			targetCoordinate.selected = !isSelected;
		}
	}
	@action onMouseSelect = (targetCoordinate: AxisCoordinate, forceClearBeginIndex = false) => {
		const targetIndex = _.indexOf(this.sortedCoordinates, targetCoordinate);
		if (forceClearBeginIndex || this.mouseRangeSelectFrom == null ) {
			this.mouseRangeSelectFrom = targetIndex;
		} else {
			const begin = Math.min(this.mouseRangeSelectFrom, targetIndex);
			const end = Math.max(this.mouseRangeSelectFrom, targetIndex);
			_.each(this.sortedCoordinates, (c, i) => {c.selected = (i >= begin && i <= end)});
		}
	}

	@action onCheck = (targetCoordinate: AxisCoordinate) => {
		targetCoordinate.checked = targetCoordinate.checked !== true;
		this.updateChangesMap();
	}
	@action onCheckAll = () => {
		_.each(this.sortedCoordinates, c => {c.checked = true});
		this.updateChangesMap();
	}
	@action onCheckWith = () => {
		_.each(this.selectedCoordinates, c => {c.checked = true});
		this.updateChangesMap();
	}
	@action onCheckWithout = () => {
		_.each(this.selectedCoordinates, c => {c.checked = false});
		this.updateChangesMap();
	}
	@action onCheckOnly = () => {
		_.each(this.sortedCoordinates, c => {c.checked = c.selected === true});
		this.updateChangesMap();
	}
	@action onCheckExcept = () => {
		_.each(this.sortedCoordinates, c => {c.checked = c.selected !== true});
		this.updateChangesMap();
	}

	@computed get actionDisabled() { return !this.selectedCoordinates?.length}

	@computed get deleteDisabled() {
		let operableCoordinates = _.filter(this.selectedCoordinates, coordinate => coordinate.readonly !== true);
		return !(operableCoordinates.length > 0 && operableCoordinates.length !== this.sortedCoordinates.length);
	}

	@action moveCoordinatesToTop = () => {
		_.each(this.selectedCoordinates, (selectedCoordinate, i) => {
			_.remove(this._sortedData, c => c == selectedCoordinate);
			this._sortedData.splice(i, 0, selectedCoordinate);
		});
		this.updateChangesMap();
	}

	@action moveCoordinatesToBottom = () => {
		_.each(this.selectedCoordinates, (selectedCoordinate, i) => {
			_.remove(this._sortedData, c => c == selectedCoordinate);
			this._sortedData.push(selectedCoordinate);
		});
		this.updateChangesMap();
	}

	@action moveCoordinatesUp = () => {
		_.each(this.selectedCoordinates, (selectedCoordinate, i) => {
			let currentIndex = _.findIndex(this._sortedData, c => c == selectedCoordinate);
			const switchUpIndex = _.findLastIndex(
				this._sortedData,
				(c, i) => i < currentIndex && c.deleted !== true && c.selected !== true);
			if (switchUpIndex >= 0) {
				_.remove(this._sortedData, c => c == selectedCoordinate);
				this._sortedData.splice(switchUpIndex, 0, selectedCoordinate);
			}
		});
		this.updateChangesMap();
	}

	@action moveCoordinatesDown = () => {
		_.each(_.reverse(this.selectedCoordinates), (selectedCoordinate, i) => {
			let currentIndex = _.findIndex(this._sortedData, c => c == selectedCoordinate);
			const switchUpIndex = _.findIndex(
				this._sortedData,
				(c, i) => c.deleted !== true && c.selected !== true,
				currentIndex + 1
			);
			if (switchUpIndex >= 0) {
				_.remove(this._sortedData, c => c == selectedCoordinate);
				this._sortedData.splice(switchUpIndex, 0, selectedCoordinate);
			}
		});
		this.updateChangesMap();
	}

	@action sortByAlphabet = (desc: boolean = false) => {
		if (this.selectedCoordinates.length > 1) {
			let newSortedData = [];
			let sortedSelection = _.sortBy(this.selectedCoordinates, 'name');
			desc && _.reverse(sortedSelection);
			_.forEach(this._sortedData, c => {
				if (sortedSelection && _.includes(sortedSelection, c)) {
					newSortedData = newSortedData.concat(sortedSelection);
					sortedSelection = null;
				} else if (!_.includes(newSortedData, c)) {
					newSortedData.push(c);
				}
			})
			this._sortedData = newSortedData;
		} else {
			this._sortedData = _.sortBy(this._sortedData, 'name');
			desc && _.reverse(this._sortedData);
		}
		this.updateChangesMap();
	}

	@action updateAxisCoordinateOrder = async (from: number, to: number) => {
		const fromItem = this.sortedCoordinates[from];
		to = to < this.sortedCoordinates.length ?
		     _.findIndex(this._sortedData, c => c == this.sortedCoordinates[to]) :
		     this._sortedData.length;
		_.remove(this._sortedData, c => c == fromItem);
		this._sortedData.splice(to, 0, fromItem);
		this.updateChangesMap();
	}

	getAxisCoordinateText = (i= 0) => {
		if (i < 1) {
			return i18n.intl.formatMessage({defaultMessage: "Axis Coordinate(s)", description: "[FlexibleAxesEditor] Axis Coordinate text"});
		} else if (i == 1){
			return i18n.intl.formatMessage({defaultMessage: "1 Axis Coordinate", description: "[FlexibleAxesEditor] Axis Coordinate text"});
		} else {
			return i18n.intl.formatMessage({defaultMessage: "{i} Axis Coordinates", description: "[FlexibleAxesEditor] Axis Coordinate text"}, {i})
		}
	}

	@action onCopy = ()=> {
		const selectedCoordinates = this.selectedCoordinates;
		const copyArray = _.map(selectedCoordinates, c => c.name );
		this.props.axesEditor.copiedCoordinates = copyArray;
		navigator.clipboard.writeText(copyArray.join('\n'));
		const copyLength = selectedCoordinates.length;
		if (copyLength > 0)
			site.toaster.show({
				intent: bp.Intent.SUCCESS,
				message: i18n.intl.formatMessage(
					{defaultMessage: "{ac} Copied.", description: "[FlexibleAxesEditor] message after copied"},
					{ac: this.getAxisCoordinateText(copyLength)}
				)
			});
	}

	@action onPaste = async(append = true) => {
		let copiedCoordinates, fromClipboard = await navigator.clipboard.readText();
		if (fromClipboard) {
			copiedCoordinates = fromClipboard
				.replace(/\r\n?|\n/g,',')
				.split(',')
				.filter(v => v);
			this.props.axesEditor.copiedCoordinates = copiedCoordinates;
		} else {
			copiedCoordinates = this.props.axesEditor.copiedCoordinates;
		}

		this.tempNames = [];
		if (append) {
			const appendLength = copiedCoordinates?.length;
			for (let i = 0; i < appendLength; i++) {
				let newName = copiedCoordinates[i];
				newName = await this._objectNameChecker.getAvailableName(null, newName);
				this.tempNames.push(newName);
				this._sortedData.push({
					name:     newName,
					checked:  true,
					selected: true,
					readonly: false
				});
			}
			if (appendLength > 0)
				site.toaster.show({
					intent: bp.Intent.SUCCESS,
					message: i18n.intl.formatMessage(
						{defaultMessage: "{ac} Appended.", description: "[FlexibleAxesEditor] message after Appended"},
						{ac: this.getAxisCoordinateText(appendLength)}
					)
				});
		} else {
			const selectedCoordinates = this.selectedCoordinates;
			const applyLength = Math.min(selectedCoordinates.length, (copiedCoordinates?.length || 0))
			const editCoordinates = selectedCoordinates.slice(0, applyLength);
			_.forEach(editCoordinates, (c,i) => c.name = `dummy_${c.name}` );
			this.updateChangesMap();
			for (let i = 0; i < editCoordinates.length; i++) {
				let newName = await this._objectNameChecker.getAvailableName(null, copiedCoordinates[i]);
				this.tempNames.push(newName);
				editCoordinates[i].name = newName;
			}
			if (applyLength > 0)
				site.toaster.show({
					intent: bp.Intent.SUCCESS,
					message: i18n.intl.formatMessage(
						{defaultMessage: "{ac} Pasted.", description: "[FlexibleAxesEditor] message after pasted"},
						{ac: this.getAxisCoordinateText(applyLength)}
					)
				});
		}
		this.tempNames = [];
		this.updateChangesMap();
	}

	set filterText(s) {
		runInAction(() => {
			if (_.isEmpty(s)) {
				this._filterText = "";
				this.filterInput && (this.filterInput.value = "");
			} else {
				this._filterText = s
					.replace(/\s/g, '\s')
					.replace(/\\/g, '\\\\')
					.replace(/\//g, '\\/')
					.replace(/\./g, '\\.')
					.replace(/\*/g, '\\*')
					.replace(/\+/g, '\\+')
					.replace(/\?/g, '\\?')
					.replace(/\[/g, '\\[');
			}
		})
	}

	@computed get filterText() {
		return this._filterText;
	}

	render() {

		const {actionDisabled} = this;

		return <div className={css.list}
		            onMouseEnter={action((e) => {
			            this.isMouseSelecting = (e.buttons == 1);
						if (!this.isMouseSelecting) {
							this.mouseRangeSelectFrom = null;
						}
		            })}
		            onMouseDown={action((e) => {
						if (e.buttons == 1 && !$(e.target).parents(`.${css.itemDragHandle}`).length) {
							this.isMouseSelecting = true;
						}
		            })}
		            onMouseUp={action((e) => {
			            this.isMouseSelecting = false;
			            this.mouseRangeSelectFrom = null;
		            })}
		>
			<div className={css.coordinateList}>
				<bp.InputGroup
					inputRef={ r => this.filterInput = r}
					leftIcon={"search"}
	                className={css.coordinateFilter}
	                onChange={action((e) => (this.filterText = $(e.target).val()))}
	                rightElement={this.filterText ? <bp.Button icon={"cross"} onClick={() => this.filterText = ""} minimal /> : null}
				/>
				<SortableAxisCoordinateList
					onSortEnd={async (status, e) => {
						await this.updateAxisCoordinateOrder(status.oldIndex, status.newIndex);
					}}
					useDragHandle
				>
					{this.sortedCoordinates.map((data, i) => <SortableAxisCoordinateItem
						key={`SortableFlexibleAxesEditorItem${i}`}
						index={i} //for SortableItem
						axisCoordinate={data}
						flexibleAxesEditorList={this}
					/> )}
				</SortableAxisCoordinateList>
			</div>
			<div className={css.actions}>
				<bp.ButtonGroup vertical={true}>
					<bp.Tooltip
						content={i18n.intl.formatMessage({defaultMessage: "Insert an Axis Coordinate", description: "[FlexibleAxesEditor] insert a coordinate to the axis button tooltip"})}
						position={bp.Position.LEFT}
					>
						<bp.Button icon={FlexibleAxisEditor.ICONS.ADD} onClick={() => this.insertAxisCoordinates()} />
					</bp.Tooltip>
					<DeleteBtn editor={this} />
				</bp.ButtonGroup>
				{!this.props.editDisabled && <>
					<bp.Divider/>
					<bp.ButtonGroup vertical={true}>
						<bp.Button icon={"sort-alphabetical"} onClick={() => this.sortByAlphabet()}/>
						<bp.Button icon={"sort-alphabetical-desc"} onClick={() => this.sortByAlphabet(true)}/>
					</bp.ButtonGroup>
				</>}
				<bp.Divider />
				<bp.ButtonGroup vertical={true}>
					<bp.Button icon={"circle-arrow-up"}   disabled={actionDisabled} onClick={this.moveCoordinatesToTop} />
					<bp.Button icon={"arrow-up"}          disabled={actionDisabled} onClick={this.moveCoordinatesUp} />
					<bp.Button icon={"arrow-down"}        disabled={actionDisabled} onClick={this.moveCoordinatesDown} />
					<bp.Button icon={"circle-arrow-down"} disabled={actionDisabled} onClick={this.moveCoordinatesToBottom} />
				</bp.ButtonGroup>
			</div>
			{this.renderHotkeys()}
		</div>
	}

	renderContextMenu(e) {
		return <bp.Menu>
			<bp.MenuItem
				text={i18n.intl.formatMessage({
					defaultMessage: "Insert {ac} At End",
					description: "[FlexibleAxesEditor] insert axis coordinate to the axis"
				}, {ac: this.getAxisCoordinateText(1)})}
				icon={FlexibleAxisEditor.ICONS.INSERT_AFTER}
				onClick={() => this.insertAxisCoordinates()}
			/>
			<bp.MenuItem
				text={i18n.intl.formatMessage({
					defaultMessage: "Insert {ac} At End",
					description: "[FlexibleAxesEditor] insert axis coordinate to the axis"
				}, {ac: this.getAxisCoordinateText()})}
				icon={FlexibleAxisEditor.ICONS.INSERT_AFTER}
			>
				{this.insertMenuItems.map((count) => <bp.MenuItem key={`menuItem_${count}`} text={count} onClick={() => this.insertAxisCoordinates(null, false, count)}/>)}
			</bp.MenuItem>
			<bp.MenuDivider />
			<bp.MenuItem
				text={i18n.intl.formatMessage({
					defaultMessage: "Append Items from Clipboard",
					description: "[FlexibleAxesEditor] paste items from clipboard"
				})}
				icon={FlexibleAxisEditor.ICONS.PASTE}
				onClick={() => this.onPaste(true)}
			/>
		</bp.Menu>
	}

	renderHotkeys(target = <React.Fragment />) {
		const hotkeys: bp.HotkeyConfig[] = [
			{
				global: true,
				combo: "mod + c",
				group: "Selection",
				label: "Copy Axis Names",
				preventDefault: true,
				onKeyDown: (e: KeyboardEvent) => this.onCopy()
			},
			{
				global: true,
				combo: "mod + v",
				group: "Selection",
				label: "Paste Axis Names",
				preventDefault: true,
				onKeyDown: (e: KeyboardEvent) => this.onPaste(this.actionDisabled)
			}
		]

		return <bp.HotkeysTarget2 hotkeys={hotkeys}>{({ handleKeyDown, handleKeyUp }) => target}</bp.HotkeysTarget2>;
	}
}

@observer class DeleteBtn extends React.Component<{editor: FlexibleAxisEditor}, any> {
	@observable toolTipIsOpen = false;

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	render() {
		const {actionDisabled, deleteDisabled, deleteSelectedCoordinates} = this.props.editor;

		return <bp.Tooltip
			position={bp.Position.LEFT}
			content={!actionDisabled && deleteDisabled ?
			         i18n.intl.formatMessage({defaultMessage: "Deleting all axis values is not allowed", description: "[FlexibleAxesEditor] delete coordinate(s) button tooltip"}) :
			         i18n.intl.formatMessage({defaultMessage: "Delete Selected Axis Coordinate(s)", description: "[FlexibleAxesEditor] delete coordinate(s) button tooltip"})
			}
			isOpen={this.toolTipIsOpen}
		>
			<bp.Button
				icon={FlexibleAxisEditor.ICONS.REMOVE}
				disabled={deleteDisabled}
				onClick={deleteSelectedCoordinates}
				onMouseOver={action(() => { this.toolTipIsOpen = true; })}
				onMouseOut={action(() => { this.toolTipIsOpen = false; })}
			/>

		</bp.Tooltip>;
	}
}

interface FlexibleAxesEditorDialogProps{
	rsSimulation: RSSimulation;
	isSingleAxis?: boolean;
	defaultSelectedAxis?: string;
	onOK?: (changes: {[axisName: string]: FlexibleAxisChanges}) => void;

	icon?: bp.IconName | bp.MaybeElement;
	title?: string | bp.MaybeElement;
}

@observer export class FlexibleAxesEditorDialog extends React.Component<FlexibleAxesEditorDialogProps, any> {
	static ICON: bp.MaybeElement = <bp.Icon icon={"property"} />
	static TITLE = i18n.intl.formatMessage({defaultMessage: "Flexible Axes Editor", description: "[FlexibleAxesEditor] dialog title"});

	@observable message: string;
	@observable axes: FlexibleAxis[];
	@observable copiedCoordinates: string[];
	changes: {[axisName: string]: FlexibleAxisChanges};

	@observable activeAxisCoordinateNameEditor: AxisCoordinateNameEditor;

	constructor(props) {
		super(props);
		makeObservable(this);

		const {rsSimulation, defaultSelectedAxis} = this.props;

		this.message = i18n.intl.formatMessage({defaultMessage: "Loading Axes Information...", description: "[FlexibleAxesEditor] message when waiting axes information loading"});
		rsSimulation.getFlexibleAxes(this.isSingleAxis ? defaultSelectedAxis : null).then(action(resp => {
			this.changes = {};
			this.axes = resp;
		})).finally(action(()=>{
			this.message = null;
		}));
	}

	get isSingleAxis() {
		const {isSingleAxis, defaultSelectedAxis} = this.props;
		return isSingleAxis === true && !!defaultSelectedAxis;
	}

	@computed get isLoading() {
		return this.axes == null;
	}

	@computed get actionDisabled() {
		return this.message != null;
	}

	@computed get defaultSelectedAxis() {
		return this.isLoading ? null : _.find(this.axes, axis => (axis.axis == this.props.defaultSelectedAxis))?.axis;
	}

	@action onOk = async () => {
		if(!_.some(Object.values(this.changes), v => !!v)) {
			return 'noUpdates';
		}
		this.message = i18n.common.MESSAGE.SAVING;
		await this.props.rsSimulation.saveFlexibleAxes(this.changes).finally(action(()=>{
			this.message = null;
		}));

		const onOk = this.props.onOK;
		!!onOk && onOk(this.changes);

		return 'ok';
	}

	render() {
		const {isLoading, isSingleAxis, axes, defaultSelectedAxis, actionDisabled, message} = this;
		const {icon, title} = this.props;

		return <BlueprintDialog
			className={classNames(dialogCss.newObjectDialog, css.dialog)}
			icon={icon || FlexibleAxesEditorDialog.ICON}
			title={title || FlexibleAxesEditorDialog.TITLE}
			message={message}
			isCloseButtonShown={!actionDisabled}
			canCancel={!actionDisabled}
			okDisabled={isLoading || actionDisabled || !!this.activeAxisCoordinateNameEditor}
			canEscapeKeyClose={!actionDisabled}
			canOutsideClickClose={!actionDisabled}
			ok={this.onOk}

		>{
			isLoading ?
			<div style={{height: 150}}><LoadingIndicator /></div> :
			isSingleAxis ?
			<div className={classNames(css.root, css.singleAxis)}>
				<div className={css.tabPanel}>
					<FlexibleAxisEditor axis={_.find(this.axes, axis=> axis.axis == defaultSelectedAxis)} axesEditor={this} editDisabled={true} />
				</div>
			</div>:
			<bp.Card className={css.root}>
				{this.message == i18n.common.MESSAGE.SAVING && <LoadingIndicator text={"Saving Flexible Axes Changes..."} />}
				<bp.Tabs
					vertical={true}
					renderActiveTabPanelOnly={true}
					defaultSelectedTabId={defaultSelectedAxis}
					onChange={action(() => {
						this.activeAxisCoordinateNameEditor = null;
					})}
				>{
					_.map(this.axes, (axis) => <bp.Tab
							key={axis.axis}
							id={axis.axis}
							title={axis.axis.replace(/_/g, " ").trim()}
							panelClassName={css.tabPanel}
							panel={<FlexibleAxisEditor axis={axis} axesEditor={this} editDisabled={false} />}
						/>
					)}</bp.Tabs>
			</bp.Card>
		}</BlueprintDialog>;
	}

	getCoordinateNames(axis: FlexibleAxis) {
		const axisChanges = _.get(this.changes, axis.axis);
		let names = _.map(axis.coordinates, c => c.coordinate);
		if (axisChanges) {
			_.forEach(axisChanges.delete, name => _.remove(names, n => n == name));
			_.forEach(axisChanges.rename, (newName, oldName) => {
				_.remove(names, name => name == oldName);
				names.push(newName);
			});
			_.forEach(axisChanges.add, name => names.push(name));
		}
		return names;
	}
}

interface NameEditorProps {
	axisCoordinate: AxisCoordinate;
	flexibleAxesEditorList: FlexibleAxisEditor;
}

@observer
class AxisCoordinateNameEditor extends React.Component<NameEditorProps, {}> {
	checker: ObjectNameChecker;
	result: ObjectNameCheckerResult;
	@observable isEditing: boolean;

	constructor(props: NameEditorProps) {
		super(props);
		makeObservable(this);

		const config = this.props.flexibleAxesEditorList._objectNameChecker.config;
		const customizeCompareList = () => _.filter(config.customizeCompareList(), name => name != this.value);
		this.checker = new ObjectNameChecker(_.assign({}, config, {customizeCompareList}));
	}

	@computed get value() {
		return _.toString(this.props.axisCoordinate.name);
	}

	switchToEditor = action(() => {
		this.isEditing = true;
		this.props.flexibleAxesEditorList.props.axesEditor.activeAxisCoordinateNameEditor = this;
	});

	switchToDisplay = action( () => {
		this.isEditing = false;
		this.props.flexibleAxesEditorList.props.axesEditor.activeAxisCoordinateNameEditor = null;
	});

	onUpdateResult = (result: ObjectNameCheckerResult, input: NameInputField) => {
		this.result = result;
	}

	@action onUpdateValue = (e) => {
		const result = this.result;
		if (!result || result.isDuplicated) {
			e.target.focus();
			return;
		}

		if (result.input == this.value) {
			this.switchToDisplay();
			return;
		}

		this.props.axisCoordinate.name = result.input;
		this.props.flexibleAxesEditorList.updateChangesMap();
		this.switchToDisplay();
	};

	render(){
		const {value, isEditing} = this;

		if (!isEditing) {
			const filterText = this.props.flexibleAxesEditorList.filterText;
			const readonly = this.props.axisCoordinate.readonly;
			return <span className={nameEditCss.editableText}>
				<span className={nameEditCss.editableTextDisplay} onDoubleClick={() => this.isEditing = true} title={value} ><Highlighter searchWords={[filterText]} textToHighlight={value}/></span>
				{!readonly && <bp.Tooltip className={nameEditCss.editableTextRenameBtn} position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.RENAME}>
					<bp.Button icon='edit' onClick={this.switchToEditor} tabIndex={-1}/>
				</bp.Tooltip>}
			</span>
		}

		return <NameInputField
			className={css.nameInputField}
			objectType={null}
			value={this.value}
			objectNameChecker={this.checker}
			autoFocus={true}

			onUpdateResult={this.onUpdateResult}
			onBlur={this.onUpdateValue}
			helpText={this.props.flexibleAxesEditorList.getHelpText}
			ref={(ref) => {
				ref?.inputRef && $(ref.inputRef).keydown((e) => {
					if (e.keyCode == KeyCode.Enter || e.keyCode == KeyCode.Tab) {
						this.checker.isDuplicated(null, $(e.target).val()).then(result => {
							this.result = result;
							this.onUpdateValue(e);
						})
					} else if (e.keyCode == KeyCode.Escape) { //if ESC call. switch input.
						this.switchToDisplay();
					}
				});
			}}
		/>
	}
}



