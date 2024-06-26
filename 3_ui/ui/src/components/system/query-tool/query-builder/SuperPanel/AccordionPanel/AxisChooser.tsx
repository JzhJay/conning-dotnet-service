// import {KeyCode} from '../../../../../../../utility/keyCode';
// import {AccordionPanel} from 'stores/index';
// import Option = __ReactSelect.Option;
// import {ApplicationStore} from "../../../../../../../stores/ApplicationStore";
// import {connect} from "react-redux";
// import Autosuggest = require('react-autosuggest');
// import {Query} from "../../../../../../../stores/query/models-ui";
// const ReactSelect = require('react-select');
// import SuggestionSelectedEventData = ReactAutosuggest.SuggestionSelectedEventData;
//
// export interface AxisChooserOption extends Option {
// 	type: 'axis' | 'coordinate';
// 	valueIndex: number;
// 	label: string;
// 	axis: string;
// 	description: string;
//
// 	// What we look for when we search
// 	searchString?: string;
// }
//
// interface MyProps {
// 	panel: AccordionPanel;
// 	placeholder?: string;
// 	verticalScrollbarWidth?: number;
// }
//
// interface MyState {
// 	searchValue?: string;
// 	suggestions?: Array<julia.Group>
// }
//
// export class AxisChooser extends React.Component<MyProps, MyState> {
// 	render() {
// 		return (
// 			<Autosuggest
// 				inputProps={{
// 						 	placeholder: "Choose an Axis",
// 						 	value: this.state.searchValue,
// 							 onChange:this.onChange
// 				}}
// 				suggestions={this.state.suggestions}
// 				focusInputOnSuggestionClick={false}
// 				getSuggestionValue={this.getSuggestionValue}
// 				onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
// 				shouldRenderSuggestions={(value) => true}
// 				onSuggestionSelected={this.onSuggestionSelected}
// 				renderSuggestion={(axis: julia.Group) => <span>{axis.groupName.label}</span>}/>
// 		)
// 	}
//
// 	constructor(props, state) {
// 		super(props, state);
//
// 		this.state = {
// 			searchValue: '',
// 			suggestions: this.getSuggestions('')
// 		}
// 	}
//
// 	onSuggestionSelected = (event, args: SuggestionSelectedEventData) => {
// 		if (args.method === 'enter') {
// 			$(ReactDOM.findDOMNode(this)).find('input').blur();
// 		}
// 	}
//
// 	getSuggestionValue = (suggestion: julia.Group) => { // when suggestion is selected, this function tells
// 		return suggestion.groupName.label;
// 	}
//
// 	onChange = (event, {newValue}) => {
// 		this.setState({searchValue: newValue});
//
// 		// Todo - tell julia
// 	};
//
// 	onSuggestionsUpdateRequested = ({value}) => {
// 		this.setState({suggestions: this.getSuggestions(value)});
// 	};
//
// 	getSuggestions(value) {
// 		const inputValue  = value.trim().toLowerCase();
// 		const inputLength = inputValue.length;
//
// 		return inputLength === 0
// 			? this.props.panel.query.variables.metadata.groups
// 			: this.props.panel.query.variables.metadata.groups
// 				  .filter(group => group.groupName.label.toLowerCase().slice(0, inputLength) === inputValue);
// 	}
//
//
// }
