import {api, site} from "stores/index";

import * as css from './ErrorIndicator.css'
import {observer} from 'mobx-react'

@observer
export class ErrorIndicator extends React.Component<{}, {}> {
	render() {
		return (
			<div className={css.container}>
                <span className={classNames({[css.connected]: api.julia.connected}, css.julia)}
                      onClick={() => api.julia.tryLoadDescriptors()}
                      data-tip
                      data-for="julia-tooltip"
                >
	                <span >{site.productName}</span>
	                <i className={classNames("icon", api.julia.connected ? 'feed' : 'warning')}/>

	                <ReactTooltip id='julia-tooltip' type={api.julia.connected ? 'info' : 'error'} place='bottom'>
		                {api.julia.connected
			                ? <span>Connected to Julia at {api.julia.hostname}</span>
			                : <span className="error">Error contacting Julia at {api.julia.hostname}<br/>Click to attempt to reconnect</span> }
	            </ReactTooltip>
                </span>


				{/*<span className={classNames({[css.connected]: api.db.connected}, css.rethink)}>*/}
				{/*<span>Horizon</span>*/}
				{/*<i className={classNames("icon", api.db.connected ? 'feed' : 'warning')} data-tip data-for="horizon-tooltip" />*/}
				{/*<ReactTooltip id='horizon-tooltip' type={api.db.connected ? 'info' : 'error'} place='bottom'>*/}
				{/*{api.db.connected ?*/}
				{/*<span>Connected to Horizon at {api.db.horizonOptions.hostname}</span> :*/}
				{/*<span className="error">Error contacting Horizon at {api.db.horizonOptions.hostname}</span> }*/}
				{/*</ReactTooltip>*/}
				{/*</span>*/}
			</div>
		)
	}
}