import {bp, LoadingIndicator} from 'components';
import {BatchExportCustomizeDialog} from 'components/system/rsSimulation/internal/progress/BatchExportCustomizeDialog';
import {BatchExportCustomizeDialog as RnBatchExportCustomizeDialog } from 'components/system/rsSimulation/rnRecalibration/progress/BatchExportCustomizeDialog';
import {BatchExportProgressDialog} from 'components/system/BatchExport/BatchExportProgressDialog';
import {FlexibleAxesEditorDialog} from 'components/system/rsSimulation/rwRecalibration/FlexibleAxesEditor';
import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import {action, autorun, flowResult, observable, makeObservable, runInAction} from 'mobx';
import {Observer, observer } from 'mobx-react';
import {AnchorButton, Tree, ContextMenu, Menu, MenuItem, TreeNodeInfo} from '@blueprintjs/core';
import * as React from 'react';

import {FlexibleAxis, RSSimulation, i18n, ObjectNameChecker, ObjectNameCheckerResult, Simulation, site} from 'stores';
import {reactionToPromise} from 'utility';
import { StepNavigationItem} from './StepNavigator';

import * as css from "./NavigationTree.css";

interface NavigationTreeComponentProps {
	rsSimulation: RSSimulation;
	showOnlyActiveNodeSubtree?: boolean;
	className?: string;
}

@observer
export class NavigationTree extends React.Component<NavigationTreeComponentProps, {}> {
	@observable.ref treeNodes: BlueprintsTreeNode[] = [];
	_dispose = null;
	_lastExpandedStatus = {};
	_isFirstRender = true;

	@observable private _editing: boolean = false;
	set editing(editing:boolean) { runInAction(() => this._editing = editing)}

	constructor(props) {
        super(props);
        makeObservable(this);

        this._dispose = autorun(() => {
			const { rsSimulation, showOnlyActiveNodeSubtree } = this.props;
			const { stepItems } = props.rsSimulation.stepNavigationController;
			let newTreeNodes;
			if (showOnlyActiveNodeSubtree) {
				const activeItem = _.get(rsSimulation, ['stepNavigationController', 'activeItem']);
				if (activeItem) {
					newTreeNodes = this.transformStepItemsToTreeDataFormat(activeItem.items);
				}
			} else {
				newTreeNodes = this.transformStepItemsToTreeDataFormat(stepItems);
			}

			if (this._isFirstRender) {
				this.initializeTreeNodeExpandedStatus(newTreeNodes);
				this._isFirstRender = false;
			}

			const { tree } = rsSimulation.recalibration;
			const targetNode = newTreeNodes.find((node) => node.name === 'targets');
			if (targetNode && tree) {
				if (this.isTargetActive()) {
					targetNode.childNodes = tree.childNodes;
				} else {
					const noSelectStatusTree = _.cloneDeep(tree.childNodes);
					this.clearAllTreeNodesSelectStatus(noSelectStatusTree);
					targetNode.childNodes = noSelectStatusTree;
				}
			}

			this.setTreeNode(newTreeNodes);

		}, {
			delay: 300
		});
    }

	setTreeNode = _.debounce(action((newTreeNodes: BlueprintsTreeNode[]) => this.treeNodes = newTreeNodes ));

	renewTreeNode = (node: BlueprintsTreeNode): BlueprintsTreeNode => {
		if (!node.isFlexibleAxisNode && !node.parentTreeNode?.isFlexibleAxisNode) {
			return node;
		}
		let newNode: BlueprintsTreeNode;
		_.forEach(node.nodeData.itemPath, name => {
			newNode = _.find(newNode ? newNode.childNodes : this.treeNodes, n => n.name == name);
		});
		return newNode;
	}

	getActivateKey = (level) => {
		return this.props.rsSimulation.stepNavigationController.activeItem?.itemPath[level];
	}

	isTargetActive = () => {
		return this.getActivateKey(0) === 'targets';
	}

