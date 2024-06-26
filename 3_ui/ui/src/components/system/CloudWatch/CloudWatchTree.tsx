import * as css from './CloudWatchTree.css'
import {observer} from 'mobx-react';
import {ObservableTree, sem} from 'components'
import type {ITreeNode} from '@blueprintjs/core';
import { action, autorun, computed, observable, runInAction, makeObservable } from 'mobx';
import {Link, cloudwatch, CloudWatchGroup, CloudWatchStream, mobx} from 'stores';
import {CloudWatchPageContext} from './CloudWatchPageContext';

interface MyProps {
	context: CloudWatchPageContext;
}

interface MyTreeNode extends ITreeNode {
	expand?: () => void;
	collapse?: () => void;
	select?: () => void;
}

export class CloudWatchGroupTreeNode implements MyTreeNode {
	constructor(public group: CloudWatchGroup) {
        makeObservable(this);
        this.id = group.logGroupName;
        this.label = <Link to={{pathname: window.location.pathname, query: {group: this.id}}}>{group.logGroupName}</Link>;
    }

	@action expand = () => {
		this.isExpanded = true;
		const {group} = this;

		if (group && !group.hasLoadedStreams) {
			runInAction(async () => {
				var streams = await group.loadInitialStreams();
				this.childNodes.replace(streams.map(s => new CloudWatchStreamNode(s)));

				if (group.nextStreamsToken) {
					this.childNodes.push(new LoadMoreStreamsNode(this));
				}
			});
		}
	}

	@action updateChildrenAfterLoad = (newStreams: CloudWatchStream[]) => {
		const {childNodes} = this;
		childNodes.spliceWithArray(this.childNodes.length - 1, 0, newStreams.map(s => new CloudWatchStreamNode(s)) )
		if (!this.group.nextStreamsToken) {
			childNodes.splice(childNodes.length - 1, 1);
		}
	}


	@action collapse = () => {
		this.isExpanded = false;
	}

	@action select = () => {
		this.isSelected = true;
		this.expand();
	}

	@observable isExpanded = false;
	@observable isSelected = false;

	@observable hasCaret = true;
	            id;
	            label;

	@observable hasLoadedStreams = false;
	@observable childNodes       = observable.array([{id: 'loading', label: 'Loading Event Streams...'}]);
}

class LoadMoreStreamsNode implements MyTreeNode {
	constructor (public groupNode: CloudWatchGroupTreeNode) {
        makeObservable(this);
        this.label = <a>{this.groupNode.group.loadingStreams ? <sem.Icon name='circle notched' loading/> : null}Load more streams...</a>;
    }

	@action select = async () => {
		this.isSelected = true;
		var newStreams = await this.groupNode.group.loadMoreStreams();
		this.groupNode.updateChildrenAfterLoad(newStreams);
	}

	@observable isSelected = false;
	hasCaret = false;
	id = 'load_more';
	label;
	childNodes = []
}


export class CloudWatchStreamNode implements MyTreeNode {
	constructor(public stream: CloudWatchStream) {
        makeObservable(this);
        this.id = stream.logStreamName;
        this.label = <Link to={{pathname: window.location.pathname, query: {group: stream.group, stream: stream.logStreamName}}}>{stream.logStreamName}</Link>;
    }

	@action select = async () => {
		this.isSelected = true;

		if (!this.stream.hasLoadedEvents) {
			await this.stream.loadEvents();
		}
	}

	@action expand = () => {
		this.isExpanded = true;
	}

	@action collapse = () => {
		this.isExpanded = false;
	}

	@observable isExpanded = false;
	@observable isSelected = false;

	//@computed get hasCaret() { return this.stream.storedBytes > 0 }
	hasCaret = false;

	id;
	label;

	@observable hasLoadedChildren = false;

	@computed get childNodes() { return [{id: 'loading', label: 'Loading Children...'}] }
}

@observer
export class CloudWatchTree extends React.Component<MyProps, {}> {
    @observable treeContents = observable.array<CloudWatchGroupTreeNode>();

	constructor(props) {
		super(props);

		makeObservable(this);

		this._toRemove.push(
			autorun(() => {
				var groups = _.orderBy<CloudWatchGroup>(mobx.values(cloudwatch.groups), g => g.logGroupName);

				// runInAction: Recreate tree
				runInAction(() => {
					this.treeContents.replace(groups.map(g => new CloudWatchGroupTreeNode(g)));
				});
			}, {name: `watch cloudwatch groups`}));

		this._toRemove.push(
			autorun( () => {
				var {context: {group, stream}} = this.props;
				if (group) {
					var groupNode = this.treeContents.find(g => g.group.logGroupName == group);
					var streamNode = stream && groupNode ? groupNode.childNodes.find(c => c.id == stream) as CloudWatchStreamNode : null;

					// runInAction: Select tree node due to query parameters
					(groupNode || streamNode) && runInAction(
						() => {
							groupNode.expand();

							if (stream) {
								if (streamNode) {
									this.selectNode(streamNode);
								}
							}
							else {
								this.selectNode(groupNode);
							}
						});
				}
			}, {name: `Watch query parameters to set tree node`})
		)
	}

    render() {
		const {treeContents} = this;

		return (
			<div className={css.root}>
				<ObservableTree contents={treeContents.slice()}
				                onNodeClick={(n: MyTreeNode) => this.selectNode(n)}
				                onNodeExpand={(n: MyTreeNode) => n.expand()}
				                onNodeCollapse={(n: MyTreeNode) => n.collapse()}/>
			</div>
		)
	}

    @observable selectedNode;

    @action selectNode = (node: MyTreeNode) => {
		const {props: {context}} = this;
		if (node != this.selectedNode) {
			if (this.selectedNode) {
				this.selectedNode.isSelected = false;
			}
			this.selectedNode = node;

			if (node instanceof CloudWatchGroupTreeNode) {
				context.groupInstance = node.group;
				context.streamInstance = null;
			} else if(node instanceof CloudWatchStreamNode) {
				context.groupInstance = cloudwatch.groups.get(node.stream.group);
				context.streamInstance = node.stream;
			}


		}
		node.select();
	}

    _toRemove = [];

    componentWillUnmount() {
		this._toRemove.forEach(f => f())
	}
}
