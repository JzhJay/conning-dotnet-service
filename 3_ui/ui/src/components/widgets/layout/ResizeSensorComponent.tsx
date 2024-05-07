//import {ResizeSensor} from 'components/index'
import {ResizeSensor} from 'utility/resizeSensor'
import * as React from 'react';

export interface Props {
    onResize(...args);
    // How far up the tree we want to watch for changes
    parentDepth?: number;
}

export abstract class ResizeSensorComponent extends React.Component<Props, {}> {
    sensor:ResizeSensor;

    static defaultProps = {
        parentDepth: 1
    }

    render() {
        return <div className="resize-sensor" />
    }

    componentDidMount() {
        let node = ReactDOM.findDOMNode(this);
        let current = node.parentElement;

        for (let i = 1; i< this.props.parentDepth; i++) {
            current = current.parentElement;
        }
        
        this.sensor = new ResizeSensor(current, this.onResize);
    }

    onResize = () => {
    //    console.log('resize');
        this.props.onResize();
    }

    componentWillUnmount() {
        this.sensor.detach();
    }
}

