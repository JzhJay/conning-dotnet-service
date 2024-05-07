import { action, observable, reaction, makeObservable, computed } from 'mobx';
import {createIntl, createIntlCache, IntlCache } from 'react-intl'
import type {IntlShape} from '@formatjs/intl/src/types';
import { user } from '../user/UserStore';
import {ClimateRiskAnalysis, IO, Query, Simulation, UserFile} from 'stores';

export class I18n {
	@observable.ref intl: IntlShape<any> = null;
	intlCache: IntlCache = createIntlCache(); // This is optional but highly recommended since it prevents memory leak

	constructor() {
		makeObservable(this);
		reaction(() => user.language, ()=> {
			this.setLocale(user.language || "en-TEST");
		}, { fireImmediately: true });
	}

	@action
	setLocale(locale: string) {
		const messages: any = this.loadLocaleData(locale);
		this.intl = createIntl({
			locale: locale,
			defaultLocale: "en-US",
			messages: messages
		}, this.intlCache);

		// Highcharts.setOptions({
		// 	lang: {
		// 		      decimalPoint: ',',
		// 		      thousandsSep: '.'
		// 	      } as any
		// });
	}

	getLocale() {
		return this.intl?.locale || 'en-TEST';
	}

	loadLocaleData(locale: string) {
		switch (locale) {
			case 'en-TEST':
				return require('../../../../lang/compiled-lang/en-TEST.json');
			case 'zh-CN':
				return require('../../../../lang/compiled-lang/zh-CN.json');
			default:
				return require('../../../../lang/compiled-lang/en-US.json');
		}
	}

