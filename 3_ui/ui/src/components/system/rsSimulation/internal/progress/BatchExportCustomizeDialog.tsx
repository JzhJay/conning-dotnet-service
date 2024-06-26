import {Select} from '@blueprintjs/select';
import {ObjectChooser} from 'components/system/ObjectChooser/ObjectChooser';
import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import {UserFileCard} from 'components/system/UserFile/UserFileCard';
import {ObjectLink} from 'components/widgets/SmartBrowser/ObjectLink';
import {BatchExportProgressDialog} from 'components/system/BatchExport/BatchExportProgressDialog';
import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import {BlueprintDialog} from 'components/widgets/BlueprintDialog';
import {bp} from 'components';
import * as React from 'react';
import {appIcons, RSSimulation, i18n, ObjectNameChecker, ObjectNameCheckerResult, simulationStore, site, user, UserFile, utility, xhr} from 'stores';
import * as css from './BatchExportCustomizeDialog.css';

interface MyProps {
	rsSimulation: RSSimulation;
	exportSettings: ExportSettings_inner;
}

interface ExportSettings_inner extends ExportSettings{
	export?: boolean;
	lang?: 'userSetting'|'en-US'|'de-DE'|'zh-CN'|'zh-TW';
}

interface ExportSettings {
	path: string[];
	filename?: string;
	export_regional?: boolean;
	export_version?: boolean;
	append?: boolean;
	export_flexible_axes?: boolean;
	append_flexible_axes?: boolean;
	export_modules?: boolean;
	append_modules?: boolean;
	all_modules?: boolean;
	all_model_choices?: boolean;
	inactive_axes?: boolean;
	version?: boolean;
	regional_settings?: RegionalSettings;
	save_user_file?: boolean;
}

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

@observer export class BatchExportCustomizeDialog extends React.Component<MyProps, {}> {

	dialogRef: BlueprintDialog;

	@observable exportSettings: ExportSettings_inner;
	@observable fileExport: string;
	@observable exportLocation: string;

	nameInputFieldRef: NameInputField;
	objectNameChecker: ObjectNameChecker;
	fileName: string;

	@observable downloadFileName: string;
	@observable appendFile: UserFile;

	constructor(props) {
		super(props);
		makeObservable(this);
		this.exportSettings = _.assign({export: true, inactive_axes: true}, this.props.exportSettings);
		this.exportSettings.regional_settings = this.regionSettings;

		this.exportLocation = this.exportSettings.append ? "append" : "newFile";
		this.fileExport = this.exportSettings.append ?
		                  this.hasRecentFile ?
		                  'recent' : 'append' : 'download';
		const simulation = simulationStore.simulations.get(this.props.rsSimulation.id);
		const defaultFileName = props.exportSettings.fileName || `${_.last(simulation.name.split("/"))}_${_.last(this.exportSettings.path)}_batch_export`;
		this.objectNameChecker = new ObjectNameChecker({ defaultName: defaultFileName, type: 'numeric'});
		this.objectNameChecker.getAvailableName('UserFile', defaultFileName).then((name) => this.fileName = name);

		this.downloadFileName = defaultFileName;
	}

	languageItems: {label: string, lang: string}[] = [
		/*{label: "Display Language Preference", region: "", lang: ""},*/
		{label: "Your regional language, or English if unavailable", lang: "userSetting"},
		{label: "English", lang: "en-US"},
		{label: "Deutsch", lang: "de-DE"},
		{label: "Chinese - Simplified", lang: "zh-CN"},
		{label: "Chinese - Traditional", lang: "zh-TW"}
	];

	@computed get loading() {
		return this.nameInputFieldRef?.loading;
	}

	@computed get hasRecentFile() {
		return !!this.props.rsSimulation.recentBatchExportUserFile?._id;
	}

	@computed get activeLanguageItem() {
		return (
			this.exportSettings.lang != null ?
			_.find(this.languageItems, item => item.lang == this.exportSettings.lang) :
			null
		) || this.languageItems[0];
	}

	get regionSettings() : RegionalSettings {
		const region = user.region;
		const separators = utility.getCsvSeparators(region);
		return {
			snativedigits: "0123456789",
			sdecimal: separators.decimal.toString(),
			sthousand: separators.thousand.toString(),
			snegativesign: "-",
			inegnumber: 1,
			slist: separators.list.toString(),
			sabbrevlangname: this.exportSettings?.regional_settings?.sabbrevlangname || "en-US",
			sshortdate: this.getShortDateformat(region) // TODO
		}
	}

	getShortDateformat(region) {
		switch (region) {
			case "DE":
				return 'd.M.yyyy';
			case "CN":
			case "TW":
				return 'yyyy/M/d';
			default:
				return 'M/d/yyyy';

		}
	}

