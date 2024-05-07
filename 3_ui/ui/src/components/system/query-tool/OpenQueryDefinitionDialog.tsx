import * as css from './OpenQueryDefinitionDialog.css';

import {Checkbox, BlueprintDialog, mobx, bp} from 'components'
import Select from 'react-select';
import {Dialog, IDialogProps, Button, Intent, InputGroup, Spinner, Label} from "@blueprintjs/core";
import type {QueryGuid, QuerySave} from 'stores/query';
import {api, simulationStore} from 'stores';

import {observer} from 'mobx-react'
import {
    observable,
    computed,
    reaction,
    autorun,
    action,
    IReactionDisposer,
    makeObservable,
} from 'mobx';
import type {SimulationGuid} from 'stores/simulation'

@observer
export class OpenQueryDefinitionDialog extends React.Component<{}, {}> {
    _disposers: IReactionDisposer[] = [];
    @observable simulationID: SimulationGuid = null;
    @observable openInNewTab                 = true;
    @observable loading                      = false;
    @observable errorMessage                        = null;
    @observable name                        = null;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get disabled() {
		return this.loading || this.name == null || this.name === ''
			|| this.simulationID == null || !this.files || this.files.length !== 1 || !this.files[0].name.toLowerCase().endsWith('.json');
	}

    componentDidMount() {
		this._disposers.push(
			autorun( () => {
				if (api.simulationStore.simulations.size === 1) {
					this.simulationID = api.simulationStore.simulations.values()[0].id;
				}
			}, {name: `Set simulation if one and only one simulation is available`})
		);
	}

    @computed
	get simulationOptions() {
		return mobx.values(api.simulationStore.simulations).map(sim => ({value: sim.id, label: sim.name}))
	}

    @computed
	get simulationSelectedOptions() {
		return this.simulationID  ? this.simulationOptions.filter(opt => opt.value == this.simulationID )[0] : null;
	}

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

    render() {
		const {errorMessage, name, loading, openInNewTab, disabled}         = this;

		const {simulationID} = this;

		return (
			<BlueprintDialog
				className={css.root}
				icon="search"
				title="Open Query Definition"
				okDisabled={disabled}
				ok={this.ok}
				error={errorMessage != null}
				message={errorMessage}
				okTitle={disabled ? "Select a simulation and valid input file" : ``}
				okText={loading ? `Loading definition...` : 'Load Query Definition'}
				additionalFooter={() => <Checkbox className={classNames(css.openInNewTab)}
				                                  tabIndex={3}
				                                  checked={openInNewTab}
				                                  onChange={() => this.openInNewTab = !this.openInNewTab}
				                                  label="Open in New Tab?"/>}>
				<Label className={classNames(css.queryName)} tabIndex={0}>
					<span>Query Name:</span>
					<InputGroup autoFocus
					            placeholder='Name Your Query'
					            onChange={e => this.name = e.target.value}/>
				</Label>
				<Label className={classNames(css.simulation)} tabIndex={1}>
					<span>Choose a Simulation:</span>
					<Select
						className={classNames([bp.Classes.INPUT_GROUP, css.reactSelect])}
						classNamePrefix={css.reactSelect}
						placeholder="Choose a Simulation..."
						isClearable={true}
						value={this.simulationSelectedOptions}
						options={this.simulationOptions}
						onChange={(option: ReactSelect.Option<SimulationGuid>) => this.simulationID = !option ? null : option.value}
					/>
				</Label>
				<Label className={classNames(css.definitionFile)} tabIndex={2}>
					<span>Definition File:</span>
					<input ref={r => this.fileOpenInput = r} id="fileOpenInput" type="file" accept="application/json" onChange={this.onFileOpenInput_Change}/>
				</Label>
			</BlueprintDialog>);
	}

    fileOpenInput: HTMLInputElement;

    @observable files: FileList;

    openQueryDefinition = () => {
		this.fileOpenInput.value = "";
		this.fileOpenInput.click();
	}

    @action onFileOpenInput_Change = (e: React.FormEvent<HTMLInputElement>) => {
		const {files} = e.currentTarget;
		this.files    = this.fileOpenInput.files;

		this.errorMessage =
			this.files.length === 1 && !this.files[0].name.toLowerCase().endsWith('.json')
				? 'File must be JSON'
				: null;
	}

    ok = () => {
		const {disabled, simulationID, openInNewTab, name} = this;

		if (disabled) { throw new Error("Cannot call ok() when disabled")}

		const file = this.fileOpenInput.files[0];

		return new Promise((res, rej) => {
			this.loading = true;

			const reader     = new FileReader();
			reader.onloadend = async loaded => {
				try {
					const definitionJson = JSON.parse(loaded.target['result'] as string) as QuerySave;

					// Load the query definition
					const id = await api.queryStore.createQuerySessionDescriptor(name, [this.simulationID], definitionJson, true);
					const url = api.routing.routeFor.query(id);

					if (openInNewTab) {
						api.site.toaster.show({intent: Intent.PRIMARY, message: `Loaded query definition '${file.name}'`})
						window.open(url);
					}
					else {
						api.routing.push(url)
					}

					this.loading = false;
					res(id)
				}
				catch (err) {
					this.errorMessage = err.message;
					rej(err);
				}
				finally {
					this.loading = false;
				}
			}

			reader.onerror = (error: any) => {
				this.errorMessage = error.message;
				api.site.raiseError(error.error);
			}

			reader.readAsText(file);
		});
	}
}
