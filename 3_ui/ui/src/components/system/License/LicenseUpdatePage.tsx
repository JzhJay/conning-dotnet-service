import { useEffect, useCallback, useRef } from 'react';
import { Classes, Button, ProgressBar, Intent, Callout } from '@blueprintjs/core';
import { flow } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react'
import { user } from 'stores';

import * as css from './LicenseUpdatePage.css';

export const LicenseUpdatePage = observer((props): JSX.Element => {
	const store = useLocalObservable(() => {
		return {
			isUpdating: false,
			updateResult: null,
			license: {
				product: '',
				customer: '',
				start: '',
				exp: ''
			}
		};
	});
	const licenseInputFileRef = useRef(null);

	const refreshLicenseInfo = (license) => {
		if (license) {
			store.license = license;
		}
	};

	const loadLicense = flow(function*() {
		const license = yield user.getLicense();
		refreshLicenseInfo(license);
	});

	const onUpdateLicense = useCallback((e) => {
		if (licenseInputFileRef.current) {
			licenseInputFileRef.current.click();
		}
	}, []);

	const onLicenseFileChange = useCallback(flow(function* (e) {
		try {
			store.isUpdating = true;
			store.updateResult = null;
			const license = yield user.updateLicense(e.target);
			refreshLicenseInfo(license);
			store.updateResult = true;
		} catch (e) {
			store.updateResult = false;
		} finally {
			store.isUpdating = false;
			licenseInputFileRef.current.value = '';
		}
	}), []);

	useEffect(() => {
		loadLicense();
	}, []);

	return (
		<div>
			<div className={css.banner}>
				License Details
			</div>
			<div className={css.content}>
				{ store.updateResult !== null &&
				<Callout 
					intent={store.updateResult ? Intent.SUCCESS : Intent.DANGER}
					icon={store.updateResult ? 'tick-circle' : 'error'}
					title={store.updateResult ? 'License is updated successfully!' : 'Fails to update license. Please check if license file is valid or contact Conning Support.'}
				/>
				}
				{ store.isUpdating && <ProgressBar intent={Intent.PRIMARY} value={100} /> }
				<table className={`bp3-html-table bp3-html-table-striped ${css.table}`}>
					<tbody>
						<tr>
							<th>Product:</th>
							<td className={classNames({[Classes.SKELETON]: !store.license.product})}>
								{store.license.product}
							</td>
						</tr>
						<tr>
							<th>Customer:</th>
							<td className={classNames({[Classes.SKELETON]: !store.license.customer})}>
								{store.license.customer}
							</td>
						</tr>
						<tr>
							<th>Start Date:</th>
							<td className={classNames({[Classes.SKELETON]: !store.license.start})}>
								{store.license.start}
							</td>
						</tr>
						<tr>
							<th>Expiry Date:</th>
							<td className={classNames({[Classes.SKELETON]: !store.license.exp})}>
								{store.license.exp}
							</td>
						</tr>
						<tr>
							<td colSpan={2} className={css.lastRow}>
								<input ref={licenseInputFileRef} type="file"  name="license.lic" accept=".lic" className={css.fileInput} onChange={onLicenseFileChange} />
								<Button disabled={store.isUpdating} onClick={onUpdateLicense}>Update License</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
});