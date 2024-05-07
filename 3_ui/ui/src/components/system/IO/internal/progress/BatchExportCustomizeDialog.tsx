import {Select} from '@blueprintjs/select';
import {ObjectChooser} from 'components/system/ObjectChooser/ObjectChooser';
import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {ObjectLink} from 'components/widgets/SmartBrowser/ObjectLink';
import {action, computed, makeObservable, observable, runInAction, flow} from 'mobx';
import {observer} from 'mobx-react';
import {BlueprintDialog} from 'components/widgets/BlueprintDialog';
import {bp, LoadingIndicator} from 'components';
import * as React from 'react';
import {appIcons, IO, ObjectNameChecker, site, user, UserFile, utility} from 'stores';
import {BatchExportProgressDialog} from 'components/system/BatchExport/BatchExportProgressDialog';
import * as css from './BatchExportCustomizeDialog.css';

interface RegionalSettings {
	snativedigits: string;
	sdecimal: string;
	sthousand: string;
	snegativesign: string;
	spositivesign?: string;
	inegnumber: number;
	slist: string;
	sabbrevlangname: string;
	sshortdate: string;
}

interface ExportSettings {
	append?: boolean;
	filename?: string;
	export_views?: string[];
	regional_settings?: RegionalSettings;
	save_user_file?: boolean;
}

interface ExportSettingsInner extends ExportSettings{
	export?: boolean;
	region?: 'userSetting'|'US'|'DE'|'CN'|'TW';
}

interface MyProps {
	io: IO;
	exportSettings?: ExportSettingsInner;
}

@observer export class BatchExportCustomizeDialog extends React.Component<MyProps, {}> {
	dialogRef: BlueprintDialog;

	@observable isLoadingEligibleExportViews: boolean = true;
	@observable exportSettings: ExportSettingsInner;
	@observable fileExport: string;
	@observable exportLocation: string;
	@observable.ref eligibleExportViews: string[] = [];

	nameInputFieldRef: NameInputField;
	objectNameChecker: ObjectNameChecker;
	fileName: string;

	@observable downloadFileName: string;
	@observable appendFile: UserFile;

	constructor(props) {
		super(props);
		makeObservable(this);
		this.exportSettings = _.assign({
			export: true,
			export_views: []
		}, this.props.exportSettings);

		this.exportLocation = this.exportSettings.append ? "append" : "newFile";
		this.fileExport = this.exportSettings.append ?
		                  this.hasRecentFile ?
		                  'recent' : 'append' : 'download';
		const ioName = props.io.name;
		const defaultFileName = this.exportSettings.filename || `${_.last(ioName.split('/'))}_batch_export`;
		this.objectNameChecker = new ObjectNameChecker({ defaultName: defaultFileName, type: 'numeric'});
		this.objectNameChecker.getAvailableName('UserFile', defaultFileName).then((name) => this.fileName = name);

		this.downloadFileName = defaultFileName;
	}

	regionItems: {label: string, region: string, lang: string}[] = [
		/*{label: "Display Language Preference", region: "", lang: ""},*/
		{label: "Your regional language, or English if unavailable", region: "userSetting", lang: ""},
		{label: "English", region: "US", lang: "en-US"},
		{label: "Deutsch", region: "DE", lang: "de-de"},
		{label: "Chinese - Simplified", region: "CN", lang: "zh-CN"},
		{label: "Chinese - Traditional", region: "TW", lang: "zh-TW"}
	];

	@computed get loading() {
		return this.nameInputFieldRef?.loading;
	}

	@computed get hasRecentFile() {
		return !!this.props.io.recentBatchExportUserFile?._id;
	}

	@computed get activeRegionItem(){
		return (
			this.exportSettings.region != null ?
			_.find(this.regionItems, item => item.region == this.exportSettings.region) :
			null
		) || this.regionItems[0];
	}

	set activeRegionItem(item){
		runInAction(() => {
			this.exportSettings.region = item.region as any;
			let {region, lang} = item
			if (region) {
				if (region == 'userSetting') {
					const updateSetting =
						_.find(this.regionItems, item => item.region == user.region) ||
						_.find(this.regionItems, item => item.region == "US");

					region = updateSetting.region;
					lang = updateSetting.lang;
				}
				const separators = utility.getCsvSeparators(region);
				const regionalSettings: RegionalSettings = {
					snativedigits: "0123456789",
					sdecimal: separators.decimal.toString(),
					sthousand: separators.thousand.toString(),
					snegativesign: "-",
					inegnumber: 1,
					slist: separators.list.toString(),
					sabbrevlangname: lang,
					sshortdate: 'M/d/yyyy'
				}
				switch (region) {
					case "DE":
						regionalSettings.sshortdate = 'd.M.yyyy';
						break;
					case "CN":
					case "TW":
						regionalSettings.sshortdate = 'yyyy/M/d';
						break;
					default:
						regionalSettings.sshortdate = 'M/d/yyyy';
						break;
				}
				this.exportSettings.regional_settings = regionalSettings;
			} else {
				delete this.exportSettings.regional_settings;
			}
		})
	}

