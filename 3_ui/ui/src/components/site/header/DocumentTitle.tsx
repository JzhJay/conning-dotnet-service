import {utility, api, site, user} from "stores";
import * as css from './DocumentTitle.css'
import { observer } from 'mobx-react';
import { reaction } from 'mobx';

@observer
export class DocumentTitle extends React.Component<{}, {}> {
	render() {
		// // const {rename: {descriptor: renamingItemDescriptor}, header} = api.site;
		// // const {label, editable, type, id}                            = header;
		//
		// const isRenaming       = renamingItemDescriptor && renamingItemDescriptor.id === id;
		// const isHeaderRenaming = isRenaming && renamingItemDescriptor.element !== 'header';
		//
		// const finalLabel = isRenaming ? renamingItemDescriptor.value : label;

		let { activeTool } = site;

		let title = activeTool ? activeTool.title() : site.productName;

		let renderTitle = activeTool ? activeTool.renderTitle ? activeTool.renderTitle : activeTool.title : () => title;

		const tooltipProps = null; //editable ? {'data-tooltip': "Rename", 'data-position': "bottom center"} : null;

// {renamingItemDescriptor && renamingItemDescriptor.id === id ? renamingItemDescriptor.value : label}
		return <div className={classNames(css.documentTitle)}
		            {...tooltipProps}>
			{activeTool && renderTitle()}
			{/*<span className={css.titleSpan}>
			</span>*/}
		</div>;
		//
		// 	{_.isString(finalLabel) ?
		// 	 <input key={`input-${id}-${editable}`}
		// 	       ref={r => this.input = r}
		// 	       readOnly={!editable}
		// 	       type="text"
		// 	       autoFocus={isHeaderRenaming}
		// 	       value={isHeaderRenaming || !editable ? finalLabel as string : undefined}
		// 	       defaultValue={editable ? label as string : undefined}
		// 	       onKeyDown={this.onKeyDown}
		// 	       onKeyUp={this.onKeyUp}
		// 	       onFocus={() => {
		// 		       api.site.rename.start({id: id, type: type, element: 'header'});
		// 		       this.input.select();
		// 	       }}
		// 	       onBlur={() => {
		// 		       if (header.editing) {
		// 			       api.site.rename.done()
		// 		       }
		// 	       }}
		// 	/> : finalLabel}
		// 	<span key="measure" className={css.titleSpan}>{finalLabel}</span>
		// </div>
	}

	// private _toDispose = [];
	//
	// componentWillMount() {
	// 	this._toDispose.push(reaction(() => site.header, () => {
	// 		if (this.input) { this.input.value = site.header.label as string }
	// 	}, {name: 'Update header input due to store change'}))
	// }
	//
	// componentWillUnmount() {
	// 	this._toDispose.forEach(f => f());
	// }
	//
	// input: HTMLInputElement;
	//
	// onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	const {KeyCode} = utility;
	// 	const input                      = e.target as HTMLInputElement;
	// //	api.site.rename.descriptor.value = input.value;
	// }
	//
	// 	onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	const {KeyCode} = utility;
	//
	// 	const input                      = e.target as HTMLInputElement;
	// //	api.site.rename.descriptor.value = input.value;
	//
	// 	switch (e.keyCode) {
	// 		case KeyCode.Enter: {
	// 			input.blur();
	//
	// 			break;
	// 		}
	//
	// 		case KeyCode.Escape: {
	// 			api.site.rename.cancel();
	// 			input.value = api.site.header.label as string;
	// 			input.blur();
	// 			break;
	// 		}
	//
	// 		default:
	// 			break;
	// 	}
	// }
}