	handleNodeSelect = async (node: BlueprintsTreeNode, nodePath?: number[], e?: React.MouseEvent<HTMLElement>) => {
		if (this.isRecalibrationNode(node)) {
			const isMultiSelect = e ? e.ctrlKey || e.metaKey : false;
			await this.props.rsSimulation.recalibration.selectTreeNode(node as any, isMultiSelect);
			const stepItem = this.findStepItemByRecalibrationNode(node);
			if (stepItem) {
				this.props.rsSimulation.stepNavigationController.setActiveByItem(stepItem);
			}
		} else {
			this.props.rsSimulation.stepNavigationController.setActiveByItem(node.nodeData);
		}
	}

	jumpToNode = async (node: BlueprintsTreeNode) => {
		const rsSimulation = this.props.rsSimulation;
		!rsSimulation.isLoaded && await reactionToPromise(() => rsSimulation.isLoaded, true);
		//!rsSimulation.recalibration.isLoaded && await reactionToPromise(() => rsSimulation.recalibration.isLoaded, true);
		await this.handleNodeSelect(this.renewTreeNode(node));
	}

	findStepItemByRecalibrationNode = (recalibrationTreeNode): StepNavigationItem => {
		const { stepItems } = this.props.rsSimulation.stepNavigationController;
		let targetStepItem = stepItems.find((node) => node.name === 'targets');
		const treeNodes = [recalibrationTreeNode];
		let parentNode = recalibrationTreeNode.parentNode;
		while(parentNode) {
			treeNodes.unshift(parentNode);
			parentNode = parentNode.parentNode;
		}

		treeNodes.forEach((node) => {
			const { items } = targetStepItem;
			targetStepItem = items.find((item) => item.name === node.id);
		});

		return targetStepItem;
	}

	toggleNodeExpanded = (node: BlueprintsTreeNode) => {
		const newExpandedStatus = !node.isExpanded;
		if (this.isRecalibrationNode(node)) {
			this.props.rsSimulation.recalibration.expandTreeNode(node, newExpandedStatus);
			return;
		}

		node.isExpanded = newExpandedStatus;
		this._lastExpandedStatus[node.id] = newExpandedStatus;
		this.setTreeNode(this.treeNodes.slice());
	}

	toggleNodeChildNodesExpanded = (node: BlueprintsTreeNode, expandedStatus) => {
		if (this.isRecalibrationNode(node)) {
			return;
		}

		node = this.renewTreeNode(node);
		node.childNodes?.forEach(childNode => {
			if (childNode.isExpanded != expandedStatus) {
				childNode.isExpanded = expandedStatus;
				this._lastExpandedStatus[childNode.id] = expandedStatus;
			}
		});
		this.setTreeNode(this.treeNodes.slice());
	}

	initializeTreeNodeExpandedStatus = (nodes: BlueprintsTreeNode[]) => {
		nodes.forEach((node) => {
			if (node.isExpanded) {
				this._lastExpandedStatus[node.id] = true;
			}

			if (node.childNodes) {
				this.initializeTreeNodeExpandedStatus(node.childNodes);
			}
		});
	}

	clearAllTreeNodesSelectStatus = (nodes: BlueprintsTreeNode[]) => {
		nodes.forEach((node) => {
			node.isSelected = false;
			if (node.childNodes) {
				this.clearAllTreeNodesSelectStatus(node.childNodes);
			}
		});
	}

	transformStepItemsToTreeDataFormat = (stepItems: StepNavigationItem[], parentTreeNode: BlueprintsTreeNode = null): BlueprintsTreeNode[] => {
		const applicableStepItems = _.filter(stepItems, (stepItem) => stepItem.applicable && stepItem.navigatorOnly !== true);

		return _.map(applicableStepItems, (stepItem) => {
			const level = stepItem.level;
			const id = `${level}-${stepItem.name}`;
			const isSelected = parentTreeNode?.isSelected !== false && this.getActivateKey(level) === stepItem.name;

			const node = new BlueprintsTreeNode(
				this.props.rsSimulation,
				{
					id,
					isSelected,
					isExpanded: _.isUndefined(this._lastExpandedStatus[id]) ? isSelected : this._lastExpandedStatus[id],
					nodeData: stepItem
				},
				parentTreeNode,
				this
			);

			if (stepItem.items?.length) {
				node.childNodes = this.transformStepItemsToTreeDataFormat(stepItem.items, node);
			}

			return node;
		});
	}

