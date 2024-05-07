import screenfull from 'screenfull';
import { observer } from "mobx-react";
import {bp} from 'components';

interface MyProps {

}

@observer
export class ToggleFullScreenButton extends React.Component<MyProps, {}> {
	render() {
		return screenfull.isEnabled ?
			<bp.Tooltip className='toggle-full-screen' content='Toggle Full Screen'>
				<bp.Button className={classNames(bp.Classes.MINIMAL)}
				           icon='fullscreen'
				           onClick={() => screenfull.isEnabled && screenfull.toggle()}/>
			</bp.Tooltip> : ""
	}
}