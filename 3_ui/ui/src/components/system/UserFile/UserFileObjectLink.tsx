import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {ObjectLink, ObjectLinkProps} from 'components/widgets/SmartBrowser/ObjectLink';
import {appIcons, UserFile, userFileStore} from 'stores';

export class UserFileObjectLink extends React.Component<ObjectLinkProps<UserFile>, any> {
	render() {
		return <ObjectLink<UserFile>
			objectType={UserFile.ObjectType}
			icon={appIcons.cards.userFile.cardIcon}
			modelLoader={async (id) => userFileStore.userFiles?.has(id) ? userFileStore.userFiles.get(id) : userFileStore.loadDescriptor(id)}

			popupContent={(model) => <UserFileCard userFile={model} showHeader={false} isTooltip/> }

			linkTo={model => UserFile.urlFor(model._id)}
			linkContent={model => model.name}

			{...this.props}
		/>;
	}
}