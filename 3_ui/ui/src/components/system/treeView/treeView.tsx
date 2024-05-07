export interface MyProps {

}

interface MyState {

}

export class TreeViewComponent extends React.Component<MyProps, MyState> {
	render() {
		return (<div className="tree-view-component">
		</div>);
	}

	node:Node;

	componentDidMount() {
		this.node = ReactDOM.findDOMNode(this);
	}
}
