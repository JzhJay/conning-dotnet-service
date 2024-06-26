import type {TabId} from '@blueprintjs/core';
import {Breadcrumb, Icon, Tab, Tabs, Tooltip, MenuItem, NavbarDivider} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import {ApplicationPage, Autorun, BillingReportPage, bp, NotificationSettingsTabPanel, PanelSection, sem} from "components";
import { autorun, observable, makeObservable, action } from 'mobx';
import {observer} from 'mobx-react';
import {ActiveTool, routing, user, utility, settings, site, i18n} from 'stores';
import {DevOnlySettingsTabPanel} from './';
import {ChangePasswordSection} from './ChangePasswordSection';
import * as css from './PreferencesPage.css';
import {FormattedMessage} from 'react-intl';

// interface MyProps {
// 	router?: ReactRouter.Router;
// 	location: HistoryModule.LocationDescriptorObject;
// }
//
// interface QueryString {
// 	tab?: string;
// }

// These are used for the URL:   ?tab=system_settings
//const keys = ['system-settings', 'query-tool'];

const {Form, Header, Segment, Input, Card, List, ListItem, FormCheckbox} = sem;

const tabIds = ['profile', 'notifications', 'cloudwatch', 'dev-only'];

@observer
export class PreferencesPage extends React.Component<{ params: {tabId: TabId}, location: HistoryModule.LocationDescriptorObject}, {}> {
    @observable selectedTab: TabId = 'profile';

	constructor(props) {
		super(props);
		makeObservable(this);

		this.selectedTab = this.props.params.tabId;
	}

    render() {
		const {selectedTab, props} = this;

		return (
			<ApplicationPage tool={ActiveTool.preferences}
			                 title={() => 'User Preferences'}
			                 breadcrumbs={() => [
								<>
									<Breadcrumb text={<>
										<Icon title={i18n.intl.formatMessage({defaultMessage: "Preferences", description: "page title"})} icon="settings"/>
										<FormattedMessage defaultMessage="Preferences" description="page title"/>
									</>}
									/>
									<NavbarDivider />
								</>,
			                    selectedTab == 'profile' && <Breadcrumb text={<>
				                    <Icon title={i18n.intl.formatMessage({defaultMessage: "Profile", description: "page title"})} icon="user"/>
				                    <FormattedMessage defaultMessage="Profile" description="page title"/>
			                    </>}
			                    />,
								selectedTab == 'notifications' && <Breadcrumb text={<>
									<Icon title={i18n.intl.formatMessage({defaultMessage: "Notifications", description: "page title"})} icon="cell-tower"/>
									<FormattedMessage defaultMessage="Notifications" description="page title"/>
								</>}
								/>,
								selectedTab == 'cloudwatch' && <Breadcrumb text={<>
									<Icon title={i18n.intl.formatMessage({defaultMessage: "Cloudwatch", description: "page title"})} icon="cloud"/>
									<FormattedMessage defaultMessage="Cloudwatch" description="page title"/>
								</>}
								/>,
								selectedTab == 'dev-only' && <Breadcrumb text={<>
									<Icon title={i18n.intl.formatMessage({defaultMessage: "Profile", description: "page title"})} icon="ninja"/>
									<FormattedMessage defaultMessage="Profile" description="page title"/>
								</>}
								/>
			                 ].filter(f => f )}
			                 className={css.preferencesPage}>
				<div className={css.content}>
					{false && <div className={css.header}>
						<Icon className={css.icon} icon='user' iconSize={24}/>
						<span className={css.title}>User Preferences</span>
					</div>}

					<Tabs id="preference-tab"
					      className={css.tabs}
					      animate={false}
					      renderActiveTabPanelOnly
					      selectedTabId={selectedTab}
					      onChange={newTabId => {
					      	this.selectedTab = newTabId;
							routing.replace(`${routing.urls.preferences}/${newTabId}`);
					      }}>
						<Tab title={<FormattedMessage defaultMessage="Profile" description="page title"/>} id="profile" panel={<SettingsTabPanel/>}/>
						{/*<Tab title="Settings" id="settings" panel={<ProfileTabPanel/>}/>*/}
						{!site.isOnPrem && <Tab title={<FormattedMessage defaultMessage="Notifications" description="page title"/>} id="notifications" panel={<NotificationSettingsTabPanel/>}/>}
						<Tabs.Expander/>

						{/*{site.features.simulationMonitor && <Tab title="Simulation Monitor" id="cloudwatch" panel={<BillingReportPage {...props} />}/> }*/}
						{DEV_BUILD && <Tab title={<span><sem.Icon name='magic'/>Dev-Only</span>} id="dev-only" panel={<DevOnlySettingsTabPanel/>}/>}
					</Tabs>
				</div>
			</ApplicationPage>
		)
	}

