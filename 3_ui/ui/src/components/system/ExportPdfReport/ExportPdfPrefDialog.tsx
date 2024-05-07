import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import InlineSVG  from 'react-inlinesvg';

import { BlueprintDialog, bp } from 'components';
import {iconUrls, user, UserPdfLogoOptions, asyncSiteLoading, i18n} from 'stores';

import * as css from './ExportPdfPrefDialog.css';

const LOGO_CONSTRAINS = {
	size: 102400,
	width: 300,
	height : 300
};

interface MyProps {
}

@observer
export class ExportPdfPrefDialog extends React.Component<MyProps, {}> {
	@observable isUpdating: boolean = false;
	@observable logoStyle: string;
	@observable logoUrl: string;
	@observable errorMessage: string;

	fileOpenInputRef = React.createRef<HTMLInputElement>()

	constructor(props) {
        super(props);

        makeObservable(this);

        const logoStyle = user.getPdfReportLogoStyle();
        const logoUrl = user.getPdfReportCustomLogo();
        this.logoStyle = logoStyle;
        this.logoUrl = logoUrl;
    }

	@action handleReportLogoOptionChange = (e) => {
		const value = e.currentTarget.value;
		if (value === UserPdfLogoOptions.none || value === UserPdfLogoOptions.conning) {
			this.fileOpenInputRef.current.value = '';
			this.errorMessage = '';
		} else {
			if (!this.logoUrl) {
				this.errorMessage = 'Please upload an image. Image width or height cannot exceed 300 pixels ';
			}
		}
		this.logoStyle = value;
	}

	handleSavePrefChange = asyncSiteLoading(async () => {
		try {
			this.isUpdating = true;
			const { profile } = user;
			const newUserMetadata = _.merge({}, profile.userMetadata );
			_.set(newUserMetadata, 'ui.report.logoStyle', this.logoStyle);
			await user.updateUserMetadata(newUserMetadata);
			await user.setPdfReportCustomLogo(this.logoUrl);
			return true;
		} finally {
			this.isUpdating = false;
		}
	})

	openFileOpenInputDialog = () => {
		if (this.fileOpenInputRef.current) {
			this.fileOpenInputRef.current.click();
		}
	}

	@action async isImageUrlOk (dataUrl) {
		return new Promise((resolve)=> {
			const img = new Image();
			img.onload = action(() => {
				if (img.naturalWidth > LOGO_CONSTRAINS.width || img.naturalHeight > LOGO_CONSTRAINS.height) {
					this.errorMessage = `Image's width or height should be less than or equal to 300 pixels`;
					resolve(false);
					return;
				}
				this.errorMessage = '';
				resolve(true);
			});
			img.onerror = () => {
				resolve(false);
			};
			img.src = dataUrl;
		});
	}

	@action onFileOpenInputChange = () => {
		if (this.fileOpenInputRef.current) {
			const { files } = this.fileOpenInputRef.current;
			if (files && files[0]) {
				if (files[0].size > LOGO_CONSTRAINS.size) {
					this.errorMessage = 'Image size should not be greater than 100KB.';
					return;
				}

				this.isUpdating = true;
				const reader = new FileReader();
				reader.onload = async (e) => {
					const imgUrl = e.target.result as string;
					if (await this.isImageUrlOk(imgUrl)) {
						this.logoUrl = imgUrl;
					}
					this.isUpdating = false;
				};
				reader.onerror = () => this.isUpdating = false;

				reader.readAsDataURL(files[0]);
			}
		}
	}

	render() {
		const hasError = !!this.errorMessage;
		const isOkDisabled = this.logoStyle === UserPdfLogoOptions.custom && (!this.logoUrl);
		return (
			<BlueprintDialog
				className={css.root}
				icon="cog"
				canCancel={!this.isUpdating}
				title="PDF Export Preferences"
				ok={this.handleSavePrefChange}
				okText="Save"
				okDisabled={isOkDisabled}
			>
				<div>
					<bp.RadioGroup
						label="Select logo:"
						onChange={this.handleReportLogoOptionChange}
						selectedValue={this.logoStyle}
						inline={true}
					>
						<bp.Radio label="None" value={UserPdfLogoOptions.none} />
						<bp.Radio label="Conning Logo" value={UserPdfLogoOptions.conning}>
							<div className={css.logo}>
								<InlineSVG src={iconUrls.conningLogo}/>
							</div>
						</bp.Radio>
						<bp.Radio label="Custom Logo" value={UserPdfLogoOptions.custom}>
							<div>
								{ this.logoUrl &&
									<div className={css.logo}>
										<img className={css.uploadImg} src={this.logoUrl} />
									</div>
								}
								<div className={css.logo}>
									<input
										ref={this.fileOpenInputRef}
										className={css.fileInput}
										type="file"
										disabled={this.isUpdating}
										accept="image/jpeg,image/png"
										onChange={this.onFileOpenInputChange} />
									<bp.Tag minimal={true} onClick={this.openFileOpenInputDialog}>{i18n.common.MESSAGE.CHOOSE_A_FILE}</bp.Tag>
								</div>
							</div>
						</bp.Radio>
					</bp.RadioGroup>
					{ hasError &&
					<label className={classNames(bp.Classes.LABEL, 'error', css.errorMessage)}>{this.errorMessage}</label>
					}
				</div>
			</BlueprintDialog>
		);
	}
}
