import type {ToolbarItemProps} from '../highchartsToolbar';
import * as React from 'react';
import {observer} from 'mobx-react';
import {AnchorButton, Tooltip, Position} from '@blueprintjs/core';
import { i18n } from 'stores';

interface RemoveTooltipsProps extends ToolbarItemProps {
	canRemoveTooltips?: boolean;
}

@observer
export class RemoveTooltipsToolbarItem extends React.Component<RemoveTooltipsProps, {}> {
	render() {
		const {chartComponent} = this.props;
		const { formatMessage } = i18n.intl;

		return <Tooltip position={Position.BOTTOM} content={formatMessage({defaultMessage: 'Remove Pinned Tooltips', description: '[highcharts] Tooltip for function Remove Pinned Tooltips'})}>
			<AnchorButton disabled={!chartComponent.canRemoveTooltips}
			              className="remove-tooltips"
			              onClick={() => chartComponent.extender.removeTooltips()}
			              text={formatMessage({defaultMessage: 'Remove Tooltips', description: '[highcharts] Button text for function Remove Pinned Tooltips'})}/>
		</Tooltip>
	}
}

