import {observer, useLocalObservable} from 'mobx-react';
import {useCallback, useEffect} from 'react';
import {rsSimulationStore, i18n} from 'stores';
import {action} from 'mobx';
import {bp, LoadingUntil} from 'components';
import {Checkbox, ContextMenu} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import * as React from 'react';
import * as css from './ParameterTemplateOptions.css';
import {formatLabelText, juliaDateStringToLocaleDateString} from 'utility';
import {ITemplateFilter, TemplateOptions} from 'ui/src/stores/rsSimulation/models';
import * as dialogCss from 'components/site/dialogs.css';

const DROPDOWN_FIELDS = ["date", "periodicity"/*, "parameterization", "version"*/];
const CHECKBOX_FIELDS = ["economies", "components"];
const PERIODICITY_RANK = {"Monthly": 1, "Quarterly": 2, "Annual": 3};

interface IDropdownItem {
	value: string;
	label: string;
}

export const ParameterTemplateOptions = observer((props: {saveTemplateFilter: (templateFilter: ITemplateFilter) => void}): JSX.Element => {
	let store: {templateOptions: TemplateOptions, templateFilter: ITemplateFilter}= useLocalObservable(() => {
		return {
			templateOptions: null,
			templateFilter: null
		}
	});

	useEffect(() => {
		store.templateOptions == null && rsSimulationStore.loadTemplateOptions().then(action(result => {
			store.templateOptions = result;
			store.templateFilter = {..._.last(result), components: ["Market_Indices"]};
			props.saveTemplateFilter(store.templateFilter);
		}));

		return () => props.saveTemplateFilter(null);
	}, [])

	let filteredTemplateOptions = store.templateOptions;

	// Generate dropdown items and filter the list of template options based on the template filter
	const dropdownItems = DROPDOWN_FIELDS.reduce((accum, field) => {
		const options = filteredTemplateOptions;
		accum[field] = options ? _.uniqBy<IDropdownItem>(options.map(t => {
			let label = _.toString(_.get(t,[field], ""));
			if (field == "date") {
				label = juliaDateStringToLocaleDateString(label);
			} else {
				label = label.replace(/_/g, " ")
				switch (label) {
					case 'Monthly':
						label = i18n.common.PERIODICITY.MONTHLY
						break;
					case 'Quarterly':
						label = i18n.common.PERIODICITY.QUARTERLY;
						break;
					case 'Annual':
						label = i18n.common.PERIODICITY.ANNUAL;
						break;
				}
			}
			return {
				value: t[field],
				label: label
			}
		}), option => option.value) : [];

		if (field == "date") // sort dates alphabetically
			accum[field] = _.orderBy(accum[field],["value"], ["desc"]);
		if (field == "periodicity") // sort periodicity by rank
			accum[field] = _.sortBy(accum[field],item => {
				return PERIODICITY_RANK[item.value];
			});

		if (filteredTemplateOptions)
			filteredTemplateOptions = filteredTemplateOptions.filter(t => t[field] == store.templateFilter[field]);

		return accum;
	}, {});

	const checkboxOptions = CHECKBOX_FIELDS.reduce((accum, field) => {
		accum[field] = filteredTemplateOptions ? filteredTemplateOptions[0][field]: [];
		return accum;
	}, {});

	const onCheckboxChange = action((field, value) => {
		if (store.templateFilter[field].includes(value))
			_.remove(store.templateFilter[field], item => item == value);
		else
			store.templateFilter[field].push(value);

		props.saveTemplateFilter(store.templateFilter);
	})

	const onBulkChange = action((field, value, choice) => {
		const allOptions = checkboxOptions[field];

		switch (choice) {
			case "all":
				store.templateFilter[field] = [...allOptions];
				break;
			case "none":
				store.templateFilter[field] = [];
				break;
			case "with":
				if (!store.templateFilter[field].includes(value))
					store.templateFilter[field].push(value);
				break;
			case "without":
				_.remove(store.templateFilter[field], item => item == value);
				break;
			case "only":
				store.templateFilter[field] = [value];
				break;
			case "except":
				store.templateFilter[field] = allOptions.filter(option => option != value);
				break;
			default:
				throw Error("Unknown bulk update choice")
		}

		props.saveTemplateFilter(store.templateFilter);
	})

	const onDropdownSelect = action((field, value) => {
		store.templateFilter[field] = value;
		props.saveTemplateFilter(store.templateFilter);
	})

	const translateFieldName = (name) => {
		switch (name) {
			case 'date':
				return i18n.common.WORDS.DATE;
			case 'periodicity':
				return i18n.intl.formatMessage({defaultMessage: "Periodicity", description: "[ParameterTemplateOptions] a field name for the FRIM's creating inputs"});
			case 'parameterization':
				return i18n.intl.formatMessage({defaultMessage: "Parameterization", description: "[ParameterTemplateOptions] a field name for the FRIM's creating inputs"});
			case 'components':
				return i18n.intl.formatMessage({defaultMessage: "Components", description: "[ParameterTemplateOptions] a field name for the FRIM's creating inputs"});
			default:
				const formattedText = formatLabelText(name);
				return _.get(i18n.databaseLookups.tags, [formattedText], formattedText);
		}
	}

	return <LoadingUntil loaded={store.templateOptions != null && store.templateFilter != null}>
		<div className={css.root}>
			{DROPDOWN_FIELDS.map(field =>
				<div className="bp3-label">
					<span className={dialogCss.requiredField}>{translateFieldName(field)}</span>
					<TemplateDropdown items={dropdownItems[field]} field={field} templateFilter={store.templateFilter} onSelect={(value) => onDropdownSelect(field, value)}/>
				</div>
			)}

			{CHECKBOX_FIELDS.map(field =>
				<div className="bp3-label">
					<span>{translateFieldName(field)}</span>
					<div className={classNames(css.checkboxes, {[css.fixedColumns]: field == "components"})}>
						{checkboxOptions[field].map( value => {
							const formattedLabel = value.replaceAll("_", " ");
							return <TemplateCheckbox
								label={_.get(i18n.databaseLookups.tagValues, [formattedLabel], formattedLabel)}
								checked={store.templateFilter[field].includes(value)}
								onChange={() => onCheckboxChange(field, value)}
								onBulkChange={choice => onBulkChange(field, value, choice)}
							/>
						})}
					</div>
				</div>
			)}
		</div>
	</LoadingUntil>;
})

