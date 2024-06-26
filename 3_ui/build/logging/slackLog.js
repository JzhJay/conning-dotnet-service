import child_process from 'child_process';
import os from 'os';

const config = {
	username:   'gulp',
	iconUrl:    "https://raw.githubusercontent.com/T1st3/vendor-icons/master/dist/32x32/gulp.png",
	webhookUrl: `https://hooks.slack.com/services/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`,
}

const hostname = os.hostname();

export function logToSlack(text, channel = "#rs-build-deploy")
{
	const cmd = `curl -X POST --data-urlencode 'payload={"channel": channel, "username": "${config.username}", "text": "http://${hostname}:  ${config.text}", "icon_url": "${config.iconUrl}"' ${config.webhookUrl}`;
	child_process.exec(cmd);
}