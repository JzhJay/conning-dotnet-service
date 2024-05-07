import * as css from './AxisCoordinateSearchResult.css';
import {api, settings, appIcons} from 'stores';
import {AccordionPanel, QueryAxis, AxisCoordinate, AxisCoordinateSearchResultModel} from 'stores/query';
import {observer} from 'mobx-react'
import {autorun} from 'mobx';
import Highlighter from 'react-highlight-words';
const scrollIntoView = require('scroll-into-view') as __ScrollIntoView.ScrollIntoView;

interface MyProps {
	className?: string;
	panel: AccordionPanel;
	index: number;
	result?: AxisCoordinateSearchResultModel;
	showScore?: boolean;
	style?: any;
}

export class AxisCoordinateSearchResult extends React.Component<MyProps, {}> {
	render() {
		const {
			      className, showScore,
			      panel, panel: {searchModel, searchModel: {searchText, searchAxis, searchIndex, selectResult}}, result, index, style
		      }            = this.props;
		const {expertMode} = settings.query;

		const selected     = index === searchIndex;

		if (result) {
			const {axis, coord} = result;
			const acc           = panel.accordionByAxisId(axis.id);

			const highlightArray = _.isEmpty(searchText) ? [] : searchText.split('=').map(s => api.utility.escapeRegExp(s.trim()));
			if (searchAxis) { highlightArray.shift(); }

			return <div className={classNames(css.root, className, {[css.selected]: selected, [css.unavailable]: acc.unavailable, [css.implied]: acc.isOnlyAvailableItemSelected})}
			            style={style}
			            onClick={() => selectResult(result)}
			            onMouseEnter={() => searchModel.searchIndex = index}
			            tabIndex={index}>
				{showScore && <span className={css.score}>{result.score}</span>}
				{!expertMode && <span className={css.typeLabel}>{coord ? 'Coordinate' : 'Axis'}</span>}
				<div className={css.header}>
					{/*<span className={css.axis}> <HighlightedText highlightedText={highlightText}>{axis.label}</HighlightedText></span>*/}
					<span className={css.axis}><Highlighter searchWords={highlightArray} textToHighlight={axis.label}/></span>
					=
					{coord && <span className={css.coordinate}><Highlighter searchWords={highlightArray} textToHighlight={coord.label}/></span> }
				</div>
				{!expertMode && ((coord && coord.description) || axis.description) &&
				<span className={css.description}>
						<Highlighter searchWords={highlightArray} textToHighlight={coord ? coord.description : axis.description}/>
					</span>}
			</div>
		}
		else {
			return <div className={classNames(css.root, className, css.selected)}
			            tabIndex={index}>
				<div className={css.description}>
					No results were found.
				</div>
			</div>
		}
	}
}