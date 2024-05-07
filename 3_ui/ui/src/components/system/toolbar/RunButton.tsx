import * as React from 'react';
import {Loader} from 'semantic-ui-react';
import {bp} from '../../index';

import * as css from './RunButton.css';

interface MyProps {
	isDisabled: boolean;
	isComplete: boolean;
	isCancelling?: boolean;
	isFinalizable?: boolean;
	isFinalizing?: boolean; // TODO: Finalize shouldn't be handled by this component since this component is meant to be a generic run/cancel button.
    buttonText: string;
    tooltipContent: string;
    className?: string;
    runCallback: () => void;
    cancelCallback: () => void;
	finalizeCallback?: () => void;
}

export class RunButton extends React.Component<MyProps, {}> {
	renderButtons() {
        let {isDisabled, isComplete, isCancelling = false, isFinalizable = false, isFinalizing = false, buttonText, tooltipContent, runCallback, cancelCallback, finalizeCallback = () => {} } = this.props;

		if (isComplete && !isCancelling) {
			return (
				<bp.Tooltip intent={bp.Intent.DANGER} content={tooltipContent} disabled={!tooltipContent}>
					<bp.AnchorButton icon="play"
						className={css.optimize}
						disabled={isDisabled}
						minimal={true}
						text={buttonText}
						onClick={runCallback} />
				</bp.Tooltip>
			);
		}
		
		return ( 
			<>
				<bp.AnchorButton icon="stop"
					className={css.cancel}
					minimal={true}
				    disabled={isCancelling}
					text={isCancelling ? "Cancelling..." : "Cancel"}
					onClick={cancelCallback}>
					<div><Loader className={css.loader} active inline='centered'/></div>
				</bp.AnchorButton>
				{ (isFinalizable || isFinalizing) &&
				<bp.AnchorButton 
					className={css.finalize}
					minimal={true}
					disabled={isFinalizing}
					text={isFinalizing ? "Finalizing..." : "Finalize"}
					onClick={finalizeCallback}
				/>
				}
			</>
		);
	}

    render() {
        const { className } = this.props;

        return ( 
			<span className={classNames(css.runButton, className)}>
				{this.renderButtons()}
			</span>
		);
    }
}
