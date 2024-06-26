import {CopyLocationContextMenuWrapper} from 'components';
import {label} from 'components/devTools/JuliaServerChooser.css';
import {ObjectChooser} from 'components/system/ObjectChooser/ObjectChooser';
import { observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {Repository} from 'stores/respository';
import {appIcons, i18n, routing, site, UserFile, userFileStore} from 'stores';
import * as css from './RepositoryGeneralView.css';
import {Checkbox, InputGroup, Callout} from '@blueprintjs/core';
import {Loader} from 'semantic-ui-react';
import { get as _get } from 'lodash';
import { formatNumberWithCommas } from 'utility';

const fileMessageStyles = {
	I: {
		title: 'Info',
		icon: 'info-sign',
		calloutCSS: 'bp3-icon-info-sign'
	},
	W: {
		title: 'Warning',
		icon: 'warning-sign',
		calloutCSS: 'bp3-intent-warning'
	},
	E: {
		title: 'Error',
		icon: 'error',
		calloutCSS: 'bp3-intent-danger'
	}
};


interface MyProps {
	repository: Repository
}

@observer
export class RepositoryGeneralView extends React.Component<MyProps, {}> {
	namedFrequencies = {
		1:   i18n.intl.formatMessage({defaultMessage: "Annually (1)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		2:   i18n.intl.formatMessage({defaultMessage: "Semiannually (2)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		3:   i18n.intl.formatMessage({defaultMessage: "Triannually (3)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		4:   i18n.intl.formatMessage({defaultMessage: "Quarterly (4)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		6:   i18n.intl.formatMessage({defaultMessage: "Bimonthly (6)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		12:  i18n.intl.formatMessage({defaultMessage: "Monthly (12)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		24:  i18n.intl.formatMessage({defaultMessage: "Semimonthly (24)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		52:  i18n.intl.formatMessage({defaultMessage: "Weekly (52)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		360: i18n.intl.formatMessage({defaultMessage: "Daily (360)", description: "[RepositoryGeneralView] simulation Frequency names"}),
		365: i18n.intl.formatMessage({defaultMessage: "Daily (365)", description: "[RepositoryGeneralView] simulation Frequency names"})
	};
	inputFrequencies = Object.keys(this.namedFrequencies).map(k => ({text: `${this.namedFrequencies[k]}`, value: parseInt(k)}));
	startPeriodInput = null;
	outputFrequencyInput = null;
	fileTypeInput = null;

	@observable selectedUserFile: UserFile;
	@observable fileLoadedMessage = "";
	@observable.ref categorizedFileMessages = _get(this.props, ["repository", "repositoryTransform", "fileId"], "") != "" ? this.categorizeFileMessages() : {};

	constructor(props) {
        super(props);

        makeObservable(this);

        const repositoryFileId = _.get(this.props.repository.repositoryTransform,"fileId");
        const routingFileId = _.get(routing, ['query', 'fileId'], '') as string;
        if (repositoryFileId) {
			userFileStore.loadDescriptor(repositoryFileId).then((userFile) => {
				this.selectedUserFile = userFile;
			});
		} else if (routingFileId) {
			userFileStore.loadDescriptor(routingFileId).then((userFile) => {
				this.selectedUserFile = userFile;
				this.fileIdUpdateFunction(userFile);
			});
		}
    }

	renderInputNumber(property: string, displayName: string, groupTitle: string) {
		return 	<CopyLocationContextMenuWrapper locationPath={[groupTitle, displayName]} nodeAttrs={{className: "form-group"}} >
					<label className={css.labelInput} htmlFor={property}>{displayName}</label>
					<Wj.InputNumber format="g0" value={this.props.repository.repositoryTransform[property]} valueChanged={e => {
						this.props.repository.repositoryTransform[property] = parseInt(e.value);
						this.props.repository.saveRepositoryTransform_debounced();}}
					/>
				</CopyLocationContextMenuWrapper>
	}
s
	renderComboBoxContainer(property: string, displayName: string, groupTitle: string) {
		return 	<CopyLocationContextMenuWrapper locationPath={[groupTitle, displayName]} nodeAttrs={{className: "form-group"}} >
					<label className={css.labelInput} htmlFor={property}>{displayName}</label>
					<div id={property}/>
				</CopyLocationContextMenuWrapper>
	}

	updateFunction(property) {
		return (e) => {
			this.props.repository.repositoryTransform[property] = e.selectedValue;
			this.props.repository.saveRepositoryTransform_debounced();
		}
	}

	renderFileObjectChooser(property: string, displayName: string, groupTitle: string) {
		return 	<CopyLocationContextMenuWrapper locationPath={[groupTitle, displayName]} nodeAttrs={{className: classNames("form-group", css.fileIdGroup)}} >
			<label className={css.labelInput} htmlFor={property}>{displayName}</label>
			<div className={classNames("wj-content", "wj-control",css.inputInline)}>
				<ObjectChooser<UserFile>
					objectType={UserFile}
					rootClassName={css.objectChooser}
					showLauncherOpenIcon={!this.selectedUserFile}
					selections={this.selectedUserFile ? [this.selectedUserFile] : []}
					chooseItemFilters={{status: ["Complete"]}}
					onSave={(selected) => this.fileIdUpdateFunction(selected[0])}

					disabled={this.props.repository.changingFile}
				/>
			</div>
		</CopyLocationContextMenuWrapper>
	}

	changeFileStatus(changing: boolean) {
		const {repository} = this.props;
		repository.changingFile = changing;
		site.busy = changing;
		this.fileTypeInput.isDisabled = changing;
	}

	async fileIdUpdateFunction(userFile: UserFile) {
		const {repository} = this.props;
		this.selectedUserFile = userFile;

		const newFileId = _.get(userFile, "_id", "")
		repository.repositoryTransform.fileId = newFileId;

		if (repository.repositoryTransform.fileId != "") {
			this.changeFileStatus(true);
			await repository.updateSelectedFile(newFileId);
			this.fileTypeInput.selectedValue = repository.repositoryTransform.fileType;
			this.categorizeFileMessages();
			this.changeFileStatus(false);
		}
	}

	async fileTypeUpdateFunction(e) {
		const {repository} = this.props;
		if (!repository.changingFile && repository.repositoryTransform.fileId != "") {
			this.changeFileStatus(true);
			await repository.updateSelectedFileType(e.selectedValue);
			this.categorizeFileMessages();
			this.changeFileStatus(false);
		}
	}

	categorizeFileMessages() {
		const fileMessages = _get(this.props, ["repository", "fileMessages"], []);
		const isError = _get(this.props, ["repository", "isError"], false);

		this.fileLoadedMessage = isError ?
		                         i18n.intl.formatMessage({defaultMessage: "File failed to load", description: "[RepositoryGeneralView] file status when system load in"}) :
		                         i18n.intl.formatMessage({defaultMessage: "File loaded successfully", description: "[RepositoryGeneralView] file status when system load in"});
		this.categorizedFileMessages = fileMessages.reduce((accu, eachMessage) => {
			const { code, message, rowNumber, columnName, fileName } = eachMessage;
			const rowInfo = rowNumber >= 0 ? i18n.intl.formatMessage({defaultMessage: `in row {row}`, description: "[RepoTool] row information in the failure message"}, {row: rowNumber}) : "";
			const colInfo = columnName != "" ? i18n.intl.formatMessage({defaultMessage: `in column {col}`, description: "[RepoTool] column information in the failure message"}, {col:columnName}) : "";
			const fileInfo = fileName != "" ? i18n.intl.formatMessage({defaultMessage: `in file {file}`, description: "[RepoTool] file information in the failure message"}, {file:fileName}) : "";

			const msg = `${message} ${rowInfo} ${colInfo} ${fileInfo}`;

			if (!Reflect.has(accu, code)) {
				accu[code] = {
					code,
					messages: [msg]
				};
			} else {
				accu[code].messages.push(msg);
			}

			return accu;
		}, {});
		return this.categorizedFileMessages;
	}

	generateComboBox(property: string, dataset, updateFunction: (property) => void) {
		let comboBox = new wijmo.input.ComboBox(`#${property}`, {
					displayMemberPath: "text",
					selectedValuePath: "value",
					itemsSource: dataset,
					selectedValue: this.props.repository.repositoryTransform[property],
					selectedIndexChanged: updateFunction,
					isEditable: true
		});
		return comboBox;
	}

	inputFrequencyInit(value, cb) {
		if (this.namedFrequencies[value]){
			cb.selectedValue = value;
		} else {
			cb.text = value;
		}
	}

	inputFrequencyTextChanged(property) {
		return (e) => {
			if(e.selectedIndex >= 0) {
				this.props.repository.repositoryTransform[property] = e.selectedValue;
			} else {
				let value = parseInt(e.text);
				if (isNaN(value) || value > 9999) {
					value = 1;
				}
				this.props.repository.repositoryTransform[property] = value;
			}
			this.updateDropDownOptions();
			this.props.repository.saveRepositoryTransform_debounced();
		}
	}

	renderInputFrequencyInput(property: string, displayName: string, disabled: boolean, dataset, groupTitle: string) {
		return	<CopyLocationContextMenuWrapper locationPath={[groupTitle, displayName]} nodeAttrs={{className: "form-group"}} >
					<label className={css.labelInput} htmlFor={property}>{displayName}</label>
					<Wj.ComboBox
						displayMemberPath="text"
						selectedValuePath="value"
						selectedValue={this.props.repository.repositoryTransform[property]}
						itemsSource={dataset}
						textChanged={this.inputFrequencyTextChanged(property)}
						initialized={this.inputFrequencyInit.bind(this, this.props.repository.repositoryTransform[property])}
						isEditable={true}
						isDisabled={disabled}
					/>
				</CopyLocationContextMenuWrapper>
	}

	renderSingleAxisInput(groupTitle: string) {
		return 	<div>
			<CopyLocationContextMenuWrapper
				locationPath={[
					groupTitle,
					i18n.intl.formatMessage({defaultMessage: "Use Single Axis", description: "[RepositoryGeneralView] checkbox label"})]}
				nodeAttrs={{className: "form-group"}}
			>
				<span className={classNames(css.checkbox, css.labelInput)}>
					<Checkbox
						alignIndicator={"right"}
						defaultChecked={this.props.repository.repositoryTransform.singleAxisCoordinate}
						label={i18n.intl.formatMessage({defaultMessage: "Use Single Axis", description: "[RepositoryGeneralView] checkbox label"})}
						onChange={this.toggleSingleAxisCoordinates.bind(this)}
					/>
				</span>
			</CopyLocationContextMenuWrapper>
			<br/>
			<CopyLocationContextMenuWrapper
				locationPath={[
					groupTitle,
					i18n.intl.formatMessage({defaultMessage: "Single Axis Name", description: "[RepositoryGeneralView] text input title"})]}
				nodeAttrs={{className: "form-group"}}
			>
				<label className={css.labelInput}>
					<FormattedMessage defaultMessage={"Single Axis Name"} description={"[RepositoryGeneralView] text input title"}/>
				</label>
				<InputGroup
				onChange={(e) => {this.props.repository.repositoryTransform.singleAxisCoordinateName = e.target.value; this.props.repository.saveRepositoryTransform_debounced()}}
				defaultValue={this.props.repository.repositoryTransform.singleAxisCoordinateName}
				disabled={!this.props.repository.repositoryTransform.singleAxisCoordinate}
				className={css.inputInline}
				placeholder="Column"
				/>
			</CopyLocationContextMenuWrapper>
		</div>
	}



	updateDropDownOptions() {
		if (this.startPeriodInput) {
			let prev = this.startPeriodInput.selectedValue;
			this.startPeriodInput.itemsSource = _.range(1, this.props.repository.repositoryTransform.inputFrequency + 1).map(i => ({text: `${i}`, value: i}));
			if (this.startPeriodInput.selectedValue <= this.props.repository.repositoryTransform.inputFrequency) {
				this.startPeriodInput.selectedValue = prev;
			}
		}
		if (this.outputFrequencyInput) {
			let prev = this.outputFrequencyInput.selectedValue;
			let outputRange = _.range(1, this.props.repository.repositoryTransform.inputFrequency + 1).filter(i => this.props.repository.repositoryTransform.inputFrequency % i == 0);
			outputRange = outputRange.filter(i => [1, 4, 12].indexOf(i) > -1);
			this.outputFrequencyInput.itemsSource = outputRange.map(i => ({text: i in this.namedFrequencies ? this.namedFrequencies[i] : `${i}`, value: i}));
			if (outputRange.indexOf(prev) != -1) {
				this.outputFrequencyInput.selectedValue = prev;
			}
		}
	}

	toggleSingleAxisCoordinates() {
		this.props.repository.repositoryTransform.singleAxisCoordinate = !this.props.repository.repositoryTransform.singleAxisCoordinate;
		this.props.repository.saveRepositoryTransform_debounced();
	}

	async componentDidMount() {
		this.fileTypeInput = this.generateComboBox(	"fileType",
													_.map(Repository.SUPPORT_FILE_TYPE, type => ({text: type, value: type})),
													this.fileTypeUpdateFunction.bind(this));

		this.startPeriodInput = this.generateComboBox(	"startPeriod",
														_.range(1, this.props.repository.repositoryTransform.inputFrequency + 1).map(i => ({text: `${i}`, value: i})),
														this.updateFunction("startPeriod"));

		let outputRange = _.range(1, this.props.repository.repositoryTransform.inputFrequency + 1).filter(i => this.props.repository.repositoryTransform.inputFrequency % i == 0);
		outputRange = outputRange.filter(i => [1, 4, 12].indexOf(i) > -1);
		this.outputFrequencyInput = this.generateComboBox("outputFrequency",
														  outputRange.map(i => ({text: i in this.namedFrequencies ? this.namedFrequencies[i] : `${i}`, value: i})),
														  this.updateFunction("outputFrequency"));

	}

	render() {
		const { fileLoadedMessage, categorizedFileMessages } = this;
		const { repository } = this.props;
		const { fileMessages = [], totalFileMessagesLength = 0, isError = false } = repository;

		return (
			<div className={css.root}>
				<div className={`${css.divInline} ${css.divInlineLeft}`}>
					<div className={css.viewTitle}>
						<FormattedMessage defaultMessage={"User File"} description={"[RepositoryGeneralView] input group title"}/>
					</div>
					{this.renderFileObjectChooser(
						"fileId",
						i18n.intl.formatMessage({defaultMessage: "File", description: "[RepositoryGeneralView] text input label"}),
						i18n.intl.formatMessage({defaultMessage: "User File", description: "[RepositoryGeneralView] input group title"})
					)}
					{this.renderComboBoxContainer(
						"fileType",
						i18n.intl.formatMessage({defaultMessage: "File Type", description: "[RepositoryGeneralView] text input label"}),
						i18n.intl.formatMessage({defaultMessage: "User File", description: "[RepositoryGeneralView] input group title"})
					)}

					<div className={css.viewTitle}>
						<FormattedMessage defaultMessage={"Data Frequencies"} description={"[RepositoryGeneralView] input group title"}/>
					</div>
					{this.renderInputFrequencyInput(
						"inputFrequency",
						i18n.intl.formatMessage({defaultMessage: "Input Frequency", description: "[RepositoryGeneralView] text input label"}),
						repository.userOptions.disableInputFrequency ,
						this.inputFrequencies,
						i18n.intl.formatMessage({defaultMessage: "Data Frequencies", description: "[RepositoryGeneralView] input group title"}))}

					{this.renderComboBoxContainer(
						"outputFrequency",
						i18n.intl.formatMessage({defaultMessage: "Output Frequency", description: "[RepositoryGeneralView] text input label"}),
						i18n.intl.formatMessage({defaultMessage: "Data Frequencies", description: "[RepositoryGeneralView] input group title"}))}

					<div className={css.viewTitle}>
						<FormattedMessage defaultMessage={"Input Metadata"} description={"[RepositoryGeneralView] input group title"}/>
					</div>
					{this.renderInputNumber(
						"startYear",
						i18n.intl.formatMessage({defaultMessage: "Starting Year", description: "[RepositoryGeneralView] text input label"}),
						i18n.intl.formatMessage({defaultMessage: "Input Metadata", description: "[RepositoryGeneralView] input group title"}))}
					{this.renderComboBoxContainer(
						"startPeriod",
						i18n.intl.formatMessage({defaultMessage: "Starting Period", description: "[RepositoryGeneralView] text input label"}),
						i18n.intl.formatMessage({defaultMessage: "Input Metadata", description: "[RepositoryGeneralView] input group title"}))}
					{this.renderInputNumber(
						"firstScenarioNumber",
						i18n.intl.formatMessage({defaultMessage: "First Scenario Number", description: "[RepositoryGeneralView] text input label"}),
						i18n.intl.formatMessage({defaultMessage: "Input Metadata", description: "[RepositoryGeneralView] input group title"}))}

					<div className={css.viewTitle}>
						<FormattedMessage defaultMessage={"Single Axis Options"} description={"[RepositoryGeneralView] input group title"}/>
					</div>
					<br/>
					{this.renderSingleAxisInput(
						i18n.intl.formatMessage({defaultMessage: "Single Axis Options", description: "[RepositoryGeneralView] input group title"})
					)}
				</div>
				<div className={`${css.divInline} ${css.divInlineRight}`}>
					{ repository.changingFile ? <Loader active inline='centered'>Loading File</Loader> :
					<>
						{ fileLoadedMessage &&
						<Callout className={classNames({
							"bp3-intent-success": !isError,
							"bp3-intent-danger": isError
							})}
							title={fileLoadedMessage} />
						}
						{ fileMessages.length > 0 &&
							<>
								<div className={`${css.viewTitle} ${css.fileMessageViewTitle}`}>
									File Messages
								</div>
								{ totalFileMessagesLength > fileMessages.length &&
									<div className={css.fileMessageTruncationWarn}>
                                        <FormattedMessage
                                            defaultMessage={"Truncation warning: showing only the first {i} of {total} messages"}
                                            description={"[RepositoryGeneralView] Truncation warning message"}
                                            values={{
												i: formatNumberWithCommas(fileMessages.length, 0),
	                                            total:formatNumberWithCommas(totalFileMessagesLength, 0)
											}}
                                        />
									</div>
								}
								{
									Object.keys(categorizedFileMessages).map((key) => {
										const { code, messages } = categorizedFileMessages[key];
										const styles = fileMessageStyles[code] || fileMessageStyles.I;

										return (
											<Callout
												key={`message_type_${code}`}
												icon={styles.icon}
												className={`${css.fileMessageItems} ${styles.calloutCSS}`}
												title={styles.title}
											>
												<ul>
													{messages.map((msg, i)=> (
														<li key={`${code}_msg_${i}`}>{ msg }</li>
													))}
												</ul>
											</Callout>
										);
									})
								}
							</>
						}
					</> }
				</div>
			</div>
		);
	}
}
