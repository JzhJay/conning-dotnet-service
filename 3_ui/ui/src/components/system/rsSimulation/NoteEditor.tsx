import { useCallback, useEffect, useRef } from 'react';
import { action, flow } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Editor } from '@tinymce/tinymce-react';
import { ButtonGroup, Button, IconName } from '@blueprintjs/core';
import moment from 'moment';
import {i18n} from 'stores';

import { RSSimulation } from '../../../stores/rsSimulation/RSSimulation';
import { user } from '../../../stores/user/UserStore';

import * as css from './NoteEditor.css';

interface MyProps {
	rsSimulation: RSSimulation;
}

export const NoteEditor = observer((props: MyProps): JSX.Element => {
	const store = useLocalObservable(() => ({
	    note: '',
		editingNote: null
	}));
	const editorRef = useRef(null);

	const getActiveItemPath = (): string[] => {
		return _.get(props.rsSimulation, ['stepNavigationController', 'activeItem', 'itemPath'], []);
	};

	const onEditorChange = useCallback(
		flow(function* (newNote: string, editor ) {
			if (store.note !== newNote) { // prevent switching path to fire additional save request
				store.editingNote = newNote;
				yield saveNote(getActiveItemPath(), newNote);
			}
		}.bind(this)
	), []);

	const activeItemPath = getActiveItemPath();
	const note = props.rsSimulation.getNote(activeItemPath);

	useEffect(action(()=> {
		store.note = note;
		store.editingNote = null;
	}), [activeItemPath.join("."), note]);

	const saveNote = useCallback(_.debounce(
		flow(function* (path, note) {
			try {
				if (path) {
					const { rsSimulation } = props;
					yield rsSimulation.editNote({ path, note });
					store.note = note;
				}
			} finally {
				store.editingNote = null;
			}
		}).bind(this),
		800
	), []);

	const getPlaceHolder = () => {
		let navItem =_.get(props.rsSimulation, ['stepNavigationController', 'activeItem']);
		let path = navItem.title;
		while (navItem.parentItem) {
			navItem = navItem.parentItem;
			path = `${navItem.title} / ${path}`;
		}
		return i18n.intl.formatMessage(
			{defaultMessage: `Add notes to {path}…`, description: "[NoteEditor] placeholder text"},
			{path}
		);
	}

	const toggleEditMode = useCallback((e) => {
		const { rsSimulation } = props;
		const readonly = props.rsSimulation.additionalControls.noteEditorReadonly;
		const newNoteEditorReadonly = !readonly;
		rsSimulation.updateAdditionalControls({noteEditorReadonly: newNoteEditorReadonly});
	}, []);

	const addTimestamp = useCallback(action(() => {
		if (editorRef.current) {
			const userName = user.currentUser ? user.currentUser.name : '';
			const { currentContent } = editorRef.current;
			const newContent = currentContent + `<p>${moment().format('MM/DD/YYYY hh:mm:ss')} (${userName}):</p>`;
			onEditorChange(newContent, editorRef.current)
		}
	}), []);

	const readonly = props.rsSimulation.additionalControls.noteEditorReadonly;
	const editModeProps = readonly ? {
		icon: 'edit' as IconName,
		text: i18n.common.OBJECT_CTRL.EDIT
	} : {
		icon: 'eye-open' as IconName,
		text: i18n.intl.formatMessage({defaultMessage: 'View', description: "[NoteEditor] switch mode to view"})
	};
	const finalNote = store.editingNote === null ? store.note : store.editingNote;

	let language;
	switch (user.settings.language) {
		case 'zh-CN':
			language = 'zh_CN';
			break;
		default:
			language = 'en';
			break;
	}

	return (
		<div className={classNames(css.root, { [css.hideToolbar]: readonly })}>
			<div className={css.floatMenu}>
				<ButtonGroup>
					<Button {...editModeProps} onClick={toggleEditMode} />
				</ButtonGroup>
			</div>
			<Editor
				ref={editorRef}
				value={finalNote}
				init={{
					height: 270,
					menubar: false,
					plugins: [
						'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
						'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
						'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
					],
					toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | link | bullist numlist outdent indent | removeformat | customAddTimestampButton | help',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
					branding: false,
					setup: (editor) => {
						editor.ui.registry.addButton('customAddTimestampButton', {
							icon: 'insert-time',
							tooltip: i18n.intl.formatMessage({defaultMessage: 'Add timestamp', description: "[NoteEditor] plugin tooltip"}),
							enabled: true,
							onAction: addTimestamp,
							onSetup: (buttonApi) => {
							  /* onSetup should always return the unbind handlers */
							  return () => {};
							}
						});
					},
					language_url: `/ui/lib/tinymce/langs/${language}.js`,
					language: language
				}}
				onEditorChange={onEditorChange}
				disabled={readonly}
			/>
			{readonly && _.isEmpty(finalNote) && <div className={css.placeholder} onClick={toggleEditMode}>{getPlaceHolder()}</div>}
		</div>
	);
})