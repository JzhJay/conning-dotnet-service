import {RSSimulationOutput} from 'components/system/rsSimulation/RSSimulationOutput';
import {RSSimulationRunning} from 'components/system/rsSimulation/RSSimulationRunning';
import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import {when} from 'mobx';
import * as React from 'react';
import {testScheduler, ITestable, expect, enzyme, simulateMouseEvent, sleep, enzymeUnmount, enzymeMount, get$Container} from "test"
import {Simulation, simulationStore, site, xhr} from 'stores';
import {RSSimulation} from 'stores';
import {waitCondition} from 'utility';

const timeouts = {
	load: 60 * 1000,
	render: 10 * 1000,
	delete: 10 * 1000,
	test: 30 * 1000,
	download: 120 * 1000,
	waitZip: 5 * 60 * 1000, //5min, the zip file now slower than before. because the number of files increase.
	run: 20 * 60 * 1000 //last run on teamcity using over 15 minutes to start service.
}

class RSSimulationRun implements ITestable {

	describeTests = () => {
		let result;

		describe(`test RS Simulation  no result page`, async function () {
			let rsSimulation: RSSimulation;

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				rsSimulation = await rsSimulationKarmaTool.getRSSimulation();

				console.log(`[RSSimulationInputs] load input state`);

				if (rsSimulation.isRunning) {
					await rsSimulation.cancel();
				}

				if (!rsSimulation.canRun) {
					// if case is complete, update props make status = Waiting
					await rsSimulation.sendInputsUpdate({simulationNodes: {yearsToProject: 10}});
					await when(() =>  rsSimulation.canRun);
				}

				result = enzymeMount(<RSSimulationOutput rsSimulation={rsSimulation} />)
			})

			after(() => enzymeUnmount(result));

			it("verify", function(){
				this.timeout(timeouts.test);
				let $root = $(result.getDOMNode());
				expect($root.find(`.bp3-callout.bp3-intent-warning`)).to.have.length(1);
			})
		})

		describe(`test RS Simulation running process page`, async function () {

			const testScenarios = 2;
			let rsSimulation: RSSimulation;
			let refreshIntervalId;

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				rsSimulation = await rsSimulationKarmaTool.getRSSimulation();

				if (rsSimulation.isRunning) {
					await rsSimulation.cancel();
				}
			});

			after(function () {
				refreshIntervalId && clearInterval(refreshIntervalId);
				enzymeUnmount(result);
			});

			it("init test configs", async function() {
				this.timeout(20*1000);
				expect(rsSimulation.isRunning).to.eq(false);
				//set running props.
				const updates = {
					"scenarioContentNodes.dataSeries" : "naicBasic",
					"simulationNodes.yearsToProject" : 2,
					"simulationNodes.scenarios" : `1-${testScenarios}`,
					"simulationNodes.timeStep" : "annual",
					"calibrationNodes.calibration" : "naicRealWorld",
					// "filesToProduceNodes.saveToStorageBlocks" : false,
					"filesToProduceNodes.fileFormat.separateTenorsCsv" : false,
					"filesToProduceNodes.fileFormat.separateAssetsCsv" : false,
					"filesToProduceNodes.fileFormat.allTenorsCsv" : true,
					"filesToProduceNodes.fileFormat.allAssetsCsv" : true,
					"filesToProduceNodes.fileFormat.allTenorsAndReturnsCsv" : true
				}

				let updateObject = {};
				_.forEach( _.keys(updates), k => _.set( updateObject, k, updates[k]));
				await rsSimulation.sendInputsUpdate(updateObject);
				_.forEach( _.keys(updates), k => {
					expect(_.get(rsSimulation.userInputs, k)).to.eq(updates[k] , `${k} should be ${updates[k]} but ${_.get(rsSimulation.userInputs, k)}`);
				});
			})

			it("can run", async function() {
				this.timeout(timeouts.run);
				expect(rsSimulation.isRunning).to.eq(false);

				await when(() => !site.busy);
				await rsSimulation.run();

				await when(() => rsSimulation.isRunning);
			})

			const reRenderRunningPage = () => {
				expect(rsSimulation.isRunning).to.equal(true);

				result = enzymeMount(<RSSimulationRunning rsSimulation={rsSimulation} />);

				rsSimulationKarmaTool.resetSse(rsSimulation, true);
			}

			it('verify prepare status page', async function() {
				this.timeout(10*1000);
				reRenderRunningPage();

				// testing charts
				expect($('.Progress__title').text() ).to.eq('Simulation Monitor');
				expect($('.progress').length        ).to.gte(1);
			})

			it('verify simulation running page', async function() {
				this.timeout(timeouts.run);
				await waitCondition(() => {
					rsSimulationKarmaTool.resetSse(rsSimulation, true);
					rsSimulation.runningMessage?.progressMessage && console.log(JSON.stringify(rsSimulation.runningMessage.progressMessage));
					return rsSimulation.runningMessage?.progressMessage;
				}, 1000, timeouts.run);

				// testing charts
				expect($('.RunningMessageBox__primary-pane').length ).to.eq(1);
				expect($('.highcharts-container').length                ).to.eq(15);
				expect($('.SummaryStatus__bar-chart').length            ).to.eq(4);
				expect($('.Progress__root').length                      ).to.eq(2);
				expect($('.CountdownClock__root').length                ).to.eq(2);
			})

			it('can unfolder/folder Scenario generation chart', async function() {
				this.timeout(timeouts.run);
				const folderBtn = $('span[icon="caret-right"]');
				expect(folderBtn.length ).to.eq(1);

				let testChart = folderBtn.parent();
				expect(testChart.find(".highcharts-yaxis-labels text").first().text()).to.eq("0");
				expect(testChart.find(".highcharts-yaxis-labels text").last().text()).to.eq(`${testScenarios}`);
				expect(testChart.find(".highcharts-xaxis-labels text").length).to.eq(1);

				simulateMouseEvent($('span[icon="caret-right"]')[0], 'click');
				await sleep(1000);

				expect(testChart.find(".highcharts-xaxis-labels text").length).to.eq(7);
			})

			const checkRunningValue = async (key:string, expectValue: number, timeout?: number) => {
				let v;
				let runCount = 0;
				await waitCondition(() => {
					if( (++runCount) % 60 == 0) {
						rsSimulation.eventSource?.dispose();
						rsSimulation.initEventSource();
					}
					v = _.get(rsSimulation, `runningMessage.progressMessage.${key}`);
					console.log(`[checkRunningValue] ${key} = ${v}`);
					return v >= expectValue;
				}, 1000, timeout || timeouts.run);

				expect(v).to.gte(expectValue);
			}

			it('can finish compiler', async function() {
				this.timeout(timeouts.run);
				await checkRunningValue( "compilerProgress", 1)
			});

			it('can start worker', async function() {
				this.timeout(timeouts.run);
				await checkRunningValue( "computationProcessesReady", 1)
			})

			it('can start store', async function() {
				this.timeout(timeouts.run);
				await checkRunningValue( "databaseProcessesReady", 1)
			})

			it('can processed Scenarios', async function() {
				this.timeout(timeouts.run);
				await checkRunningValue( "csvNumberScenariosProcessed", 1, timeouts.run)
			})

			it('can created csv files', async function() {
				this.timeout(timeouts.run);
				await checkRunningValue( "numberCsvFilesComplete", 1, timeouts.run)
			})

			it('can complete', async function() {
				this.timeout(timeouts.run * 3);
				let runCount = 0;
				await waitCondition(() => {
					if (runCount == 5 ) {
						runCount = 0;
						simulationStore.loadDescriptor(rsSimulation._id).then((sim) => {
							console.log(`get simulation status from database = ${sim.status}`);
							rsSimulation.status = (sim.status as any);
						});
					} else {
						runCount ++;
					}
					rsSimulationKarmaTool.resetSse(rsSimulation, true);
					console.log(`simulation status = ${rsSimulation.status}`);
					return rsSimulation.isComplete;
				}, 30 * 1000, timeouts.run * 3);

				expect(rsSimulation.isComplete).to.eq(true);
			})
		})


		describe(`test RS Simulation result page`, async function () {
			let rsSimulation: RSSimulation;

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				rsSimulation = await rsSimulationKarmaTool.getRSSimulation();

				await rsSimulation.loadFileInformation();

				result = enzymeMount(<RSSimulationOutput rsSimulation={rsSimulation} />)
			})

			after(() => enzymeUnmount(result));

			it("verify number of processing files match", async function(){
				this.timeout(timeouts.waitZip);
				expect(rsSimulation.isComplete).to.equal(true);

				/* let counter = 0;
				await waitCondition(() => {
					if ((++counter)%20 === 0) {
						console.log(`update file list, current: ${_.map(rsSimulation.outputFiles, f => f?.title)}`)
						rsSimulation.loadFileInformation();
					}
					return rsSimulation.hadZipFile;
				}, 1000, timeouts.waitZip);
				*/
				let $trs;
				await waitCondition(() => ($trs = get$Container().find(`.bp3-html-table tbody tr`)).length > 0 );
				expect($trs.length).to.equal(rsSimulation.outputFiles.length);
			})

			it("testing download - csv", async function(){
				this.timeout(timeouts.download);
				expect(rsSimulation.outputFiles.length).to.gt(0);
				const url = xhr.createAuthUrl(`${rsSimulation.apiUrl}/download/${rsSimulation.outputFiles[0].id}`, true);
				const res = await xhr.get(url, null, "blob", true);
				expect(res['statusCode']).to.equal(200);
				expect(res['type']).equals("text/csv")
				expect(res['header']['content-type']).contains("text/csv")
				expect(res['header']['content-disposition']).contains(`filename=${rsSimulation.outputFiles[0].title}`)
				expect(res['body']['type']).equals("text/csv")
				expect(res['body']['size']).to.be.greaterThan(0)
			})

			/*
			it("testing download - archived file", async function(){
				this.timeout(timeouts.test);
				expect(rsSimulation.outputFiles.length).to.gt(0);
				const url = xhr.createAuthUrl(`${rsSimulation.apiUrl}/download/${rsSimulation.outputFiles[rsSimulation.outputFiles.length - 1].id}`, true);
				const res = await xhr.get(url, null, "blob", true);
				expect(res['statusCode']).to.equal(200);
				expect(res['type']).equals("application/zip")
				expect(res['header']['content-type']).contains("application/zip")
				expect(res['header']['content-disposition']).contains(`filename=Exported_Files.zip`)
				expect(res['body']['type']).equals("application/zip")
				expect(res['body']['size']).to.be.greaterThan(0)
			})
			 */
		})


		describe(`Delete current RS Simulation Simulation`, async function () {

			it('try delete', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				let rsSimulation = await rsSimulationKarmaTool.savedRSSimulation;

				if (!rsSimulation) {
					return;
				}

				if(rsSimulation.isRunning) {
					await rsSimulation.cancel();
				}
				await Simulation.delete(rsSimulation as any);
				rsSimulation.eventSource?.dispose();
			});
		})
	}
}



testScheduler.register(new RSSimulationRun());