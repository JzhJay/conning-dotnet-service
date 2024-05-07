import {i18n} from 'stores';
import {Query} from 'stores/query'
import { computed, observable, action, toJS, autorun, makeObservable } from 'mobx';
import {AccordionPanel} from '../';
import {VariableClauseWrapper} from '.';

export class ScenariosWrapper {
	dispose = () => {
		this.panel.dispose();
	}

	get selected() : number {
		return this.scenarioSelections.selected.length;
	}

	get available() : number {
		return this.scenarioSelections.available.length;
	}

	@computed get scenarioSelections() {
		return this.clause.axes.get(this.axis.id.toString());
	}

	@computed get axis() {
		return this.query.axisByCode('Scenario');
	}

	@computed get panelTitle() {
		return i18n.intl.formatMessage({
			defaultMessage: `{count} of {total}`,
			description: "[AccordionPanelToolbarTitle] a panel tool title - display how many item selected"
		}, {count: this.selected, total: this.available});
	}

	panel : AccordionPanel;

	constructor(private query: Query, private clause: VariableClauseWrapper) {
        makeObservable(this);
        this.panel = new AccordionPanel(query, {
			part:     'scenarios',
			clause: clause
		})
    }
}

