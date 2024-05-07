//import {GoldenLayoutComponent} from './goldenLayout/goldenLayoutComponent';
// System Components
import * as sem from 'semantic-ui-react';
import * as bp from '@blueprintjs/core';

export { sem, bp }

import InlineSVG  from 'react-inlinesvg';
export {InlineSVG};

export { GoldenLayoutComponent } from './goldenLayout/GoldenLayoutComponent'
export * from './wijmo-components/FlexGridWrapper';
export type { DragAndDropProps, DragProps, DropProps } from '../utility/react-dnd-helpers';
export { dragCollectFn, dropCollectFn } from '../utility/react-dnd-helpers';

export { ResizeSensor } from '../utility/resizeSensor';

export * from './widgets';
export * from '../themes/themes'
export * from './semantic-ui';
export * from './site';
export * from './formControls'
export * from './blueprintjs'
export * from './system'
export * from './pages'
import * as queryTool from './system/query-tool';

export { queryTool };

import {ReactSortable} from 'lib/sortablejs/react-sortablejs';

export { ReactSortable }

const reactSelect = require('react-select') as any;
const ReactSelect = reactSelect.default as ReactSelect.ReactSelectAsyncClass;
// import * as ReactSelectModule from 'react-select';  // Does not work on new versions of react-select
export {ReactSelect};

export * from './devTools/JuliaServerChooser'

import * as Highlighter from 'react-highlight-words';
import TimeAgo from 'timeago-react'
export { Highlighter, TimeAgo }

import FlipMove from 'react-flip-move';

export {Link} from 'react-router';

export const scrollIntoView = require('scroll-into-view') as __ScrollIntoView.ScrollIntoView;

FlipMove.defaultProps.appearAnimation = "none";
FlipMove.defaultProps.enterAnimation = KARMA ? 'none' : "fade";
FlipMove.defaultProps.leaveAnimation = KARMA ? 'none' : "fade"
FlipMove.defaultProps.disableAllAnimations = KARMA == true;

//export * from './blueprintjs'

import { FocusStyleManager, Tooltip, Popover } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

Popover.defaultProps.minimal = true;
Popover.defaultProps.hoverOpenDelay = 400;
Popover.defaultProps.hoverCloseDelay = 350;

import Splitter from 'm-react-splitters';

export {Splitter};


//import * as Wj from 'wijmo.react';
//export { Wj };

import * as utility from 'utility'
export {utility};

import ReactJson from 'react-json-view';
export {ReactJson}

export {SortableContainer, SortableElement} from 'react-sortable-hoc';
import Push from 'push.js'
export {Push}
export * from './blueprintjs'
import * as mobx from 'mobx'
export {mobx}

import JsonView from 'react-json-view';
export {JsonView}