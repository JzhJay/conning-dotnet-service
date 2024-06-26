import * as css from './LicenseUpdateMessage.css';

export const LicenseUpdateMessage = (props) => {
	const { licenseExpireTime = 0, isExpired = false } = props;
	const message = isExpired ? `Your software license expired on ${new Date(licenseExpireTime).toLocaleDateString()}.` :
	`Your software license will expire on ${new Date(licenseExpireTime).toLocaleDateString()}.`;

	return (
		<div className={css.main}>
			<div>{message}</div>
			<div>Please update your license or contact Conning Support.</div>
		</div>
	);
}