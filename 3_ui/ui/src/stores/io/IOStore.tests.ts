import { testScheduler, ITestable, expect, sleep } from "test"
import { api, user, mobx, xhr, omdb, JuliaIO } from 'stores';
import { ioStore as store, IO } from 'stores/io';
import { ReportDescriptorTreeNode } from "ui/src/components/site/sidebar/reports";
import { reactionToPromise, buildURL } from "../../utility";
import { ioStore } from "./IOStore";

const timeouts = {
    loadDescriptors: 5000,
    loadTestIO: 60 * 1000,
    runTestIO: 360 * 1000,
    waitTestIO: 80000
}

class IOStoreTests implements ITestable {

    describeTests = () => {
        let ioId: string, connectionId: string;
        let io: IO;
        describe(`IOStore basic operation`, function () {
            this.timeout(timeouts.loadTestIO);
            before('can load test IO run', async function() {
                let result = await xhr.putUntilSuccess<{ioId: string, connectionId: string}>(store.apiRoute + "?mock=true", { data: { name: "Mock IO", "dfioPath": "test" } }, "io_id");
                ({ioId, connectionId} = result);
            })
            it("should have a valid io ID", function() {
                expect(ioId).to.not.be.null;
            })
            it("OMDB InvestmentOptimization table should have an entry correspond to the Mock IO", async function() {
                var iODescriptor = await omdb.findSingle<JuliaIO>('InvestmentOptimization', ioId);
                expect(iODescriptor.name).to.equal("Mock IO");
                expect(iODescriptor.status).to.equal("Waiting");
            })
            it("should be able to load descriptor of Mock IO", async function() {
                io = await store.loadDescriptor(ioId);
                expect(io).to.not.be.null;
                expect(io.id).to.equal(ioId);
                expect(io.status).to.equal("Waiting");
                expect(store.ios.has(ioId)).to.be.true;
                expect(store.ios.size).to.equal(1);
            })
        })

        describe('IOStore Run Optimization', function () {
            this.timeout(timeouts.runTestIO);
            before("should be able to run optimization", async function() {
				io.resetEvaluationState();
				io.setupListeners();
				await io.optimize(false, true);
				await io.currentPage.insertView("efficientFrontier");
				await reactionToPromise(() => io.status, "Complete");
				expect(io.status).to.equal("Complete");
			})

            it("should have correct frontier points", function() {
                expect(io.frontierPoints).to.deep.equal([9032, 7233, 6755, 4345, 3854, 1488]);
            })
            
            it("should have correct length of asset classes", function() {
                expect(io.assetGroups(2).length).to.equal(37);
            })
            // it("should not have lambdas", () => {
            //     expect(io.lambda).to.be.null;
            // })
            it("should have correct value of evaluation details", function() {
                expect(5).to.equal(5);
                io.frontierPoints.forEach((x) => {
                    expect(x in io.evaluations).to.be.true;
                });
            })
        })
		
        describe('IOStore Update Control Flags', function () {
            it("should be able to update control flags", async function() {
                const result = await xhr.post(io.apiUrl + '/update-control-flags?connection-id=' + io.connectionID, { includeLambdaTable: true});
                io.processState(result);
                expect(io.lambda.length).to.equal(31);
            })

            it("should be able to toggle view", async function() {
                expect(io.currentPage.selectedViews.length).to.equal(1);
                await io.currentPage.insertView("status");
                expect(io.currentPage.selectedViews.length).to.equal(2);
            })
            it("should be able to update percentile", async function() {
                let frontierIndex = io.frontierPoints[0];
                expect(io.evaluations[frontierIndex].percentiles.length).to.equal(9);
                let targetUpdateCount = io.updateCount + 2;
                io._updatePercentiles([50, 76]);
                await reactionToPromise(() => io.updateCount, targetUpdateCount);
                expect(io.evaluations[frontierIndex].percentiles.length).to.equal(2);
            })
        })

        describe("IOStore User Input", function () {
            it("User input between front end and back end should be consistent", async function() {
                const state: any = await xhr.get(buildURL(io.apiUrl + '/user-input', { ['connection-id']: io.connectionID, enabled: io.connectionID }));
                // expect(io.pages.to).to.deep.equal(ApiPage[](state.outputPages));
                expect(io.currentPage.selectedViews.map(v => v.name)).to.deep.equal(state.outputPages[0].views.map(view => view.view));
            })
        })

		after("should be clean up optimization", function() {
			if (io) {
				console.log('[IOStore.tests] Clean up io');
				io.cleanup();
			}
		});

        // describe("IO Open Existing Object", function () {
        //     this.timeout(timeouts.waitTestIO);
        //     before("can open existing IO", async () => {
        //         await xhr.get(io.apiUrl + '/s3-write-status?connection-id=' + io.connectionID);
        //         if(io.eventSource){
        //             var eventSource: IOEventSource = io.eventSource;
        //             eventSource.dispose();
        //         }
        //         await xhr.delete(io.apiUrl + '/io-monitor-server-process');
        //         ioStore.ios.delete(ioId);
        //     })
        //     it("ioStore should be empty", () => {
        //         expect(ioStore.ios.size).to.equal(0);
        //     })
        //     it("should be able to load an existing IO", async () => {
        //         io = await store.loadDescriptor(ioId);
        //         expect(io.frontierPoints.length).to.equal(0);
        //         await io.loadExistingIO();
        //         expect(io.assetGroups(2).length).to.equal(37);
        //         expect(io.selectedViews.length).to.equal(2);
        //     })
        //     it("should populate selectedViews after toggle some views on", async () => {
        //         await io.toggleViewSelection("efficientFrontier");
        //         expect(io.selectedViews.length).to.equal(3);
        //     })
        // })
    }
}

testScheduler.register(new IOStoreTests());
