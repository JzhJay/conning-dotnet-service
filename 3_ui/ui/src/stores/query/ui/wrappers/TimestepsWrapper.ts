import {Query, AccordionPanel, mobx, i18n} from 'stores'
import {VariableClauseWrapper} from '.';

export class TimestepsWrapper {
	dispose = () => {
		this.panel.dispose();
	}

	get selected() : number {
		return _.sumBy(this.clauseAxes, a => a.selectedAndAvailable);
	}

	get available() : number {
		return _.sumBy(this.clauseAxes, a => a.available.length);
	}

	get clauseAxes() {
		const {query} = this;
		return mobx.values(this.clause.axes).filter(a => query.axisById(a.id).code === 'Time');
	}

	get axis() {
		return this.query.axisByCode('Scenario');
	}

	get panelTitle() {
		return i18n.intl.formatMessage({
			defaultMessage: `{count} of {total}`,
			description: "[AccordionPanelToolbarTitle] a panel tool title - display how many item selected"
		}, {count: this.selected, total: this.available});
	}

	panel : AccordionPanel;

	constructor(private query: Query, private clause: VariableClauseWrapper) {
		this.panel = new AccordionPanel(query, {
			part:     'time-steps',
			clause: clause
		})
	}
}

