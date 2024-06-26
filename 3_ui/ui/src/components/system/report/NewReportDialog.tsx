import * as css from './NewReportDialog.css';

import {Checkbox, ReactSelect, BlueprintDialog, bp} from 'components'
import {Dialog, IDialogProps, Button, Intent, InputGroup, Spinner} from "@blueprintjs/core";
import {ReportDescriptor} from 'stores/report';
import {api} from 'stores';

import {observer} from 'mobx-react'
import { observable, computed, reaction, autorun, action, makeObservable } from 'mobx';
import type {SimulationGuid} from 'stores/simulation'

@observer
export class NewReportDialog extends React.Component<{ simulationIds?: SimulationGuid[] }, {}> {
    @observable name: string                 = "";
    @observable creating                     = false;
    @observable errorMessage                        = null;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    //@observable createWhere : CreateWhere = "sameTab";

    @computed get disabled() {
		return this.creating || this.name === "";
	}

    render() {
		const {simulations} = api.simulationStore;
		const {errorMessage, name, creating, disabled, props: {simulationIds, children, ...props}} = this;


		/*
		// Removed until we have a page that can create the query during load
		 additionalFooter={() => <Checkbox className={classNames(css.openInNewTab)}
		 tabIndex={3}
		 checked={queryInNewTab}
		 onChange={() => this.queryInNewTab = !queryInNewTab}
		 label="Open in New Tab?"/>}

		*/

		 return (
			<BlueprintDialog
				className={css.root}
				icon="search"
				{...props}
				title="New Report"
				ok={this.ok}
				error={errorMessage != null}
				message={errorMessage}
				okDisabled={disabled}
				okTitle={disabled && !creating ? "You must name the query and select a simulation" : `Create '${name}'`}
				okText="OK">
				<label className={bp.Classes.LABEL} tabIndex={0}>
					<span>Name:</span>
					<InputGroup autoFocus
					            placeholder='Report Name'
					            disabled={creating}
					            onChange={e => this.name = e.target.value}/>


				</label>
			</BlueprintDialog>);
	}

    fileOpenInput: HTMLInputElement;

    @observable files: FileList;

    ok = async () => {
		const {disabled, name} = this;

		if (disabled) { throw new Error("Cannot call ok() when disabled")}

		this.creating = true;

		const report = await api.reportStore.createReport(name);

		this.creating = false;

		const url = api.routing.routeFor.report(report.id);

		api.routing.push(url, api.constants.dialogAnimationMs);

		return report;
	}
}
