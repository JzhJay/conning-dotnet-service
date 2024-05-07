import {Alignment, AnchorButton, ButtonGroup, Navbar, NavbarDivider, NavbarGroup} from '@blueprintjs/core';
import gql from 'graphql-tag';
import {observer} from 'mobx-react';
import {Autorun, OmdbAdminPageContext, sem} from 'components';
import {Query} from '@apollo/client/react/components';
import {julia, settings, simulationStore, queryStore, queryResultStore, reportStore, omdb} from 'stores';
import * as css from './ImportFromJuliaTab.css';

const {Form, Header, Segment, Input, FormCheckbox, Button} = sem;

@observer
export class ImportFromJuliaTab extends React.Component<{ context: OmdbAdminPageContext }, {}> {
	render() {
		const {context} = this.props;
		return <div className={css.root}>
			<Autorun name="Load julia descriptors if required">
				{() => {
					!simulationStore.hasLoadedDescriptors && simulationStore.loadDescriptors();
					!queryStore.hasLoadedDescriptors && queryStore.loadDescriptors();
					!queryResultStore.hasLoadedDescriptors && queryResultStore.loadResultDescriptors();
					!reportStore.hasLoadedDescriptors && reportStore.loadDescriptors();
				}}
			</Autorun>

			<Form as='div'>
				<fieldset>
					<legend>Source (Julia)</legend>
					<Form.Field>
						<Segment attached>
							<Input label="Julia Server:" labelPosition="left" fluid disabled readOnly value={julia.hostname}/>
						</Segment>
					</Form.Field>
					<Form.Field>
						<Segment attached>
							<Input label="Simulations:" labelPosition="left" fluid disabled readOnly
							       value={!simulationStore.hasLoadedDescriptors ? '...' : simulationStore.simulations.size.toLocaleString()}/>
							<Input label="Queries:" labelPosition="left" fluid disabled readOnly value={!queryStore.hasLoadedDescriptors ? '...' : queryStore.descriptors.size.toLocaleString()}/>
							<Input label="   with results:" labelPosition="left" fluid disabled readOnly
							       value={!queryResultStore.hasLoadedDescriptors ? '...' : queryResultStore.loadedResults.size.toLocaleString()}/>
							<Input label="Reports:" labelPosition="left" fluid disabled readOnly value={!reportStore.hasLoadedDescriptors ? '...' : reportStore.descriptors.size.toLocaleString()}/>
						</Segment>
					</Form.Field>
				</fieldset>

				<fieldset>
					<legend>Destination (Omdb)</legend>

					<Form.Field>
						<Segment attached>
							<Query query={gql`
							query mongoConfig {
								config { omdb { server db } }
							}`}>
								{({data, loading, error = null}) => {
										return <>
											<Input label="Mongo Server(s):" labelPosition="left" fluid disabled value={loading || error ? '...' : data.config.omdb.server}/>
											<Input label="Mongo Database:" labelPosition="left" fluid disabled value={loading || error ? '...' : data.config.omdb.db}/>
										</>
								}}
							</Query>
						</Segment>
						<Segment attached>
							<Query query={gql`
							query collectionSizes {
							omdb {
								simulation {count }
								query { count }
								report { count }
								#report { find(limit: 0) { queryTotal: total } } }
							}}`}>
								{({data, loading, error = null}) => {
									return <>
										<Input label="Simulations:" labelPosition="left" fluid disabled readOnly
										       value={loading || error ? '...' : data.omdb.simulation.count.toLocaleString()}/>
										<Input label="Queries:" labelPosition="left" fluid disabled readOnly
										       value={loading ||error  ? '...' : data.omdb.query.count.toLocaleString()}/>
										{/*<Input label="   with results:" labelPosition="left" fluid disabled readOnly*/}
										{/*value={!queryResultStore.hasLoadedDescriptors ? '...' : queryResultStore.loadedResults.size.toLocaleString()}/>*/}
										<Input label="Reports:" labelPosition="left" fluid disabled readOnly
										value={loading || error ? '...' : data.omdb.report.count.toLocaleString()}/>
									</>;
								}}
							</Query>
						</Segment>

					</Form.Field>
				</fieldset>

				<fieldset>
					<legend>Options</legend>
					<Form.Field>
						<Segment attached>
							<sem.FormCheckbox label="Overwrite existing records?"/>
						</Segment>
					</Form.Field>
				</fieldset>
			</Form>
		</div>
	}

}