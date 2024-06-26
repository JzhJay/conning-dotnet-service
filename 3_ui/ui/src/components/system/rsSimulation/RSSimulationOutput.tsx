import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {appIcons, i18n} from 'stores';
import {RSSimulation} from '../../../stores/rsSimulation';
import {AppIcon, bp, IconButton, sem} from '../../index';
import * as css from './RSSimulationOutput.css';

interface MyProps {
	rsSimulation: RSSimulation;
}

export class RSSimulationEmptyOutput extends React.Component<{}, {}> {
	render() {
		return <bp.Callout
			title={i18n.intl.formatMessage({defaultMessage: "No results available", description: "[RSSimulationEmptyOutput] the message box title for output page ask run simulation first"})}
			intent={bp.Intent.WARNING}
		>
			<FormattedMessage
				defaultMessage={"Run simulation to generate output files."}
				description={"[RSSimulationEmptyOutput] the message box description for output page ask run simulation first"}
			/>
		</bp.Callout>;
	}
}


@observer
export class RSSimulationOutput extends React.Component<MyProps, {}> {

	render() {
		const {rsSimulation} = this.props;

		return (
			<div className={css.root}>
				{rsSimulation.isComplete ? <RSSimulationResult rsSimulation={rsSimulation} /> : <RSSimulationEmptyOutput /> }
			</div>
		);
	}
}

@observer
class RSSimulationResult extends React.Component<MyProps, {}>{

	render() {
		const {rsSimulation} = this.props;
		return <table className={classNames(bp.Classes.HTML_TABLE, bp.Classes.INTERACTIVE, css.resultTable)}>
			<thead>
			<tr>
				<th></th>
				<th>File Name</th>
				<th>Description</th>
				<th></th>
				<th>File Size</th>
			</tr>
			</thead>
			<tbody>
			{rsSimulation.outputFiles.map((o,i) => {
				return (
					<tr key={i}>
						<td className={css.fileIcon}><AppIcon icon={RSSimulation.isZipFile(o)?appIcons.simulation.zip:appIcons.simulation.file}/></td>
						<td className={css.title}>{o.title}</td>
						<td className={css.description}>{o.description}</td>
						<td className={css.download}>
							<IconButton icon={appIcons.simulation.download} className={bp.Classes.MINIMAL} onClick={() => rsSimulation.downloadFile(o)} text={"Download"}/>
						</td>
						<td className={css.fileSize}>{RSSimulation.byteToMegabyte(o.bytes)}MB</td>
					</tr>)
			})}
			{/* !rsSimulation.hadZipFile && <tr>
				<td className={css.fileIcon}></td>
				<td colSpan={4}><sem.Loader active inline size="tiny"></sem.Loader>&nbsp;&nbsp;<span>Compressing all files to an archive file...</span></td>
			</tr> */}
			</tbody>
		</table>;
	}
}
