import {gulp} from '../';
import superagent from "superagent";

const whiteSourceApiUrl = 'https://app.whitesourcesoftware.com/api/v1.3';

gulp.task('clean:projects', async (cb) => {
	const productToken = '87cd0bd9f18b4e8681e2678becfd31c26bb7876a903f4e8796f97cf906ae51b1',
		  userKey = '2cda2f4c14554a6f8abafaa953b526a48af8eba7ac104168927d4f94b47a8123';

	let body;
	const response = await superagent
		.post(whiteSourceApiUrl)
		.send({
			requestType: 'getAllProjects',
			productToken,
			userKey
		})
		.set('accept', 'json');

	body = response.body;

	const bugFixProjects = body.projects.filter(project => project.projectName.match(/^bugfix\//));

	for (const project of bugFixProjects.slice(0, 50)) {
		console.log(`Deleting: ${project.projectName}`);
		const response = await superagent.post(whiteSourceApiUrl).send({
			"requestType" : "deleteProject",
			productToken,
			userKey,
			"projectToken": project.projectToken
		}).set('accept', 'json')

		console.log(response.body);
	}

})
