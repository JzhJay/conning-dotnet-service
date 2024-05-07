import {RSSimulationApplication} from 'components/system/rsSimulation/RSSimulationApplication';
import { useEffect, useCallback, useRef, useMemo } from 'react';
import { IconName, IconSize, Icon, Intent, InputGroupProps2, Menu, MenuItem } from '@blueprintjs/core';
import { Suggest, IItemRendererProps, renderFilteredItems } from '@blueprintjs/select';
import { action, computed } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react'
import {FormattedMessage} from 'react-intl';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import {i18n} from 'stores';

import { StepNavigationController, StepNavigationItem } from './StepNavigator';
import { ResizeSensor } from 'components';

import * as css from "./AddressPath.css";
import * as stepNavigatorCss from "./StepNavigator.css";

type AddressPathProps = {
	rsSimulationApplication: RSSimulationApplication;
	visible: boolean;
};

type SuggestItemProps = {
	path: string;
	icon: IconName;
};

const LOCAL_STORAGE_KEY = 'rs-simulation-recent-used-address-paths';
const MAX_RECENT_USED_PATH_SIZE = 20;

export const AddressPath = observer((props: AddressPathProps): JSX.Element => {
	const controller: StepNavigationController = props.rsSimulationApplication.rsSimulation.stepNavigationController;

	const store = useLocalObservable(() => {
		const recentUsedPathsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
		return {
			searchPath: '',
			pathErrorMessage: '',
			recentUsedPaths: recentUsedPathsJson ? JSON.parse(recentUsedPathsJson) : [],
			suggestPaths: [],
			suggestListColumnMaxWidth: 500
		};
	});
	const suggestInputRef = useRef(null);

	const recentUsedPathItems = useMemo(() => {
		return store.recentUsedPaths.map((path) => ({ icon: 'time', path }));
	}, [store.recentUsedPaths]);

	const allSuggestPathItems = useMemo(() => {
		const recentUsedPathsSet = new Set<string>(store.recentUsedPaths);
		const suggestPathsExcludeRecendUsed = store.suggestPaths.filter((path) => !recentUsedPathsSet.has(path));

		return recentUsedPathItems.concat(suggestPathsExcludeRecendUsed.map((path) => ({ icon: 'search', path })));
	}, [store.recentUsedPaths, store.suggestPaths]);

	const saveRecentUsedPaths = action((newPath: string) => {
		const { recentUsedPaths } = store;
		const newRecentUsedPaths = recentUsedPaths.filter((path) => path !== newPath);

		newRecentUsedPaths.unshift(newPath);
		store.recentUsedPaths = newRecentUsedPaths.slice(0, MAX_RECENT_USED_PATH_SIZE);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.recentUsedPaths));
	});

	const changeCurrentPathFromItem = action((activeItem) => {
		let level = 0;
		let activeKey = activeItem.itemPath[level];
		let itemsThisLevel = controller.stepItems.filter(item => item.navigatorOnly !== true);
		let activeItemThisLevel = _.find(itemsThisLevel, item => item.name == activeKey);
		let path = '';

		while (activeItemThisLevel) {
			path = `${path}/${activeItemThisLevel.title}`;
			if (activeItemThisLevel.hasItems) {
				level = level + 1;
				activeKey = activeItem.itemPath[level];
				itemsThisLevel = activeItemThisLevel.items;
				activeItemThisLevel = _.find(itemsThisLevel, item => item.name == activeKey);
			} else {
				activeItemThisLevel = null;
			}
		}

		store.searchPath = path;
		store.pathErrorMessage = '';
		saveRecentUsedPaths(path);
    });

	const switchPath = action((path: string) => {
		store.searchPath = path;

		const subPaths = path.split('/');
		let subPath;
		while(subPaths.length > 0 && !subPath) {
			subPath = subPaths.shift();
		}

		let itemsThisLevel = controller.stepItems.filter(item => item.navigatorOnly !== true);
		let matchItem = itemsThisLevel.find(item => item.title === subPath);
		while(subPaths.length > 0 && matchItem) {
			itemsThisLevel = matchItem.items;
			subPath = subPaths.shift();
			matchItem = _.find(itemsThisLevel, item => item.title == subPath);
		}

		if (matchItem) {
			if (props.rsSimulationApplication.rsSimulation.isTreeNavigator && matchItem.itemPath[0] === 'targets') {
				props.rsSimulationApplication.selectRecalibrationTreeNode(matchItem.itemPath.slice(1), false)
			}
			controller.setActiveByItem(matchItem);
			return;
		}

		store.pathErrorMessage = i18n.intl.formatMessage({defaultMessage: 'The path is not valid.', description: "[AddressPath] the input path is unavailable"});
	});

	const suggestItemRender = useCallback((item: SuggestItemProps, { index, modifiers, handleClick }: IItemRendererProps): JSX.Element => {
		const { path, icon } = item;
		if (!modifiers.matchesPredicate) {
			return null;
		}

		return <MenuItem
				 active={modifiers.active}
				 key={`${path}_${index}`}
				 text={path}
				 icon={icon ? <Icon icon={icon} color="#a3a8ae" /> : null }
				 onClick={handleClick}
			   />;
	}, []);

	const onItemSelect = useCallback(action((item:SuggestItemProps, e) => {
		if (e.charCode === 13 || e.key === 'Enter' || e.which === 123) {
			store.searchPath = item.path;	// handle switch path in keyup event
			return;
		}
		switchPath(item.path);
	}), []);

	const detectEnterUp = useCallback(
		action((e) => {
			if (e.charCode === 13 || e.key === 'Enter' || e.which === 123) {
				switchPath(store.searchPath);
			} else {
				store.searchPath = e.target.value;
			}
		})
	, []);

	const inputValueRenderer = useCallback(() => '', []);

	const itemPredicate = useCallback((query: string = '', { path = '' } : SuggestItemProps) => path.toLowerCase().indexOf(query.toLowerCase()) >= 0, []);

	// This is how i render List using react virtualized
	const renderList = (items, activeIndex) => {
		const rowCount = items.length;
		const totalHeight = rowCount * 35;
		const props = {
			className: css.suggestReactVirtualizedList,
			width: store.suggestListColumnMaxWidth,
			height: totalHeight > 300 ? 300 : totalHeight,
			rowCount,
			rowHeight: 35,
			rowRenderer: (args) => {
				const { key, style, index } = args;
				return (
					<div key={key} style={{ ...style }}>
						{items[index]}
					</div>
				);
			},
			...(activeIndex >= 0 ? {scrollToIndex: activeIndex} : {})
		};

		return <List {...props} />;
	}

	const itemListRenderer = useCallback((itemListProps): JSX.Element => {
		// find active Item index
		let activeIndex = -1;
		if (itemListProps.activeItem) {
			const activePath = itemListProps.activeItem.path;
			activeIndex = itemListProps.filteredItems.findIndex(item => item.path === activePath);
		}

		// Blueprint function to apply RenderItem on each filteredItems
		const renderItems = renderFilteredItems(itemListProps, <Menu><MenuItem
			disabled={true}
			text={i18n.intl.formatMessage({defaultMessage: "No suggested paths.", description: "[AddressPath] hit message if no suggestion found"})}
		/></Menu>)
		if (Array.isArray(renderItems)) { // If result is array, use react virtualized
			return renderList(renderItems, activeIndex);
		}

		return renderItems as JSX.Element; // render no result
	}, [store.suggestListColumnMaxWidth]);

	useEffect(action(() => {
		if (_.get(controller, ['stepItems', 'length'], 0) > 0) {
			const buildSuggestPaths = (finalResult: string[], stepItems: StepNavigationItem[], parentPath = ''): string[] => {
				stepItems.forEach((stepItem) => {
					if (!stepItem.navigatorOnly) {
						const newSuggestPath = `${parentPath}/${stepItem.title}`;
						finalResult.push(newSuggestPath);
						if (stepItem.items?.length > 0) {
							buildSuggestPaths(finalResult, stepItem.items, newSuggestPath);
						}
					}
				});
				return finalResult;
			};

			store.suggestPaths = buildSuggestPaths([], controller.stepItems);
		}
	}), [controller?.stepItems]);

	useEffect(() => {
		const activeItem = _.get(controller, ['activeItem']);
		if (activeItem) {
			changeCurrentPathFromItem(activeItem);
		}
	}, [_.get(controller, ['activeItem','name'])]);

	useEffect(() => {
		if (suggestInputRef.current) {
			const sensor = new ResizeSensor(suggestInputRef.current.parentNode, action(() => {
				if (suggestInputRef.current) {
					store.suggestListColumnMaxWidth = suggestInputRef.current.clientWidth;
				}
			}));
			return sensor.detach;
		}
	}, []);

	const inputProps: InputGroupProps2 = {
		onKeyUp: detectEnterUp,
		inputRef: suggestInputRef
	};

	if (store.pathErrorMessage) {
		inputProps.rightElement = (
			<div className={css.errorMsgRoot}>
				<span className={css.errorMsg}>
					{store.pathErrorMessage}
				</span>
				<Icon icon="warning-sign" size={IconSize.STANDARD} intent={Intent.DANGER} />
			</div>
		);
		inputProps.intent = Intent.DANGER;
	}

	const suggestItems = computed(()=> {
		if (_.isEmpty(_.trim(store.searchPath))) {
			return recentUsedPathItems;
		}
		return allSuggestPathItems;
	}).get();

	return (
		props.visible ?
		<div className={classNames(stepNavigatorCss.stepItemListRoot, stepNavigatorCss.lastList)}>
			<div className={css.customFormGroup}>
				<div className={css.label}>
					<FormattedMessage defaultMessage={"Address:"} description={"[AddressPath] input title"}/>
				</div>
				<div className={css.formGroupInput}>
					<Suggest
						fill={true}
						query={store.searchPath}
						items={suggestItems}
						itemListRenderer={itemListRenderer}
						itemRenderer={suggestItemRender}
						itemPredicate={itemPredicate}
						inputProps={inputProps}
						inputValueRenderer={inputValueRenderer}
						onItemSelect={onItemSelect}
						popoverProps={{
							className: css.suggestReactVirtualizedList
						}}
					/>
				</div>
			</div>
		</div> :
		null
	);
});