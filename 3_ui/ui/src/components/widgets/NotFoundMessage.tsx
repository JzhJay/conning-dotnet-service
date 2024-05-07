import {api} from 'stores';

interface MyProps {
    message?: any;
    className?: string;
}

interface MyState {
    loaded?: boolean;
}

export class NotFoundMessage extends React.Component<MyProps, MyState> {
    render() {
        const {message} = this.props;

        return (
            <div className={classNames( this.props.className, "pusher")}>
                    <div className="ui vertical masthead aligned segment">
                        <div className="ui text center container">
                            {/*<h1 className="ui inverted header">
                             Page Not Found
                             </h1>*/}
                            <h2>{message}</h2>
                            {window.previousUrl
                                ? <div className="ui huge primary button" onClick={() => api.routing.history.goBack()}>Go back to '{window.previousUrl}'<i className="right arrow icon"></i></div>
                                : null}
                            <div className="ui huge secondary button" onClick={() => api.routing.push(api.routing.urls.home)}>Return to the homepage<i className="right arrow icon"></i></div>
                        </div>
                    </div>
                </div>
        );
    }

}