const TemplateCheckbox = observer((props: { label: string, checked: boolean, onChange: () => void, onBulkChange: (choice: string) => void }): JSX.Element => {
	const {label, checked, onChange, onBulkChange} = props;

	const onContextMenu = (e) => {
		// prevent the browser's native context menu
		e.preventDefault();

		const menu = <bp.Menu>
			<bp.MenuItem text={i18n.common.SELECTION.ALL}      onClick={() => onBulkChange("all")} />
			<bp.MenuItem text={i18n.common.SELECTION.NONE}     onClick={() => onBulkChange("none")} />
			<bp.MenuItem text={i18n.common.SELECTION.WITH}     onClick={() => onBulkChange("with")} />
			<bp.MenuItem text={i18n.common.SELECTION.WITHOUT}  onClick={() => onBulkChange("without")} />
			<bp.MenuItem text={i18n.common.SELECTION.ONLY}     onClick={() => onBulkChange("only")} />
			<bp.MenuItem text={i18n.common.SELECTION.EXPECT}   onClick={() => onBulkChange("except")} />
		</bp.Menu>

		ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {});
	}

	return <div className={css.templateCheckbox} key={label} onContextMenu={onContextMenu}>
		<Checkbox
			large={true}
			checked={checked}
			onChange={onChange}
		/>
		<div className={css.checkboxLabel}>
			{label}
		</div>
	</div>
})


const TemplateDropdown =  observer((props:{ items: IDropdownItem[], field: string, templateFilter: ITemplateFilter, onSelect: (value: string) => void }): JSX.Element => {
	const activeItem = props.templateFilter[props.field];

	return <Select
		activeItem={activeItem}
		items={props.items}
		itemRenderer={(item, {handleClick, modifiers}) => {
			return <bp.MenuItem key={item.value} text={item.label} onClick={() => props.onSelect(item.value)}/>
		}}
		onItemSelect={(item) => props.onSelect(item.value)}
		popoverProps={{ minimal: true, popoverClassName: css.highchartsPopoverToolbarSelect }}
		itemPredicate={(query, item) => (query == null || (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0))}
		filterable={props.items.length > 5}
	>
		<bp.Button
			text={props.items.find(option => option.value == activeItem).label}
			rightIcon="chevron-down" />
	</Select>
})