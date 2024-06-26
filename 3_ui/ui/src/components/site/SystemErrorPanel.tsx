import {Card} from '@blueprintjs/core';
import * as css from './SystemErrorPanel.css';
import {bp, sem} from 'components';
import {observer} from 'mobx-react';
import {api, site, julia} from 'stores';

@observer
export class SystemErrorPanel extends React.Component<{}, {}> {
	render() {
		const {overrideErrorDialog} = site;

		return <bp.Overlay isOpen={!julia.connected && !overrideErrorDialog} canEscapeKeyClose={false} canOutsideClickClose={false} autoFocus={false}>
			<Card elevation={4} className={classNames(css.noConnection)}>
				<sem.Message icon negative error compact>
					<sem.Icon name='warning sign'/>
					<sem.Message.Content>
						<sem.Message.Header>Connection Error</sem.Message.Header>
						<sem.Message.List items={site.errors.map((e, i) => <span key={i.toString()}>{e.message}</span>)}/>
						{!julia.connected && <p>We are unable to connect to our <a href={julia.url}>Julia server</a>.</p>}
					</sem.Message.Content>
				</sem.Message>

				<div className={bp.Classes.BUTTON_GROUP} style={{float: 'right'}}>
					<bp.Button large intent={bp.Intent.PRIMARY} onClick={() => window.location.reload()}>Reload</bp.Button>
					<div className="bp3-button-group-divider"/>
					<bp.Button large intent={bp.Intent.DANGER} onClick={() => site.overrideErrorDialog = true}>Cancel</bp.Button>
				</div>
			</Card>
		</bp.Overlay>
	}
}