import * as Duo from 'duo_web_sdk';
import * as css from "./DUOMFA.css";

export class DUOMFAPage extends React.Component<{isAction?: boolean}, any> {
	componentDidMount() {
		const params = new URLSearchParams(window.location.search);
		Duo.init({
			'host': params.get("host"),
			'sig_request': params.get("signRequest"),
			'post_action': `https://${window.conning.globals.authDomain}/continue?state=` + params.get("state")
		});
	}

	render() {
		return (
			<div className={css.root}>
				<div className={css.panel}>
					<div className={css.header}>
						<img src="/ui/images/duologo.png"/>
						<span>DUO 2-Step Verification</span>
					</div>
					<iframe id="duo_iframe"/>
				</div>
			</div>
		)
	}
}