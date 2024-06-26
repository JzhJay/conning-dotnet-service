import {api} from 'stores';

export default class ReportPreferences extends React.Component<{}, {}> {
    render() {
	    const {settings} = api.user;

	    return (<div className="ui form">
                <div className="ui segments">
                    <h2 className="ui top attached header">Reports:</h2>

                </div>
            </div>
        )
    }
}

