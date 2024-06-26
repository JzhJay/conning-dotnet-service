import { Dialog } from '@blueprintjs/core';

import { EvaluationComparisonUserOptions} from 'stores';
import type { EvaluationDetail } from '../../../../../stores/io';
import { IO, IOView, IOPage } from '../../../../../stores/io';
import EvaluationComparisonView from './EvaluationComparisonView';

import * as css from './EvaluationComparisonOverlay.css';

interface MyProps {
	io: IO;
	view: IOView;
	page: IOPage;
	userOptions: EvaluationComparisonUserOptions;
	isOpen: boolean;
	evaluation1: EvaluationDetail;
	evaluation2: EvaluationDetail;
	onClose: () => void;
}

export class EvaluationComparisonOverlay extends React.Component<MyProps, {}> {
	render() {
        const { io, isOpen, evaluation1, evaluation2, view, page, userOptions, onClose } = this.props;
        
        return (
			<Dialog isOpen={isOpen} onClose={onClose} title="Evaluation Comparison" className={css.evaluationComparisonDialog}>
				<EvaluationComparisonView className={css.evaluationComparisonDialogContent} io={io} view={view} page={page} userOptions={userOptions} evaluation1={evaluation1} evaluation2={evaluation2} />
			</Dialog>
        );
    }
}
