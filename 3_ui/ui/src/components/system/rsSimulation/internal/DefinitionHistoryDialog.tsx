import {IconName} from '@blueprintjs/core';
import * as classnames from 'classnames';
import {BlueprintDialog, bp, LoadingIndicator} from 'components';
import {action, computed, makeObservable, observable, when} from 'mobx';
import {observer} from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
import {RSSimulation, i18n, simulationStore, user, xhr} from 'stores';
import Splitter from 'm-react-splitters';
import {downloadCSVFile} from 'utility';

import * as css from './DefinitionHistoryDialog.css'
import * as inputTableCss from '../../userInterfaceComponents/Table/InputTable.css'

@observer
export class DefinitionHistoryDialog extends React.Component<{rsSimulation: RSSimulation}, any> {

	static TITLE: string = i18n.intl.formatMessage({defaultMessage: "Definition History", description: "[DefinitionHistoryDialog] dialog title"});
	static ICON: IconName = "history";

	@observable data;
	@observable loading;
	@observable selectedDataRow;

	hasMachineName: boolean;

	detailHeader: {header: string, binding: string, multi?: boolean}[] = [
		{header: i18n.intl.formatMessage({defaultMessage: "Value", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"value"},
		{header: i18n.intl.formatMessage({defaultMessage: "GMT Date", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"gdate"},
		{header: i18n.intl.formatMessage({defaultMessage: "GMT Time", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"gtime"},
		{header: i18n.intl.formatMessage({defaultMessage: "Version", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"version"},
		{header: i18n.intl.formatMessage({defaultMessage: "File Name", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"file"},
		{header: i18n.intl.formatMessage({defaultMessage: "File Size", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"filesize"},
		{header: i18n.intl.formatMessage({defaultMessage: "Locations", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"locations", multi: true},
		{header: i18n.intl.formatMessage({defaultMessage: "Save Date", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"sdate"},
		{header: i18n.intl.formatMessage({defaultMessage: "Save Time", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"stime"},
		{header: i18n.intl.formatMessage({defaultMessage: "MD5 Hash", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"md5hash"},
		{header: i18n.intl.formatMessage({defaultMessage: "Notes", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"notes"},
		{header: i18n.intl.formatMessage({defaultMessage: "Updates", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"updates", multi: true},
		{header: i18n.intl.formatMessage({defaultMessage: "Modules", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"modules", multi: true},
		{header: i18n.intl.formatMessage({defaultMessage: "Flexible Axes", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), binding:"axes", multi: true}
	]

	constructor(props) {
		super(props);

		makeObservable(this);

		this.loading = true;
		let loadingUser = !user.hasLoadedUsers;
		if (loadingUser) {
			user.loadDescriptors().then(() => {
				loadingUser = false;
			});
		}

		xhr.get(`${this.props.rsSimulation.apiUrl}/history`).then((result) => {
			when(() => !loadingUser).then(action(() => {
				let hasMachineName = false;
				this.data = _.map((result as any[]), (rec, i) => {
					hasMachineName = hasMachineName || (_.has(rec, "machine") && rec.machine != "S3");
					this.convertDateTime(rec, "gdate", "gtime", "GMT");
					this.convertDateTime(rec, "ldate", "ltime", "DST");
					this.convertDateTime(rec, "sdate", "stime", "DST");
					this.convertUser(rec);
					rec["ulocation"] = `\\${rec["ulocation"].join('\\')}`;
					return rec;
				});
				this.hasMachineName = hasMachineName;
			}));
		}).finally(action(() => {
			this.loading = false;
		}));
	}

	@computed get gridColumnHeaders(): any[] {
		const commonAttrs = {
			isReadOnly: true,
			allowSorting: false,
			dataType: wijmo.DataType.String
		}
		return [
			{binding: "ldate", header: i18n.intl.formatMessage({defaultMessage: "Date", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), ...commonAttrs},
			{binding: "ltime", header: i18n.intl.formatMessage({defaultMessage: "Time", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), ...commonAttrs},
			{binding: "user", header: i18n.intl.formatMessage({defaultMessage: "User", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), ...commonAttrs},
			{binding: "machine", header: i18n.intl.formatMessage({defaultMessage: "Machine", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), ...commonAttrs, visible: this.hasMachineName},
			{binding: "action", header: i18n.intl.formatMessage({defaultMessage: "Action", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), ...commonAttrs},
			{binding: "ulocation", header: i18n.intl.formatMessage({defaultMessage: "Location", description: "[DefinitionHistoryDialog] column title for the table showing the simulation operate history"}), ...commonAttrs}
		];
	}

	convertDateTime = (data, dateKey = "gdate", timeKey = "gtime", z: string = "GMT") => {
		if (!_.has(data, dateKey) || !_.has(data, timeKey)) {
			return;
		}
		const date = _.padStart(`${data[dateKey]}`, 8, '0');
		const time = _.padStart(`${data[timeKey]}`, 6, '0');
		const m = moment(`${date}_${time} ${z}`, "YYYYMMDD_HHmmss Z");
		const d = m.toDate();
		// console.log(`${date}_${time} ${z} == ${m.toDate().toString()}` )
		data[dateKey] = new Intl.DateTimeFormat().format(d);
		data[timeKey] = m.format("hh:mm:ss A");
	}

	convertUser(data) {
		if (!data?.user) {
			return;
		}
		if (user.users.has(data.user)) {
			const u = user.users.get(data.user);
			data.user = _.get(u, "name", _.get(u, "fullName", _.get(u, "email")));
		}
	}

	@computed get gridData() {
		return this.data.slice().reverse();
	}

	@computed get selectedData() {
		if (
			!_.isFinite(this.selectedDataRow) ||
			this.selectedDataRow < 0 ||
			this.selectedDataRow >= this.data?.length
		) {
			return null;
		}
		return this.gridData[this.selectedDataRow];
	}

	@action initializeGrid = (flexGrid: wijmo.grid.FlexGrid) => {
		flexGrid.select(-1,-1);
		flexGrid.autoSizeColumns();
	}

	export = () => {
		const recordHeaders = _.filter(this.gridColumnHeaders, h => h.visible !== false);
		const headers = _.map(recordHeaders, h => h.header);
		const lengthOfHeader = headers.length;
		headers.push("Detail");
		headers.push("Value");
		const exports : string[][] = [headers];

		// -----
		_.forEach(this.gridData, (d)=> {
			let lineData= _.map(recordHeaders, rHeader => d[rHeader.binding]);
			_.forEach(this.detailHeader, (dHeader) => {
				let value = _.get(d, dHeader.binding);
				if (value == null || (dHeader.multi && !_.isArray(value))) {
					return null;
				}
				if (!lineData) {
					lineData = [];
					for (let i = 0; i < lengthOfHeader; i++) {
						lineData.push("");
					}
				}
				lineData.push (dHeader.header)
				if (!dHeader.multi) {
					if (!_.isString(value)) {
						value = JSON.stringify(value);
					}
					lineData.push (value)
				} else {
					_.forEach(value as any[], (v) => {
						if (!lineData) {
							lineData = [];
							for (let i = 0; i <= lengthOfHeader; i++) {
								lineData.push("");
							}
						}
						if (!_.isString(v)) {
							v = JSON.stringify(v);
						}
						lineData.push (v);
						exports.push(lineData);
						lineData = null;
					})
				}
				if (lineData) {
					exports.push(lineData);
				}
				lineData = null;
			})
		});

		const simulation = simulationStore.simulations.get(this.props.rsSimulation.id);
		downloadCSVFile(exports, `${simulation.name}_DefinitionHistory.csv`)
	}


	render() {
		const hasDetail = !!this.selectedData;

		return <BlueprintDialog
			className={css.root}
			title={DefinitionHistoryDialog.TITLE}
			icon={DefinitionHistoryDialog.ICON}
			canCancel={false}
			isCloseButtonShown={true}
			okDisabled={false}
			additionalFooter={() => {
				return <bp.Button onClick={() => this.export()}>{i18n.common.FILE_CTRL.EXPORT}</bp.Button>
			}}
		>
			{this.loading ?
			 <LoadingIndicator /> :
			 !this.data?.length ?
			 <h4 style={{margin: "10px 20px"}}>No Recorded History</h4>:
			 <Splitter
				 className={classnames({[css.noDetail]: !hasDetail})}
				 position="horizontal"
				 primaryPaneMinHeight={100}
				 postPoned={false}
			 >
				 <div className={classnames(css.gridBox, inputTableCss.root)}>
					 <Wj.FlexGrid
						 showMarquee={false}
						 autoGenerateColumns={false}
						 autoSizeMode={wijmo.grid.AutoSizeMode.Cells}
						 headersVisibility={wijmo.grid.HeadersVisibility.Column }
						 allowDragging={wijmo.grid.AllowDragging.None}
						 allowMerging={wijmo.grid.AllowMerging.None}
						 selectionMode={wijmo.grid.SelectionMode.Row}
						 initialized={this.initializeGrid}
						 columns={this.gridColumnHeaders}
						 itemsSource={this.gridData}
						 onSelectionChanged={action((e) => {
							 if (e.row < 0) {
								 return;
							 }
							 const dataRow = e.row;
							 if (this.selectedDataRow == dataRow) {
								 this.selectedDataRow = null;
								 (e.panel as wijmo.grid.GridPanel).grid.select(-1, -1);
							 } else {
								 this.selectedDataRow = dataRow;
							 }
						 })}

					 />
				 </div>
				 {hasDetail && <div className={css.detailBox}>
					 <h3>Detail</h3>
					 <div className={css.detailGrid}>
						 {_.map(this.detailHeader, header => {
							 let value = _.get(this.selectedData, header.binding);
							 if (value == null) {
								 return null;
							 }
							 if (!header.multi) {
								 if (!_.isString(value)) {
									 value = JSON.stringify(value);
								 }
								 return <React.Fragment key={`detail_${header.binding}`}>
									 <div>{header.header}</div>
									 <div>{`${value}`}</div>
								 </React.Fragment>
							 }

							 if (!_.isArray(value)) {
								 return null;
							 }

							 return <React.Fragment key={`detail_${header.binding}`}>
								 <div>{header.header}</div>
								 <ul>{
									 _.map( value, (text,i) => {
										 if (!_.isString(text)) {
											 text = JSON.stringify(text);
										 }
										 return <li key={`detail_${header.binding}_${i}`}>{text}</li>}
									 )
								 }</ul>
							 </React.Fragment>
						 })}
					 </div>
				 </div>}
			 </Splitter>
			}

		</BlueprintDialog>;
	}

}