    _toDispose = [];

    componentDidUpdate() {
		const {_toDispose, props: {location, params: {tabId}}} = this;
		if (!_.isEmpty(tabId) && tabId != this.selectedTab && _.includes(tabIds, tabId)) {
			this.selectedTab = tabId;
		}
	}

    componentWillUnmount() {
		this._toDispose.forEach(f => f())
	}
}

@observer
class SettingsTabPanel extends React.Component<{}, {}> {
	render() {
		// const showUpgradeDbButton = systemInformation
		// 	&& systemInformation.canMigrateDb
		// 	&& systemInformation.dbVersion !== systemInformation.serverVersion;

		//const query         = location.query as QueryString;
		const {currentUser, settings} = user;

		return (
			<div className="scrollable">
				<span className={css.subtitle}>
					<FormattedMessage defaultMessage={"Configure properties related to your"} description={"[SettingsTabPanel] Indicates the page sub title, and show account name - message part"}/>&nbsp;
					<Tooltip content={currentUser && currentUser.email}><u><FormattedMessage defaultMessage={"account"} description={"[SettingsTabPanel] Indicates the page sub title, and show account name - account link text part"}/></u></Tooltip>:
				</span>

				{false && currentUser &&
					<PanelSection
						title={i18n.intl.formatMessage({defaultMessage: "Login", description: "[SettingsTabPanel] section title - Indicates login block if can not load the user information"})}
						subtitle={<span>
							<FormattedMessage defaultMessage={"You are logged in as "} description={"[SettingsTabPanel] section description - Indicates login block if can not load the user information"}/>
							<Tooltip content={currentUser.email}><a>'{currentUser.name}'</a></Tooltip>.
						</span>} />
				}

				<PanelSection
					title={i18n.intl.formatMessage({defaultMessage: "Two-Factor Authentication", description: "[SettingsTabPanel] section title - Indicates Two-Factor Authentication setting block"})}
					collapsible={false}
				>
					<bp.Switch
						checked={user.enableMFA}
						disabled={user.forceMFA}
						onChange={action(() => user.settings.enableMFA = !user.enableMFA)}
						label={`${i18n.intl.formatMessage({defaultMessage:'Enable MFA ', description: '[SettingsTabPanel] Indicates Multi-factor authentication option'})}${user.forceMFA ? i18n.intl.formatMessage({defaultMessage:'(Locked by Administrator)', description: '[SettingsTabPanel] section description - (Locked by Administrator)'}) : '' }`}
					/>
				</PanelSection>

				<PanelSection
					title={i18n.intl.formatMessage({defaultMessage: 'Region', description: '[SettingsTabPanel] section title - Indicates a region setting block'})}
					collapsible={false}>
					<Select
						activeItem={user.region}
						items={Object.keys(this.selectableRegions)}
						itemRenderer={(region, {handleClick, modifiers}) => {
							const text = this.displayNamesFunc.of(region);
							return <MenuItem key={region} onClick={handleClick} active={modifiers.active} text={text} />
						}}
						onItemSelect={(regionCode) => user.settings.region = regionCode }
						filterable={true}
						itemPredicate={(query, regionCode) => (query == null || (this.displayNamesFunc.of(regionCode).toLowerCase().indexOf(query.toLowerCase()) >= 0)) }
					>
						<bp.Button
							text={this.displayNamesFunc.of(user.region)}
							rightIcon="double-caret-vertical" />
					</Select>
				</PanelSection>

				{user.isDeveloper && <PanelSection
					title={i18n.intl.formatMessage({defaultMessage: 'Language', description: '[SettingsTabPanel] section title - Indicates a language setting block'})}
					collapsible={false}>
					<Select
						activeItem={user.language}
						items={Object.keys(this.selectableLanguages)}
						itemRenderer={(language, {handleClick, modifiers}) => {
							const text = this.displayLanguageNamesFunc.of(language);
							return <MenuItem key={language} onClick={handleClick} active={modifiers.active} text={text} />
						}}
						onItemSelect={(languageCode) => {
							console.log('languageCode', languageCode);
							user.settings.language = languageCode;
						}}
						filterable={true}
						itemPredicate={(query, regionCode) => (query == null || (this.displayLanguageNamesFunc.of(regionCode).toLowerCase().indexOf(query.toLowerCase()) >= 0)) }
					>
						<bp.Button
							text={this.displayLanguageNamesFunc.of(user.language)}
							rightIcon="double-caret-vertical" />
					</Select>
				</PanelSection>}

				<PanelSection
					title={i18n.intl.formatMessage({defaultMessage: 'Query Tool Variables Layout', description: '[SettingsTabPanel] section title - Indicates a Query Tool Variables Layout setting block'})}
					collapsible={false}
				>
					<bp.Radio label={i18n.intl.formatMessage({defaultMessage: 'Collapsed (Vertical)', description: '[SettingsTabPanel] section option - Query Tool Variables Layout - Vertical'})} checked={user.settings.query.shouldExpandVariables !== true} onChange={action(() => user.settings.query.shouldExpandVariables = false)}/>
					<bp.Radio label={i18n.intl.formatMessage({defaultMessage: 'Expanded (Horizontal)', description: '[SettingsTabPanel] section option - Query Tool Variables Layout - Horizontal'})} checked={user.settings.query.shouldExpandVariables === true} onChange={action(() => user.settings.query.shouldExpandVariables = true)}/>
				</PanelSection>

			</div>)
	}

