import {autorun} from 'mobx';

interface MyProps {
	children: Function;
	name?: string;
}

export class Autorun extends React.Component<MyProps, {}> {
	_dispose : Function[] = [];
	constructor(props) {
		super(props);
		const {name} = this.props;  // non-reactive

		this._dispose.push(
			autorun(() => {
				var f = this.props.children as Function;
				f && f();
			}, {name})
		)
	}

	componentWillUnmount() {
		this._dispose.forEach(f => f());
	}

	render() {
		return null;
	}
}