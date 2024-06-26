import {desc} from 'rethinkdb';
import { IO } from 'stores/io';
import {get$Container, sendNativeEventToElement, verifyDownloadFile} from 'test';
import { waitCondition } from 'utility';
import * as css from '../../IO/internal/StrategySummaryView.css';

export function runStrategySummaryChartTests(expect, getIo){
    describe(`Should have correct columns`, function () {
        it("should have correct number of columns", function () {
            const io:IO = getIo();
            expect($('table').first()[0].children[0].children[0].childElementCount).to.equal(1 + io.additionalPoints.length + io.lambda.length);
        })
        it("should have correct column names", function () {
			expect($('.asset-header').get(0).parentElement.children[1].textContent).to.equal("Untitled1"); // additional points
            expect($('.asset-header').get(0).parentElement.children[2].textContent).to.equal("a"); // lambda points
            expect($('.asset-header').get(0).parentElement.lastElementChild.textContent).to.equal("ae");
        })
    });

    describe('Should have correct rows', function () {
        it("should have a total row", function () {
			expect(get$Container().find("th:contains('Total')").get(0)).to.not.be.null;
		})
        it("total row should all have 100% as value", function () {
            var totalRows = get$Container().find("th:contains('Total')").get(0).parentNode;
            let cellValues: string[] = [];
            for(let i = 0; i < totalRows.childNodes.length; ++i){
                if (totalRows.childNodes[i].nodeName != "TH") cellValues.push(totalRows.childNodes[i].textContent);
            }
            let uniqueValues = _.uniq(cellValues);
            expect(uniqueValues.length).to.equal(1);
	        expect(parseFloat(uniqueValues[0])).to.equal(100);
        })
    })

    describe("Should have correct interaction", function () {
        describe("click column", function () {
			before(async function () {
				let secondColumn = $('.asset-header').get(0).parentElement.children[2]; // click column "a"

				if (!$(secondColumn).hasClass('StrategySummaryView__reference-column')) {
					$(secondColumn).click();
				}

			    await waitCondition(() => true, 1000);
            })
            it("should hightlight column name that being clicked", async function () {
				expect(get$Container().find('.StrategySummaryView__reference-column').first().text()).to.equal("a");
            })
            it("should set the clicked column as reference column so change in risk/reward will set to 0", function () {
				const $riskTh = get$Container().find("tbody tr th:contains('Change In Risk')");
				const $rewardTh = get$Container().find("tbody tr th:contains('Change In Reward')");

				expect($riskTh.length).to.equal(1);
				expect($riskTh.next('td').next('td').text()).to.equal("0.00");
				expect($rewardTh.length).to.equal(1);
				expect($rewardTh.next('td').next('td').text()).to.equal("0.00");
			})
        })

        describe("click rows section in toolbar", function () {
            before(async function () {
				const $specifyButton = $('#specifyButton');
				if (!$specifyButton.hasClass('bp3-active')) {
					$specifyButton.click();
				}
				waitCondition(()=> true, 500);
	            $('.bp3-button-text:contains("Select Content")').click();
            	waitCondition(() => $('.DatasetToolbarItemBase__content-menu').length );
                $('.DatasetToolbarItemBase__content-menu .bp3-switch:contains("Duration")').first().click();
                await waitCondition(() => true, 5000);
            })
            it("duration row should disappear after uncheck duration checkbox in toolbar", function () {
                expect($("th:contains('Duration')").get(0)).to.be.undefined;
            })
            it("duration row should come back if checkbox is checked again", async function() {
	            $('.DatasetToolbarItemBase__content-menu .bp3-switch:contains("Duration")').first().click();
                await new Promise<void>((resolve) => {
	                $('.DatasetToolbarItemBase__content-menu').parents('.bp3-portal').first().remove();
                    setTimeout(() => {
                        resolve();
                    }, 3000)
                });
                expect($("th:contains('Duration')").get(0)).to.not.be.undefined;
            })
        })
    })


	describe("should be able export files", function () {
		it('should be able export csv file', async function () {
			this.timeout(5*1000);
			let target = $('button.bp3-button[target="download"]');
			sendNativeEventToElement(target[0], 'click');
			await waitCondition(() => {
				let item = $('.bp3-portal .bp3-menu-item').filter((i,elem) => $(elem).text() == 'Export CSV');
				if (item.length) {
					sendNativeEventToElement(item[0], 'click');
					return true;
				}
				return false;
			})

			const io:IO = getIo();
			await verifyDownloadFile(expect, {
				type: "text/csv",
				fileName: `${io.name}-StrategySummaryExport.csv`
			});
		});

		it('should be able export xlsx file', async function () {
			this.timeout(10*1000);
			let target = $('button.bp3-button[target="download"]');
			sendNativeEventToElement(target[0], 'click');
			await waitCondition(() => {
				let item = $('.bp3-portal .bp3-menu-item').filter((i,elem) => $(elem).text() == 'Export XLSX');
				if (item.length) {
					sendNativeEventToElement(item[0], 'click');
					return true;
				}
				return false;
			})

			const io:IO = getIo();
			await verifyDownloadFile(expect, {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				fileName: `${io.name}-StrategySummaryExport.xlsx`
			});
		});
	})
}