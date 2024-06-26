import * as css from './DashboardNews.css';
import {observer} from 'mobx-react';
import {bp, sem} from 'components'
import {computed} from 'mobx';

export interface NewsItem {
	leed: string;
	body: string;
}

interface MyProps {
	newsItems?: NewsItem[];
}

@observer
export class DashboardNews extends React.Component<MyProps, {}> {
	static defaultProps = {
		newsItems: [
			{leed: 'New Report for ORSA in beta', body: 'Helping meet...'},
			{leed: 'Version 8.1.2 of ADVISE released', body: 'Helping meet...'},
			{leed: 'North American User Group Meeting Announced', body: 'Helping meet...'}
		]
	}

	render() {
		const {props: {newsItems}} = this;
		return (
			<div className={css.root}>
				<div className="masthead">
					<div className="ui container">
						<h1 className="ui header">
							News:
						</h1>
						<div className="ui hidden divider"/>

						<sem.List>
							{newsItems.map((item, i) =>
								<sem.List.Item className={css.newsItem}>{item.leed}: {item.body} </sem.List.Item>
							)}
						</sem.List>
					</div>
				</div>
			</div>
		);
	}
}