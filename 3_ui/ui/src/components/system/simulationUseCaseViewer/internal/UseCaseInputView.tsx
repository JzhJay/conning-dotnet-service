import {bp} from 'components';
import {RNRecalibrationTool} from 'components/system/rsSimulation/rnRecalibration/RNRecalibrationTool';
import {AllParameters} from 'components/system/rsSimulation/internal/AllParameters';
import {RSSimulationInputSpecificationComponent} from 'components/system/rsSimulation/internal/RSSimulationInputSpecificationComponent';
import Splitter from 'm-react-splitters';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RSSimulation} from 'stores';
import { Book } from 'ui/src/stores/book/Book';
import {BookPage} from 'stores/book/BookPage';
import {BookView} from 'stores/book/BookView';
import type {IModelDefinition} from 'stores/rsSimulation/rwRecalibration/models';

import * as css from './UseCaseInputView.css';

@observer
export class UseCaseInputView extends React.Component<{rsSimulation: RSSimulation, view: BookView, page: BookPage, book: Book}, any> {
	@observable modelDefinitions: IModelDefinition[];
	@observable _selectedModelDefinitions: IModelDefinition;
	@observable _expandedModelDefinitions: IModelDefinition[] = [];

	constructor(props) {
		super(props);
		makeObservable(this);

		this.initModelDefinitions();
	}

	setViewOptions = _.debounce(() => {
		const {book, page, view} = this.props;
		const viewIndex = page.getViewIndex(view.id);
		book.sendPageUpdate([{index: page.pageNumber, views:[{index: viewIndex, controls:JSON.stringify(view.userOptions)}]}]);
	})

	@action initModelDefinitions() {
		const {rsSimulation, view} = this.props;
		const viewDefinition = _.find(rsSimulation.useCaseViewer.viewDefinitions.inputs, input => input.title == view.name)
		const nodeMap: {[key:string]: {filter: string[], def?:IModelDefinition}} = {};
		_.forEach(viewDefinition.nodes, node => {
			const path = _.toString(node).split("+");
			if (!nodeMap[path[0]])
				nodeMap[path[0]] = {filter:[]};

			if (path.length > 1)
				nodeMap[path[0]].filter.push(...path.slice(1));
		});

		this.modelDefinitions = _.map<string, IModelDefinition>( _.keys(nodeMap), node => {
			const {rsSimulation, view} = this.props;
			let nodePath = node.split("/");
			const firstPathNode = _.first(nodePath)
			nodePath = nodePath.slice(1);

			const locationPath = [];
			let inputOptions;
			switch (firstPathNode) {
				case 'Execution':
					inputOptions = rsSimulation.inputOptions["simulationNodes"];
					locationPath.push(inputOptions.name);
					break;
				case 'Parameters':
					inputOptions = rsSimulation.parametersUserInterface.inputOptions.allParameters;
					locationPath.push(AllParameters.FIRST_PATH_NAME);
					break;
				default:
					throw new Error(`path ${firstPathNode} not defined.`);
			}
			_.forEach(nodePath, nodeName => {
				if (!inputOptions?.options?.length) {
					return null;
				}
				inputOptions = _.find(inputOptions.options, option => option.title == nodeName);
				locationPath.push(inputOptions?.name);
			})

			if (!inputOptions) { return null; }

			const addLocationPathToChildren = (parentDef) => {
				_.forEach(_.get(parentDef, "options"), def => {
					def.locationPath = [...parentDef.locationPath, def.name];
					addLocationPathToChildren(def);
				})
			}
			inputOptions.locationPath = locationPath;
			addLocationPathToChildren(inputOptions);

			inputOptions.applicableChildrenTitles = nodeMap[node].filter;

			nodeMap[node].def = inputOptions;
			return inputOptions;

		}).filter(def => !!def);

		this._selectedModelDefinitions = this.modelDefinitions[0];

		_.forEach(_.values(nodeMap), f => {
			if (!f.filter.length || !f.def) {
				return null;
			}
			f.def.options = _.filter(f.def.options, model => _.includes(f.filter, model.title));
		})

	}

	@computed get treeContent(): bp.TreeNodeInfo<IModelDefinition>[] {
		if (this.modelDefinitions.length == 1 && this.modelDefinitions[0]["activePanel"] === 0 ) {
			return this.transformTreeInfo(this.modelDefinitions[0].options, true);
		} else {
			return this.transformTreeInfo(this.modelDefinitions, true);
		}
	}

	get canTreeRootClick() {
		return this.modelDefinitions.length == 1;
	}

	transformTreeInfo = (defs: IModelDefinition[], withStates = false): bp.TreeNodeInfo<IModelDefinition>[] => {
		if (!defs) {
			return null;
		}
		const NodeInfos = _.map<IModelDefinition,bp.TreeNodeInfo<IModelDefinition>>(defs, def => {
			let isSelected = null, isExpanded = null;
			if (withStates) {
				isSelected = def == this._selectedModelDefinitions;
				isExpanded = _.includes(this._expandedModelDefinitions, def);
			}
			return {
				id: def.name,
				label: def.title,
				childNodes: this.transformTreeInfo(def.options, withStates),
				nodeData: def,
				isSelected,
				isExpanded
			}
		}).filter(node => !!node);

		return NodeInfos.length ? NodeInfos : null;
	}

	 isParameterView(def: IModelDefinition) {
		return _.get(def, "locationPath.0", "") == AllParameters.FIRST_PATH_NAME ;
	 }

	 @computed get displayTree() {
		if (this.modelDefinitions.length > 1) {
			return true;
		}
		let result = false;
		_.forEach(this.modelDefinitions, def => {
			result = result || ( this.isParameterView(def) && _.has(def, "options"));
		});
		return result;
	}