	set activeLanguageItem(item) {
		runInAction(() => {
			this.exportSettings.lang = item.lang as any;
			let {lang} = item
			if (lang) {
				if (lang == 'userSetting') {
					// const updateSetting =
					// 	_.find(this.languageItems, item => item.lang == user.lang) ||
					// 	_.find(this.languageItems, item => item.lan == "en-US");

					lang = "en-US"; // TODO: Get from user settings when supported
				}

				this.exportSettings.regional_settings.sabbrevlangname = lang;
			} else {
				this.exportSettings.regional_settings.sabbrevlangname = null;
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
					params.filename = this.props.rsSimulation.recentBatchExportUserFile._id;
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

		const exportRelatedField = ["all_modules", "all_model_choices", "inactive_axes"];
		if (this.exportSettings.export === false) {
			// if parent trigger unchecked. disabled all export;
			_.forEach(exportRelatedField, field => _.set(params, field, false));

		} else if (_.some(exportRelatedField, field => _.get(params, field) !== null)){
			// if user changed any sub-field. make the export setting as page display.
			_.forEach(exportRelatedField, field => _.set(params, field, _.get(params, field) !== false));

		}

		const rsSimulation = this.props.rsSimulation;
		try {
			site.busy = true;
			const id: number = await xhr.post(`${rsSimulation.apiUrl}/generate-batch-export`, params);
			// wait this dialog closed and open progress dialog.
			setTimeout(() => {
				site.setDialogFn(() => <BatchExportProgressDialog object={rsSimulation} fileID={id} isUserFile={params.save_user_file} downloadFileName={this.downloadFileName} download={rsSimulation.downloadBatchExportFile} />);
			}, 500);
		}
		finally {
			site.busy = false;
		}

		return 'ok';
	}

	render() {

		return <BlueprintDialog
			className={css.root}
			canCancel={false}
			title={i18n.intl.formatMessage({defaultMessage: `Batch Export Special`, description: "[BatchExportCustomizeDialog] dialog title"})}
			icon={'cloud-download'}
			ok={this.ok}
			okDisabled={this.loading}
			ref={ref => this.dialogRef = ref}
		>
			<bp.FormGroup>
				<bp.RadioGroup
					label={i18n.intl.formatMessage({defaultMessage: "Export location", description: "[BatchExportCustomizeDialog] radio group title - export file location"})}
					selectedValue={this.exportLocation}
					onChange={this.exportLocationChange}
				>
					<bp.Radio
						label={i18n.intl.formatMessage({defaultMessage: "New File", description: "[BatchExportCustomizeDialog] create a new export file to save data"})}
						value="newFile"
					/>
					{this.exportLocation == 'newFile' && <bp.RadioGroup
						className={css.subRadioGroup}
						selectedValue={this.fileExport}
						onChange={this.exportFileChange}
					>
						<bp.Radio label={i18n.common.FILE_CTRL.DOWNLOAD} value="download" />
						{this.fileExport == 'download' && <bp.FormGroup>
							<bp.InputGroup
								type={"text"}
								placeholder="Download file name."
								rightElement={<bp.Tag minimal>.csv</bp.Tag>}
								defaultValue={this.downloadFileName}
								onChange={action((e) => this.downloadFileName = e.target.value)}
							/>
						</bp.FormGroup>}
						<bp.Radio
							label={i18n.intl.formatMessage({defaultMessage: "Save {userFile} to server", description: "[BatchExportCustomizeDialog] create a new file and save it on server"}, {userFile: UserFile.OBJECT_NAME_SINGLE})}
							value="saveUserFile"
						/>
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

					<bp.Radio
						label={i18n.intl.formatMessage({defaultMessage: "Append", description: "[BatchExportCustomizeDialog] append save data to selected user file"})}
						value="append"
					/>
					{this.exportLocation == 'append' && <bp.RadioGroup
						className={css.subRadioGroup}
						selectedValue={this.fileExport}
						onChange={this.exportFileChange}
					>
						<bp.Radio
							label={i18n.intl.formatMessage({defaultMessage: "Append to most recently exported {userFile}", description: "[BatchExportCustomizeDialog] append date into a file on server which we operate it recently"}, {userFile: UserFile.OBJECT_NAME_SINGLE})}
							value="recent" disabled={!this.hasRecentFile}
						/>
						{this.fileExport == 'recent' && <bp.FormGroup>
							<ObjectLink
								objectType={"UserFile"}
								icon={appIcons.tools.userFiles}
								id={this.props.rsSimulation.recentBatchExportUserFile._id}
								modelLoader={(id) => this.props.rsSimulation.recentBatchExportUserFile}
								popupContent={(model) => <UserFileCard userFile={model} showHeader={false} isTooltip/> }
								linkTo={model => UserFile.urlFor(model._id)}
								linkContent={model => model.name}
								onLinkClick={(e) => this.dialogRef.result = 'closeByLink'}
							/>
						</bp.FormGroup>}
						<bp.Radio
							label={i18n.intl.formatMessage({defaultMessage: "Append to other existing {userFile}", description: "[BatchExportCustomizeDialog] append date into a file on server"}, {userFile: UserFile.OBJECT_NAME_SINGLE})}
							value="append"
						/>
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
			<bp.FormGroup>
				<PrivateCheckBox
					label={i18n.intl.formatMessage({defaultMessage: "Export data", description: "[BatchExportCustomizeDialog] group title - choose which data will export"})}
					exportSetting={this.exportSettings} bind={"export"} />
				<bp.FormGroup>
					<PrivateCheckBox
						label={i18n.intl.formatMessage({defaultMessage: "Export data for all modules", description: "[BatchExportCustomizeDialog] export all modules data"})}
						exportSetting={this.exportSettings} bind={"all_modules"} parent={"export"} />
					<PrivateCheckBox
						label={i18n.intl.formatMessage({defaultMessage: "Export data for all model choices", description: "[BatchExportCustomizeDialog] export all modules choices"})}
						exportSetting={this.exportSettings} bind={"all_model_choices"} parent={"export"} />
					<PrivateCheckBox
						label={i18n.intl.formatMessage({defaultMessage: "Export data for inactive flexible axis elements", description: "[BatchExportCustomizeDialog] export all modules axis coordinates only its active"})}
						exportSetting={this.exportSettings} bind={"inactive_axes"} parent={"export"} />
				</bp.FormGroup>
			</bp.FormGroup>
			{/*<bp.FormGroup label={"Export language"}>*/}
			{/*	<Select<{label: string, lang: string}>*/}
			{/*		items={this.languageItems}*/}
			{/*		activeItem={this.activeLanguageItem}*/}
			{/*		itemRenderer={(item, renderProps) =>*/}
			{/*			<bp.MenuItem key={item.lang} text={item.label} onClick={renderProps.handleClick}/>*/}
			{/*		}*/}
			{/*		onItemSelect={(item) => {*/}
			{/*			this.activeLanguageItem = item;*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<bp.Button text={this.activeLanguageItem.label} rightIcon="double-caret-vertical"/>*/}

			{/*	</Select>*/}
			{/*</bp.FormGroup>*/}
			<bp.FormGroup>
				<PrivateCheckBox
					label={i18n.intl.formatMessage({defaultMessage: "Export flexible axes", description: "[BatchExportCustomizeDialog] export flexible axes information"})}
					exportSetting={this.exportSettings} bind={"export_flexible_axes"} />
				<bp.FormGroup>
					<PrivateCheckBox
						label={i18n.intl.formatMessage({defaultMessage: "Append flexible axes", description: "[BatchExportCustomizeDialog] using append to export flexible axes information"})}
						exportSetting={this.exportSettings} bind={"append_flexible_axes"} parent={"export_flexible_axes"} />
				</bp.FormGroup>
			</bp.FormGroup>
			<bp.FormGroup>
				<PrivateCheckBox
					label={i18n.intl.formatMessage({defaultMessage: "Export module selections", description: "[BatchExportCustomizeDialog] export module selections information"})}
					exportSetting={this.exportSettings} bind={"export_modules"} />
				<bp.FormGroup>
					<PrivateCheckBox
						label={i18n.intl.formatMessage({defaultMessage: "Append module selections", description: "[BatchExportCustomizeDialog] using append to export module selections information"})}
						exportSetting={this.exportSettings} bind={"append_modules"} parent={"export_modules"} />
				</bp.FormGroup>
			</bp.FormGroup>
		</BlueprintDialog>;
	}
}

@observer class PrivateCheckBox extends React.Component<{
	label: string
	exportSetting: ExportSettings_inner,
	bind: string,
	parent?:string,
	defaultValue?: boolean
}, any> {

	constructor(props) {
		super(props);
		if (this.props.defaultValue != null && this.value == null) {
			this.value = this.props.defaultValue;
		}
	}

	@computed get value(): boolean {
		return _.get(this.props.exportSetting, this.props.bind);
	}

	set value(newValue) {
		runInAction(() => {
			_.set(this.props.exportSetting, this.props.bind, newValue);
		});
	}

	@computed get disabled(): boolean {
		return this.props.parent && (_.get(this.props.exportSetting, this.props.parent) !== true);
	}

	render() {
		return <bp.Checkbox
			label={this.props.label}
			checked={this.value === true}
			disabled={this.disabled}
			onChange={e => this.value = e.currentTarget.checked}
		/>;
	}
}