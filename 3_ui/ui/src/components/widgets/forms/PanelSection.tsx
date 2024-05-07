import * as css from './PanelSection.css'
import {observer} from 'mobx-react';
import {sem} from 'components'
import {} from 'stores'
import { observable, makeObservable } from 'mobx';

interface MyProps {
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	contents?: React.ReactNode;
	actionBar?: React.ReactNode;
	className?: string;
	collapsible?: boolean;
	style?: React.CSSProperties;
}

@observer
export class PanelSection extends React.Component<MyProps, {}> {
    @observable expanded = false;

    static defaultProps = {
		collapsible: true
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const {expanded, props: {children, className, title, subtitle, contents, style, actionBar, collapsible}} = this;

		const opened = expanded || !collapsible;

		return (
			<div className={classNames(className, css.root, {[css.opened]: opened})} style={style}>
				<div className={css.titlebar}>
					<span className={css.title}>{title}</span>
					{actionBar
					 ? actionBar
					 : (contents || children) && collapsible && <sem.Button
						size="mini"
						onClick={() => this.expanded = !expanded}
						content={expanded ? 'close' : 'expand'}
					/>}
				</div>
				{subtitle && <span className={css.subtitle}>
					{subtitle}
				</span>}
				{(contents || children) ?
				 collapsible
				 ? <Collapse className={css.contents} isOpened={opened}>
					 {contents}
					 {children}
				 </Collapse>
				 : <div className={css.contents}>
					 {contents}
					 {children}
				 </div>
                    : null}
			</div>
		)
	}
}
