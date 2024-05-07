import {ResizeSensor} from '../../../utility/resizeSensor'
import {Container} from "golden-layout";
import * as PropTypes from 'prop-types';

const targetFps = 30;
const debounceMs = 1000 / targetFps;

export abstract class AutoResizeComponent<Props, State> extends React.Component<Props, State> {
    constructor(props, state) {
        super(props, state);
    }

    sensor:ResizeSensor;
	declare context:{ glContainer:Container}
    callback;

    static contextTypes = {
        glContainer: PropTypes.any
    }

    abstract onResize()

    componentDidMount() {
        let node = ReactDOM.findDOMNode(this);
        let wrapper = () => this.onResize.call(this);
        this.callback = _.throttle(wrapper, debounceMs, {leading: true,  trailing: true});

        if (this.context.glContainer) {
            this.context.glContainer.on('resize', this.callback, this);
        }
        else
            this.sensor = new ResizeSensor(node, this.callback);
    }

    componentWillUnmount() {
        if (this.context.glContainer)
            this.context.glContainer.unbind('resize', this.callback, this)
        else
            this.sensor.detach();
    }

}
