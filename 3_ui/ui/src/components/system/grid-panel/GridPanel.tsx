import {LoadingUntil} from '../../widgets/LoadingUntil';
import * as css from './GridPanel.css';
import {observer} from 'mobx-react';

interface MyProps extends React.AllHTMLAttributes<HTMLDivElement> {
    label?: string;
    className?: string;
    loaded?: boolean;
    actions?: React.ReactNode[];
    children?: React.ReactNode;
    onLoad?: () => void;
	showLoader?: boolean;
    loadingMessage?: string;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

@observer
export class GridPanel extends React.Component<MyProps, {}> {
    render() {
        const {loaded, showLoader, loadingMessage, actions, label, className, children, onLoad, ...props} = this.props;

        return (
            <LoadingUntil loaded={loaded == null || loaded} loader={showLoader}
                          message={loadingMessage} onLoad={onLoad}>
                <div className={classNames(className, css.gridPanel)}>
                    <div className={css.wrapper} {...props}>
                        {children}
                    </div>
                    {label ? <div className="ui bottom right attached label">{label}</div> : null }
                </div>
            </LoadingUntil>
        );
    }

    static defaultProps = {
        title:     '',
	    loadingMessage: '',
	    showLoader: false
    }
}
