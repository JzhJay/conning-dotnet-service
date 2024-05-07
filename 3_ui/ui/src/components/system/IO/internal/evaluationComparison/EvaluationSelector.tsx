import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { EvaluationComparisonUserOptions} from 'stores';
import type { EvaluationDetail } from '../../../../../stores/io';
import { IO } from '../../../../../stores/io';

import * as css from './EvaluationSelector.css';

interface MyProps {
	className?: string;
	io: IO;
	userOptions: EvaluationComparisonUserOptions;
	allEvaluations: EvaluationDetail[];
	evaluation: EvaluationDetail;
    circleClassName?: string;
    onChange: (evaluation: EvaluationDetail) => void;
}

const AllocationPointSelect = Select.ofType<any>();

export class EvaluationSelector extends React.Component<MyProps, {}> {
    constructor(props) {
        super(props);
    }

	itemRenderer = (item, { modifiers: { active }, handleClick }) => {
		const { name, evaluationNumber } = item;
        const text = item.displayName ? `${name} - ${item.displayName}` : name;	// displayName: additional point's name
		
        return (
            <MenuItem key={`${evaluationNumber}_${name}`} active={active} text={text} onClick={handleClick} />
        );
	}
	
    onItemSelect = (item) => {
        this.props.onChange(item);
    }

	itemsEqual = (a, b) => {
        return a.evaluationNumber ===  b.evaluationNumber && a.name === b.name;	// lambda points have same evaluationNumber but different name
	}

    prevEvaluation = () => {
        const { allEvaluations, evaluation } = this.props;
        const { evaluationNumber, name } = evaluation;
        const index = allEvaluations.findIndex((point) => point.evaluationNumber === evaluationNumber && point.name === name);
        if (index !== -1) {
            const newIndex = index - 1 >= 0 ? index - 1 : allEvaluations.length - 1;
            this.props.onChange(allEvaluations[newIndex]);
        }
    }

    nextEvaluation = () => {
        const { allEvaluations, evaluation } = this.props;
        const { evaluationNumber, name } = evaluation;
        const index = allEvaluations.findIndex((point) => point.evaluationNumber === evaluationNumber && point.name === name);
        if (index !== -1) {
            const newIndex = index + 1 < allEvaluations.length ? index + 1 : 0;
            this.props.onChange(allEvaluations[newIndex]);
        }
    }

    renderPointSelect() {
        const { allEvaluations, circleClassName = '', evaluation } = this.props;

        return (
            <AllocationPointSelect
				activeItem={evaluation}
                items={allEvaluations}
                itemRenderer={this.itemRenderer}
                filterable={false}
                popoverProps={{ minimal: true }}
				onItemSelect={this.onItemSelect}
				itemsEqual={this.itemsEqual}
            >
                <Button
					className={`${css.pointName} ${circleClassName}`}
                    minimal={true}
                    text={evaluation.name}
                />
            </AllocationPointSelect>
        )
    }

    render() {
		const { className = '' } = this.props;
        return (
			<div className={`${css.root} ${className}`}>
				<Button icon="chevron-left" minimal={true} onClick={this.prevEvaluation} />
					{this.renderPointSelect()}
				<Button icon="chevron-right" minimal={true} onClick={this.nextEvaluation} />
			</div>
		);
    }
}