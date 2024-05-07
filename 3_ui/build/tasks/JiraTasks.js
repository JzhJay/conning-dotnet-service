/*
import gulp from 'gulp';
import _ from 'lodash';
import JiraClient from 'jira-connector';

const JIRA_BOARD = "Query Tool";
const jira = new JiraClient({
	host:       'jira.advise-conning.com',
	basic_auth: {username: 'build', password: 'buildpassword'}
});

process.env.SPRINT = 'unknown';
let loaded = false;

gulp.task('get-jira-sprint', (done) => {
	if (loaded) {
	    console.log(`Using cached sprint value '${process.env.SPRINT}'`)
		done();
		return;
	}

	console.log('Loading sprint information from Jira...')
	jira.makeRequest({
		                 uri:    jira.buildAgileURL('/board'),
		                 method: 'GET',
		                 json:   true
	                 }, (err, res) => {
		if (err || !res.values) {
			done();
			console.error(err);
		}
		else {
			const devBoard = _.find(res.values, b => b.name == JIRA_BOARD);
			if (devBoard != null) {
				jira.makeRequest({
					                 uri:    jira.buildAgileURL('/board/' + devBoard.id + '/sprint'),
					                 method: 'GET',
					                 json:   true,
					                 qs:     {state: 'active'}
				                 }, (err, res) => {
					if (err) {
						throw err;
					}

					const sprint = _.first(res.values);

					if (sprint) {
						console.log(`Current Jira Sprint:  ${sprint.name}`);
						process.env.SPRINT = sprint.name;
						loaded = true;
					}
					else {
						console.warn(`No active sprint on board ${JIRA_BOARD}`)
					}
						done();
				})
			} else {
				console.error(`Could not find the JIRA board '${JIRA_BOARD}'`);
				done();
			}
		}
	});
});
*/
