import * as React from 'react';
import {bp, dialogs} from 'components';
import {climateRiskAnalysisStore} from '../../../stores/climateRiskAnalysis';
import {OmdbTagForm} from '../ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';


export class ClimateRiskAnalysisBrowserMenu extends React.Component<{}, {}> {
	render() {
		return <bp.Menu>
			<bp.MenuItem text="New Climate Risk Analysis" icon="document" onClick={() => {
				OmdbTagForm.hasRequiredUserTagsByObjectType("ClimateRiskAnalysis").then( hasRequired => {
					if (hasRequired) {
						dialogs.newClimateRiskAnalysis();
					} else {
						climateRiskAnalysisStore.createNewClimateRiskAnalysis();
					}
				});
			}}/>
		</bp.Menu>
	}
}