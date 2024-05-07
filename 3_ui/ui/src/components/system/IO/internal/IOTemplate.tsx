import {Button} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import * as React from 'react';
import {IO} from '../../../../stores/io';
import * as css from './IOTemplate.css'

@observer
export class IOTemplate extends React.Component<{io: IO}, {}> {

	render() {
		const {io} = this.props;

		return <div className={css.root}>
			<span className={css.title}>Layout Templates:</span>
			<Button text={"Blank"} large={true} onClick={() => io.createPagesFromTemplate(null)}/>
			<Button text={"Compact Inputs"} large={true} onClick={() => io.createPagesFromTemplate(false)}/>
			<Button text={"Novice Step-by-Step"} large={true} onClick={() => io.createPagesFromTemplate(true)}/>
		</div>
	}
}