import Sortable from 'sortablejs';
import * as PropTypes from 'prop-types';

const store = {
	nextSibling: null,
	activeComponent: null
};

interface ChangeEvent extends React.SyntheticEvent<any> {
	oldIndex: number;
	newIndex: number;
}

interface MyProps {
    options: Sortable.SortableOptions;
    onChange?: (order: string[], sortable: Sortable, event:ChangeEvent) => void;
    className?: string;
    tag?: string;
}

export class ReactSortable extends React.Component<MyProps, {}> {
	static propTypes = {
		options: PropTypes.object,
		onChange: PropTypes.func,
		tag: PropTypes.string
	};

	static defaultProps = {
		options: {},
		tag: 'div'
	};

	sortable = null;

	componentDidMount() {
		const options = { ...this.props.options };

		[
			'onChoose',
			'onStart',
			'onEnd',
			'onAdd',
			'onUpdate',
			'onSort',
			'onRemove',
			'onFilter',
			'onMove',
			'onClone'
		].forEach((name) => {
			const eventHandler = options[name];

			options[name] = (...params) => {
				const [evt] = params;

				if (name === 'onChoose') {
					store.nextSibling = evt.item.nextElementSibling;
					store.activeComponent = this;
				} else if ((name === 'onAdd' || name === 'onUpdate') && this.props.onChange) {
					const items = this.sortable.toArray();
					const remote = store.activeComponent;
					const remoteItems = remote.sortable.toArray();

					evt.from.insertBefore(evt.item, store.nextSibling);

					if (remote !== this) {
						const remoteOptions = remote.props.options || {};

						if ((typeof remoteOptions.group === 'object') && (remoteOptions.group.pull === 'clone')) {
							// Remove the node with the same data-reactid
							evt.item.parentNode.removeChild(evt.item);
						}

						remote.props.onChange && remote.props.onChange(remoteItems, remote.sortable, evt);
					}

					this.props.onChange && this.props.onChange(items, this.sortable, evt);
				}

				if (evt.type === 'move') {
					const [evt, originalEvent] = params;
					const canMove = eventHandler ? eventHandler(evt, originalEvent) : true;
					return canMove;
				}

				setTimeout(() => {
					eventHandler && eventHandler(evt);
				}, 0);
			}
		});

		this.sortable = Sortable.create(ReactDOM.findDOMNode(this) as HTMLElement, options);
	}

	componentWillUnmount() {
		if (this.sortable) {
			this.sortable.destroy();
			this.sortable = null;
		}
	}

	render() {
		const { tag: Component, ...props } = this.props;

		return (
			<Component {...props as any} />
		);
	}
}
