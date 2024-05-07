import {api, julia} from 'stores';
import {semanticMenu} from 'components';
import * as css from './JuliaServerChooser.css';
import {observer} from 'mobx-react'

@observer
export class JuliaServerChooser extends React.Component<{}, {}> {
	render() {
		let {url, hostname, recentHosts} = julia;

		hostname = hostname.replace('.advise-conning.com', '');

		const {MenuItem} = semanticMenu;

		return (<div className={css.root}>
			<MenuItem menuItemLabel={<span><b className={css.label}>Julia Server:</b>  {hostname}</span>}
			          title={url}>
				{recentHosts.map((host, i) => <MenuItem key={i.toString()}
				menuItemLabel={<div>
					<span className="text" onClick={() => api.julia.overrideHost(host)}>{host}</span>
						{recentHosts.length > 1 ? <button className='ui button' title={`Remove ${host}`} onClick={() => api.julia.removeHost(host)}>x</button> : null}
					</div>}/>)}
			</MenuItem>
		</div>);
	}
}