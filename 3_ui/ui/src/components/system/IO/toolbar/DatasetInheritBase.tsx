import {bp} from "components";
import * as React from 'react';
import {BaseOutputUserOptions} from 'stores';
import {observer} from 'mobx-react';
import {Button, ButtonGroup, Popover, AnchorButton} from '@blueprintjs/core';
import * as css from './DatasetToolbarItemBase.css'

interface MyProps {
	toggleInherit: () => void;
	renderMenu: () => JSX.Element;
	userOptions: BaseOutputUserOptions;
	showSelectBtn: boolean;
}

@observer
export class DatasetInheritBase extends React.Component<MyProps, {}> {
	render() {
		const {toggleInherit, renderMenu, showSelectBtn} = this.props;
		const {shouldInheritData} = this.props.userOptions;

		return <div className={classNames(css.content, "ui labeled input dataset")}>
				<ButtonGroup className="ui labeled input">
					<div className="ui label">
						Content:
					</div>
					<Button text="Inherit" active={shouldInheritData} onClick={toggleInherit} id="inheritButton"/>
					<Button text="Specify" active={!shouldInheritData} onClick={toggleInherit} id="specifyButton"/>
				</ButtonGroup>

				<span className={bp.Classes.NAVBAR_DIVIDER}/>

                {!shouldInheritData && <Popover
					autoFocus={false}
    				position={bp.Position.BOTTOM_LEFT}
    				minimal
    				hoverOpenDelay={300} hoverCloseDelay={600}
    				interactionKind={bp.PopoverInteractionKind.CLICK}
    				popoverClassName={classNames(css.popover)}
    				canEscapeKeyClose
    				content={renderMenu()}>
    				<AnchorButton text="Select Content" onClick={() => {}}/>
				</Popover>}
			</div>
	}
}
