import {IconName} from '@blueprintjs/core';
import {InputTable} from 'components/system/userInterfaceComponents/Table/InputTable';
import {FormattedMessage} from 'react-intl';
import {i18n, site} from 'stores';

export class TableCopier {

	static ICONS = {
		COPY: "clipboard" as IconName,
		PASTE: "duplicate" as IconName
	}

	constructor(private grid, private inputTable?: InputTable) {
		const orgFunc = grid.setClipString;
		grid.setClipString = (clipText) => {
			const selection = grid.selection;
			if (selection.col !== selection.col2 && clipText.indexOf("\t") == -1) {
				site.confirm(
					i18n.intl.formatMessage({defaultMessage: "Continue Paste?", description: "[TableCopier] a confirm message title"}),
					<>
						<FormattedMessage defaultMessage={"Multiple columns were selected for pasting, however the pasted data contains no \"TAB\" characters to separate the data into columns."}
					                    description={"[TableCopier] a confirm message detail"}/>
						<br/>
						<hr/>
						<FormattedMessage defaultMessage={"Paste content:"} description={"[TableCopier] copy content detail display box title"}/>
						<br/>
						<pre>{clipText}</pre></>
				).then(result => result && orgFunc.call(grid, clipText))
			} else {
				orgFunc.call(grid, clipText);
			}
		}
	}

	copySelection = () => {
		const backupFormat = wijmo.Globalize.format;

		try {
			wijmo.Globalize.format = this.inputTable?.gridHandler?.clipValueFormatter || ((value) => value);
			const clipString       = this.grid.getClipString();
			if (navigator.clipboard?.writeText) {
				navigator.clipboard.writeText(clipString);
			} else {
				const textArea = $("<textarea />").css('display', 'none').appendTo(document.body).val(clipString);
				textArea.focus().select();
				document.execCommand('copy');
				textArea.remove();
			}
		}
		finally {
			wijmo.Globalize.format = backupFormat;
		}
	}

	pasteSelection = () => {
		navigator.clipboard?.readText && navigator.clipboard.readText().then(clipText => {
			site.busy = true;
			try {
				this.grid.setClipString(clipText);
			}
			finally {
				site.busy = false;
			}
		});
	}
}