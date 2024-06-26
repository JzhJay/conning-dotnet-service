import {TreeNodeInfo} from '@blueprintjs/core';
import {IconNames} from '@blueprintjs/icons';
import classNames from 'classnames';
import {bp, Option} from 'components';
import {findOption} from 'components/system/IO/internal/inputs/utility';
import {FormattedMessage} from 'react-intl';
import {i18n, Reports} from 'stores';
import {TreePreviewCardGrid} from '../../internal/TreePreviewCardGrid';
import {ReportsPage} from '../ReportsPage';
import {computed, makeObservable} from 'mobx';
import {observer} from 'mobx-react';
import * as css from './ReportsSummaryPage.css';
import * as cardGridCss from '../../internal/TreePreviewCardGrid.css';

interface ReportsSummaryPageProps {
	reports: Reports;
	activePath: string[];
	onNavigate: (pageId: string) => void;
}

interface ReportsOption {
	option:Option;
	path: string[];
}

@observer
export class ReportsSummaryPage extends React.Component<ReportsSummaryPageProps, any> {
	static REPORT_ICON: bp.IconName = IconNames.BOOK;

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@computed get interfaceOption() {
		const {reports, activePath} = this.props;
		return reports.findOption(activePath);
	}

	covertOptionToTreeInfo = (option:Option, path: string[], stopCondition: (o:Option)=> boolean): TreeNodeInfo<Option> | null => {
		if (stopCondition(option)) {
			return {
				id: path.join("."),
				label: option.title || option.name,
				icon: Reports.optionIsReport(option) ? ReportsSummaryPage.REPORT_ICON : null,
				nodeData: option,
				hasCaret: false
			};
		}
		const {options, ...newOption} = option;
		let newOpts = _.map(options, opt => {
			return this.covertOptionToTreeInfo(opt, [...path, opt.name], stopCondition);
		});
		newOpts = _.filter(newOpts, opt => opt != null);
		return newOpts?.length ? {
			id: path.join("."),
			label: newOption.title || newOption.name,
			icon: Reports.optionIsReport(option) ? ReportsSummaryPage.REPORT_ICON : null,
			nodeData: newOption,
			isExpanded: true,
			hasCaret: true,
			childNodes: newOpts
		} : newOption?.name == Reports.OUTPUT_PATH_NAME ? {
			id: path.join("."),
			label: newOption.title || newOption.name,
			icon: <bp.Spinner size={50} />,
			nodeData: newOption,
			hasCaret: false
		} : null;
	}

	@computed get reportFolders(): TreeNodeInfo {
		const folders: ReportsOption[] = [];

		const findReport = (option: Option, path: string[]) => {
			const newPath = [...path, option.name];
			const reports = _.filter(option.options, o => Reports.optionIsReport(o));
			if (_.size(reports) > 0) {
				folders.push({option: _.assign({}, option, {options: reports}), path: newPath});
			} else {
				_.map(option.options, (o) => findReport(o, newPath));
			}
		}

		findReport(
			this.interfaceOption,
			this.props.activePath.slice(0, -1)
		);

		if (folders.length == 1 && folders[0].option.name == this.interfaceOption.name) {
			return this.covertOptionToTreeInfo(
				folders[0].option,
				folders[0].path,
				Reports.optionIsReport
			)
		}

		return {
			id: "dummyParent",
			label: "dummyParent",
			childNodes: _.map(folders, ro => this.covertOptionToTreeInfo(
				ro.option,
				ro.path,
				Reports.optionIsReport
			))
		}
	}

	@computed get completedReports(): ReportsOption[] {
		const reports = this.props.reports;
		const activePathString = this.props.activePath.join('.');
		const completedReportPaths: string[][] = _.filter(
			reports.userInterface?.completedReportPaths,
			path => path.join('.').indexOf(activePathString) == 0
		);

		const completedReport = _.map<string[], ReportsOption>(
			completedReportPaths,
			path => ({option: reports.findOption(path), path})
		);

		return _.filter(
			completedReport,
			ro => !!ro?.option
		);
	}

	onTreeNodeClick: bp.TreeEventHandler<Option> = (node) => {
		this.props.onNavigate(_.toString(node.id));
	}

	render() {
		if (Reports.optionIsReport(this.interfaceOption)) {
			return <div className={css.root}>
				{this.interfaceOption.description && <bp.Callout className={css.calloutMessage}>{this.interfaceOption.description}</bp.Callout>}
				<TreePreviewCardGrid
					activeItem={this.covertOptionToTreeInfo(
						this.interfaceOption,
						this.props.activePath,
						(o) => !_.get(o, "hints.tab")
					)}
					onNodeClick={this.onTreeNodeClick}
				/>
			</div>
		}

		return <div className={css.root}>
			<bp.Callout className={css.calloutMessage}>
				<FormattedMessage
					defaultMessage={"The Reports Library is a set of analytic reports that perform computations on the raw output of a simulation and display the results in tabular and graphical form. The reports have been designed to implement analytics ranging from basic to advanced, and to provide great flexibility in adjusting the details of the computations to suit the particular needs of the user."}
					description={"[ReportsSummaryPage] page description"}/>
			</bp.Callout>
			<br/>
			<div><FormattedMessage defaultMessage={"Available Reports"} description={"[ReportsSummaryPage] section title - all report list"}/>:</div>
			<TreePreviewCardGrid
				activeItem={this.reportFolders}
				onNodeClick={this.onTreeNodeClick}
				className={css.cardsGrid}
			/>
			<br/>
			<div><FormattedMessage defaultMessage={"Completed Reports"} description={"[ReportsSummaryPage] section title - reports which are already had result."}/>:</div>
			<div className={classNames(cardGridCss.root, css.cardsGrid)}>
				{ _.map(this.completedReports, item => <bp.Card
					key={`completedReports_${item.option.name}`}
					elevation={bp.Elevation.THREE}
					interactive={true}
					className={classNames(bp.Classes.MENU_ITEM, css.completedReportCard)}
					onClick={() => this.props.onNavigate([...item.path, Reports.OUTPUT_PATH_NAME].join('.'))}
				>
					<bp.Icon icon={ReportsSummaryPage.REPORT_ICON} />
					<div>{item.option.title||item.option.name}</div>
				</bp.Card> )}
			</div>

		</div>;
	}

}