	@action exportFileChange = (e) => {
		this.fileExport = e.target.value;
	}

	@action exportLocationChange = (e) => {
		this.exportLocation = e.target.value;

		if (this.exportLocation == "newFile")
			this.fileExport = "download";
		else
			this.fileExport = this.fileExport = this.hasRecentFile ? 'recent' : 'append';
	}

	ok = async () => {
		const params = _.cloneDeep(this.exportSettings) as ExportSettings;

		// delete private attributes.
		delete (params as any).export;
		delete (params as any).region;

		// set export file information
		params.append = false;
		delete params.filename;
		switch (this.fileExport) {
			case 'download':
				params.filename = `${this.downloadFileName}.csv`;
				break;
			case 'saveUserFile':
				if (this.fileName) {
					params.append = false;
					params.filename = `${this.fileName}.csv`;
					params.save_user_file = true;
				}
				break;
			case 'recent':
				if (this.hasRecentFile) {
					params.append = true;
					params.filename = this.props.io.recentBatchExportUserFile._id;
					params.save_user_file = true;
				}
				break;
			case 'append':
				if (this.appendFile?._id) {
					params.append = true;
					params.filename = this.appendFile._id;
					params.save_user_file = true;
				}
				break;
		}

		const { io } = this.props;
		const id = await io.batchExportToCSV(params);
		// wait this dialog closed and open progress dialog.
		if (typeof id === 'number') {
			setTimeout(() => {
				site.setDialogFn(() => <BatchExportProgressDialog object={io} fileID={id} isUserFile={params.save_user_file} download={io.downloadBatchExportFile} downloadFileName={params.filename}/>);
			}, 500);
		}

		return 'ok';
	}

	@action
	toggleExportAllViews = (e) => {
		if (e.target.checked) {
			this.exportSettings.export_views.splice(0, this.exportSettings.export_views.length, ...this.eligibleExportViews);
		} else {
			this.exportSettings.export_views.splice(0);
		}
	}

	renderExportSections() {
		const { exportSettings, eligibleExportViews } = this;
		const { io } = this.props;
		const isExportAllViews = exportSettings.export_views.length === eligibleExportViews.length;

		return (
			<bp.FormGroup>
				<bp.Checkbox label="Export all data" checked={isExportAllViews} onChange={this.toggleExportAllViews} />
				<bp.FormGroup>
					{eligibleExportViews.map((viewName)=> {
				       let label = io.inputOptions[viewName].title || io.inputOptions[viewName].name;
					   label = `Export ${label}`;
					   return <PrivateCheckBox key={viewName} label={label} exportSetting={exportSettings} bind={viewName} />;
					})}
				</bp.FormGroup>
			</bp.FormGroup>
		);
	}

	@flow.bound
	*getBatchExportEligibleViews() {
		try {
			const { io } = this.props;
			this.isLoadingEligibleExportViews = true;
			this.eligibleExportViews = yield io.getEligibleBatchExportViews();
		} finally {
			this.isLoadingEligibleExportViews = false;
		}
	}

	componentDidMount(): void {
		this.getBatchExportEligibleViews();
	}