	isRecalibrationNode = (node) => {
		return Reflect.has(node, 'coordinate');
	}

	openContextMenu = (node: BlueprintsTreeNode, nodePath?: number[], e?: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		// invoke static API, getting coordinates from mouse event

		if (!this.isTargetActive) {
			return;
		}

		const contextMenuOffset = {left: e.clientX, top: e.clientY};
		let nextNode            = this.treeNodes[nodePath[0]];
		let nodePathNames       = [nextNode.name];
		while (nodePathNames.length < nodePath.length) {
			nextNode =  nextNode.childNodes[nodePath[nodePathNames.length]];
			nodePathNames.push(nextNode.name);
		}

		if (this.isRecalibrationNode(node)) {
			ContextMenu.show(
				<Menu>
					<MenuItem icon="join-table" text={i18n.intl.formatMessage({defaultMessage: "Combine tables", description: "[recalibration][ModelTree] menu tree contextmenu for operate axis organization"})}
					          onClick={this.getChangeAxisCategoryCallback('combine')}/>
					<MenuItem icon="th-disconnect" text={i18n.intl.formatMessage({defaultMessage: "Split tables", description: "[recalibration][ModelTree] menu tree contextmenu for operate axis organization"})}
					          onClick={this.getChangeAxisCategoryCallback('split')}/>
					<MenuItem icon="th" text={i18n.intl.formatMessage({defaultMessage: "Restore default setting", description: "[recalibration][ModelTree] menu tree contextmenu for operate axis organization"})}
					          onClick={this.getChangeAxisCategoryCallback('default')}/>
				</Menu>,
				contextMenuOffset
			);
		} else if (nodePathNames[0] === 'calibrationInputs' && this.props.rsSimulation.rnRecalibration.isLoaded) {
			const { rsSimulation } = this.props;
			const { rnRecalibration } = rsSimulation;
			
			ContextMenu.show(
				<Menu>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Batch Export", description: "[NavigationTree] export FIRM parameters"})}
						icon="cloud-download"
					>
						<bp.MenuItem
							text={i18n.intl.formatMessage({defaultMessage: "New Local File", description: "[NavigationTree] export FIRM parameters to a new file and download"})}
							onClick={async () => {
								const id = await flowResult(rnRecalibration.batchExportByPath(nodePathNames));
								site.setDialogFn(() => <BatchExportProgressDialog object={rnRecalibration} fileID={id} isUserFile={false} download={rnRecalibration.downloadBatchExportFile} />)
							}}/>
						<bp.MenuItem
							text={i18n.intl.formatMessage({defaultMessage: "Append to Recent File", description: "[NavigationTree] export FIRM parameters to a existing file and download"})}
							onClick={async () => {
								const id = await flowResult(rnRecalibration.appendToRecentFile(nodePathNames));
								site.setDialogFn(() => <BatchExportProgressDialog object={rnRecalibration} fileID={id} isUserFile={!!rnRecalibration.recentBatchExportUserFile} isLocalAppend={!!rnRecalibration.batchExportRecentFileHandle} download={rnRecalibration.downloadBatchExportFile} appendToLocalFile={rnRecalibration.downloadAndAppendToExportFile}/>)
							}}/>
						<bp.MenuItem
							text={i18n.intl.formatMessage({defaultMessage: "Special...", description: "[NavigationTree] export customize FIRM parameters data"})}
								onClick={() => {
								site.setDialogFn(() => <RnBatchExportCustomizeDialog rsSimulation={rsSimulation} path={nodePathNames} />)
							}}/>
					</bp.MenuItem>
				</Menu>,
				contextMenuOffset
			);
		} else if (nodePathNames[0] == "allParameters") {

			let extraMenuItems = null;
			let {rsSimulation} = this.props;

			if (node.isFlexibleAxisNode) {
				extraMenuItems = <bp.MenuItem text={FlexibleAxesEditorDialog.TITLE} icon={FlexibleAxesEditorDialog.ICON}
					             onClick={() => site.setDialogFn(() => <FlexibleAxesEditorDialog rsSimulation={this.props.rsSimulation} defaultSelectedAxis={node.flexibleAxis}/>)}/>
			} else if (node.parentTreeNode?.isFlexibleAxisNode) {
				if (!node.isSelected) {
					this.handleNodeSelect(node);
				}
				const siblingNodes  = node.parentTreeNode.childNodes;
				const childrenIndex = _.indexOf(siblingNodes, node);
				const prevNode      = childrenIndex > 0 ? siblingNodes[childrenIndex - 1] : null;
				const nextNode      = childrenIndex < siblingNodes.length - 1 ? siblingNodes[childrenIndex + 1] : null;
				extraMenuItems = <>
				<bp.MenuItem text={FlexibleAxesEditorDialog.TITLE} icon={FlexibleAxesEditorDialog.ICON}
						             onClick={() => site.setDialogFn(() => <FlexibleAxesEditorDialog rsSimulation={this.props.rsSimulation}
						                                                                                  defaultSelectedAxis={node.parentTreeNode.flexibleAxis}/>)}/>
					<bp.MenuDivider/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Jump Up", description: "[NavigationTree] move axis coordinate at tree node contextmenu"})}
						icon={"blank"} disabled={!prevNode} onClick={prevNode ? () => this.jumpToNode(prevNode) : null}/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Jump Down", description: "[NavigationTree] move axis coordinate at tree node contextmenu"})}
						icon={"blank"} disabled={!nextNode} onClick={nextNode ? () => this.jumpToNode(nextNode) : null}/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Open Similar", description: "[NavigationTree] expose all coordinates with same axis at tree node contextmenu"})}
						icon={"blank"} onClick={() => this.toggleNodeChildNodesExpanded(node.parentTreeNode, true)}/>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Close Similar", description: "[NavigationTree] collapse all coordinates with same axis at tree node contextmenu"})}
						icon={"blank"} onClick={() => this.toggleNodeChildNodesExpanded(node.parentTreeNode, false)}/>
					<bp.MenuDivider/>
					<bp.MenuItem text={i18n.common.OBJECT_CTRL.RENAME} icon={"blank"} onClick={action(() => this.renewTreeNode(node).isEditing = true)}/>
					<bp.MenuItem text={i18n.common.OBJECT_CTRL.DELETE} icon={"blank"} onClick={() => {
						rsSimulation.stepNavigationController.setActiveByItem(node.nodeData.parentItem);
						let itemIndex = node.parentTreeNode.childNodes.indexOf(node);
						_.remove(node.parentTreeNode.childNodes, node);
						if (node.parentTreeNode.childNodes.length <= itemIndex) {
							itemIndex--;
						}
						rsSimulation.stepNavigationController.setActiveByItem(node.parentTreeNode.nodeData);
						this.editing = true;
						rsSimulation.updateExistFlexibleAxisCoordinate(
							node.parentTreeNode.flexibleAxis,
							[{coordinate: node.nodeData.title, deleted: true}]
						).then(() =>{
							rsSimulation.stepNavigationController.setActiveByItem(node.parentTreeNode.childNodes[itemIndex].nodeData);
						}).finally(() => this.editing = false );
					}}/>
					<bp.MenuItem text={i18n.intl.formatMessage({defaultMessage: "Deactivate", description: "[NavigationTree] Deactivate axis coordinate at tree node contextmenu"})} icon={"blank"} onClick={() => {
						rsSimulation.stepNavigationController.setActiveByItem(node.nodeData.parentItem);
						let itemIndex = node.parentTreeNode.childNodes.indexOf(node);
						_.remove(node.parentTreeNode.childNodes, node);
						if (node.parentTreeNode.childNodes.length <= itemIndex) {
							itemIndex--;
						}
						rsSimulation.stepNavigationController.setActiveByItem(node.parentTreeNode.nodeData);
						this.editing = true;
						rsSimulation.updateExistFlexibleAxisCoordinate(
							node.parentTreeNode.flexibleAxis,
							[{coordinate: node.nodeData.title, active: false}]
						).then(() => {
							rsSimulation.stepNavigationController.setActiveByItem(node.parentTreeNode.childNodes[itemIndex].nodeData);
						}).finally(() => this.editing = false );
					}}/>
				</>
			}

			ContextMenu.show(
				<Menu>
					<bp.MenuItem
						text={i18n.intl.formatMessage({defaultMessage: "Batch Export", description: "[NavigationTree] export FIRM parameters"})}
						icon="cloud-download"
					>
						<bp.MenuItem
							text={i18n.intl.formatMessage({defaultMessage: "New Local File", description: "[NavigationTree] export FIRM parameters to a new file and download"})}
							onClick={async () => {
								const id = await rsSimulation.batchExport(nodePathNames);
								site.setDialogFn(() => <BatchExportProgressDialog object={rsSimulation} fileID={id} isUserFile={false} download={rsSimulation.downloadBatchExportFile} />)
							}}/>
						<bp.MenuItem
							text={i18n.intl.formatMessage({defaultMessage: "Append to Recent File", description: "[NavigationTree] export FIRM parameters to a existing file and download"})}
							onClick={async () => {
								const id = await rsSimulation.appendToRecentFile(nodePathNames);
								site.setDialogFn(() => <BatchExportProgressDialog object={rsSimulation} fileID={id} isUserFile={!!rsSimulation.recentBatchExportUserFile} isLocalAppend={!!rsSimulation.batchExportRecentFileHandle} download={rsSimulation.downloadBatchExportFile} appendToLocalFile={rsSimulation.downloadAndAppendToExportFile}/>)
							}}/>
						<bp.MenuItem
							text={i18n.intl.formatMessage({defaultMessage: "Special...", description: "[NavigationTree] export customize FIRM parameters data"})}
								onClick={() => {
								site.setDialogFn(() => <BatchExportCustomizeDialog rsSimulation={rsSimulation} exportSettings={{path: nodePathNames}} />)
							}}/>
					</bp.MenuItem>
					{extraMenuItems}
				</Menu>,
				contextMenuOffset
			);
		}
	}

