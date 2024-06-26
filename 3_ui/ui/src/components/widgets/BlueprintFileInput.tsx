import {action, computed, IReactionDisposer, makeObservable, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import {i18n} from 'stores';
import { bp } from "..";

interface BlueprintFileInputProps {

	onfileListChange: (fileList: FileList, inputElement?:HTMLInputElement) => void;

	accept?: string;
	autoFocus?: boolean;
	disabled?: boolean;
	onChange?: React.FormEventHandler<HTMLInputElement>;

	blueprintFileInputProps?: bp.FileInputProps;
}

@observer
export class BlueprintFileInput extends React.Component<BlueprintFileInputProps, any>{

	@observable fileList: FileList = null;

	private inputProps: React.HTMLProps<HTMLInputElement> = {
		id: 'fileOpenInput'
	};

	constructor(props) {
		super(props);
		makeObservable(this);

		if (this.props.accept) {
			this.inputProps.accept = this.props.accept
		}
	}

	@computed get disabled() {
		return this.props.disabled != null ? this.props.disabled : this.props.blueprintFileInputProps?.disabled;
	}

	@computed get buttonText() {
		return this.props.blueprintFileInputProps?.buttonText || i18n.common.WORDS.BROWSE;
	}

	@computed get text() {

		const tagStyle = {height: "24px", padding: "2px 6px"}

		if (!this.fileList?.length) {
			const defaultText =
				this.props.blueprintFileInputProps?.text ||
				i18n.common.MESSAGE.CHOOSE_A_FILE
			return <bp.Tag minimal={true} style={tagStyle}>{defaultText}</bp.Tag>
		}
		return <>{
			_.map(this.fileList, (f) => <bp.Tag minimal={true} id={uuid.v4()} style={tagStyle} title={f.name}>{f.name}</bp.Tag>)
		}</>

	}

	@action onChange: React.FormEventHandler<HTMLInputElement> = (e)=> {
		const target = e.target as HTMLInputElement;
		this.fileList = target.files;

		if (this.props.onfileListChange) {
			this.props.onfileListChange(this.fileList, target);
		}

		if (this.props.onChange) {
			this.props.onChange(e);
		}
	}


	render() {
		return <bp.FileInput
			{...this.props.blueprintFileInputProps}
			disabled={this.disabled}
			text={this.text}
			buttonText={this.buttonText}
			inputProps={this.inputProps}
			onInputChange={this.onChange}
		/>;
	}

}