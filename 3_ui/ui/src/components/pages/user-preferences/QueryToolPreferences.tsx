import {api} from 'stores';

export default class QueryToolPreferences extends React.Component<{}, {}> {
    render() {
        const {settings} = api.user;

        return (<div className="ui segments">
                <h2 className="ui top attached header">Query Tool</h2>
                <div className="ui attached segment">

                    {/*                        <div className="ui labeled input">
                     <div className="ui label">Default Sort Order:</div>
                     <ReactSelect
                     value={queryPreferences.defaultSortOrder} clearable={false}
                     options={[{value: 'initial', label: 'Default'}, {value: 'asc', label: 'Ascending'}, {value: 'desc', label: 'Descending'} ]}
                     onChange={(option: __ReactSelect.Option) => dispatch(user.updatePreferences({query: { defaultSortOrder : option.value as CoordinateSortOrder }}))}
                     />
                     </div>*/}



                    {/*<fieldset>*/}
                    {/*<legend>Formatting:</legend>*/}
                    {/*</fieldset>*/}
                </div>
                {/*
                 <div className="ui labeled input">
                 <div className="ui label">Axis Availability:</div>
                 <Slider value={queryPreferences.axisAvailabilityDelay}
                 min={0} max={600} step={null}
                 marks={{0: 'Off', 200: 'Fast', 400: 'Normal', 600: 'Slow'}}
                 onChange={value => dispatch(user.updatePreferences({query: { axisAvailabilityDelay : value }}))}/>
                 </div>

                 <div className="ui labeled input">
                 <div className="ui label">Coordinate Availability:</div>
                 <Slider value={queryPreferences.coordinateAvailabilityStagger}
                 min={0} max={600} step={null}
                 marks={{0: 'Off', 200: 'Fast', 400: 'Normal', 600: 'Slow'}}/>
                 </div>*/}

            </div>
        )
    }
}