	// List of Countries in various Javascript data structures:
	// https://gist.github.com/incredimike/1469814
	selectableRegions = {
		"AF": "Afghanistan",
		"AL": "Albania",
		"DZ": "Algeria",
		"AS": "American Samoa",
		"AD": "Andorra",
		"AO": "Angola",
		"AI": "Anguilla",
		"AQ": "Antarctica",
		"AG": "Antigua and Barbuda",
		"AR": "Argentina",
		"AM": "Armenia",
		"AW": "Aruba",
		"AU": "Australia",
		"AT": "Austria",
		"AZ": "Azerbaijan",
		"BS": "Bahamas (the)",
		"BH": "Bahrain",
		"BD": "Bangladesh",
		"BB": "Barbados",
		"BY": "Belarus",
		"BE": "Belgium",
		"BZ": "Belize",
		"BJ": "Benin",
		"BM": "Bermuda",
		"BT": "Bhutan",
		"BO": "Bolivia (Plurinational State of)",
		"BQ": "Bonaire, Sint Eustatius and Saba",
		"BA": "Bosnia and Herzegovina",
		"BW": "Botswana",
		"BV": "Bouvet Island",
		"BR": "Brazil",
		"IO": "British Indian Ocean Territory (the)",
		"BN": "Brunei Darussalam",
		"BG": "Bulgaria",
		"BF": "Burkina Faso",
		"BI": "Burundi",
		"CV": "Cabo Verde",
		"KH": "Cambodia",
		"CM": "Cameroon",
		"CA": "Canada",
		"KY": "Cayman Islands (the)",
		"CF": "Central African Republic (the)",
		"TD": "Chad",
		"CL": "Chile",
		"CN": "China",
		"CX": "Christmas Island",
		"CC": "Cocos (Keeling) Islands (the)",
		"CO": "Colombia",
		"KM": "Comoros (the)",
		"CD": "Congo (the Democratic Republic of the)",
		"CG": "Congo (the)",
		"CK": "Cook Islands (the)",
		"CR": "Costa Rica",
		"HR": "Croatia",
		"CU": "Cuba",
		"CW": "Curaçao",
		"CY": "Cyprus",
		"CZ": "Czechia",
		"CI": "Côte d'Ivoire",
		"DK": "Denmark",
		"DJ": "Djibouti",
		"DM": "Dominica",
		"DO": "Dominican Republic (the)",
		"EC": "Ecuador",
		"EG": "Egypt",
		"SV": "El Salvador",
		"GQ": "Equatorial Guinea",
		"ER": "Eritrea",
		"EE": "Estonia",
		"SZ": "Eswatini",
		"ET": "Ethiopia",
		"FK": "Falkland Islands (the) [Malvinas]",
		"FO": "Faroe Islands (the)",
		"FJ": "Fiji",
		"FI": "Finland",
		"FR": "France",
		"GF": "French Guiana",
		"PF": "French Polynesia",
		"TF": "French Southern Territories (the)",
		"GA": "Gabon",
		"GM": "Gambia (the)",
		"GE": "Georgia",
		"DE": "Germany",
		"GH": "Ghana",
		"GI": "Gibraltar",
		"GR": "Greece",
		"GL": "Greenland",
		"GD": "Grenada",
		"GP": "Guadeloupe",
		"GU": "Guam",
		"GT": "Guatemala",
		"GG": "Guernsey",
		"GN": "Guinea",
		"GW": "Guinea-Bissau",
		"GY": "Guyana",
		"HT": "Haiti",
		"HM": "Heard Island and McDonald Islands",
		"VA": "Holy See (the)",
		"HN": "Honduras",
		"HK": "Hong Kong",
		"HU": "Hungary",
		"IS": "Iceland",
		"IN": "India",
		"ID": "Indonesia",
		"IR": "Iran (Islamic Republic of)",
		"IQ": "Iraq",
		"IE": "Ireland",
		"IM": "Isle of Man",
		"IL": "Israel",
		"IT": "Italy",
		"JM": "Jamaica",
		"JP": "Japan",
		"JE": "Jersey",
		"JO": "Jordan",
		"KZ": "Kazakhstan",
		"KE": "Kenya",
		"KI": "Kiribati",
		"KP": "Korea (the Democratic People's Republic of)",
		"KR": "Korea (the Republic of)",
		"KW": "Kuwait",
		"KG": "Kyrgyzstan",
		"LA": "Lao People's Democratic Republic (the)",
		"LV": "Latvia",
		"LB": "Lebanon",
		"LS": "Lesotho",
		"LR": "Liberia",
		"LY": "Libya",
		"LI": "Liechtenstein",
		"LT": "Lithuania",
		"LU": "Luxembourg",
		"MO": "Macao",
		"MG": "Madagascar",
		"MW": "Malawi",
		"MY": "Malaysia",
		"MV": "Maldives",
		"ML": "Mali",
		"MT": "Malta",
		"MH": "Marshall Islands (the)",
		"MQ": "Martinique",
		"MR": "Mauritania",
		"MU": "Mauritius",
		"YT": "Mayotte",
		"MX": "Mexico",
		"FM": "Micronesia (Federated States of)",
		"MD": "Moldova (the Republic of)",
		"MC": "Monaco",
		"MN": "Mongolia",
		"ME": "Montenegro",
		"MS": "Montserrat",
		"MA": "Morocco",
		"MZ": "Mozambique",
		"MM": "Myanmar",
		"NA": "Namibia",
		"NR": "Nauru",
		"NP": "Nepal",
		"NL": "Netherlands (the)",
		"NC": "New Caledonia",
		"NZ": "New Zealand",
		"NI": "Nicaragua",
		"NE": "Niger (the)",
		"NG": "Nigeria",
		"NU": "Niue",
		"NF": "Norfolk Island",
		"MP": "Northern Mariana Islands (the)",
		"NO": "Norway",
		"OM": "Oman",
		"PK": "Pakistan",
		"PW": "Palau",
		"PS": "Palestine, State of",
		"PA": "Panama",
		"PG": "Papua New Guinea",
		"PY": "Paraguay",
		"PE": "Peru",
		"PH": "Philippines (the)",
		"PN": "Pitcairn",
		"PL": "Poland",
		"PT": "Portugal",
		"PR": "Puerto Rico",
		"QA": "Qatar",
		"MK": "Republic of North Macedonia",
		"RO": "Romania",
		"RU": "Russian Federation (the)",
		"RW": "Rwanda",
		"RE": "Réunion",
		"BL": "Saint Barthélemy",
		"SH": "Saint Helena, Ascension and Tristan da Cunha",
		"KN": "Saint Kitts and Nevis",
		"LC": "Saint Lucia",
		"MF": "Saint Martin (French part)",
		"PM": "Saint Pierre and Miquelon",
		"VC": "Saint Vincent and the Grenadines",
		"WS": "Samoa",
		"SM": "San Marino",
		"ST": "Sao Tome and Principe",
		"SA": "Saudi Arabia",
		"SN": "Senegal",
		"RS": "Serbia",
		"SC": "Seychelles",
		"SL": "Sierra Leone",
		"SG": "Singapore",
		"SX": "Sint Maarten (Dutch part)",
		"SK": "Slovakia",
		"SI": "Slovenia",
		"SB": "Solomon Islands",
		"SO": "Somalia",
		"ZA": "South Africa",
		"GS": "South Georgia and the South Sandwich Islands",
		"SS": "South Sudan",
		"ES": "Spain",
		"LK": "Sri Lanka",
		"SD": "Sudan (the)",
		"SR": "Suriname",
		"SJ": "Svalbard and Jan Mayen",
		"SE": "Sweden",
		"CH": "Switzerland",
		"SY": "Syrian Arab Republic",
		"TW": "Taiwan",
		"TJ": "Tajikistan",
		"TZ": "Tanzania, United Republic of",
		"TH": "Thailand",
		"TL": "Timor-Leste",
		"TG": "Togo",
		"TK": "Tokelau",
		"TO": "Tonga",
		"TT": "Trinidad and Tobago",
		"TN": "Tunisia",
		"TR": "Turkey",
		"TM": "Turkmenistan",
		"TC": "Turks and Caicos Islands (the)",
		"TV": "Tuvalu",
		"UG": "Uganda",
		"UA": "Ukraine",
		"AE": "United Arab Emirates (the)",
		"GB": "United Kingdom of Great Britain and Northern Ireland (the)",
		"UM": "United States Minor Outlying Islands (the)",
		"US": "United States of America (the)",
		"UY": "Uruguay",
		"UZ": "Uzbekistan",
		"VU": "Vanuatu",
		"VE": "Venezuela (Bolivarian Republic of)",
		"VN": "Viet Nam",
		"VG": "Virgin Islands (British)",
		"VI": "Virgin Islands (U.S.)",
		"WF": "Wallis and Futuna",
		"EH": "Western Sahara",
		"YE": "Yemen",
		"ZM": "Zambia",
		"ZW": "Zimbabwe",
		"AX": "Åland Islands"
	};

	selectableLanguages = {
		"zh-CN": "China",
		"en-US": "United States of America (the)",
		...(DEV_BUILD ? {
			"en-TEST": "Test Translation Language"
		} : {})
	};

	displayNamesFunc = new (Intl["DisplayNames"])([window.navigator["userLanguage"] || window.navigator.language], {type: 'region'});

	displayLanguageNamesFunc = new (Intl["DisplayNames"])([window.navigator["userLanguage"] || window.navigator.language], {type: 'language'});

	externalIDInput: HTMLInputElement

	onUpdateExternalUser = (e) => {
		user.settings.externalID = this.externalIDInput.value;
	}

	onUpdateExternalUser_KeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.keyCode === utility.ENTER_KEY_CODE) {
			this.externalIDInput.blur();
		}
	}

}

