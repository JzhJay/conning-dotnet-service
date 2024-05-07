// import * as css from './AppUploadPanel.css';
// import {bp, sem} from 'components';
// import {observer} from 'mobx-react';
// import {site} from 'stores';
// import DropzoneComponent from 'react-dropzone-component';
// import 'react-dropzone-component/styles/filepicker.css';
//
// const componentConfig = {
// 	iconFiletypes: ['.dfs', '.dfq', '.dfa'],
// 	showFiletypeIcon: true,
// 	postUrl: 'none'
// };
//
// const dropzoneConfig = {
// 	addRemoveLinks: false,
// 	autoProcessQueue: false,
// 	multiple: false,
// 	accept: function(file, done) {
// 		const {fullPath, name} = file;
//
// 		console.log(file.name);
// 		done('no');
// 	}
// }
//
// @observer
// export class AppUploadPanel extends React.Component<{},{}> {
// 	render() {
// 		return (
// 		<bp.Overlay isOpen={site.inGlobalDragOver} canEscapeKeyClose={false} canOutsideClickClose={false} autoFocus={false}>
// 			<div className={classNames(css.root, "pt-card pt-elevation-4")}>
// 				<DropzoneComponent config={componentConfig}
// 				                   eventHandlers={this} djsConfig={dropzoneConfig}>
// 					<div className="dz-message">Drop External Files or Directories to Import</div>
// 				</DropzoneComponent>
//
// 			</div>
// 		</bp.Overlay>)
// 	}
//
// 	addedfile = (file) => {
// 		console.log(file);
// 	}
// }
