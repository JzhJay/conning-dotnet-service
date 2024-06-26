import {i18n} from 'stores';
import type { PartProps } from '../';
import { SuperPanelComponent } from '../';

import {observer} from 'mobx-react';

@observer
export class ScenariosPanel extends React.Component<PartProps, {}> {
	render() {
		const { query } = this.props;

		return <SuperPanelComponent part={"scenarios"}
		                            title={i18n.intl.formatMessage({defaultMessage: `Scenarios`, description: "[ScenariosPanel] the query input panel title"})}
									query={query}
									panels={[query._variables.scenarios.panel]}/>
	}
}


