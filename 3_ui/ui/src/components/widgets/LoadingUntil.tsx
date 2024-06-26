import {action, makeObservable, observable} from 'mobx';
import { observer } from "mobx-react";
import * as css from './LoadingUntil.css'
import {LoadingIndicator} from '../semantic-ui/parts/Loading';
import {routing} from 'stores';

interface MyProps {
    loaded?: boolean;
    onLoad?: () => void;
    inline?: boolean;
	loader?: boolean;
    image?: string;
    message?: string | React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
	delayTime?: number;
}

interface MyState {
    loaded?: boolean;
}

@observer
export class LoadingUntil extends React.Component<MyProps, MyState> {
	@observable awaitingDelay = false;
	private _delayTimeout = null;

	constructor(props) {
		super(props);
		makeObservable(this);

		if (props.delayTime != null) {
			this.setDelayTimer(props.delayTime);
		}
	}

	@action setDelayTimer(delayTime) {
		this.awaitingDelay = true;
		this._delayTimeout = setTimeout(action(() => {
				this.awaitingDelay = false;
			}
		), delayTime);
	}

    render() {
        const { loader, inline, style, children, message, image} = this.props;
		const loaded = this.awaitingDelay || this.props.loaded;

        return (
            <div style={style} className={classNames(css.loadingUntil, this.props.className, {[css.loaded]: loaded})}>
	            {/*<RouteTransition*/}
	            {/*key="loading"*/}
	            {/*pathname={routing.pathname}*/}
	            {/*runOnMount={true}*/}
	            {/*atEnter={{ opacity: .8 }}*/}
	            {/*atLeave={{ opacity: .5 }}*/}
	            {/*atActive={{ opacity: 1 }}*/}
	            {/*stiffness={650} damping={24}*/}
	            {/*className={css.routeTransitionContainer}>*/}
	            {!loaded
	                ? <LoadingIndicator key='loader' className={css.loader} loader={loader} image={image} inline={inline} >{message}</LoadingIndicator>
	                : <div style={style}  className={css.children} key='children'>{typeof(children) === "function" ? (children as any)() : children}</div>}
	            {/*</RouteTransition>*/}
            </div>
        );
    }

    componentDidMount() {
        if (this.props.loaded && this.props.onLoad) {
            this.props.onLoad();
        }
    }

    componentDidUpdate(oldProps: MyProps) {
        if (this.props.onLoad && this.props.loaded && this.props.loaded !== oldProps.loaded) {
            this.props.onLoad();
        }
    }

	componentWillUnmount() {
		clearTimeout(this._delayTimeout);
	}
}
