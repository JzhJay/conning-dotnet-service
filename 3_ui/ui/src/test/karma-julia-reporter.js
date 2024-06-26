var JuliaReporter = function (helper, logger, config) {
	var log = logger.create('reporter.julia');

	console.log("Julia Reporter!")

	this.onBrowserComplete = function (browser) {
		var results = browser.lastResult;
		var time    = helper.formatTimeInterval(results.totalTime);

		console.log(results);
	};

};
JuliaReporter.$inject = ['helper', 'logger', 'config.juliaReporter'];

// PUBLISH DI MODULE
module.exports = {
	'reporter:julia': ['type', JuliaReporter]
};