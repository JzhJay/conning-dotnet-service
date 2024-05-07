import * as css from './404.css';
import {site, routing} from 'stores';

interface MyProps {
    location:HistoryModule.LocationDescriptorObject;
}

export class NotFoundPage extends React.Component<MyProps, {}> {
    componentDidMount() {
        site.setPageHeader('Page Not Found');
        site.activeTool = null;
    }

    render() {
        return (
            <div id="page-not-found" className={classNames([css.pageNotFound, 'pusher'])}>
                <div className="ui vertical masthead aligned segment">
                    <div className={css.container}>
                        {/*<h1 className="ui inverted header">
                         Page Not Found
                         </h1>*/}
                        <h2>The url '{window.location.href}' is not a valid page.</h2>
                        {window.previousUrl
                            ? <div className="ui huge primary button" onClick={routing.history.goBack}>Go back to '{window.previousUrl}'<i className="right arrow icon"></i></div>
                            : null}
                        <div className="ui huge secondary button" onClick={() => routing.push('/')}>Return to the homepage<i className="right arrow icon"></i></div>
                    </div>
                </div>
            </div>
        )
    }

}
