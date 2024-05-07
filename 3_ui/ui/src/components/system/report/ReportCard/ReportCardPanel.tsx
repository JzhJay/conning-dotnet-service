import {ButtonGroup} from '@blueprintjs/core';
import * as css from './ReportCardPanel.css';
import { observer } from "mobx-react";

interface MyProps {
	title?: string;
	icon?: React.ReactNode;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
	actions?:React.ReactNode | React.ReactNode[];
	style?: React.CSSProperties;
}

@observer
export class ReportCardPanel extends React.Component<MyProps, {}> {
	render() {
		const {props: {title, actions, className, style, children}} = this;

		return <div className={classNames(className, css.root)} style={style}>
			<div className={css.header}>
				<span className={css.title}>{title}</span>
				{actions && <ButtonGroup className={classNames(css.actions)}>
					{actions}
				</ButtonGroup>}
			</div>
			<div className={css.content}>
				{children}
			</div>
		</div>
		// {showTitle && <sem.Card.Content>
		// 	<sem.Card.Header>
		// 		<bp.Tooltip className="right floated" content="Add a Simulation" >
		// 			<bp.AnchorButton icon="plus" onClick={() => report.addSimulationSlot()}/>
		// 		</bp.Tooltip>
		// 	</sem.Card.Header>
		// </sem.Card.Content>}

	}
}