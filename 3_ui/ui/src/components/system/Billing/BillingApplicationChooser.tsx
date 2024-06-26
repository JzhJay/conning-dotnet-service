import { MenuItem } from '@blueprintjs/core';
import { MultiSelect, ItemRenderer } from '@blueprintjs/select';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const BillingAvailableApplication = ["Simulation", "InvestmentOptimization", "ClimateRiskAnalysis"];
var BillingApplicationMultiSelect = MultiSelect.ofType<string>();

@observer
export class BillingApplicationChooser extends React.Component{
    selectedApplications = observable.array<string>();

    private renderApplication: ItemRenderer<string> = (app, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={this.selectedApplications.indexOf(app) != -1 ? "tick" : "blank"}
                key={app}
                onClick={handleClick}
                text={app}
                shouldDismissPopover={false}
            />
        );
    };

    render(){
        return <BillingApplicationMultiSelect
	        resetOnSelect= {true}
            tagRenderer = {(x:string) => x}
            items = {BillingAvailableApplication}
            selectedItems = {this.selectedApplications}
            itemRenderer = {this.renderApplication}
            onItemSelect = {app => {
                if (this.selectedApplications.indexOf(app) != -1){
                    this.selectedApplications.remove(app);
                }
                else{
                    this.selectedApplications.push(app)
                }
            }}
			onRemove={(tag, i) => {
				this.selectedApplications.remove(tag)
				//pageContext.isDirty = true;
			}}
            tagInputProps={{
                tagProps: (v, i) => ({ minimal: true }),
                inputProps: { placeholder: this.selectedApplications.length == 0 ? 'All Applications' : 'Select More...' },
            }}
        />
    }
}
