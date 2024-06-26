import {UserFilesPage} from 'components/system/UserFile/UserFilesPage';
import * as React from 'react';
import {bp} from 'components';
import {action} from 'mobx';
import { i18n } from 'stores';

import { i18nMessages } from './i18nMessages';

interface MyProps {
	pageRef: UserFilesPage;
}

export class UserFileContextMenu extends React.Component<MyProps, {}> {

	render() {
		return <bp.MenuItem onClick={action(() => { this.props.pageRef.uploadFile = true; })} text={i18n.intl.formatMessage(i18nMessages.upload)} /> ;
	}
}