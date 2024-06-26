import { push } from 'react-router-redux'

import DefinitionTree from './components/definitionTree'
import {juliaModelServerPort} from './app-config';
import { connect } from 'react-redux'
import { setTitle } from 'stores/index'

import * as Select from 'react-select'
import {Utility} from "../../../utility";

@connect(state => state)
export class VttPage extends React.Component<any, any> {
    constructor() {
        super();
        this.loadDefinitions = this.loadDefinitions.bind(this);
        this.onDefinitionSelected = this.onDefinitionSelected.bind(this);
    }

    componentDidMount() {
        dispatch(setHeader('Query Result'))
    }

    loadDefinitions() {
        return utility.superAgent.get(`http://localhost:${juliaModelServerPort}`).then((response) => {
                return {
                    options: _.map(response.body, v => {
                        return {value: v, label: v}
                    })
                }
            });
    }

    onDefinitionSelected(definition) {
        dispatch(push(null, `/vtt/${definition}`));
    }


    render() {
        const {params} = this.props;

        return (
            <div className="vtt">
                <div className="sidebar">
                    <div className="pure-control-group">
                        <label htmlFor="definitions">
                            Choose a definition:
                        </label>

                        <Select
                            name="definitions"
                            clearable={false}
                            asyncOptions={this.loadDefinitions}
                            value={params.definition}
                            onChange={this.onDefinitionSelected}
                        />
                    </div>

                    <div className="pure-g">
                        <div className="pure-u-1-3">
                            {this.props.params.definition ?
                                <DefinitionTree
                                    definition={params.definition}
                                    juliaPort={juliaModelServerPort} />
                                : <span>Select a Definition Above</span>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
