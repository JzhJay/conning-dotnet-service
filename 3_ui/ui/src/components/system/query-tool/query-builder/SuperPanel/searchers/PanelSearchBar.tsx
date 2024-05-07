import {AccordionPanel, QueryPart} from 'stores/query';
import {AxisCoordinateSearcher, RangeSearcher} from './';
import * as css from './PanelSearchBar.css';
import {api} from 'stores';

interface MyProps {
	panel?: AccordionPanel;
	part: QueryPart;
}
export class PanelSearchBar extends React.Component<MyProps, {}> {
	render() {
		const {panel, part} = this.props;

		switch (part) {
			case 'time-steps':
			case 'variables': {
				return <AxisCoordinateSearcher searchModel={panel.searchModel}/>
			}

			case 'scenarios': {
				return <RangeSearcher panel={panel}/>
			}

			default: { return <div className={css.panelSearchBar}/>}
		}

		return null;
	}
}