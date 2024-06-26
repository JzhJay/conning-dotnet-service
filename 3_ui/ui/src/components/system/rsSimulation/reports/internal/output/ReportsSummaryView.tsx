import {IconNames} from '@blueprintjs/icons';
import {observer} from 'mobx-react';
import { bp } from 'components';
import {i18n} from 'stores';
import * as css from './ReportsSummaryView.css';

@observer
export class ReportsSummaryView extends React.Component<{
	errorList: string[]
}, any> {

	render() {
		const {errorList} = this.props;

		if (!errorList?.length) {
			return <bp.Callout title={i18n.intl.formatMessage({defaultMessage: "All Tests Passed!", description: "[ReportsSummaryView] all tests passed"})} intent={bp.Intent.SUCCESS} className={css.root} />
		}

		return <bp.Callout title={i18n.intl.formatMessage({defaultMessage: `{mLength} Failed Tests`, description: "[ReportsSummaryView] has some failed tests"}, {mLength: errorList.length})} intent={bp.Intent.DANGER} icon={IconNames.CROSS} className={css.root} >
			<bp.Card className={css.errorList} elevation={2}>{
				_.map(errorList, (s,i) => {
					return <div key={`ReportsSummaryView_msg${i}`} className={css.errorItem}>{s}</div>
				})
			}</bp.Card>
		</bp.Callout>;
	}

}