	getChangeAxisCategoryCallback = (mode) => {
		return async () => {
			await this.props.rsSimulation.recalibration.changeAxisCategoryByTreeNode(mode);
		}
	}

	componentWillUnmount() {
		if (this._dispose) {
			this._dispose();
		}
	}

	render() {
		const { treeNodes } = this;
		const { showOnlyActiveNodeSubtree, className } = this.props;

		return (
			<div className={classNames(css.root, className)}>
				{this._editing && <LoadingIndicator text={"Flexible Axes Updating..."} />}
				<div className={css.content}>
					<Tree<StepNavigationItem>
						contents={treeNodes}
						onNodeClick={this.handleNodeSelect}
						onNodeExpand={this.toggleNodeExpanded}
						onNodeCollapse={this.toggleNodeExpanded}
						onNodeContextMenu={this.openContextMenu}
					/>
				</div>
			</div>
		);
	}
}

export class BlueprintsTreeNode implements TreeNodeInfo<StepNavigationItem> {

	// blueprint TreeNode attributes
	id: string;
	isSelected: boolean = false;
	isExpanded: boolean = false;
	name: string;
	label: string | JSX.Element;
	nodeData: StepNavigationItem;
	childNodes: BlueprintsTreeNode[] = null

	// GEMS attributes
	flexibleAxis: string;

