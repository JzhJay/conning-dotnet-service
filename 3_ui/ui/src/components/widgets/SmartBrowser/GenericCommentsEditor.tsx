import {BlueprintDialog, bp, Highlighter, SortableCardsPanel} from 'components';
import * as dialogCss from 'components/site/dialogs.css';
import {action, computed, makeObservable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {api, ClimateRiskAnalysis, omdb, Simulation, site, UserFile} from 'stores';
import {TruncatedFormat} from '@blueprintjs/table';

import * as css from './GenericCommentsEditor.css';

interface Model {
	__typename: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis";
	_id: string;
	name: string;
	comments: string;
}

interface GenericCommentsEditorProps {
	model: Model;
	valueUpdater?: (newValue: string, editableComponent: GenericCommentsEditor) => Promise<void>;
	editable?: boolean;
	editingOnStart?: boolean;
	panel?: SortableCardsPanel;
}
@observer
export class GenericCommentsEditor extends React.Component<GenericCommentsEditorProps, {}> {
	constructor(props: GenericCommentsEditorProps) {
		super(props);
		makeObservable(this);
	}

	@computed get value() {
		return (_.get(this.props.model, SortableCardsPanel.COMMENTS_FIELD) || "").toLocaleString();
	}

	@computed get editable(){
		if(_.isBoolean(this.props.editable)) {
			return this.props.editable;
		}

		/*
		const model = this.props.model;
		if (model instanceof Simulation) {
			return Simulation.editable(model as any);
		} */
		return true;
	}

	valueUpdater = () :((value:string) => Promise<void>) => {
		if (this.props.valueUpdater) {
			return (value) => this.props.valueUpdater(value, this);
		} else {
			return null;
		}
	}

	openEditor: React.MouseEventHandler<any> = (e) => {
		e.stopPropagation();
		site.setDialogFn(() => <CommentsEditDialog model={this.props.model} valueUpdater={this.valueUpdater()} />)
	}

	@computed get displayContent(){
		const {props: {panel}, value} = this;
		const searchWords = panel && panel.searchText ? panel.searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : [];
		let returnElement = <Highlighter searchWords={searchWords} textToHighlight={value} />;

		return <span className={css.displayer}>{returnElement}</span>;
	}

	render(){
		const {editable, displayContent} = this;

		return <>
			{displayContent}
			{editable && <div className={css.editBtnOuter}>
				<bp.Button icon='edit' onClick={this.openEditor} className={css.editBtn}/>
			</div>}
		</>
	}
}


interface CommentsEditDialogProps {
	model: Model;
	valueUpdater?: (newValue: string) => Promise<void>;
}

export class CommentsEditDialog extends React.Component<CommentsEditDialogProps, {}> {

	inputRef;

	setInputRef = (ref) => {
		this.inputRef = ref;
		if (ref) {
			$(ref.inputElement).on('keydown', e => {
				if (e.keyCode == 13) {
					e.stopPropagation();
				}
			});
		}
	}

	ok = async () => {
		const {valueUpdater, model} = this.props;
		let value = _.escape(this.inputRef.inputElement.value) || "";
		value = value.replace(/(^[\n\r]*)|([\n\r\s]*$)/g, "");

		if (value != model.comments) {
			if (valueUpdater) {
				await valueUpdater(value);
			} else {
				site.busy = true;
				await omdb.updatePartial(model.__typename, model._id, {[SortableCardsPanel.COMMENTS_FIELD]: value})
					.then( action(updates => {
						_.assign(model, updates);
					})).finally(() => site.busy = false);
			}
		}

		return 'ok';
	}

	render() {
		const {model} = this.props;

		return (
			<BlueprintDialog
				className={classNames(dialogCss.newObjectDialog)}
				icon={"edit" }
				title={`Comments for ${model.name}`}
				isCloseButtonShown={true}
				canCancel={true}
				okDisabled={false}
				okText={'OK'}
				ok={this.ok}
			>
				<bp.EditableText
					defaultValue={_.get(model, SortableCardsPanel.COMMENTS_FIELD, "") || ""}
					isEditing={true}
					selectAllOnFocus={true}
					multiline={true}
					minLines={5}
					ref={this.setInputRef}
					confirmOnEnterKey={false}
				/>
			</BlueprintDialog>);
	}

}