import {bp, CopyLocationContextMenuWrapper} from 'components';
import { action, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {BookPage} from '../../../../../stores/book/BookPage';
import { BookView } from 'ui/src/stores/book/BookView';
import {ClimateRiskAnalysis, DescriptionUserOptions, xhr} from 'stores';
import { formatNumberWithCommas } from 'utility';

import * as css from './DescriptionInput.css';
import * as layoutCss from '../../../inputSpecification/InputSpecificationComponent.css';
import * as reportCss from '../../../../../utility/pdfExport.css';


interface DescriptionInputProps {
	climateRiskAnalysis: ClimateRiskAnalysis,
	allowScrolling: boolean,
	page: BookPage;
	view: BookView;
}

@observer
export class DescriptionInput extends React.Component<DescriptionInputProps, any> {
    @action onBaseCurrencyChange = (val: string) => {
		const { page, view } = this.props;
		const userOptions = page.getViewUserOptions(view.id);
		userOptions.baseCurrency = val;
		page.updateUserOptions(view.id, userOptions)
	}

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    render() {
		const { climateRiskAnalysis, page, view } = this.props;
		const userOptions:DescriptionUserOptions = view.userOptions;

		return <CopyLocationContextMenuWrapper locationPath={["Title"]} nodeAttrs={{
			"className": classNames(layoutCss.root, css.rootRows),
			"style": {overflow: this.props.allowScrolling ? null : 'auto'},
			"data-component-name": "DescriptionInput"
		}}>
			{ page.showViewCaption &&
			<div className={css.viewCaption}>
				<div className={css.productDetails}>Portfolio Details:</div>
				<div className={css.otherInfo}>
					<div className={css.fieldName}>Name:</div>
					<div className={css.fieldValue}>{climateRiskAnalysis.name}</div>
					<div className={css.fieldName}>Base Currency:</div>
					<div className={css.fieldValue}>
						<bp.EditableText multiline={false} minLines={1} onChange={this.onBaseCurrencyChange} value={userOptions.baseCurrency} />
					</div>
					<div className={css.fieldName}>Starting Market Value:</div>
					<div className={css.fieldValue}>{`${userOptions.baseCurrency} ${formatNumberWithCommas(climateRiskAnalysis.inputState.startingMarketValue)}`}</div>
				</div>
			</div>
			}
			<div className={`${css.main} ${reportCss.viewMainBlock}`}>
				<div className={css.inputTitle}>
					<div className={css.textArea}>
						<bp.EditableText
							className={css.inputTitleText}
							multiline={true}
							minLines={3}
							onConfirm={this.onTitleConfirm}
							placeholder="Title"
							defaultValue={this.props.climateRiskAnalysis.inputState.title}
						></bp.EditableText>
					</div>
				</div>
				<div className={css.inputDescription}>
					<div className={css.textArea}>
						<bp.EditableText
							multiline={true}
							minLines={3}
							onConfirm={this.onDescriptionConfirm}
							placeholder="Description"
							defaultValue={this.props.climateRiskAnalysis.inputState.description}
						></bp.EditableText>
					</div>
				</div>
			</div>
		</CopyLocationContextMenuWrapper>;
	}

    onTitleConfirm = (newTitle) => {
		if (newTitle != null) {
			xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/title`, {
				title: newTitle
			}).then(() => {
				this.props.climateRiskAnalysis.inputState.title = newTitle;
			});
		}
	}

    onDescriptionConfirm = (newDescription) => {
		if (newDescription != null) {
			xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/description`, {
				description: newDescription
			}).then(() => {
				this.props.climateRiskAnalysis.inputState.description = newDescription;
			});
		}
	}
}