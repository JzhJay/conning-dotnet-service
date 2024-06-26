const log = require('fancy-log');

log.banner = (message, location = 'both') => {
	if (location == 'both' || location == 'top') {
		log("-----------------------------------------------");
	}
	if (message) {
		log(`${message}`)
	}

	if (location == 'both' || location == 'bottom') {
		log("-----------------------------------------------");
	}
}

export {log};

const forwardProcessPipes = (err, stdout, stderr) => {
	if (stdout) {
		log(stdout);
	}
	if (stderr) {
		log(stderr)
	}
}
