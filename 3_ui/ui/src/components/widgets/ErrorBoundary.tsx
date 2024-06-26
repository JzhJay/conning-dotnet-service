import { Button, Intent } from '@blueprintjs/core';
import { observable, makeObservable } from "mobx";
import { observer } from "mobx-react";
import { sem } from 'components';
import * as css from './ErrorBoundary.css'

@observer
export class ErrorBoundary extends React.Component<{error?: Error}, {}> {
    @observable error;

    reloadPage = () => {
		window.location.reload();
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidCatch(error, info) {
		this.error = error;
		console.error(error);
	}

    render() {
		const { error, props: { children } } = this;
		const displayError = this.props.error || error

		return <>
			{displayError ? <sem.Message error icon className={css.error}>
			             <sem.Icon name="exclamation triangle"/>
			             <sem.Message.Content>
				             <sem.Message.Header>An error has occurred while rendering</sem.Message.Header>

				             {DEV_BUILD && <div className={css.stack}>
					             {displayError.stack}
				             </div>}

							 <div className={css.footer}>
							 	<Button icon="refresh" intent={Intent.DANGER} text="Refresh page to try again" outlined onClick={this.reloadPage} />
							 </div>
			             </sem.Message.Content>
		             </sem.Message>
		             : children}
			</>;
	}
}