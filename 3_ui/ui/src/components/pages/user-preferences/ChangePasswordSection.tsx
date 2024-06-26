import {Button} from '@blueprintjs/core';
import {Form, Input} from 'semantic-ui-react';
import {bp, PanelSection} from '../../index';
import * as css from './ChangePasswordSection.css'
import {observer} from 'mobx-react';
import {} from 'components'
import {} from 'stores'

interface MyProps {

}

@observer
export class ChangePasswordSection extends React.Component<MyProps, {}> {
	render() {
		return (
			<PanelSection title='Change Password'
			              subtitle="Your password was changed ### days ago"
			              contents={<div>
				              <Form>
					              <Input label="Current Password:" type="password"/>
					              <Input label="New Password:" type="password"/>
					              <Input label="Confirm New Password:" type="password"/>
				              </Form>

				              <div className={css.actionFooter}>
					              <Button text="Save" large intent={bp.Intent.PRIMARY} onClick={this.tryUpdatePassword}/>
				              </div>
			              </div>}

			/>
		);
	}

	private tryUpdatePassword = () => {

	}
}
