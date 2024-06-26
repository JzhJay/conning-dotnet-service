import * as PropTypes from 'prop-types';

const KEYCODES = {
    ESCAPE: 27
};

interface PortalProps {
    isOpened?:boolean;
    openByClickOn?:any;
    closeDelay?:number;
    closeOnOutsideClick?:boolean;
    closeOnEsc?:boolean;
    onOpen?:(Node) => void;
    onClose?:() => void;
    onUpdate?:() => void;
    className?:string;
    beforeClose(node:React.ReactNode, fn:Function)
}

interface MyState {
    active?:boolean;
}

export default class Portal extends React.Component<PortalProps, MyState> {
    constructor(props, state) {
        super(props, state);
        this.state                   = {active: false};
        this.handleWrapperClick      = this.handleWrapperClick.bind(this);
        this.closePortal             = this.closePortal.bind(this);
        this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
        this.handleKeydown           = this.handleKeydown.bind(this);
        this.portal                  = null;
        this.node                    = null;
    }

    portal;
    node;
    $node: JQuery;

    componentDidMount() {
        if (this.props.closeOnEsc) {
            document.addEventListener('keydown', this.handleKeydown);
        }

        if (this.props.closeOnOutsideClick) {
            document.addEventListener('mouseup', this.handleOutsideMouseClick);
            document.addEventListener('touchstart', this.handleOutsideMouseClick);
        }

        if (this.props.isOpened) {
            this.openPortal();
        }
    }

	componentDidUpdate(prevProps: Readonly<PortalProps>, prevState: Readonly<MyState>, snapshot?: any) {
	    // portal's 'is open' state is handled through the prop isOpened
        if (typeof this.props.isOpened !== 'undefined') {
            if (this.props.isOpened) {
                if (prevState.active) {
                    this.renderPortal(this.props);
                } else {
                    this.openPortal(this.props);
                }
            }
            if (!this.props.isOpened && prevState.active) {
                this.closePortal();
            }
        }

        // portal handles its own 'is open' state
        if (typeof this.props.isOpened === 'undefined' && prevState.active) {
            this.renderPortal(this.props);
        }
    }

    componentWillUnmount() {
        if (this.props.closeOnEsc) {
            document.removeEventListener('keydown', this.handleKeydown);
        }

        if (this.props.closeOnOutsideClick) {
            document.removeEventListener('mouseup', this.handleOutsideMouseClick);
            document.removeEventListener('touchstart', this.handleOutsideMouseClick);
        }

        this.closePortal(true);
    }

    renderPortal(props) {
        if (!this.node) {
            const node = this.node = document.createElement('div');
            if (props.className) {
                this.node.className = props.className;
            }
            if (props.style) {
                $(node).css(props.style)
            	//CSSPropertyOperations.setValueForStyles(this.node, props.style);
            }
            document.body.appendChild(this.node);
        }
        this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, React.cloneElement(props.children, {closePortal: this.closePortal}) as any, this.node, this.props.onUpdate);
    }

    render() {
        if (this.props.openByClickOn) {
            return React.cloneElement(this.props.openByClickOn, {onClick: this.handleWrapperClick});
        } else {
            return null;
        }
    }

    handleWrapperClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.active) { return; }
        this.openPortal();
    }

    ignoreFirstClick = false;

    openPortal(props = this.props) {
        this.ignoreFirstClick = true;
        this.setState({active: true});
        this.renderPortal(props);

        this.props.onOpen(this.node);
    }

    closePortal(isUnmounted = false) {
        this.ignoreFirstClick = true;

        const resetPortalState = () => {
            if (this.node) {
                ReactDOM.unmountComponentAtNode(this.node);
                document.body.removeChild(this.node);
            }
            this.portal = null;
            this.node   = null;
            if (isUnmounted !== true) {
                this.setState({active: false});
            }
        };

        if (this.state.active) {
            if (this.props.beforeClose) {
                this.props.beforeClose(this.node, resetPortalState);
            } else {
                resetPortalState();
            }

            this.props.onClose();
        }
    }

    handleOutsideMouseClick(e) {
        if (!this.state.active) { return; }

        const root = ReactDOM.findDOMNode(this.portal);

        if (this.ignoreFirstClick || root.contains(e.target)) {
            this.ignoreFirstClick = false;
            return;
        }

        e.stopPropagation();
        this.closePortal();
    }

    handleKeydown(e) {
        if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
            this.closePortal();
        }
    }

    static propTypes = {
        className:           PropTypes.string,
        closeDelay:          PropTypes.number,
        style:               PropTypes.object,
        children:            PropTypes.element.isRequired,
        openByClickOn:       PropTypes.element,
        closeOnEsc:          PropTypes.bool,
        closeOnOutsideClick: PropTypes.bool,
        isOpened:            PropTypes.bool,
        onOpen:              PropTypes.func,
        onClose:             PropTypes.func,
        beforeClose:         PropTypes.func,
        onUpdate:            PropTypes.func
    };

    static defaultProps = {
        closeDelay: 0,
        onOpen:     () => {},
        onClose:    () => {},
        onUpdate:   () => {}
    };
}
