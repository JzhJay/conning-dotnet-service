import * as css from './Text.css';
import { sem, bp } from 'components';
import { observer } from "mobx-react";
import { Link, ReportText,appIcons } from 'stores';
import { computed, observable, reaction, makeObservable } from "mobx";
import { ReportTextComponent } from "../widgets/ReportTextComponent";
import { SortableHandle } from 'react-sortable-hoc';
import { IconButton } from "../../../blueprintjs/IconButton";

interface MyProps {
	item?: ReportText;
}

const DragHandle = SortableHandle(() => <div className='draggable bp3-icon-paragraph'/>)

@observer
export class ReportTextSummary extends React.Component<MyProps, {}> {
    nameInput: HTMLInputElement;
    textArea: HTMLTextAreaElement;

    @observable original: { name?: string, text?: string };

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    componentDidMount() {
		const { item } = this.props;

		this.original = { name: item.name, text: item.text }
	}

    render() {
		const { props: { item, item: { name, errors, text } } } = this;

		return (
			<sem.Card.Content extra className={classNames(css.root, { [css.lastChild]: item.isLastChild })}>
				<sem.Form as="div" error={_.some(_.values(errors))}>
					<sem.Form.Group>
						<sem.Form.Field>
							<label/>
							<DragHandle/>
						</sem.Form.Field>
						{/*<sem.Form.Field width={4}>
							<label>Name</label>
							<sem.Input value={name}
							           ref={r => this.nameInput = r}
							           onChange={(e, data) => item.name = data.value}
							           onFocus={() => this.original.name = this.nameInput.value}
							           onKeyDown={e => {
								           if (e.keyCode == utility.KeyCode.Escape) {
									           item.name = this.original.name;
								           }
								           else if (e.keyCode == utility.KeyCode.Enter) {
									           this.nameInput.blur();
								           }
							           }}/>
						</sem.Form.Field>*/}

						<sem.Form.Field width={14}>
							<label>Text</label>
							<ReportTextComponent style={{ height: 145 }} item={item}/>
							{/*<sem.TextArea value={text} placeholder="Descriptive Text"*/}
							{/*ref={r => this.textArea = ReactDOM.findDOMNode(r) as HTMLTextAreaElement}*/}
							{/*onChange={(e, data) => item.text = data.value}*/}
							{/*onFocus={() => this.original.text = this.textArea.value}*/}
							{/*onKeyDown={e => {*/}
							{/*if (e.keyCode == utility.KeyCode.Escape) {*/}
							{/*item.text = this.original.text;*/}
							{/*}*/}
							{/*else if (e.keyCode == utility.KeyCode.Enter) {*/}
							{/*this.textArea.blur();*/}
							{/*}*/}
							{/*}}*/}
							{/*onBlur={() => this.original.text = this.props.item.text = this.textArea.value}/>*/}
						</sem.Form.Field>

						<sem.Form.Field style={{ textAlign: 'right' }}>
							<label/>
							<div className={bp.Classes.BUTTON_GROUP}>

								{/*<bp.Tooltip content='Open'*/}
								            {/*>*/}
									{/*<Link to={item.clientUrl} className={classNames('pt-button pt-icon-link')}/>*/}
								{/*</bp.Tooltip>*/}

								<bp.Tooltip content='Duplicate'
								            >
									<bp.AnchorButton icon="duplicate" onClick={() => item.duplicate()}/>
								</bp.Tooltip>

								<bp.Tooltip content="Remove Text Block">
									<IconButton icon={appIcons.report.remove} onClick={() => item.delete()}/>
								</bp.Tooltip>
							</div>
						</sem.Form.Field>
					</sem.Form.Group>
				</sem.Form>
			</sem.Card.Content>)
	}
}
