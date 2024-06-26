import * as css from './QueryViewRequirementsTooltip.css';
import { QueryResult, QueryViewAvailability } from 'stores'
import { observer } from 'mobx-react'
import { FormattedMessage } from 'react-intl';
import {bp} from 'components'

interface QueryViewRequirementsTooltipProps {
	view: QueryViewAvailability;
	bootstrapNotSupported: boolean;
	sensitivityNotSupported?: boolean;
}

@observer
export class QueryViewRequirementsTooltip extends React.Component<QueryViewRequirementsTooltipProps, {}> {
	render() {
		const { view: { requirements, available, description, name }, bootstrapNotSupported, sensitivityNotSupported = true } = this.props;

		return (<div className={css.root}>
			<span className={css.title}>{description}</span>
			{sensitivityNotSupported &&
			<div className={css.requirements}>
				<div className={classNames(css.requirement, { [css.met]: false })}>
					<bp.Icon icon='small-cross'/>
					<span className={css.description}><FormattedMessage defaultMessage="Sensitivity is not supported for this view" description="[Query] Message for query result view which doesn't support sensitivity"/></span>
				</div>
			</div> }

			{bootstrapNotSupported ? (<div className={css.requirements}>
				                       <div key={"bootstrapNotSupported"} className={classNames(css.requirement, { [css.met]: false })}>
					                       <bp.Icon icon='small-cross'/>
					                       <span className={css.description}><FormattedMessage defaultMessage="Bootstrap is not supported for this view" description="[Query] Message for query result view which doesn't support Bootstrap"/></span>
				                       </div>
			                       </div>) :
			 (requirements && requirements.length > 0 && <div className={css.requirements}>
				 {_.sortBy(requirements, 'met').map(({ met, description }, i) => [
					 <div key={i.toString()} className={classNames(css.requirement, { [css.met]: met })}>
						 <bp.Icon icon={met ? 'small-tick' : 'small-cross'}/>
						 <span className={css.description}>{description}</span>
					 </div>
				 ])} </div>)
			}
		</div>)
	}
}