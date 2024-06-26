import {get$Container} from 'test';
import {reactionToPromise, waitCondition, sleep} from 'utility';
import { IO } from 'stores/io';
import {waitChartFrontierData} from './ioTestUtils';

export function runPathWiseDominanceTests(getEnzymeContainer, getIo, expect) {
    describe(`Should show lambda path wise dominance`, function () {
	    before(async function() {
		    let specifyButton = get$Container().find(".bp3-button").eq(1);
		    if(!specifyButton.hasClass("bp3-active"))
			    specifyButton.click();
		    let allocationsButton = getEnzymeContainer(true).find('span.bp3-popover-target').at(0);
		    allocationsButton.simulate('click');
		    await sleep(500); // wait for hover to show menu
			$('input#toggleLambda').not(':checked').parent().click();
		    allocationsButton.simulate('click');
		    await sleep(500); // wait for reloadData
	    });

        it (`should have correct number of rows and columns`, function () {
          let io:IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("tr").length).to.equal(io.lambda.length);
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small tr").children("td").length).to.equal(io.lambda.length * io.lambda.length);
        });

        it(`should have correct number of labels`, function () {
          let io: IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("text").length).to.equal(io.lambda.length);
        });

        it ("should have correct number of graphs without hovers", function () {
          let io:IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("g").length).to.equal(io.lambda.length * (io.lambda.length - 1));
        });
    });

    describe(`Should show efficient frontier path wise dominance`, function () {
        before(async function() {
          let io:IO = getIo();
          let updateCount = io.updateCount;
          let specifyButton = get$Container().find(".bp3-button").eq(1);
          if(!specifyButton.hasClass("bp3-active"))
            specifyButton.click();
          let allocationsButton = getEnzymeContainer(true).find('span.bp3-popover-target').at(0);
          allocationsButton.simulate('click');
          await waitCondition(() => { // wait for hover to show menu
            return true;
          }, 500);
          $('input#toggleFrontier').parent().click();
          allocationsButton.simulate('click');
          await waitChartFrontierData(io, "pathWiseDominance", updateCount, true);
        });

        it("should have correct number of rows and columns", function () {
          let io:IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("tr").length).to.equal(io.frontierPoints.length);
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small tr").children("td").length).to.equal(io.frontierPoints.length * io.frontierPoints.length);
        });

        it("should have correct number of labels", function () {
          let io: IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("text").length).to.equal(io.frontierPoints.length);
        });

        it ("should have correct number of graphs without hovers", function () {
          let io: IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("g").length).to.equal(io.frontierPoints.length *(io.frontierPoints.length - 1));
        });
    });

    describe(`Should show path wise dominance percentages`, function () {
        before(async function() {
          let io:IO = getIo();
          let percentageButton = get$Container().find(".bp3-button").eq(4);
          if(!percentageButton.hasClass("bp3-active"))
            percentageButton.click();
        });

        it("should have correct number of rows and columns", function () {
          let io:IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("tr").length).to.equal(io.frontierPoints.length);
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small tr").children("td").length).to.equal(io.frontierPoints.length * io.frontierPoints.length);
        });

        it("should have correct number of percentages and labels", function () {
          let io: IO = getIo();
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("text").length).to.equal(io.frontierPoints.length * io.frontierPoints.length);
        });

        it ("should have no graphs", function () {
          expect(get$Container().find(".bp3-html-table.bp3-html-table-bordered.bp3-small").find("g").length).to.equal(0);
        });
    });
}
