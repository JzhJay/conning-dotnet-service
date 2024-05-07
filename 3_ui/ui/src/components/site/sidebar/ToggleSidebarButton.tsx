import { observer } from 'mobx-react';
import { settings, appIcons } from "stores"
import { AppIcon, bp} from 'components';
import * as css from './ToggleSidebarButton.css';

@observer
export class ToggleSidebarButton extends React.Component<{ className?: string }, {}> {
	render() {
		const { sidebar } = settings;
		const { props } = this;

		return (
			<bp.Tooltip className={props.className}  content='Toggle Sidebar'>
				<bp.Button className={classNames( css.button)}
				           minimal
				           active={sidebar.show}
				           data-active={sidebar.show}
				           onClick={() => sidebar.show = !sidebar.show}>
					<AppIcon icon={appIcons.sidebar.toggle}/>
				</bp.Button>
			</bp.Tooltip>)
	}
}

//
// {/*<Tooltip position={Position.BOTTOM} content="Toggle Sidebar" className={props.className}>*/}
// // </Tooltip>)