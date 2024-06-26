import { InputGroup} from '@blueprintjs/core';
import {
    computed,
    observable,
    autorun,
    runInAction,
    action,
    IReactionDisposer,
    makeObservable,
} from 'mobx';
import {Simulation} from 'stores/simulation';
import {api, simulationStore} from 'stores';
import {observer} from 'mobx-react';
import {BlueprintDialog, bp} from 'components';
import * as css from './ImportLegacySimulationDialog.css';

@observer
export class ImportLegacySimulationDialog extends React.Component<{}, {}> {
    _disposers: IReactionDisposer[] = [];
    @observable name: string = "";
    @observable path: string = "";
    @observable importing    = false;
    @observable errorMessage        = "";

	constructor(props) {
		super(props);

        makeObservable(this);

		this._disposers.push(
			autorun(() => {
				const {name, importing} = this;
				this.errorMessage              = (!importing && api.simulationStore.simulationByName[name])
				                                 ? api.simulationStore.errors.simulationWithNameAlreadyExists(name)
				                                 : null;
			}, {name: 'Check for simulation name collisions'})
		);
		// autorun(`Automatically set the name to match that of the .dfs if it has not been otherwise set`, () => {
		// 	const {name, path} = this;
		// 	if (_.isEmpty(name) && !_.isEmpty(path)) {
		// 		let name = path.substring(path.lastIndexOf('/') + 1);
		// 		name = name.substring(0, name.indexOf('.')).replace(/_/g, ' ');
		// 		this.name = name;
		// 		if (this.nameInput) { this.nameInput.value = name }
		// 	}
		// });
    }

    @computed get disabled() {
		return !this.path || this.path == '' || !this.name || this.name === "" || this.importing;
	}

    nameInput: InputGroup;

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

    render() {
		const {simulations, simulationByName}                                    = api.simulationStore;
		const {name, path, importing, errorMessage, disabled}                           = this;

		return (
			<BlueprintDialog
				ok={this.ok}
				 className={css.root}
				okDisabled={disabled}
				canCancel={!importing}
				error={errorMessage != null}
				message={errorMessage}
				icon={'database'}
				title={`Import Simulation`}
				okTitle={disabled && !importing ? "Provide a path and name" : `Import Simulation '${name}'`}
				okText={importing ? `Importing '${name}'...` : 'Import Simulation'}>
				<label className={classNames(bp.Classes.LABEL, bp.Classes.INLINE)} tabIndex={0}>
					<span>Name:</span>
					<InputGroup autoFocus
					            disabled={importing}
					            defaultValue={this.name}
					            ref={r => this.nameInput = r}
					            placeholder='Simulation Name'
					            onChange={e => this.name = e.target.value}/>

				</label>
				<label className={classNames(bp.Classes.LABEL, bp.Classes.INLINE)} tabIndex={1}>
					<span>Path:</span>
					<InputGroup value={path}
					            disabled={importing}
					            placeholder='/path/to/dfs'
					            onChange={e => this.path = e.target.value}/>

				</label>
			</BlueprintDialog>
		);
	}

    @action ok = async() => {
		const {disabled, name, path} = this;

		if (disabled) { throw new Error("Cannot call ok() when disabled")}

		this.errorMessage     = null;
		this.importing = true;
		try {
			const simulation = await simulationStore.importSimulation({name: name, path: path});
			api.routing.push(api.routing.urls.simulationBrowser);
			return simulation;
		}
		catch (err) {
			// if (err.status) {
			// 	const {status} = err;
			//
			// 	switch (status) {
			// 		case 406: {
			//
			// 		}
			// 		default: {
			// 			this.errorMessage     = err.message;
			// 		}
			// 	}
			// }

			this.errorMessage     = err.message ? err.message : 'Unable to Import';
			this.importing = false;
			$(ReactDOM.findDOMNode(this.nameInput)).find('input').focus();
		}
	}
}