import { bp } from 'components';
import { sem } from '../../index';

import * as css from './ExportPdfProgressDialog.css';

interface MyProps {
	isOpen: boolean;
	progress: number;
	title?: string;
}

export class ExportPdfProgressDialog extends React.Component<MyProps, {}> {
	render() {
		const { isOpen, progress, title } = this.props;

		return (
			<bp.Dialog isOpen={isOpen} className={css.root}>
				<sem.Header size="small" icon>
					<sem.Icon name="file pdf outline" />
					{ title || 'Exporting page to PDF ...' }
				</sem.Header>
				<sem.Progress 
					value={progress*100}
					total={100}
					autoSuccess
					active={true}
					color="green"
					label={`${Math.round(progress * 100)}%`}
				/>
			</bp.Dialog>
		);
	}
}