	// editable title
	isEditing: boolean;
	private EditableTextRef;

	constructor(
		private rsSimulation: RSSimulation,
		private treeNodeProps: {
			id: string;
			isSelected: boolean;
			isExpanded: boolean;
			nodeData: StepNavigationItem;
		},
		public parentTreeNode: BlueprintsTreeNode,
		private navigationTreeRef: NavigationTree
	) {
		_.assign(this, treeNodeProps)

		// apply props from nodeData
		this.name = this.nodeData.name;
		this.flexibleAxis = this.nodeData.flexibleAxis;

		if (parentTreeNode?.isFlexibleAxisNode) {
			makeObservable(this, {isEditing: observable});
			this.label = <Observer>{() => <bp.EditableText
				ref={ref => this.EditableTextRef = ref}
				className={css.treeNodeEditableText}
				disabled={!this.isEditing}
				isEditing={this.isEditing}
				defaultValue={this.nodeData.title}
				onEdit={() => {
					$(this.EditableTextRef.inputElement)
						.width($(this.EditableTextRef.inputElement).parents(`.bp3-tree-node-label`).first().width())
						.val(this.nodeData.title)
						.click(e => e.stopPropagation() );
				}}
				onCancel={action(() => {
					this.isEditing = false;
				})}
				onConfirm={(value) => {
					this.rsSimulation.getFlexibleAxes(parentTreeNode.flexibleAxis).then(axes => {
						const axis = _.find(axes, axis => axis.axis == parentTreeNode.flexibleAxis)

						let coordinateList = _.map(axis.coordinates, c => c.coordinate);
						coordinateList = _.filter(coordinateList, name => name != this.nodeData.title);
						const reservedList = axis.reserved || [];

						const getHelpText = (
							checkResult: ObjectNameCheckerResult,
							applySuggestNameElementCreator: (suggestNameWithoutPath:string, suggestName:string) => React.ReactElement
						) => {
							const isCaseInsensitive = checkResult.isCaseInsensitive;
							const duplicatedName = checkResult.inputWithoutPath;

							const findIn = (nameList: string[]) => {
								const testName = isCaseInsensitive ? _.toLower(duplicatedName) : duplicatedName;
								return _.find(nameList, name => ((isCaseInsensitive ? _.toLower(name): name) == testName));
							}
							let found = findIn(coordinateList);
							if (found) {
								const suggestName = checkResult.suggestNameWithoutPath;
								const applySuggest = applySuggestNameElementCreator(suggestName, suggestName);
								return <>An object with the name "{found}" already exists. Would you like to use "{applySuggest}" instead?</>;
							}

							found = findIn(reservedList);
							if (found) {
								const suggestName = checkResult.suggestNameWithoutPath;
								const applySuggest = applySuggestNameElementCreator(suggestName, suggestName);
								return <>The name "{found}" has been reserved. Would you like to use "{applySuggest}" instead?</>;
							}
							return null;
						}

						ObjectNameCheckerDialog.saveUniqueNameOrDialog({
							model: null,
							newName: value,
							onRename: async (newName, result) => {
								this.isEditing = false;
								const oldName = this.nodeData.title;
								if( oldName == newName) {
									return;
								}
								this.navigationTreeRef.editing = true;
								let testNode = this.rsSimulation.stepNavigationController.activeItem;
								let newPath: number[] = [];
								let includeThisNode = false;
								while (testNode) {
									includeThisNode = includeThisNode || testNode == this.nodeData;
									newPath.unshift(_.indexOf(
										testNode.parentItem ? testNode.parentItem.items : this.rsSimulation.stepNavigationController.stepItems,
										testNode
									));
									testNode = testNode.parentItem;
								}

								if (includeThisNode) {
									this.rsSimulation.stepNavigationController.setActiveByItem(this.nodeData.parentItem);
								}

								this.nodeData.title = newName;
								await rsSimulation.updateExistFlexibleAxisCoordinate(
									parentTreeNode.flexibleAxis,
									[{coordinate: oldName, newName: newName}]
								).then( result => {
									if (result) {
										let target = null;
										_.forEach(newPath, (n, i) => {
											target = i == 0 ?
											         this.rsSimulation.stepNavigationController.stepItems[n] :
											         target?.items[n];
										});
										target && this.rsSimulation.stepNavigationController.setActiveByItem(target)
									}
								}).finally(() => {
									this.navigationTreeRef.editing = false;
								});
							},
							onClosed: () => {
								$(this.EditableTextRef?.valueElement).text(this.nodeData.title);
								$(this.EditableTextRef?.inputElement).focus().val(this.nodeData.title);
								this.isEditing = false;
							},
							helpText: getHelpText
						},
						{
							defaultName: axis.prototype.replace(/\s&0$/, ""),
							sequenceStartFrom: 1,
							type: 'numeric',
							caseInsensitive: axis.caseInsensitive,
							alwaysAddSequence: true,
							customizeCompareList: () => [...coordinateList, ...reservedList]
						});
					});
				}}
				confirmOnEnterKey={true}
				selectAllOnFocus={true}
			/>}</Observer>;
		} else {
			this.label = this.nodeData.title;
		}

	}

	get isFlexibleAxisNode (): boolean {
		return !!this.flexibleAxis;
	}
}
