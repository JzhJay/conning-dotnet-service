import * as bp from '@blueprintjs/core'
import {computed, observable, makeObservable, reaction} from "mobx"
import { observer } from 'mobx-react'
import * as React from 'react';
import {Progress} from 'semantic-ui-react';
import {formatLabelText} from 'utility';
import {xhr, api, routing, ClimateRiskAnalysis, Repository, site} from '../../../stores';
import { IO } from '../../../stores/io';
import { QueryDescriptor } from '../../../stores/query/ui';
import { RSSimulation } from '../../../stores/rsSimulation';
import { Dialog, Classes, Button, AnchorButton, Intent, Spinner } from '@blueprintjs/core';

import * as css from './ExpireDialog.css'

interface MyProps{
    app: IO | QueryDescriptor | RSSimulation | ClimateRiskAnalysis | Repository
}

export enum ServerStatus {
    notInitialized = "ServerNotInitialized",
    created = "ServerCreated",
    ready = "ServerReady",
    aboutToClose = "ServerAboutToClose",
    closed = "ServerClosed"
}

const textDisplay = {
    dialog: {
        [ServerStatus.aboutToClose]: "The server session has been idle for an extended period of time and will be automatically closed in 15 minutes",
        [ServerStatus.closed]: "The server session has been closed"
    },
    button: {
        [ServerStatus.aboutToClose]: "Extend My Session",
        [ServerStatus.closed]: "Reconnect"
    }
}

@observer
export class ExpireDialogComponent extends React.Component<MyProps, {}> {
    activityInterval = null;
    serverTimeout = 60 * 60 * 1000; //TODO: Ideally this timeout should be communicated by the REST server.
    @observable isForceClose = false;
	eventSourceReaction = null;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    componentDidMount(): void {
	    this.monitorEventSource()
	}

	monitorEventSource() {
		this.eventSourceReaction && this.eventSourceReaction();
		this.eventSourceReaction = reaction(() => this.props.app.eventSource?.isConnected, (isConnected) => {
			if (isConnected === false)
				this.props.app.serverStatus = ServerStatus.closed;
		})
	}

    forceClose = () => {
		this.isForceClose = true;
        routing.push(api.routing.urls.home);
	}

    @computed get statusMessage(): any[] {
		const messages = this.props.app["loadingStatusMessages"]?.filter(m => m.type == "status" || m.progress);
		if (!messages || !messages.length) {
			return [];
		}
		let returnMessages = [];
		_.forEach(messages, data => {
			const {label, progress} = data;
			if (!progress || progress.denominator <= 0) {
				return;
			}

			const existObj = _.find(returnMessages, d => d.label == label);
			if (existObj) {
				if (existObj.denominator != progress.denominator || existObj.numerator < progress.numerator) {
					existObj.denominator = progress.denominator;
					existObj.numerator = progress.numerator;
				}
			} else {
				returnMessages.push({
					label: label,
					...progress
				});
			}
		});

		const lastMessage = messages[messages.length - 1];
		if (lastMessage.type == "status") {
			returnMessages = returnMessages.filter( d => d.denominator != d.numerator);
			returnMessages.push(lastMessage);
		}
		return returnMessages;
	}

	async requestWithRetry(func, attempts = 0) {
		try
		{
			await func();
		}
		catch (e) {
			if (attempts < 5) {
				attempts = attempts + 1;
				site.toaster.clear();
				site.toaster.show({message: `Retrying failed connection request. Attempt: ${attempts}`, intent: bp.Intent.WARNING});
				await this.requestWithRetry(func, attempts);
			}
		}
	}

	render () {
		const { isForceClose, statusMessage } = this;
		const { app } = this.props;
		const { serverStatus } = app;
		const isRestarting = (app instanceof IO) && app.isRestarting;
		const isOpen = !isForceClose && (serverStatus == ServerStatus.aboutToClose || serverStatus == ServerStatus.closed || app.isReconnecting || isRestarting);

        return <Dialog
            isOpen={isOpen}
			title={isRestarting ? "Restarting" : "Inactivity Timeout"}
			onClose={this.forceClose}
        >
            <div className={Classes.DIALOG_BODY}>
                <strong>
					{ isRestarting ? 'The server session is restarting ...' : app.isReconnecting ? 'The server session is reconnecting ...' : textDisplay.dialog[serverStatus] }
                </strong>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
	            { isRestarting || app.isReconnecting ?
	            <>
		            <Spinner size={40} className={css.sessionReconnectSpinner} />
		            {statusMessage.map( (m, i) => {
			            if (_.isInteger(m.denominator)) {
				            const {numerator, denominator, label} = m;
				            return <div key={`m${i}`} className={css.progressLabel}>
				             <div>{label}</div>
				             <Progress value={numerator} total={denominator} active={numerator > 0 && numerator < denominator} label={`${Math.round(numerator / denominator * 100)}%`} color={'green'} autoSuccess />
				            </div>
			            } else if (m.data != null) {
				            return <div className={css.statusLabel} key={`m${i}`}>{formatLabelText(m.data)}</div>
			            }
		            })}
	            </> :
				<div className={classNames(Classes.DIALOG_FOOTER_ACTIONS, css.dialogFooterActionModified)}>
                    <AnchorButton
                        intent={Intent.PRIMARY}
                        onClick={async () => {
							const { app } = this.props;
							const { serverStatus } = app;
							switch (serverStatus){
								case ServerStatus.aboutToClose:
									this.requestWithRetry(app.sessionExtend.bind(app));
									break;
								case ServerStatus.closed:
									await this.requestWithRetry(app.sessionReconnect.bind(app));
									this.monitorEventSource();
									break;
								default:
									break;
							}
						}}
					>
                        {textDisplay.button[serverStatus]}
					</AnchorButton>
					<Button
						intent={Intent.DANGER}
						onClick={this.forceClose}
					>
                        Cancel
                    </Button>
                </div>
				}
            </div>
        </Dialog>
    }

    componentWillUnmount(): void {
	    clearInterval(this.activityInterval);
	    this.eventSourceReaction && this.eventSourceReaction();
    }
}
