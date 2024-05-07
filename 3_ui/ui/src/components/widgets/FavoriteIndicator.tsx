import { bp,  AppIcon } from 'components';
import { appIcons, i18n } from 'stores';
import * as css from './FavoriteIndicator.css';
import { action } from 'mobx';
import { observer } from "mobx-react";

interface MyProps {
	model?: { isFavorite: boolean };
	className?: string;
	hasTooltip?: boolean;
}

@observer
export class FavoriteIndicator extends React.Component<MyProps, {}> {
	@action
	toggleFavorite = () => {
		const { model } = this.props;
		if (model) {
			model.isFavorite = !model.isFavorite;
		}
	}

	render() {
		const { model, hasTooltip, className } = this.props;

		return ( <bp.Tooltip disabled={!model || !hasTooltip} position={bp.Position.BOTTOM}
		                   className={classNames(css.root, { [css.isFavorite]: model && model.isFavorite })}
		                   content={model && model.isFavorite ? i18n.intl.formatMessage({defaultMessage: `This is a Favorite`, description: "[FavoriteIndicator] Tooltip that indicates that the object is a favorite (ranked higher than other items)"}) : i18n.intl.formatMessage({defaultMessage: `Favorite this item`, description: "[FavoriteIndicator] Tooltip for a button that marks this object as a favorite (rank higher than other items)"})}>
			<a onClick={this.toggleFavorite}>
				<AppIcon title={""}
				         icon={model && model.isFavorite ? appIcons.favorite.checked : appIcons.favorite.unchecked}/>
			</a>
		</bp.Tooltip>)
	}
}