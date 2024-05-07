import {ControlPanelPage} from 'components';
import {controlPanelStore, IO, ioTestData, simulationTestData, site} from 'stores';
import {enzyme, enzymeMount, enzymeUnmount, expect, ITestable, simulateMouseEvent, sleep, testScheduler} from 'test';
import {reactionToPromise, waitCondition} from 'utility';

class ControlPanelPageTests implements ITestable {
	describeTests = () => {
		describe("Control Panel Tests", function () {
			let result = null;

			const dataRowClassName= '.ControlPanelPage__process';
			const defaultSessions = ["WorkerManager", "ResourceInventory", "FileUploaderServer", "RestApi", "FileExporterServer", "LogForwarder", "WindowsEC2Manager"];
			const objectSessions = ["IOMonitorServer"];

			before(function() {
				result = enzymeMount(<ControlPanelPage />);
			})

			after(() => enzymeUnmount(result));

			it("should render", async function () {
				await waitCondition(() => {
					return $(dataRowClassName).length > 0
				});
				expect($(dataRowClassName).length).to.eq(defaultSessions.length);
			})

			it("should default sessions startup", async function () {
				$(dataRowClassName).each((i,elem) => {
					const name = $(elem).find('td').first().text().trim();
					expect(_.includes(defaultSessions, name)).to.eq(true, `session ${name} should in default session array [${defaultSessions}]`)
				})
			})

			it("should new session can show up", async function () {
				this.timeout(300 * 1000);
				const io = await ioTestData.loadTestData();
				await io.loadExistingIO();

				await controlPanelStore.loadProcesses();
				expect($(dataRowClassName).length).to.eq(defaultSessions.length+1);
			})

			it("verify new session and close", async function () {
				const $row = $(dataRowClassName).filter((i, elem) => {
					return $(elem).find('td').first().next().text().trim() != 'default';
				})

				expect($row.length).to.eq(1);
				const name = $row.find('td').first().text().trim();
				expect(_.includes(objectSessions, name)).to.eq(true, `session ${name} should in default session array [${objectSessions}]`);

				const removeBtn = $row.find('.ControlPanelPage__delete');
				simulateMouseEvent(removeBtn[0], 'click');
				site.busy && await reactionToPromise(()=> site.busy , false);
			})

			it("should session list is right after close", async function () {
				await controlPanelStore.loadProcesses();
				expect($(dataRowClassName).length).to.eq(defaultSessions.length);
				$(dataRowClassName).each((i,elem) => {
					const name = $(elem).find('td').first().text().trim();
					expect(_.includes(defaultSessions, name)).to.eq(true, `session ${name} should in default session array [${defaultSessions}]`)
				})
			})
		})
	}
}
testScheduler.register(new ControlPanelPageTests());