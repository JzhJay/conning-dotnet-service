import * as classnames from 'classnames';
import {bp} from 'components';
import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {ClimateRiskAnalysis, IO, ObjectCatalogContext, QueryDescriptor, Simulation, site, UserFile} from 'stores';
import {ObjectNameCheckerConfig} from 'stores/objectMetadata/ObjectNameChecker';

import * as css from 'components/widgets/SmartBrowser/SortableCardsPanel.css';

interface Model {
	__typename: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis";
	_id: string;
	name: string;
}

interface GenericNameEditorProps {
	model: Model;
	valueUpdater?: (newValue: string, editableNameComponent: GenericNameEditor) => void;
	catalogContext?: ObjectCatalogContext;

	editable?: boolean;
	editingOnStart?: boolean;

	objectNameCheckerConfig?: ObjectNameCheckerConfig;

	onTextClick?: (e) => void;
}
@observer
export class GenericNameEditor extends React.Component<GenericNameEditorProps, {}> {

	@observable isConfirming: boolean;
	@observable isEditing: boolean;

	constructor(props: GenericNameEditorProps) {
		super(props);
		makeObservable(this);

		this.isEditing = this.editable && this.props.editingOnStart === true;
	}

	@computed get editable(){
		if(_.isBoolean(this.props.editable)) {
			return this.props.editable;
		}

		const model = this.props.model;
		if (model instanceof Simulation) {
			return Simulation.editable(model as any);
		}
		return true;
	}

	@computed get value(){
		return this.props.model.name;
	}

	get valueUpdater() : ((newValue: string) => Promise<void>) {
		const {model, catalogContext} = this.props;

		return async (val) => {
			try {
				site.busy = true;
				if (model instanceof Simulation) {
					await Simulation.rename(model, val);
				} else if ( model instanceof QueryDescriptor) {
					await (model as QueryDescriptor).rename(val);
				} else if (model instanceof IO) {
					await (model as IO).rename(val);
				} else if (model instanceof ClimateRiskAnalysis) {
					await (model as ClimateRiskAnalysis).rename(val);
				} else if (model instanceof UserFile) {
					await (model as UserFile).rename(val);
				} else {
					return;
				}

				if (catalogContext && catalogContext.isHierarchicalViewEnabled) {
					await catalogContext.refresh();
				}
			} finally {
				site.busy = false;
			}
		}
	}

	switchToEditor = action((e) => {
		e.preventDefault();
		e.stopPropagation();
		this.isEditing = true;
	})

	cancelChange = action( () => {
		this.isEditing = false;
	})

	confirmChange = action(async (newValue: string) => {
		if (newValue == this.value) {
			this.isEditing = false;
			return;
		}

		if (this.props.valueUpdater) {
			try {
				await this.props.valueUpdater(newValue, this);
			} finally {
				this.isEditing = false;
				this.isConfirming = false;
			}
			return;
		}

		this.isConfirming = true;
		let canDuplicate = null;
		if (this.props.catalogContext) {
			const desc = _.find(this.props.catalogContext.objectTypes, d => d.id == this.props.model.__typename);
			desc && (canDuplicate = desc.ui.uniqueName === false);
		}
		await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			newName: newValue,
			model: this.props.model,
			onRename: this.valueUpdater,
			onClosed: action(() => {
				this.isEditing = false;
				this.isConfirming = false;
			}),
			canDuplicate
		})
	});

	onTextClick = !!this.props.onTextClick ? (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.onTextClick(e);
    } : null;

	render(){
		const {value, editable, isEditing} = this;

		if (!editable) {
			return <span className={css.editableText}>
				<span className={css.editableTextDisplay} title={value}>{value}</span>
			</span>;
		}

		if (!isEditing) {
			return <span className={css.editableText}>
				<span className={classnames(css.editableTextDisplay, {[css.textCanClick]: !!this.onTextClick})} onDoubleClick={() => this.isEditing = true} onClick={this.onTextClick} title={value} >{value}</span>
				<bp.Tooltip className={css.editableTextRenameBtn} position={bp.Position.BOTTOM} content='Rename'>
					<bp.Button icon='edit' onClick={this.switchToEditor}/>
				</bp.Tooltip>
			</span>
		}

		return <>
			<bp.EditableText
				className={css.editableTextEditor}
				defaultValue={value}
				isEditing={true}
				selectAllOnFocus={true}
				disabled={this.isConfirming}
				onCancel={this.cancelChange}
				onConfirm={this.confirmChange}
			/>
			{this.isConfirming && <bp.Spinner size={bp.SpinnerSize.SMALL} />}
		</>
	}
}