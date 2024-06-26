import * as css from './RangeSearcher.css';
import * as searcherCss from "./querySearchers.css";
import {utility} from 'stores'
import {AccordionPanel} from 'stores/query';
import {observer} from 'mobx-react';
import { autorun, computed, observable, makeObservable } from 'mobx';
import {AppIcon} from 'components';
import {appIcons} from 'stores';

const {KeyCode} = utility;

interface MyProps {
	placeholder?: string;
	panel: AccordionPanel;
}

@observer
export class RangeSearcher extends React.Component<MyProps, {}> {
    static defaultProps = {
		placeholder: "e.g. 10-100, 500, 1000"
	}

    @observable focused = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const {focused} = this;

		return (
			<div className={classNames(searcherCss.querySearcher, { [searcherCss.focused]: focused})}>
				<div>
					<AppIcon icon={appIcons.queryTool.search} className="iconic-sm"/>
					<input ref={r => this.input = r} placeholder={this.props.placeholder}
					       onBlur={this.onBlur} onFocus={this.onFocus} onKeyUp={this.onKeyUp}/>
				</div>
			</div>
		)
	}

    _toDispose: Function[] = [];

    componentDidMount() {
		this._toDispose.push(
			autorun(() => {
				const accordion = this.props.panel.accordions[0];

				const {values, areNoAvailableValuesSelected, areAllAvailableSelected, areSomeButNotAllSelected} = accordion;

				if (areNoAvailableValuesSelected || areAllAvailableSelected) {
					this.input.value = null;
				}
				else {
					let value = "";

					if (areSomeButNotAllSelected) {
						let from = -1;
						let to   = -1;

						let appendRangeAndReset = () => {
							if (from !== -1) {
								if (value.length > 0) {
									value += ',';
								}

								if (from === to) {
									value += accordion.values[from].label;
								}
								else {
									value += accordion.values[from].label + '-' + accordion.values[to].label;
								}
							}

							from = to = -1;
						}

						for (let i = 0; i < values.length; i++) {
							if (!accordion.values[i].selected) {
								appendRangeAndReset();
							}
							else {
								if (from === -1) {
									from = i;
								}
								to = i;
							}
						}

						appendRangeAndReset()
					}

					this.input.value = value;
				}
			}, {name: `Update range searcher`}));
	}

    componentWillUnmount() {
		(this._toDispose).forEach(f => f());
	}

    input: HTMLInputElement;
    initialValue = "";

    /**
	 * Watch for the escape key
	 * @param $event
	 */
    onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === KeyCode.Escape) {
			this.input.value = this.initialValue;
			this.input.blur();
		}
		else if (e.keyCode === KeyCode.Enter) {
			this.input.blur();
		}
	}

    onFocus = () => {
		this.focused = true;
		this.initialValue = this.input.value;
	}

    get accordion() {
		return this.props.panel.accordions[0];
	}

    onBlur = () => {
		this.focused = false;
		const value     = this.input.value;
		const {accordion, props: {panel}} = this;

		if (value.length > 0) {
			let checkRanges = [];

			const match = value.match(/(\d+-\d+|\d+-|\d+|-\d+)*/g)

			assert(panel.accordions.length === 1, "Range Search can only be used when there's one and only one accordion");

			const lastIndex = accordion.values.length - 1;
			const minLabel = _.get(accordion, ['values', 0, 'coordinate', 'label'], '0');
			const maxLabel = _.get(accordion, ['values', lastIndex, 'coordinate', 'label'], String(lastIndex));
			const minIndex = parseInt(minLabel);
			const maxIndex = parseInt(maxLabel);

			_.forEach(match, (value: string) => {
				if (value.length === 0) {
					// do nothing
				}
				else if (/^\d+$/.test(value)) {
					const number = parseInt(value);
					checkRanges.push({from: number, to: number});
				} else if (/^\d+-\d+/.test(value)) {
					const range = value.split('-');
					let from  = parseInt(range[0]);
					let to    = parseInt(range[1]);
					if (to < from) {
						const temp = to;
						to       = from;
						from     = temp;
					}

					to   = Math.min(maxIndex, to)
					from = Math.min(maxIndex, Math.max(minIndex, from));
					checkRanges.push({ from, to });
				}
				else if (value[0] === '-') {
					const from = minIndex;
					let to = parseInt(value.substr(1));

					to = Math.min(maxIndex, to)
					checkRanges.push({ from, to });
				}
				else {
					let from = parseInt(value.substr(0, value.length - 1));
					const to = maxIndex;
					from = Math.min(maxIndex, Math.max(minIndex, from));

					checkRanges.push({ from, to });
				}
			});

			checkRanges = _.sortBy(checkRanges, 'from');

			const { valuesByLabel } = this;
			const values = _.flatMap(checkRanges, r => _.range(r.from, r.to + 1))
						.filter(index => !!valuesByLabel[index]).map(index => valuesByLabel[index]);

			accordion.selectValues('Only', values)
		}
		else {
			accordion.selectValues('All', [])
		}

	}

    @computed get valuesByLabel() {
		return _.keyBy(this.accordion.values, v => parseInt(v.label))
	}
}
