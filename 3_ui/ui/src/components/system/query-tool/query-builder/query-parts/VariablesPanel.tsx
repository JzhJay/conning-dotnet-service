import {computed} from 'mobx';
import type {PartProps} from '../';
import {SuperPanelComponent} from '../';
import {utility, mobx, i18n} from 'stores';
import {observer} from 'mobx-react';

interface MyProps extends PartProps {
}

@observer
export class VariablesPanel extends React.Component<MyProps, {}> {

	@computed get panels() {
		const {query} = this.props;
		const panels = mobx.values(query._variables.clauses).filter(c => c.id !== 0).map(c => c.panel);
		return query.isVariablesPage ? panels.filter(panel => panel.id === query.currentPage.clause): panels;
	}

	render() {
		const {query}     = this.props;
		return <SuperPanelComponent part="variables"
		                            onAccordionPanelTitle={panel => utility.numberWithCommas(panel.selected)}
		                            title={i18n.intl.formatMessage({
			                            defaultMessage: `Variables ({variables})`,
			                            description:    "[VariablesPanel] the query input panel title"
		                            }, { variables: `${utility.numberWithCommas(_.get(query, ['_variables', 'selected'], 0))}`})}
		                            onAddPanel={query._variables.addClause}
		                            onDeletePanel={query._variables.clauses.size > 2 ? (panel) => query._variables.deleteClause(panel.id) : async () => {}}
		                            panels={this.panels}
		                            query={query}
		/>
	}
}
