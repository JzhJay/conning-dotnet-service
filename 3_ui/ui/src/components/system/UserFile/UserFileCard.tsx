import {IOmdbTag, OmdbCardTag} from '../../../stores/objectMetadata/OmdbTag';
import * as css from './UserFileCard.css'
import {appIcons, omdb, ObjectTypeQuery, UserFile, Query, apolloStore, IOmdbQueryGraph, OmdbCardSection, Report, Simulation, i18n, ClimateRiskAnalysis} from "stores";
import { observer } from 'mobx-react'
import { bp, SmartCard, SmartCardProps, SortableCardsPanel} from 'components';
import {computed, observable} from "mobx";
import { IconButton } from "../../blueprintjs/IconButton";
import {downloadFile} from '../../../utility';

interface MyProps extends SmartCardProps {
	userFile?: UserFile;
}

@observer
export class UserFileCard extends React.Component<MyProps, {}> {
	objectType = UserFile.ObjectType;

	render() {
		const { objectType, props, props:{className, loading, isTooltip, onDelete, onDuplicate} } = this;

		const overrideProps = {
			model: this.props.userFile,
			appIcon: this.props.appIcon || appIcons.cards.userFile.cardIcon,
			className: classNames(css.root, className),
		}

		return <SmartCard
			{...props}
			{...overrideProps}

			title={{name: 'name'}}
			titleIcons={<UserFileCardToolbarButtons disabled={loading} userFile={overrideProps.model} isTooltip={isTooltip} onDelete={onDelete} onDuplicate={onDuplicate}/>}
			onRename={async value => { overrideProps.model.rename(value); }}
		/>;
	}
}

@observer
export class UserFileCardToolbarButtons extends React.Component<{ disabled?: boolean, isTooltip?: boolean, userFile: UserFile, className?: string, onDelete: (id:string) => void, onDuplicate: (io) => void}, {}> {
	render() {
		const { props: { isTooltip, className, disabled, onDelete } } = this;

		let userFile = this.props.userFile;
		if (!(userFile instanceof UserFile)) {
			userFile = new UserFile(userFile);
		}

		return <bp.ButtonGroup className={classNames(className)}>
			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({defaultMessage: "Download File", description: "[UserFileCard] tooltip for button that downloads a file to the user's computer"})}>
				<IconButton icon={appIcons.queryTool.download} target="download" disabled={disabled} onClick={async () => {
					downloadFile(userFile.downloadLinkUrl)

				}}/>
			</bp.Tooltip>}
			{!isTooltip && <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.DELETE(UserFile.OBJECT_NAME_SINGLE)}>
				<IconButton icon={appIcons.cards.delete} disabled={disabled} onClick={async () => {
					let r = await userFile.delete();
					r != null && onDelete(userFile._id);
				}}/>
			</bp.Tooltip>}
		</bp.ButtonGroup>;
	}
}
