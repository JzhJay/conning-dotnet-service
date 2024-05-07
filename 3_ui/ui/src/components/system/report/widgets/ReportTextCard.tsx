import {appIcons, ReportText} from "stores";
import {observer} from 'mobx-react'
import {sem, bp, SmartCard} from 'components';
import * as css from './ReportTextCard.css';
import { ReportTextComponent } from "./ReportTextComponent";

interface MyProps {
	text?: ReportText;
	isTooltip?: boolean;
	style?: React.CSSProperties;
	className?: string;
	readonly?: boolean;
}

@observer
export class ReportTextCard extends React.Component<MyProps, {}> {
	render() {
		const {props: {text, style,readonly, className, isTooltip }} = this;

		return (
			<SmartCard style={style}
			           className={classNames(css.root, className, {[css.isTooltip]: isTooltip })}
			           model={text}
			           title={{value: text.name}}
			           appIcon={appIcons.cards.query.cardIcon}
			           isTooltip={isTooltip}
			           readonly={readonly}
			           titleIcons={(<div>
				              <bp.Tooltip  content="Delete">
					              <bp.Button icon="trash" onClick={() => text.delete}/>
				              </bp.Tooltip>
			              </div>).props.children}>
				<sem.Card.Content>
					<ReportTextComponent item={text} isTooltip />
				</sem.Card.Content>
			</SmartCard>);
	}
}