	render() {
		const { exportSettings, isLoadingEligibleExportViews } = this;

		return <BlueprintDialog
			className={css.root}
			canCancel={false}
			title="Batch Export Special"
			icon={'multi-select'}
			ok={this.ok}
			okDisabled={this.loading || exportSettings.export_views.length === 0}
			ref={ref => this.dialogRef = ref}
		>
			{ isLoadingEligibleExportViews ?
			<LoadingIndicator active={true} /> :
			<>
			<bp.FormGroup>
				<bp.RadioGroup
					label={"Export location"}
					selectedValue={this.exportLocation}
					onChange={this.exportLocationChange}
				>
					<bp.Radio label="New File" value="newFile" />
					{this.exportLocation == 'newFile' && <bp.RadioGroup
						className={css.subRadioGroup}
						selectedValue={this.fileExport}
						onChange={this.exportFileChange}
					>
						<bp.Radio label="Download" value="download" />
						{this.fileExport == 'download' && <bp.FormGroup>
							<bp.InputGroup
								type={"text"}
								placeholder="Download file name."
								rightElement={<bp.Tag minimal>.csv</bp.Tag>}
								defaultValue={this.downloadFileName}
								onChange={action((e) => this.downloadFileName = e.target.value)}
							/>
						</bp.FormGroup>}
						<bp.Radio label="Save user file to server" value="saveUserFile" />
						{this.fileExport == 'saveUserFile' && <bp.FormGroup>
							<NameInputField
								ref={r => this.nameInputFieldRef = r}
								objectType={"UserFile"}
								objectNameChecker={this.objectNameChecker}
								value={this.fileName}
								onUpdateResult={(result) => {
									if (result.isDuplicated) {
										this.fileName = null;
									} else {
										this.fileName = result.inputWithoutPath;
									}
								}}
							/>
						</bp.FormGroup>}
					</bp.RadioGroup>}
					<bp.Radio label="Append" value="append" />
					{this.exportLocation == 'append' && <bp.RadioGroup
						className={css.subRadioGroup}
						selectedValue={this.fileExport}
						onChange={this.exportFileChange}
					>
						<bp.Radio label="Append to most recently exported user file" value="recent" disabled={!this.hasRecentFile} />
						{this.fileExport == 'recent' && <bp.FormGroup>
							<ObjectLink
								objectType={"UserFile"}
								icon={appIcons.tools.userFiles}
								id={this.props.io.recentBatchExportUserFile._id}
								modelLoader={(id) => this.props.io.recentBatchExportUserFile}
								popupContent={(model) => <UserFileCard userFile={model} showHeader={false} isTooltip/> }
								linkTo={model => UserFile.urlFor(model._id)}
								linkContent={model => model.name}
								onLinkClick={(e) => this.dialogRef.result = 'closeByLink'}
							/>
						</bp.FormGroup>}
						<bp.Radio label="Append to other existing user file" value="append" />
						{this.fileExport == 'append' &&
							<bp.FormGroup>
							<ObjectChooser<UserFile>
								objectType={UserFile}
								chooseItemFilters={{status: ["Complete"], type:["CSV"]}}
								onSave={action((selected) => {
									this.appendFile = selected[0];
								})}
								selections={this.appendFile ? [this.appendFile] : []}
								rootClassName={bp.Classes.INPUT}
							/>
						</bp.FormGroup> }
					</bp.RadioGroup>}
				</bp.RadioGroup>
			</bp.FormGroup>
			{/* Export language is not supported yet, hide temporarily
			<bp.FormGroup label={"Export language"}>
				<Select<{label: string, region: string, lang: string}>
					items={this.regionItems}
					activeItem={this.activeRegionItem}
					itemRenderer={(item, renderProps) =>
						<bp.MenuItem key={item.region} text={item.label} onClick={renderProps.handleClick}/>
					}
					onItemSelect={(item) => {
						this.activeRegionItem = item;
					}}
				>
					<bp.Button text={this.activeRegionItem.label} rightIcon="double-caret-vertical"/>
				</Select>
			</bp.FormGroup>
			*/}
			{this.renderExportSections()}
			</>}
		</BlueprintDialog>;
	}
}

@observer class PrivateCheckBox extends React.Component<{
	label: string
	exportSetting: ExportSettingsInner,
	bind: string,
	defaultValue?: boolean
}, any> {

	constructor(props) {
		super(props);
		if (this.props.defaultValue != null && this.value == null) {
			this.value = this.props.defaultValue;
		}
	}

	@computed get value(): boolean {
		const { bind, exportSetting } = this.props;
		return exportSetting.export_views.some((viewName) => viewName === bind);
	}

	set value(newValue) {
		runInAction(() => {
			const { bind, exportSetting } = this.props;
			const bindIndex = exportSetting.export_views.findIndex((viewName) => viewName === bind);
			if (newValue) {
				bindIndex === -1 && exportSetting.export_views.push(bind);
			} else {
				bindIndex >= 0 && exportSetting.export_views.splice(bindIndex, 1);
			}
		});
	}

	render() {
		return <bp.Checkbox
			label={this.props.label}
			checked={this.value === true}
			onChange={e => this.value = e.currentTarget.checked}
		/>;
	}
}