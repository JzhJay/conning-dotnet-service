import * as css from './SmartCard.css';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import {api, i18n, OmdbCardTag, OmdbUserTag, utility} from 'stores';
import {SortableCardsPanel, Highlighter} from 'components';

@observer
export class SmartCardTagLabel extends React.Component<{ className?: string, panel?: SortableCardsPanel, tag: OmdbCardTag | OmdbUserTag, value?: React.ReactNode | string | number, isTitle?: boolean, to?: ReactRouter.RoutePattern }> {
	render() {

		const {value, panel, tag, isTitle, to} = this.props;

		const className = classNames(this.props.className, css.tagLabel, {[css.isTitle]: isTitle});

		const canSort = false && panel && panel.props.tableColumns.some(f => f.canSort != false && f.name == tag);
		let text;
		if (value) {
			text = typeof value === 'number' ? value.toLocaleString() : value;
		} else if (tag) {
			if (tag["reserved"] !== false) {
				text = utility.formatLabelText(tag.name);
				text = _.get(i18n.databaseLookups.tags, [text], text);
			} else {
				text = tag.name;
			}
		} else {
			text = "";
		}

		if (!isTitle && typeof text == 'string') {
			text += ':';
		}

		if (text == null || text == "") {
			return null;
		}

		if (isTitle) {
			if (to) {
				return (<Link to={to} title={typeof text === 'string' ? text : null} className={className}>
					<Highlighter
						className={css.titleHighlighter}
						searchWords={panel && panel.searchText ? panel.searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
						textToHighlight={text ? text : ''}/>
				</Link>);
			}
			else {
				return <Highlighter
					title={typeof text === 'string' ? text : null}
					className={classNames(css.titleHighlighter, className)}
					searchWords={panel && panel.searchText ? panel.searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
					textToHighlight={text ? text : ''}/>
			}
		}
		else {
			return <span className={className}>
			{text}
		</span>;
		}
	}
}