import {i18n} from 'stores';
import type { PartProps } from '../';
import { SuperPanelComponent } from '../';
import {observer} from 'mobx-react';

@observer
export class TimeStepsPanel extends React.Component<PartProps, {}> {
	render() {

//extraToolbarPlaceholder={`e.g. ${_.first(values).label}-${_.last(values).label}`}
		const { query }     = this.props;

		return <SuperPanelComponent part={"time-steps"}
		                            title={i18n.intl.formatMessage({defaultMessage: `Time-Steps`, description: "[TimeStepsPanel] the query input panel title"})}
									query={this.props.query}
									panels={[query._variables.timesteps.panel]} />
	}
}
