import * as React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
    indeterminate?: boolean;
}

export class IndeterminateCheckbox extends React.Component<Props, {}> {
    componentDidMount() {
        if (this.props.indeterminate === true) {
            this._setIndeterminate(true);
        }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.indeterminate !== this.props.indeterminate) {
            this._setIndeterminate(this.props.indeterminate);
        }
    }

    _setIndeterminate(indeterminate) {
        const node = ReactDOM.findDOMNode(this) as HTMLInputElement;
        node.indeterminate = indeterminate;
    }

    render() {
        return <input type="checkbox"
            {..._.omit(this.props, 'indeterminate')}
                      className={classNames(this.props.className, {indeterminate: this.props.indeterminate})}/>;
    }
}