	@computed get common() {
		return {
			WORDS: {
				ID:     i18n.intl.formatMessage({defaultMessage: "ID", description: "[Common] unique among all identifiers used for those objects and for a specific purpose"}),
				NAME:   i18n.intl.formatMessage({defaultMessage: "Name", description: "[Common] a word by which a thing is known"}),
				DATE:   i18n.intl.formatMessage({defaultMessage: "Date", description: "[Common] the day of the month or year as specified by a number"}),
				FILE:   i18n.intl.formatMessage({defaultMessage: "File", description: "[Common] a item of user's data"}),
				BROWSE: i18n.intl.formatMessage({defaultMessage: "Browse", description: "[Common] button for ask user choose file(s) form their own machine"}),
				ACTION: i18n.intl.formatMessage({defaultMessage: "Action", description: "[Common] using for the object browser column name, the column contains some action buttons."}),
				BROWSER_CARDS_VIEW: i18n.intl.formatMessage({defaultMessage:`Cards`, description:"[Common] Indicates the cards view on the object browser"}),
				BROWSER_TABLE_VIEW: i18n.intl.formatMessage({defaultMessage:`Table`, description:"[Common] Indicates the table view on the object browser"}),
				SPECIFICATION:  i18n.intl.formatMessage({defaultMessage:`Specification`, description:"[Common] an act of describing or identifying something precisely or of stating a precise requirement"}),
				CONFIGURATION:  i18n.intl.formatMessage({defaultMessage:`Configuration`, description:"[Common] an arrangement of elements in a particular form, figure, or combination"}),
				RESULT:     i18n.intl.formatMessage({defaultMessage:`Result`, description:"[Common] a consequence, effect, or outcome of something."}),
				SETTINGS:   i18n.intl.formatMessage({defaultMessage:`Settings`, description:"[Common] the place or type of surroundings where something is positioned or where an event takes place."}),
				SHOW:   i18n.intl.formatMessage({defaultMessage: "Show", description: "[Common] make a item can show on the page"}),
				HIDE:   i18n.intl.formatMessage({defaultMessage: "Hide", description: "[Common] make a item can not saw on the page"}),
				AUTO:   i18n.intl.formatMessage({defaultMessage: "Auto", description: "[Common] the status will change based on the system"}),
			},
			MESSAGE: {
				CHOOSE_A_FILE: i18n.intl.formatMessage({defaultMessage: "Choose a file...", description: "[common] message which display when a file select box does not selected any"}),
				FILE_MUST_BE_SELECTED: i18n.intl.formatMessage({defaultMessage: "File must be selected", description: "[common] user must selected a file from machine to continue"}),
				MORE:       i18n.intl.formatMessage({defaultMessage:`More...`, description:"[Common] the message let user know there had more options/information"}),
				LOADING:    i18n.intl.formatMessage({defaultMessage:`Loading...`, description:"[Common] the message let user know the system is on progress"}),
				STARTING:   i18n.intl.formatMessage({defaultMessage:`Starting...`, description:"[Common] the message let user know the system is starting the progress"}),
				SAVING:     i18n.intl.formatMessage({defaultMessage:`Saving...`, description:"[Common] the message let user know the data is executing storage to backend"}),
				SEARCHING:  i18n.intl.formatMessage({defaultMessage: "Search...", description: "[Common] a filter input's placeholder"}),
				WITH_VARIABLES: {
					DELETE_CONFIRMATION: (objectTypeName: string, objectName: string) => i18n.intl.formatMessage({defaultMessage: `Are you sure you want to delete the {objectTypeName}: "{objectName}" ?`, description: "[Common] for the object control - confirmation message before deleting an object"}, {objectTypeName, objectName}),
					LOADING: (name: string) => i18n.intl.formatMessage({defaultMessage: `Loading {name}...`, description: "[Common] the message let user know the system is on progress"}, {name}),
					STARTING: (name: string) => i18n.intl.formatMessage({defaultMessage: `Starting {name}...`, description: "[Common] the message let user know the system is starting the progress"}, {name}),
					WAITING_READY: (name: string) => i18n.intl.formatMessage({defaultMessage: `Waiting {name} Ready...`, description: "[Common] the message let user know the system is on progress"}, {name}),
					SAVING: (name: string) => i18n.intl.formatMessage({defaultMessage: `Saving {name}...`, description: "[Common] the message let user know the system is on progress"}, {name}),
					CREATING: (objName: string) => i18n.intl.formatMessage({defaultMessage: `Creating {objName}...`, description: "[Common] the message let user know the object is creating"}, {objName}),
					CREATED: (objName: string, itemName: string) => i18n.intl.formatMessage({defaultMessage: `{objName} "{itemName}" Created`, description: "[Common] the message let user know the object created"}, {objName, itemName}),
					MODIFYING: (objName: string) => i18n.intl.formatMessage({defaultMessage: `Modifying {objName}...`, description: "[Common] the message let user know the object is modifying"}, {objName}),
					MODIFIED: (objName: string, itemName: string) => i18n.intl.formatMessage({defaultMessage: `{objName} "{itemName}" Modified`, description: "[Common] the message let user know the change of object saved "}, {objName, itemName}),
					FILE_TYPE_MUST_BE: (type: string) => i18n.intl.formatMessage({defaultMessage: 'File must be {type}', description: "[common] dialog error message - the upload file must be a specified file"}, {type}),
					INITIALIZING_SESSION: (objName: string) => i18n.intl.formatMessage({defaultMessage: 'Initializing {objName} Session', description: "[common] Application Initializing Message"}, {objName}),
					LOAD_SESSION_FAILED: (objName: string) => i18n.intl.formatMessage({defaultMessage: 'Loading {objName} Session Failed', description: "[common] Application Failed Message - load object failed."}, {objName}),
				}
			},
			DIALOG: {
				OK:     i18n.intl.formatMessage({defaultMessage: "OK", description: "[Common] using for the button display. confirm an action or dismiss a message box"}),
				CANCEL: i18n.intl.formatMessage({defaultMessage: "Cancel", description: "[Common] using for the button display. allows the user to cancel the action or message box"}),
				SIMULATE: i18n.intl.formatMessage({defaultMessage: "Simulate", description: "[Common] execute a simulation object to get the result"}),
				CALIBRATE: i18n.intl.formatMessage({defaultMessage: "Calibrate", description: "[Common] execute a Calibration object to get the result"}),

			},
			FILE_CTRL: {
				DOWNLOAD:   i18n.intl.formatMessage({defaultMessage: "Download", description: "[Common] using for common download function"}),
				IMAGE:      i18n.intl.formatMessage({defaultMessage: "Image", description: "[Common] Download image's menu divider text"}),
				CSV:        i18n.intl.formatMessage({defaultMessage: "CSV", description: "[Common] a CSV file"}),
				XLSX:       i18n.intl.formatMessage({defaultMessage: "XLSX", description: "[Common] a XLSX file"}),
				PNG:        i18n.intl.formatMessage({defaultMessage: "PNG", description: "[Common] a PNG image file"}),
				JPEG:       i18n.intl.formatMessage({defaultMessage: "JPEG", description: "[Common] a JPEG image file"}),
				SVG:        i18n.intl.formatMessage({defaultMessage: "SVG", description: "[Common] a SVG image file"}),
				PDF:        i18n.intl.formatMessage({defaultMessage: "PDF", description: "[Common] a PDF file"}),
				JSON:       i18n.intl.formatMessage({defaultMessage: "PDF", description: "[Common] a JSON file"}),
				PRINT:      i18n.intl.formatMessage({defaultMessage: "Print", description: "[Common] using for common print function"}),
				SPECIFICATION:  i18n.intl.formatMessage({defaultMessage:`Specification`, description:"[Common] a file about of describing or identifying something precisely or of stating a precise requirement"}),
				CONFIGURATION:  i18n.intl.formatMessage({defaultMessage:`Configuration`, description:"[Common]  a file contains an arrangement of elements in a particular form, figure, or combination"}),
				IMPORT:     i18n.intl.formatMessage({defaultMessage: "Import", description: "[Common] for the object control - load a related data file"}),
				EXPORT:     i18n.intl.formatMessage({defaultMessage: "Export", description: "[Common] for the object control - generate a related data file for download"}),
				BATCH_IMPORT: i18n.intl.formatMessage({defaultMessage: "Batch Import", description: "[Common] to import specifications file"}),
				WITH_VARIABLES: {
					DOWNLOAD:   (fileType: string) => i18n.intl.formatMessage({defaultMessage: "Download {fileType}", description: "[Common] using for common download function with file type"}, {fileType}),
					IMPORT:     (fileType: string) => i18n.intl.formatMessage({defaultMessage: "Import {fileType}", description: "[Common] for the object control - load a related data file with file type"}, {fileType}),
					EXPORT:     (fileType: string) => i18n.intl.formatMessage({defaultMessage: "Export {fileType}", description: "[Common] for the object control - generate a related data file for download with file type"}, {fileType})
				}
			},
			OBJECT_CTRL: {
				NEW:        i18n.intl.formatMessage({defaultMessage: "New", description: "[Common] for the object control - New a object "}),
				RENAME:     i18n.intl.formatMessage({defaultMessage: "Rename", description: "[Common] for the object control - rename the object"}),
				DELETE:     i18n.intl.formatMessage({defaultMessage: "Delete", description: "[Common] for the object control - delete the object"}),
				DUPLICATE:  i18n.intl.formatMessage({defaultMessage: "Duplicate", description: "[Common] for the object control - duplicate the object"}),
				EDIT:       i18n.intl.formatMessage({defaultMessage: "Edit", description: "[Common] for the object control - modify values of a object"}),
				RESET:      i18n.intl.formatMessage({defaultMessage: "Reset", description: "[Common] for the object control - reset the object configs"}),
				RUN:        i18n.intl.formatMessage({defaultMessage: "Run", description: "[Common] for the object control - execute for generate the result"}),
				CANCEL_RUN: i18n.intl.formatMessage({defaultMessage: "Cancel", description: "[Common] for the object control - cancel generate the result"}),
				DONE:       i18n.intl.formatMessage({defaultMessage: "Done", description: "[Common] for the object control - result already generated"}),

				BOOK:       i18n.intl.formatMessage({defaultMessage: "Book", description: "[Common] the object book structure - book, the most top level"}),
				PAGE:       i18n.intl.formatMessage({defaultMessage: "Page", description: "[Common] the object book structure - page, included by a book"}),
				VIEW:       i18n.intl.formatMessage({defaultMessage: "View", description: "[Common] the object book structure - view, included by a page"}),
				LOCK:       i18n.intl.formatMessage({defaultMessage: "Lock", description: "[Common] the object page ctrl - a page lock to avoid the result lost because user change the inputs"}),
				UNLOCK:     i18n.intl.formatMessage({defaultMessage: "Unlock", description: "[Common] the object page ctrl - to disable the page lock which is used to avoid the result lost"}),
				PREVIOUS:   i18n.intl.formatMessage({defaultMessage: "Previous", description: "[Common] the object page ctrl - happening or existing before something or someone else"}),
				NEXT:       i18n.intl.formatMessage({defaultMessage: "Next", description: "[Common] the object page ctrl - being the first one after the present one or after the one just mentioned"}),

				COPY:       i18n.intl.formatMessage({defaultMessage: "Copy", description: "[Common] save the object to the clipboard"}),
				PASTE:      i18n.intl.formatMessage({defaultMessage: "Paste", description: "[Common] get and put the object to the clipboard"}),

				INSERT:     i18n.intl.formatMessage({defaultMessage: "Insert", description: "[Common] put objects to selected place"}),

				OPEN_RECENT: i18n.intl.formatMessage({defaultMessage: "Open Recent...", description: "[Common] for the object control - open the object which is used recently"}),
				BATCH_IMPORT_FILES: i18n.intl.formatMessage({defaultMessage: "Batch Import File", description: "[Common] export a object specification file (JSON)"}),
				VALIDATION_SIDEBAR: i18n.intl.formatMessage({defaultMessage: "Validation Sidebar", description: "[Common] a sidebar which show the validation messages"}),
				WITH_VARIABLES: {
					BROWSER:(objectType: string) => i18n.intl.formatMessage({defaultMessage: "{objectType} Browser", description: "[Common] for the object control - object browser title"}, {objectType}),
					RUN:    (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Run {followingText}", description: "[Common] for the object control - execute for generate the result"}, {followingText}),
					NEW:    (followingText: string) => i18n.intl.formatMessage({defaultMessage: "New {followingText}", description: "[Common] for the object control - new a object"}, {followingText}),
					NEW_SESSION:    (followingText: string) => i18n.intl.formatMessage({defaultMessage: "New {followingText} Session", description: "[Common] for the object control - new a object"}, {followingText}),
					EDIT:   (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Edit {followingText}", description: "[Common] for the object control - modify values of a object"}, {followingText}),
					RESET:  (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Reset {followingText}", description: "[Common] for the object control - reset the object configs"}, {followingText}),
					RENAME: (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Rename {followingText}", description: "[Common] for the object control - rename the object"}, {followingText}),
					DELETE: (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Delete {followingText}", description: "[Common] for the object control - delete the object"}, {followingText}),
					REMOVE: (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Remove {followingText}", description: "[Common] for the object control - remove the object"}, {followingText}),
					DUPLICATE: (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Duplicate {followingText}", description: "[Common] for the object control - duplicate the object"}, {followingText}),
					OPEN:    (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Open {followingText}", description: "[Common] for the object control - opens an object for viewing or editing"}, {followingText}),
					SAVE:    (followingText: string) => i18n.intl.formatMessage({defaultMessage: "Save {followingText}", description: "[Common] for the object control - save an object configuration"}, {followingText})
				}
			},
			PERIODICITY: {
				MONTHLY:    i18n.intl.formatMessage({defaultMessage: "Monthly", description: "[common] a option for the periodicity"}),
				QUARTERLY:  i18n.intl.formatMessage({defaultMessage: "Quarterly", description: "[common] a option for the periodicity"}),
				ANNUAL:     i18n.intl.formatMessage({defaultMessage: "Annual", description: "[common] a option for the periodicity"})
			},
			SELECTION: {
				ALL:    i18n.intl.formatMessage({defaultMessage: "All", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				NONE:   i18n.intl.formatMessage({defaultMessage: "None", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				WITH:   i18n.intl.formatMessage({defaultMessage: "With", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				WITHOUT:i18n.intl.formatMessage({defaultMessage: "Without", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				ONLY:   i18n.intl.formatMessage({defaultMessage: "Only", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				EXPECT: i18n.intl.formatMessage({defaultMessage: "Except", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				CLEAR:  i18n.intl.formatMessage({defaultMessage: "Clear", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				COLLAPSE:     i18n.intl.formatMessage({defaultMessage: "Collapse", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				EXPAND:       i18n.intl.formatMessage({defaultMessage: "Expand", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				COLLAPSE_ALL: i18n.intl.formatMessage({defaultMessage: "Collapse All", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				EXPAND_ALL:   i18n.intl.formatMessage({defaultMessage: "Expand All", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				SORT_DEFAULT: i18n.intl.formatMessage({defaultMessage: "Default Sort", description: "[Common] a order way for the list a set of items"}),
				SORT_AZ:      i18n.intl.formatMessage({defaultMessage: "Sorted A-Z", description: "[Common] a order way for the list a set of items"}),
				SORT_ZA:      i18n.intl.formatMessage({defaultMessage: "Sorted Z-A", description: "[Common] a order way for the list a set of items"}),
				SELECT_ALL:   i18n.intl.formatMessage({defaultMessage: "Select All", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
				CLEAR_SELECT: i18n.intl.formatMessage({defaultMessage: "Clear Selection", description: "[Common] The name of a shortcut lets the user select the specific item/items quickly"}),
			},
			LOGS: {
				DEBUG: i18n.intl.formatMessage({defaultMessage: "Debug", description: "[Common] The filter name to filter log messages - Debug"}),
				INFO: i18n.intl.formatMessage({defaultMessage: "Info", description: "[Common] The filter name to filter log messages - Info"}),
				WARNINGS: i18n.intl.formatMessage({defaultMessage: "Warnings", description: "[Common] The filter name to filter log messages - Warnings"}),
				ERRORS: i18n.intl.formatMessage({defaultMessage: "Errors", description: "[Common] The filter name to filter log messages - Errors"})
			}
		}
	}

	@computed get economies() {
		return {
			"US": i18n.intl.formatMessage({defaultMessage: "US", description: "a country/economy identification"}),
			"DE": i18n.intl.formatMessage({defaultMessage: "DE", description: "a country/economy identification"}),
			"GB": i18n.intl.formatMessage({defaultMessage: "GB", description: "a country/economy identification"}),
			"CH": i18n.intl.formatMessage({defaultMessage: "CH", description: "a country/economy identification"}),
			"AU": i18n.intl.formatMessage({defaultMessage: "AU", description: "a country/economy identification"}),
			"CA": i18n.intl.formatMessage({defaultMessage: "CA", description: "a country/economy identification"}),
			"JP": i18n.intl.formatMessage({defaultMessage: "JP", description: "a country/economy identification"}),
			"DK": i18n.intl.formatMessage({defaultMessage: "DK", description: "a country/economy identification"}),
			"NO": i18n.intl.formatMessage({defaultMessage: "NO", description: "a country/economy identification"}),
			"SE": i18n.intl.formatMessage({defaultMessage: "SE", description: "a country/economy identification"}),
			"BR": i18n.intl.formatMessage({defaultMessage: "BR", description: "a country/economy identification"}),
			"PL": i18n.intl.formatMessage({defaultMessage: "PL", description: "a country/economy identification"}),
			"KR": i18n.intl.formatMessage({defaultMessage: "KR", description: "a country/economy identification"}),
			"TW": i18n.intl.formatMessage({defaultMessage: "TW", description: "a country/economy identification"}),
			"HK": i18n.intl.formatMessage({defaultMessage: "HK", description: "a country/economy identification"}),
			"CN": i18n.intl.formatMessage({defaultMessage: "CN", description: "a country/economy identification"}),
			"TH": i18n.intl.formatMessage({defaultMessage: "TH", description: "a country/economy identification"}),
			"MY": i18n.intl.formatMessage({defaultMessage: "MY", description: "a country/economy identification"}),
			"CZ": i18n.intl.formatMessage({defaultMessage: "CZ", description: "a country/economy identification"}),
			"SG": i18n.intl.formatMessage({defaultMessage: "SG", description: "a country/economy identification"}),
			"IL": i18n.intl.formatMessage({defaultMessage: "IL", description: "a country/economy identification"}),
			"AR": i18n.intl.formatMessage({defaultMessage: "AR", description: "a country/economy identification"}),
			"CL": i18n.intl.formatMessage({defaultMessage: "CL", description: "a country/economy identification"}),
			"MX": i18n.intl.formatMessage({defaultMessage: "MX", description: "a country/economy identification"})
		}
	}

	@computed get modules() {
		let modules = {
			"Economies": i18n.intl.formatMessage({defaultMessage: "Economies", description: "a module/component identification"}),
			"Markets": i18n.intl.formatMessage({defaultMessage: "Markets", description: "a module/component identification"}),
			"Securities": i18n.intl.formatMessage({defaultMessage: "Securities", description: "a module/component identification"}),
			"Returns": i18n.intl.formatMessage({defaultMessage: "Returns", description: "a module/component identification"}),
			"Martingale Tests": i18n.intl.formatMessage({defaultMessage: "Martingale Tests", description: "a module/component identification"}),
			"User Values": i18n.intl.formatMessage({defaultMessage: "User Values", description: "a module/component identification"}),
			"Catastrophe": i18n.intl.formatMessage({defaultMessage: "Catastrophe", description: "a module/component identification"}),
			"Insurance": i18n.intl.formatMessage({defaultMessage: "Insurance", description: "a module/component identification"}),
			"Financing": i18n.intl.formatMessage({defaultMessage: "Financing", description: "a module/component identification"}),
			"Holdings": i18n.intl.formatMessage({defaultMessage: "Holdings", description: "a module/component identification"}),
			"Portfolios": i18n.intl.formatMessage({defaultMessage: "Portfolios", description: "a module/component identification"}),
			"Entities": i18n.intl.formatMessage({defaultMessage: "Entities", description: "a module/component identification"}),
			"Decision": i18n.intl.formatMessage({defaultMessage: "Decision", description: "a module/component identification"}),
			"Supplemental Models":  i18n.intl.formatMessage({defaultMessage: "Supplemental Models", description: "a module/component identification"}),
			"Accounting": i18n.intl.formatMessage({defaultMessage: "Accounting", description: "a module/component identification"}),
			"Tax": i18n.intl.formatMessage({defaultMessage: "Tax", description: "a module/component identification"}),
			"Economic Variables": i18n.intl.formatMessage({defaultMessage: "Economic Variables", description: "a module/component identification"}),
			"Financial Markets": i18n.intl.formatMessage({defaultMessage: "Financial Markets", description: "a module/component identification"}),
			"Individual Securities": i18n.intl.formatMessage({defaultMessage: "Individual Securities", description: "a module/component identification"}),
			"Investments": i18n.intl.formatMessage({defaultMessage: "Investments", description: "a module/component identification"}),
			"Cash": i18n.intl.formatMessage({defaultMessage: "Cash", description: "a module/component identification"}),
			"Market Returns": i18n.intl.formatMessage({defaultMessage: "Market Returns", description: "a module/component identification"})
		}

		for (const module in modules) {
			if (module.includes(" ")) {
				modules[module.replace(/ /g, "_")] = modules[module];
			}
		}

		return modules
	}

    @computed get databaseLookups() {
		const eulerPeriod = i18n.intl.formatMessage({defaultMessage: "Euler Period", description: "Indicates the frequency of a simulation."});
		const canceled = i18n.intl.formatMessage({defaultMessage: "Canceled", description: "Signals that the requested operation was canceled"});
		return {
			tags: {
				"_id": this.common.WORDS.ID,
				"Name": this.common.WORDS.NAME,
				"Axes": i18n.intl.formatMessage({defaultMessage: "Axes", description: "Label for the axes that can be selected in the simulation"}),
				"Comments": i18n.intl.formatMessage({defaultMessage: "Comments", description: "Label for a textfield with custom user comments to describe an object"}),
				"Created By": i18n.intl.formatMessage({defaultMessage: "Created By", description: "Label that identifies the name of the person that created an object"}),
				"Created Time": i18n.intl.formatMessage({defaultMessage: "Created Time", description: "Label that identifies the time that an object was created"}),
				"Dfs Path": i18n.intl.formatMessage({defaultMessage: "DFS Path", description: "label for the path to the DFS file"}),
				"Economies": i18n.intl.formatMessage({defaultMessage: "Economies", description: "Label for the economies (US, UK, CN, etc) that were simulated"}),
				"Elements": i18n.intl.formatMessage({defaultMessage: "Elements", description: "Label for the number of elements/numbers that were generated by the simulation"}),
				"Frequencies": i18n.intl.formatMessage({defaultMessage: "Frequencies", description: "Label for the frequencies (monthly, yearly, etc) were simulated"}),
				"Grid Name": i18n.intl.formatMessage({defaultMessage: "Grid Name", description: "Label for the the name of a grid/server"}),
				"Modified By": i18n.intl.formatMessage({defaultMessage: "Modified By", description: "Label that identifies the name of the person that last modified an object"}),
				"Modified Time": i18n.intl.formatMessage({defaultMessage: "Modified Time", description: "Label that identifies the time that an object was last modified"}),
				"Modules": i18n.intl.formatMessage({defaultMessage: "Modules", description: "Label for the modules/components that were included/used in the simulation"}),
				"Periods": i18n.intl.formatMessage({defaultMessage: "Periods", description: "Label for the number of the periods (years, quarters and months) in the simulation"}),
				"Product Version": i18n.intl.formatMessage({defaultMessage: "{productName} Version", description: "Label for the software version"}, {productName: _.get(window, ["conning", "globals", "product"], "")}),
				"Scenario Summary": i18n.intl.formatMessage({defaultMessage: "Scenario Summary", description: "Label for the Meta data that describes a simulation"}),
				"Scenarios": i18n.intl.formatMessage({defaultMessage: "Scenarios", description: "Label for the number of scenarios that were simulated"}),
				"Size": i18n.intl.formatMessage({defaultMessage: "Size", description: "Label for the size in bytes of the simulation"}),
				"Source Type": i18n.intl.formatMessage({defaultMessage: "Source Type", description: "Label for the source (Legacy, GEMS, User Uploaded File) that generated the simulation"}),
				"Status": i18n.intl.formatMessage({defaultMessage: "Status", description: "Label for the current state/status of an object"}),
				"Use Case": i18n.intl.formatMessage({defaultMessage: "Use Case", description: "Label for a value that describes a particular UI work flow or use case that the simulation inputs and outputs should highlight"}),
				"User File": UserFile.OBJECT_NAME_SINGLE,
				"Variables": i18n.intl.formatMessage({defaultMessage: "Variables", description: "Label for the number of variables in the simulation"}),
				"Version": i18n.intl.formatMessage({defaultMessage: "Version", description: "Label for the schema version of the simulation"}),

				//simulation parameterizationMeasure
				"Parameterization Measure": i18n.intl.formatMessage({defaultMessage: "Parameterization Measure", description: "Parameterization Measure for the simulation firm"}),

				//Query
				"Has Result": i18n.intl.formatMessage({defaultMessage: "Has Result", description: "Indicates that the query object has been run and results are available"}),
				"Result": i18n.intl.formatMessage({defaultMessage: "Result", description: "The query result metadata"}),
				"Simulations": Simulation.OBJECT_NAME_MULTI,

				//User File
				"Type": i18n.intl.formatMessage({defaultMessage: "Type", description: "Describes the type of file that was uploaded"}),

				// AO
				"Asset Returns Simulation": i18n.intl.formatMessage({defaultMessage: "Asset Returns Simulation", description: "Link to a simulation that provides asset returns values for an optimization"}),
				"Company Data Repository": i18n.intl.formatMessage({defaultMessage: "Company Data Repository", description: "Link to a repository (user uploaded file) that provides company data values for an optimization"}),
				"Company Data Simulation": i18n.intl.formatMessage({defaultMessage: "Company Data Simulation", description: "Link to a simulation that provides company data values for an optimization"}),

				// CRA
				"Simulation": Simulation.OBJECT_NAME_SINGLE
			},
			tagValues: {
				"Waiting": i18n.intl.formatMessage({defaultMessage: "Waiting", description: "Signals that the object is incomplete and is waiting on the user to run it"}),
				"Running": i18n.intl.formatMessage({defaultMessage: "Running", description: "Signals that a process is running in order to generate the requested output"}),
				"Complete": i18n.intl.formatMessage({defaultMessage: "Complete", description: "Signals that a process has completed and the requested results are available"}),
				"Failed": i18n.intl.formatMessage({defaultMessage: "Failed", description: "Signals that the requested operation failed to complete"}),
				"Cancelled": canceled,
				"Canceled": canceled,
				"Canceling": i18n.intl.formatMessage({defaultMessage: "Canceling", description: "Signals that the requested operation is in the process of being canceled"}),
				"Finalizing": i18n.intl.formatMessage({defaultMessage: "Finalizing", description: "Signals that the requested output is being finalized before being complete"}),
				"Restarting": i18n.intl.formatMessage({defaultMessage: "Restarting", description: "Signals that a process is being restarted"}),
				"Creating": i18n.intl.formatMessage({defaultMessage: "Creating", description: "Signals that a process is being created"}),
				"Not Complete": i18n.intl.formatMessage({defaultMessage: "Not Complete", description: "[Common] Signals that a process has not completed"}),
				"Run": i18n.intl.formatMessage({defaultMessage: "Run", description: "[Common] Signals that a process is in the run (has been started and is running) state"}),

				// Simulation source types
				"Classic": i18n.intl.formatMessage({defaultMessage: "Classic", description: "[Common] simulation source type for the data came from a windows application"}),
				"IntermediateResults": i18n.intl.formatMessage({defaultMessage: "Intermediate Results", description: "[Common] simulation source type for intermediate/in-between/not final by scenario values that are aggregated to produce AO outputs"}),
				"IntermediateResult":  i18n.intl.formatMessage({defaultMessage: "Intermediate Results", description: "[Common] simulation source type for intermediate/in-between/not final by scenario values that are aggregated to produce AO outputs"}),
				"User Uploaded File": i18n.intl.formatMessage({defaultMessage: "User Uploaded File", description: "[Common] simulation source type for scenario files that were uploaded by the user and used to create a simulation object"}),

				//simulation parameterizationMeasure
				"RealWorld": i18n.intl.formatMessage({defaultMessage: "Real World", description: "[Common] simulation parameterization Measure for the firm simulation"}),
				"RiskNeutral": i18n.intl.formatMessage({defaultMessage: "Risk Neutral", description: "[Common] simulation parameterization Measure for the firm simulation"}),

				"No grid": i18n.intl.formatMessage({defaultMessage: "No grid", description: "Signals that a simulation wasn't ran with a grid"}),

				"Year": i18n.intl.formatMessage({defaultMessage: "Year", description: "Indicates the frequency of a simulation."}),
				"Month": i18n.intl.formatMessage({defaultMessage: "Month", description: "Indicates the frequency of a simulation."}),
				"Quarter": i18n.intl.formatMessage({defaultMessage: "Quarter", description: "Indicates the frequency of a simulation."}),
				"Euler_period": eulerPeriod,
				"Euler_Period": eulerPeriod,

				...this.economies,
				...this.modules
			}
		}
	}

	@computed get highcharts() {
		return {
			chart: {
				box: i18n.intl.formatMessage({
					defaultMessage: 'Box',
					description: '[hightcharts] Box Chart'
				}),
				cone: i18n.intl.formatMessage({
					defaultMessage: 'Cone',
					description: '[hightcharts] Cone Chart'
				}),
				scatter: i18n.intl.formatMessage({
					defaultMessage: 'Scatter',
					description: '[hightcharts] Scatter Chart'
				}),
				pdf: i18n.intl.formatMessage({
					defaultMessage: 'Probability Density Function',
					description: '[hightcharts] Probability Density Function Chart'
				}),
				cdf: i18n.intl.formatMessage({
					defaultMessage: 'Cumulative Density Function',
					description: '[hightcharts] Cumulative Density Function Chart'
				}),
				gboxplot: i18n.intl.formatMessage({
					defaultMessage: 'Box Plot',
					description: '[hightcharts] Box Plot Chart'
				}),
				craBox: i18n.intl.formatMessage({
					defaultMessage: 'Market Value Through Time Statistics',
					description: '[hightcharts] Market Value Through Time Statistics Chart in CRA'
				}),
				rsSimulationRecalibration: i18n.intl.formatMessage({
					defaultMessage: 'Recalibration',
					description: '[hightcharts] Recalibration Chart in Recalibration'
				})
			},
			loadingChart(chart: { chart: string }) {
				return i18n.intl.formatMessage({
					defaultMessage: 'Loading {chart} Chart...',
					description: '[hightcharts] Loading message while loading chart'
				}, chart);
			},
			toolbar: {
				percentiles: i18n.intl.formatMessage({
					defaultMessage: 'Percentiles:',
					description: '[hightcharts] Form label for setting multiple percentiles'
				})
			},
			tooltipTitle: {
				distributionPercentiles: i18n.intl.formatMessage({
					defaultMessage: 'Distribution Percentiles',
					description: '[hightcharts] Tooltip title in chart - Distribution Percentiles'
				}),
				seriesIdentification: i18n.intl.formatMessage({
					defaultMessage: 'Series Identification',
					description: '[hightcharts] Tooltip title in chart - Series Identification'
				}),
				pointIdentication: i18n.intl.formatMessage({
					defaultMessage: 'Point Identification',
					description: '[hightcharts] Tooltip title in chart - Point Identification'
				}),
				pointValue: i18n.intl.formatMessage({
					defaultMessage: 'Point Value',
					description: '[hightcharts] Tooltip title in chart - Point Value'
				}),
				pointValues: i18n.intl.formatMessage({
					defaultMessage: 'Point Values',
					description: '[hightcharts] Tooltip title in chart - Point Values'
				}),
				percentileDetails: i18n.intl.formatMessage({
					defaultMessage: 'Percentile Details',
					description: '[hightcharts] Tooltip title in chart - Percentile Details'
				}),
				distributionInformation: i18n.intl.formatMessage({
					defaultMessage: 'Distribution Information',
					description: '[hightcharts] Tooltip title in chart - Distribution Information'
				}),
				identification: i18n.intl.formatMessage({
					defaultMessage: 'Identification',
					description: '[hightcharts] Tooltip title in chart - Identification'
				}),
				assetAllocation: i18n.intl.formatMessage({
					defaultMessage: 'Asset Allocation',
					description: '[hightcharts] Tooltip title in chart - Asset Allocation'
				}),
				metrics: i18n.intl.formatMessage({
					defaultMessage: 'Metrics',
					description: '[hightcharts] Tooltip title in chart - Metrics'
				}),
				horizon: i18n.intl.formatMessage({
					defaultMessage: 'Horizon',
					description: '[hightcharts] Tooltip title in chart - Horizon'
				})
			},
			tooltipValueSet: {
				assetClass: i18n.intl.formatMessage({
					defaultMessage: 'Asset Class',
					description: '[hightcharts] Tooltip value in chart - Asset Class'
				}),
				name: i18n.intl.formatMessage({
					defaultMessage: 'Name',
					description: '[hightcharts] Tooltip value in chart - Name'
				}),
				value: i18n.intl.formatMessage({
					defaultMessage: 'Value',
					description: '[hightcharts] Tooltip value in chart - Value'
				}),
				values: i18n.intl.formatMessage({
					defaultMessage: 'Values',
					description: '[hightcharts] Tooltip value in chart - Value (plural)'
				}),
				percentile: i18n.intl.formatMessage({
					defaultMessage: 'Percentile',
					description: '[hightcharts] Tooltip value in chart - Percentile'
				}),
				percentiles: i18n.intl.formatMessage({
					defaultMessage: 'Percentiles',
					description: '[hightcharts] Tooltip value in chart - Percentile (plural)'
				}),
				probabilityDensity: i18n.intl.formatMessage({
					defaultMessage: 'Probability Density',
					description: '[hightcharts] Tooltip value in chart - Probability Density'
				}),
				target: i18n.intl.formatMessage({
					defaultMessage: 'Target',
					description: '[hightcharts] Tooltip value in chart - Target'
				}),
				previous: i18n.intl.formatMessage({
					defaultMessage: 'Previous',
					description: '[hightcharts] Tooltip value in chart - Previous'
				}),
				current: i18n.intl.formatMessage({
					defaultMessage: 'Current',
					description: '[hightcharts] Tooltip value in chart - Current'
				}),
				horizon: i18n.intl.formatMessage({
					defaultMessage: 'Horizon',
					description: '[hightcharts] Tooltip value in chart - Horizon'
				}),
				point: i18n.intl.formatMessage({
					defaultMessage: 'Point',
					description: '[hightcharts] Tooltip value in chart - Point'
				}),
				duration: i18n.intl.formatMessage({
					defaultMessage: 'Duration',
					description: '[hightcharts] Tooltip value in chart - Duration'
				}),
				year: i18n.intl.formatMessage({
					defaultMessage: 'Year',
					description: '[hightcharts] Tooltip value in chart - Year'
				}),
				mean: i18n.intl.formatMessage({
					defaultMessage: 'Mean',
					description: '[hightcharts] Tooltip value in chart - Mean'
				}),
				series: i18n.intl.formatMessage({
					defaultMessage: 'Series',
					description: '[hightcharts] Tooltip value in chart - Series'
				})
			}
		};
	}

	translateObjectName = (type) => {
		switch (`${type}`) {
			case Simulation.ObjectType:
				return Simulation.OBJECT_NAME_SINGLE;
			case Query.ObjectType:
				return Query.OBJECT_NAME_SINGLE;
			case IO.ObjectType:
				return IO.OBJECT_NAME_SINGLE;
			case ClimateRiskAnalysis.ObjectType:
				return ClimateRiskAnalysis.OBJECT_NAME_SINGLE;
			case UserFile.ObjectType:
				return UserFile.OBJECT_NAME_SINGLE;
			default:
				return type;
		}
	}
}

export const i18n = new I18n();