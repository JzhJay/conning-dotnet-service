import { observer } from "mobx-react";
import { ReportText } from 'stores';
import { KeyCode } from 'utility';
import * as css from './ReportTextComponent.css';
// import * as tinymce from 'tinymce';
import { bp, ReportTextContextMenu } from 'components'
import { observable, reaction, makeObservable } from "mobx";

interface MyProps {
	item: ReportText;
	isLayoutDragging?: boolean;
	inline?: boolean;
	className?: string;
	height?: number;
	style?: React.CSSProperties;
	isTooltip?: boolean;
}

@observer
export class ReportTextComponent extends React.Component<MyProps, {}> {
    id = `text-${uuid.v4()}`;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    render() {
		const { id, rendered, props: { style, className, inline, item, isLayoutDragging } } = this;

		//return <ReactQuill style={{flexGrow:1}} value={item.text} onChange={v => item.text = v} />

		return <form style={style}
		             className={classNames(css.root, className, { [css.inline]: inline, [css.isLayoutDragging]: isLayoutDragging, [css.rendered]: rendered })}>
			{inline && <div id={`toolbar-${id}`} className={css.toolbarContainer}/>}
			<div dangerouslySetInnerHTML={{ __html: item.text }} id={id}/>
		</form>;

		// 	<div id={this.id} dangerouslySetInnerHTML={item.text} />
		// 	{/*<textarea id={this.id} value={item.text} onChange={() => {*/}
		// 	{/*}}/>*/}
		// </div>
	}

    editor;
    @observable rendered = false;

    // componentWillReceiveProps(newProps: MyProps) {
    // 	if (newProps.isLayoutDragging != this.props.isLayoutDragging) {
    // 		console.log(this.editor);
    // 		this.editor.toolbar = !newProps.isLayoutDragging ? false : TOOLBAR_ITEMS;
    // 	}
    // }

    timeout;

    componentDidMount() {
		this.timeout = setTimeout(this.initialize, 50);
	}

    initialize = () => {
		const { isTooltip, isLayoutDragging, item, inline, height } = this.props;
		/*
		tinymce.baseURL = '/node_modules/tinymce';

		tinymce.init({
			             //target: ReactDOM.findDOMNode(this),
			             selector: `#${this.id}`,
			             setup: editor => {
				             this.editor = editor;
				             editor.on('change', _.debounce(() => {
					             item.text = editor.getContent();
				             }, 200, { leading: false }));

				             editor.on('init', () => {
					             this.rendered = true;
				             })

				             // https://stackoverflow.com/questions/13543220/tiny-mce-how-to-allow-people-to-indent
				             editor.on('keydown', (e: KeyboardEvent) => {
					             let cancel = false;

					             if (e.keyCode == KeyCode.Tab) {
						             if (e.shiftKey) {
							             editor.execCommand('Outdent');
						             }
						             else {
							             editor.execCommand('mceInsertContent', false, '&emsp;');
							             tinymce.dom.Event.cancel(e);
						             }

						             cancel = true;
					             }

					             // Eat ctrl-s / command-s
					             const key = String.fromCharCode(e.keyCode);

					             if ((e.ctrlKey || e.metaKey) && (key == 's' || key == 'S')) {
						             cancel = true;
					             }

					             if (cancel) {
						             tinymce.dom.Event.cancel(e);

						             e.preventDefault();
						             e.stopPropagation();
						             return false;
					             }
				             })
			             },
			             content_css: '/lib/tinymce/tinymce.css',
			             inline: inline,
			             height: height,
			             fixed_toolbar_container: inline ? `#toolbar-${this.id}` : null,
			             statusbar: false,
			             menubar: false,
			             readonly: isLayoutDragging,
			             resize: false,
			             branding: false,
			             themes: null,
			             file_picker_types: 'image',
			             paste_data_images: true,
			             plugins: 'advlist link autolink image media paste imagetools lists contextmenu searchreplace table textcolor textpattern colorpicker visualblocks hr',
			             toolbar: isTooltip || isLayoutDragging ? false : 'bold italic underline | quicklink h1 h2 h3 blockquote | alignleft aligncenter alignright | numlist bullist outdent indent | table | hr | visualblocks',
			             contextmenu: 'cut copy paste | bold italic underline | undo redo | link image inserttable '
		             }); */
	}

    componentDidUpdate() {
	}

    componentWillUnmount() {
		try {
			this.timeout && clearTimeout(this.timeout);
			// tinymce && this.editor && tinymce.remove(this.editor);
		}
		catch (err) {

		}
	}
}