import * as css from './MigrateDataSchemaPage.css'
import {Observer, observer} from 'mobx-react';
import {ApplicationPage, Splitter, bp, sem} from 'components';
import type {OmdbObjectType} from 'stores';
import {ObjectCatalogContext, settings, Simulation, omdb, julia, xhr} from 'stores'
import {observable} from 'mobx';
import {ActiveTool} from '../../../stores/site';
import {AnchorButton, Button, Navbar, NavbarGroup, NavbarHeading, Tooltip} from '@blueprintjs/core';
import {AutoSizer} from 'react-virtualized';
import {Select} from '@blueprintjs/select';

const {Form, Header, Segment} = sem;

interface MyProps {
	queryParams?: HistoryModule.Query;
}

const ObjectTypes = Select.ofType<OmdbObjectType>()

@observer
export class MigrateSchemaPage extends React.Component<MyProps, {}> {
	get preferences() {
		return settings.pages.migrateDataSchema
	}

	onSubmit = async (e, f) => {
		const {juliaServer, databaseServer, databaseName} = this;

		var juliaUrl = `${juliaServer}/julia/v1`;

		var legacySims = await xhr.get<any>(`${juliaUrl}/simulations`);
		var legacyQueryDescriptors = await xhr.get<any>(`${juliaUrl}/queries`);

		debugger;
		//xhr.get(simulationS)
	}

	juliaServer = 'http://ps.cloud.advise-conning.com';
	databaseServer = 'localhost';
	databaseName = 'omdb-migrated';

	onChange = (e, {name, value}) => {
		this[name] = value;
	}

	render() {
		const {queryParams}        = this.props;
		const {preferences: prefs, juliaServer, databaseServer, databaseName} = this;

		return <ApplicationPage title={() => 'Migrate Existing Schema'}
		                        tool={ActiveTool.preferences}
		                        breadcrumbs={() => [
			                        <div key="bc" className={bp.Classes.BREADCRUMB}>
				                        <AnchorButton className={bp.Classes.MINIMAL} icon="dashboard">Migrate Schema</AnchorButton>
			                        </div>
		                        ]}>
			<Form onSubmit={this.onSubmit}>
				<fieldset>
					<legend>Select Existing Endpoint</legend>

					{/*<sem.Form.Group widths='equal'>*/}
					<Form.Field>
						<Segment attached>
							<sem.Input name="juliaServer" onChange={this.onChange}
							           label="Julia Server"
								labelPosition="left"
								fluid required
								defaultValue={juliaServer}/>
						</Segment>
					</Form.Field>
					<Form.Field>
							<sem.Input name="databaseServer" onChange={this.onChange}
							           label="Database Server"
								labelPosition="left"
								fluid required
								defaultValue={databaseServer} />

					</Form.Field>
					<Form.Field>
						<sem.Input name="databaseName" onChange={this.onChange}
						           label="Database Name"
								labelPosition="left"
								fluid required
								defaultValue={databaseName}/>
					</Form.Field>
					<Form.Button type='submit'>Submit</Form.Button>
				</fieldset>
			</Form>
		</ApplicationPage>;
	}

	renderContextMenu() {
		return null; //<SimulationContextMenu location='browser' panel={this.panel}/>
	}

	_toRemove = [];

	componentWillUnmount() {
		this._toRemove.forEach(f => f());
	}
}
