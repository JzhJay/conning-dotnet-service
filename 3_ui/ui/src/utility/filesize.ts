const CEIL = 1000;
const UNITS = {
	bits: ['bit', 'Kbit', 'Mbit', 'Gbit', 'Tbit', 'Pbit', 'Ebit', 'Zbit', 'Ybit'],
	bytes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
};

interface FileSizeOptions {
	precision: number;
	unit: 'bits' | 'bytes';
}

export function filesize(value, options: FileSizeOptions = { precision: 0, unit: 'bytes' }) {
	const { unit = 'bytes' } = options;
	let { precision = 0 } = options;
	let	number = Number(value);
	if ((typeof number !== 'bigint' && isNaN(number)) || number < 0) {
		throw new TypeError('Invalid file size value');
	}
	let exponent = Math.floor(Math.log(number) / Math.log(CEIL));
	if (exponent < 0) {
		exponent = 0;
	} else if (exponent > 8) {
		if (precision > 0) {
			precision = precision + 8 - exponent;
		}
		exponent = 8;
	}

	if (number > 0) {
		let val = number / Math.pow(1000, exponent);
		if (unit === 'bits') {
			val = val * 8;

			if (val >= CEIL && exponent < 8) {
				val = val / CEIL;
				exponent += 1;
			}
		}

		const p = Math.pow(10, exponent > 0 ? 2 : 0);
		number = Math.round(val * p) / p;

		if (number === CEIL && exponent < 8) {
			number = 1;
			exponent += 1;
		}
	}

	const finalUnit = UNITS[unit][exponent];
	if (precision > 0) {
		return `${number.toPrecision(precision)} ${finalUnit}`;
	}

	return `${number} ${finalUnit}`;
}