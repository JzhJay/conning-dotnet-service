import {ProgressDialog} from 'components/system/rsSimulation/internal/ProgressDialog';
import {observer, useLocalObservable} from 'mobx-react';
import {ITemplateFilter} from 'stores/rsSimulation/models';
import {BlueprintDialog, bp} from 'components';
import {action} from 'mobx';
import * as React from 'react';
import {useCallback} from 'react';
import {ParameterTemplateOptions} from 'components/system/simulation/ParameterTemplateOptions';
import {RSSimulation, i18n, site} from 'stores';
import * as css from './GetTemplateDialog.css';

export const ICON: bp.IconName = "search-template"
export const TITLE = {
	DEFAULT: i18n.intl.formatMessage({defaultMessage: "Select Template", description: "[GetTemplateDialog] dialog title when user choosing template file"}),
	PROGRESS: i18n.intl.formatMessage({defaultMessage: "Get Template...", description: "[GetTemplateDialog] dialog title when the file is uploading and importing"})
}
export const GetTemplateDialog = observer((props: {rsSimulation: RSSimulation}): JSX.Element => {
	let store: { templateFilter: ITemplateFilter } = useLocalObservable(() => {
		return {
			templateFilter:  null
		}
	});

	const saveTemplateFilter = useCallback(action((templateFilter) => {
		store.templateFilter = templateFilter;
	}), []);

	const onOK = useCallback(async () => {
		try {
			site.busy = true;
			await props.rsSimulation.setTemplate(store.templateFilter);
			setTimeout(() => site.setDialogFn(() => <ProgressDialog
				progress={props.rsSimulation.templateProgress}
				title={TITLE.PROGRESS}
				icon={ICON}
			/>), 0);
		}
		finally {
			site.busy = false;
		}
		return null;
	}, []);

	return <BlueprintDialog
		className={classNames(css.root, css.dialog)}
		icon={ICON}
		title={TITLE.DEFAULT}
		isCloseButtonShown={true}
		canCancel={true}
		okDisabled={false}
		ok={onOK}

	>
		<ParameterTemplateOptions saveTemplateFilter={saveTemplateFilter}/>
	</BlueprintDialog>;
})