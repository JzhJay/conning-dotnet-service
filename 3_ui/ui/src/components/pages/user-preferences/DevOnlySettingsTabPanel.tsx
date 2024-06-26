import {observer} from 'mobx-react';
import {settings, utility, julia, site, user, rsSimulationStore} from 'stores';
import {sem} from 'components'
import {Switch} from '@blueprintjs/core';
const {Form, Header, Segment, Input, Button, Card, List, ListItem, FormCheckbox} = sem;

@observer
export class DevOnlySettingsTabPanel extends React.Component<{}, {}> {
	render() {
		const {versionClient} = site;

		return (
			<Form as='div'>
				<fieldset>
					<legend>Connection Settings</legend>

					{/*<Form.Group widths='equal'>*/}
					<Form.Field>
						<Segment attached>
							<Input
								label="Julia Server"
								labelPosition="left"
								fluid
								placeholder={julia.hostname}
								onBlur={this.onJuliaServerChanged}
								onKeyDown={this.onJuliaServer_KeyDown}
								defaultValue={julia.hostname}

								ref={ref => {
									this.juliaServerInput = ref && ref['inputRef']
								}}
								action={<Button content="Reset Hostname"
								                onClick={() => julia.resetHostname()}/>}
							/>

							<FormCheckbox toggle defaultChecked={!settings.julia.disabled} label='Enable Julia'
							              onChange={() => {
								              settings.julia.disabled = !settings.julia.disabled;
								              julia.tryLoadDescriptors()
							              }}/>
						</Segment>
					</Form.Field>

					<Form.Field>
						<Header attached="top" content={`${site.productName}(${user.customerName}) Version:`}/>
						<Segment attached>
							<Input readOnly label="Client Version:" className="version" value={versionClient}/>
							{/*<Input readOnly label="Server Version:" className="version" value={systemInformation ? systemInformation.serverVersion : ''}/>*/}
						</Segment>
					</Form.Field>
				</fieldset>

				<fieldset>
					<legend>Feature Toggles</legend>
					<Form.Field>
						<Switch label="Reports" checked={settings.features.reports} onChange={() => {
							settings.features.reports = !settings.features.reports;

							julia.resetStores();
						}}/>
					</Form.Field>
				</fieldset>

				<fieldset>
					<legend>Licenses</legend>
					<Form.Field>
						<Header attached="top" content="Third-Party Components"/>
						<Segment attached>
							<List>
								<ListItem>React v{React.version}</ListItem>
								{/*<ListItem>Blueprint v${bp.version}</ListItem>*/}
								{/*<ListItem>Semantic UI v${bp.version}</ListItem>*/}
							</List>
						</Segment>
					</Form.Field>
				</fieldset>
			</Form>
		)
	}

	juliaServerInput: HTMLInputElement;
	onJuliaServerChanged = (event: React.SyntheticEvent<any>) => {
		if (this.juliaServerInput.value !== julia.hostname) {
			julia.overrideHost(this.juliaServerInput.value);
			//this.context.router.replace(Object.assign({}, this.props.location, {query: {juliaUrl: this.juliaServerInput.value}}));

			// this.context.router.replaceWith(this.context.router.getCurrentPathname(),
			// 								this.props.params, {groupBy: value});
			//
			// this.context.router.setQuery({juliaUrl: this.juliaServerInput.value});
		}
	}

	onJuliaServer_KeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.keyCode === utility.ENTER_KEY_CODE) {
			this.juliaServerInput.blur();
		}
		else if (event.keyCode === utility.ESC_KEY_CODE) {
			this.juliaServerInput.value = julia.hostname;
			this.juliaServerInput.blur();
		}
	}
}