	updateUserOptions = action((userOptions) => {
		const view = this.props.view;
		const displayModeUpdated = view.userOptions.displayMode != userOptions.displayMode;
		view.userOptions = userOptions;

		if (displayModeUpdated) {
			_.assign(view.userOptions, userOptions)
			this.setViewOptions();
			// this.treeNodeContent.specification = this.treeNodeContent.generateSpecification();
		}
	})

	updateUserOptions_allParameters = (userOptions, ref) => {
		const displayModeUpdated = ref.userOptions.displayMode != userOptions.displayMode;
		if (displayModeUpdated) {
			ref.treeNodeContent.specification = ref.treeNodeContent.generateSpecification();
		}

		this.updateUserOptions(userOptions);
	}

	@action onRootClick = () => {
		if (!this.canTreeRootClick) {
			return;
		}
		this._selectedModelDefinitions = this.modelDefinitions[0];
		this._expandedModelDefinitions.splice(0,this._expandedModelDefinitions.length);
	}

	onTreeNodeClick: bp.TreeEventHandler<IModelDefinition> = action((node) => {
		this._selectedModelDefinitions = node.nodeData;
		const nodeFilePath = _.get(node.nodeData, "locationPath", []);
		let targetTestDefs = this.modelDefinitions;
		for (let i = 0; i < nodeFilePath.length; i++) {
			const testPath = _.slice(nodeFilePath, 0, i+1).join(",");
			const targetTestDef = _.find(targetTestDefs, def => _.eq(_.get(def, "locationPath").join(","), testPath));
			if (targetTestDef) {
				if (!_.includes(this._expandedModelDefinitions, targetTestDef)) {
					this._expandedModelDefinitions.push(targetTestDef);
				}
				targetTestDefs = _.get(targetTestDef, "options", []);
			}
		}
	})

	onTreeNodeExpand: bp.TreeEventHandler<IModelDefinition> = action((node) => {
		if (!_.includes(this._expandedModelDefinitions, node.nodeData)) {
			this._expandedModelDefinitions.push(node.nodeData);
		}

	})

	onTreeNodeCollapse: bp.TreeEventHandler<IModelDefinition> = action((node) => {
		if (_.includes(this._expandedModelDefinitions, node.nodeData)) {
			_.pull(this._expandedModelDefinitions, node.nodeData);
		}
	})

	render() {
		const selectedDef = this._selectedModelDefinitions;
		const {rsSimulation, view} = this.props;
		let content;
		if (!selectedDef) {
			content = <div>No selected ModelDefinition</div>;

		} else if (!this.isParameterView(selectedDef)) {
			content = <RSSimulationInputSpecificationComponent
				rsSimulation={rsSimulation}
				viewName={selectedDef.name}
				userOptions={view.userOptions}
				updateUserOptions={this.updateUserOptions}
			/>
		} else {
			const allParameterComponent = <AllParameters<IModelDefinition>
				rsSimulation={this.props.rsSimulation}
				activeItem={this._selectedModelDefinitions}
				getPath={(item) => item.locationPath}
				onNodeClick={this.onTreeNodeClick}
				applicableChildrenTitles={this._selectedModelDefinitions?.applicableChildrenTitles}
				transformTreeInfo={(item) => this.transformTreeInfo([item])[0]}
				userOptions={view.userOptions}
				allowScrolling={this.props.page.scrollMode}
				updateUserOptions={this.updateUserOptions_allParameters}
			/>

			if (!this.displayTree) {
				content = allParameterComponent;
			} else {
				content = <Splitter
					position={"vertical"}
					postPoned={false}
					primaryPaneWidth={`${view.userOptions.splliterPane || 200}px`}
					primaryPaneMinWidth={"20px"}
					primaryPaneMaxWidth={"40%"}
					ref={this.register}
					onDragFinished={() => {
						view.userOptions.splliterPane = this.splitter.state.primaryPane;
						this.setViewOptions();
					}}
				>
					<div className={css.treeSideBar}>
						<div className={classNames(css.title, {[css.canClick]: this.canTreeRootClick})} onClick={this.onRootClick}>{view.label}:</div>
						<bp.Tree
							contents={this.treeContent}
							onNodeClick={this.onTreeNodeClick}
							onNodeExpand={this.onTreeNodeExpand}
							onNodeCollapse={this.onTreeNodeCollapse}
						/>
					</div>
					<div>
						{allParameterComponent}
					</div>
				</Splitter>;
			}
		}

		return <div className={css.root}>{content}</div>
	}

	componentDidMount() {
		if (this.splitter && !this.props.view.userOptions.splliterPane) {
			// remove sidebar area's scroll-bar if the width not set by user
			const sideBar = $(this.splitter.paneWrapper).find(`.${css.treeSideBar}`);
			const currentWidth = sideBar.width();
			sideBar.addClass(css.treeLeafNoOverflow);
			let updateWidth = Math.max(currentWidth, sideBar[0].scrollWidth + 40);
			sideBar.parent().width(updateWidth);
			sideBar.removeClass(css.treeLeafNoOverflow);
		}
	}

	splitter;
	componentWillUnmount() {
		this.unregister();
	}

	componentDidUpdate(prevProps: Readonly<{ rsSimulation: RSSimulation; view: BookView; page: BookPage; book: Book }>, prevState: Readonly<any>, snapshot?: any) {
		// Invalidate the page if the input view is updated while offscreen since some inputs components like ResizeableInput need to be onscreen to be measured correctly.
		if (this.props.book.currentPage != this.props.page)
			this.props.page.renderedTime = null;
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
}