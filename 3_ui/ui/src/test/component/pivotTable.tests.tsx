import {
	enzyme,
	isPhantomJS,
	testScheduler,
	ITestable,
	runQueryFromOptions,
	sampleQueries,
	expect,
	JULIA_TAG,
	sendNativeEventToElement,
	verifyDownloadFile, enzymeMount, enzymeUnmount, get$Container
} from "test"
import {PivotTable} from 'components';
import {QueryResult, queryStore} from 'stores'
import { xhr } from "../../stores";
import {waitCondition, reactionToPromise, downloadFile} from "../../utility/utility";

const timeouts = {
	loadMetadata: 10 * 60 * 1000,
	compareScreenshots: 30 * 1000,
	export: 10 * 1000
}

class PivotTableTests implements ITestable {
	describeTests() {

		const sampleQuery = sampleQueries[0];
		describe(`Pivot table - (${sampleQuery.id})`, () => this.registerTests(sampleQuery));
	}

	registerTests(queryOptions) {
		let result                = null,
			pivotTable: PivotTable = null,
			arrangementChanged    = (newMetadata) => {},
			updated               = (pivotWrapper, pivotTable) => {},
			metadata              = null,
			qr:QueryResult        = null,
			$testContainer        = null,
			queryResult:  QueryResult          = null,
			wrapPivotTable = null;

		before(async function () {
			this.timeout(timeouts.loadMetadata);
			// runs before all tests in this block
			queryResult = await runQueryFromOptions(queryOptions);
			console.log(`(query: ${queryOptions.id}): created`);

			await queryResult.loadMetadata(); // Must load explictly to allow rearranging.
			console.log(`(query: ${queryOptions.id}): metadata loaded`);

			return queryResult.arrangement.rearrange(queryOptions.arrangement).then(() => {
				// Create a location to render the pivot
				return new Promise((accept, reject) => {
					let rendered = false;
					let onLoaded  = function (pivot) {
						if (!rendered) {
							rendered         = true;
							pivotTable        = pivot;
							accept();
						}
					}

					wrapPivotTable = enzymeMount(
						<PivotTable userOptions={queryResult}
						            queryResult={queryResult}
						            showToolbar={true}
						            onLoaded={onLoaded}
						            arrangementChanged={(newMetaData) => arrangementChanged(newMetaData)}/>)

					$testContainer = $("#testContainer");
				})
			})

		});

		after(function (done) {
			this.timeout(10*1000);
			enzymeUnmount(wrapPivotTable)
			queryResult && queryStore.deleteQueryDescriptor(queryResult.id);
			done();
		})

		if (isPhantomJS) {
			it.skip('should match baseline image', function (done) {
				this.timeout(timeouts.compareScreenshots);
				//generateAndCompareScreenshot(`pivot/${id}.png`, done)
			});
		}
		else {

			it('should have rendered a pivot with axis, coordinates and data cells', function() {
				const {pivotMetadata} = pivotTable.queryResult;

				// Verify row header
				const rowHeaders = [].slice.call($testContainer.find('.row-axes .wj-colheaders .wj-header'))

				rowHeaders.forEach((axis, i) => {
					expect(axis.innerHTML).to.equal(pivotMetadata.axes[pivotMetadata.rowAxes[i]].groupName.label, "should match row header")
				})

				// Verify column header
				const columnHeaders = [].slice.call($testContainer.find('.column-axes .wj-rowheaders .wj-header'))

				columnHeaders.forEach((axis, i) => {
					expect(axis.innerHTML).to.equal(pivotMetadata.axes[pivotMetadata.columnAxes[i]].groupName.label,  "should match column header")
				})


				// Verify data
				pivotTable.detailCellsGrid.refresh();
				const {viewRange} = pivotTable.detailCellsGrid;
				for (let r = viewRange.topRow; r <= viewRange.bottomRow; r++) {
					for (let c = viewRange.leftCol; c <= viewRange.rightCol; c++) {
						var cell = pivotTable.detailCellsGrid.cells.getCellElement(r, c);

						expect(cell.innerHTML).to.equal(pivotTable.formatDetailCell(pivotTable.cache.getCell(r, c).detailCell), "should match data cell content")
					}
				}
			})

			it(`should have correct max css height`, function () {
				// Workaround for https://jira.advise-conning.com/browse/WEB-1789 requires modifying wijmo's code. Ensure that the max css height remains correct. e.g. an update
				// doesn't break us
				let FlexGrid:any = wijmo.grid.FlexGrid
				FlexGrid._maxCssHeight = null // clear cache;
				$("body").addClass('restrict-body')
				expect(FlexGrid._getMaxSupportedCssHeight()).to.equal(26.5 * 1000 * 1000)
				$("body").removeClass('restrict-body')
			})


			it(`should scroll without errors ${JULIA_TAG}`, async function () {
				this.timeout(60 * 1000);
				await runScrollTest(pivotTable, expect);
			})

			it.skip('should resize to fit container bounds', async function () {
				this.timeout(10 * 1000);

				const resize = async (multiple) => {
					//let $pivotNode = $testContainer.find('.pivot-table');
					let $detailCells = $testContainer.find('.detail-cells').first();
					$testContainer.height($detailCells.height() * multiple);
					$testContainer.width($detailCells.width() * multiple);

					// Trigger a resize event to force update
					window.dispatchEvent(new Event('resize'));

					// Flexgrid doesn't update synchronously so give it a second to upate
					await new Promise<void>((accept) => window.setTimeout(() => accept(), 1000))

					const bounds = getViewBounds();

					// Verify that the last cell extends all the way to the lower right of the screen and that its not too far offscreen which would indicate that the virtualization isn't working as expected.
					const buffer = 150; // Flexgrid sometimes renders an extra row/column beyond what is actually shown on screen
					const $lastCell = $(bounds.bottomRight)
					$detailCells = $($testContainer.find('.detail-cells').get(0));
					expect($lastCell.position().top + $lastCell.height()).to.be.within($detailCells.height(), $detailCells.height() + buffer, "last cell should be close to pivot bounds")
					expect($lastCell.position().left + $lastCell.width()).to.be.within($detailCells.width(), $detailCells.width() + buffer, "last cell should be close to pivot bounds")

					// Verify that the row and column headers grew/shrank to be inline with the details table
					// TODO: verify last cell position as done for the detail cells?
					const $rowHeader = $($testContainer.find('.row-axes').get(0));
					expect(($rowHeader.position().top + $rowHeader.height()) - ($detailCells.position().top + $detailCells.height())).to.be.at.most(2, "row header height should match detail table  height");

					const $colHeader = $($testContainer.find('.column-axes').get(0));
					expect(($rowHeader.position().left + $rowHeader.width()) - ($detailCells.position().left + $detailCells.width())).to.be.at.most(2, "column header width should match detail table  width");
				}

				await resize(.5);
				await resize(6);
			})

			// Should verify DOM and use UI to arrange
			describe.skip(`Re-arranging`, function () {
				function setupArrangmentCallbacks(doneTestCallback) {
					let finishedArrangement = false;
					arrangementChanged      = (newMetadata) => {
						metadata = newMetadata;
						//pivotWrapperNode.setState({metadata: newMetadata});
						finishedArrangement = true;
					}

					updated = () => {
						if (finishedArrangement) {
							window.setTimeout(() => doneTestCallback(), 1000);
							finishedArrangement = false;
						}
					};
				}

				it('should perform custom re-arranging without errors', function (done) {
					this.timeout(30000);

					const {pivotMetadata} = qr;

					if (pivotMetadata.columnAxes.length > 1 || pivotMetadata.rowAxes.length > 1) {
						const axes = {
							rowAxes:    _.cloneDeep(pivotMetadata.rowAxes),
							columnAxes: _.cloneDeep(pivotMetadata.columnAxes)
						};

						setupArrangmentCallbacks(done);

						if (axes.columnAxes.length > 1) {
							const axis = axes.columnAxes.pop();
							axes.rowAxes.push(axis);
						}
						else if (axes.rowAxes.length) {
							let axis = axes.rowAxes.pop();
							axes.columnAxes.push(axis);
						}

						qr.arrangement.rearrange(axes);
					}
					else {
						done();
					}
				})

				it('should flip without errors', function (done) {
					this.timeout(30000);

					setupArrangmentCallbacks(done);
					qr.arrangement.flip();
				})

				it('should rearrange all to rows without errors', function (done) {
					this.timeout(30000);

					if (qr.pivotMetadata.columnAxes.length > 0) {
						setupArrangmentCallbacks(done);
						qr.arrangement.allToRows();
					}
					else {
						done();
					}
				})

				it('should rearrange all to columns without errors', function (done) {
					this.timeout(90000);

					const {queryResult, queryResult: {pivotMetadata}} = pivotTable.props;

					if (pivotMetadata.rowAxes.length > 0) {
						setupArrangmentCallbacks(done);
						queryResult.arrangement.allToColumns();
					}
					else {
						done()
					}
				})
			});

			describe('StatisticPivot in PivotTalbe ', function() {

				const basicFields = ['Sum', 'Count', 'Mean', 'Variance.P', 'Variance.S', 'StDev.P', 'StDev.S', 'CoeffVar', 'Skewness', 'Kurtosis', 'Minimum', 'Maximum'];

				const getAllHeaders = async () => {
					await waitCondition(() => !pivotTable.isLoading);
					const rows = pivotTable.cache.rows;
					const rowAxesColumns = [];
					for (let i = 0 ; i < rows ; i++) {
						rowAxesColumns.push(pivotTable.getCellData('rows', i,0));
					}
					return rowAxesColumns;
				}

				it(`should be able to change view to StatisticPivot ${JULIA_TAG}`, async function () {
					this.timeout(150000);

					await waitCondition(() => $('.select-statistics-button').length > 0);
					sendNativeEventToElement($('.select-statistics-button').get(0), 'click');
					await reactionToPromise(() => queryResult.showStatisticsPivot, true);

					expect($('.select-statistics-button').hasClass('bp3-active')).to.be.true;

					await waitCondition(() => $('.row-axes .wj-header:contains("Statistic")').length > 0);
					expect($('.row-axes .wj-colheaders .wj-cell').length).to.eq(1);
					expect($('.row-axes .wj-colheaders .wj-cell').text()).to.eq('Statistic');

					expect($('.bp3-button-group.percentiles').length).to.eq(2);
					expect($('.bp3-button-group.percentiles:eq(0) .label').text()).to.eq('Percentiles:');
					expect($('.bp3-button-group.percentiles:eq(1) .label').text()).to.eq('CTEs:');

					const rowAxesColumns = await getAllHeaders();

					const expectedFields = [...basicFields];
					_.forEach( $('.bp3-button-group.percentiles:eq(0) input').val().split(','), v => expectedFields.push(`=${v.trim()}%`));
					_.forEach( $('.bp3-button-group.percentiles:eq(1) input').val().split(','), v => expectedFields.push(`${v.trim()}%`));

					expect(rowAxesColumns.sort()).to.deep.eq(expectedFields.sort());
					expect(queryResult.statistics.length > 0).to.be.true;
				});

				it(`should toggle statistic fields ${JULIA_TAG}`, async function () {
					this.timeout(150000);

					const clickSwitch_and_valid = async (field:string, show: boolean, columns: string[] ) => {
						const  rowAxesColumns_before = await getAllHeaders();
						sendNativeEventToElement($(`.bp3-portal .bp3-switch input[name="${field}"]`).parent()[0], 'click');

						const rowAxesColumns_after = await getAllHeaders();

						const diffColumns = [..._.difference<string>(rowAxesColumns_after, rowAxesColumns_before), ..._.difference<string>(rowAxesColumns_before, rowAxesColumns_after)];
						expect(columns.sort()).to.deep.eq(diffColumns.sort(), `should ${show?"show":"hide"} row "${columns}" but "${diffColumns}" on PivotTable`);
					}

					const get_btn = () => $('.pivotTable__select-statistics .bp3-button');

					sendNativeEventToElement(get_btn()[0], 'click');
					await waitCondition(() => get_btn().is('.bp3-active'));
					expect($('.bp3-portal .bp3-switch').length).equal(basicFields.length + 2, `have ${basicFields.length + 2} switches in screen.`);

					for(let i = 0; i < basicFields.length; i++) {
						const field = basicFields[i];
						await clickSwitch_and_valid(field, false, [field]);
						await clickSwitch_and_valid(field, true,  [field]);
					};

					expect($('.bp3-button-group.percentiles .label').text()).to.eq('Percentiles:CTEs:');
					const percentiles = $('.bp3-button-group.percentiles:eq(0) input').val().split(',').map(v => `=${v.trim()}%`);
					const CTEs =        $('.bp3-button-group.percentiles:eq(1) input').val().split(',').map(v =>  `${v.trim()}%`);

					await clickSwitch_and_valid('Percentile', false, percentiles);
					expect($('.bp3-button-group.percentiles .label').text()).to.eq('CTEs:');
					await clickSwitch_and_valid('Percentile', true , percentiles);

					await clickSwitch_and_valid('CTE', false, CTEs);
					expect($('.bp3-button-group.percentiles .label').text()).to.eq('Percentiles:');
					await clickSwitch_and_valid('CTE', true , CTEs);

					expect($('.bp3-button-group.percentiles .label').text()).to.eq('Percentiles:CTEs:');

					sendNativeEventToElement(get_btn()[0], 'click');
					await waitCondition(() => !get_btn().is('.bp3-active'));
				});

				it(`should customize percentiles ${JULIA_TAG}`, async function () {
					this.timeout(150000);

					const percentilesInput = wrapPivotTable.update().find('.percentiles input').at(0);
					percentilesInput.getDOMNode().value = '7, 20';
					percentilesInput.simulate('keydown', { keyCode: 13 });

					await waitCondition(() => $(`.pivotTable__vertical-splitter .wj-row > div:first-child:contains("=99%")`).length === 0);

					await waitCondition(() => $(`.pivotTable__vertical-splitter .wj-row > div:first-child:contains("=7%")`).length > 0);

					expect($('.pivotTable__vertical-splitter .wj-row > div:first-child:contains("=7%")').length).equal(1, `should have row "=7%" on PivotTable`);

					expect($('.pivotTable__vertical-splitter .wj-row > div:first-child:contains("=20%")').length).equal(1, `should have row "=20%" on PivotTable`);
				});

				it(`should customize ctes ${JULIA_TAG}`, async function () {
					this.timeout(150000);

					const ctesInput = wrapPivotTable.update().find('.percentiles input').at(1);
					ctesInput.getDOMNode().value = '<2, <12';
					ctesInput.simulate('keydown', { keyCode: 13 });

					await waitCondition(() => $(`.pivotTable__vertical-splitter .wj-row > div:first-child:contains("<5%")`).length === 0);


					await waitCondition(() => $(`.pivotTable__vertical-splitter .wj-row > div:first-child:contains("<2%")`).length > 0);

					expect($(`.pivotTable__vertical-splitter .wj-row > div:first-child:contains("<2%")`).length).equal(1, `should have row "<2%" on PivotTable`);

					expect($(`.pivotTable__vertical-splitter .wj-row > div:first-child:contains("<12%")`).length).equal(1, `should have row "<12%" on PivotTable`);
				});

				it(`should be able to turn off StatisticPivot`, async function () {
					this.timeout(150000);
					await waitCondition(() => $('.select-statistics-button').length > 0);
					sendNativeEventToElement($('.select-statistics-button').get(0), 'click');
					await reactionToPromise(() => queryResult.showStatisticsPivot, false);
					await waitCondition(() => $('.wj-header:contains("Statistic")').length === 0);

					expect($('.select-statistics-button').hasClass('bp3-active')).to.be.false;

					await waitCondition(() => $('.wj-cell.first-column[role="gridcell"]').first().text() === '-0.004196');
					expect($('.wj-cell.first-column[role="gridcell"]').first().text()).equal('-0.004196', 'should load pivot table successfully on PivotTable after turning off Statistic');
				});
			});

			describe('Use sensitivity in PivotTalbe ', function() {
				it(`should be able to enable sensitivty ${JULIA_TAG}`, async function () {
					this.timeout(150000);

					await waitCondition(() => $('.toggle-sensitivty').length > 0);
					sendNativeEventToElement($('.toggle-sensitivty').get(0), 'click');

					await waitCondition(() => queryResult.sensitivityEnabled === true);
					await waitCondition(() => queryResult.showStatisticsPivot === true);
					await waitCondition(() => queryResult.showStatisticsPivotBeforeEnableSensitivity === false);

					// Verify defaults
					expect($('.toggle-sensitivty').hasClass('bp3-active')).to.be.true;

					expect($('.sensitivity-column-select .bp3-button-text').text()).equal('Compounding=Annual,Economy=DE,Quarter=2016Q1', 'should select first column as default option');

					await waitCondition(() => $('.sensitivity-reference-mean-input input').val() !== '');

					expect($('.sensitivity-reference-mean-input input').val()).equal('-0.004195823719596592', 'should set reference mean value');

					expect($('.sensitivity-shifted-mean-input input').val()).equal('0', 'should set shifted mean value');

					expect($('.sensitivity-reference-sd-input input').val()).equal('0', 'should set reference standard deviation value');

					expect($('.sensitivity-shifted-sd-input input').val()).equals('0', 'should set shifted standard deviation value');
				});

				it(`should be able to run sensitivity ${JULIA_TAG}`, async function () {
					this.timeout(150000);

					const beforePivotTable = _.cloneDeep(pivotTable.cache);

					const $columnSelect = $('.sensitivity-column-select .bp3-button-text');
					sendNativeEventToElement($columnSelect.get(0), 'click');

					const optionText = 'Compounding=Continuous,Economy=US,Quarter=2018Q1';
					const $selectOptions = $(`.sensitivity-column-select-popover .bp3-menu-item-label:contains("${optionText}")`);
					sendNativeEventToElement($selectOptions.get(0), 'click');

					await waitCondition(() => $('.sensitivity-column-select .bp3-button-text').text() === optionText);

					expect($('.sensitivity-column-select .bp3-button-text').text()).equal(optionText, `should change option to ${optionText}`);

					expect($('.sensitivity-reference-mean-input input').val()).equal('0.020423604980335706', 'should set reference mean value');

					expect($('.sensitivity-reference-sd-input input').val()).equal('0.008395735060584048', 'should set reference standard deviation value');

					wrapPivotTable.update();

					const shiftedMeanInput = wrapPivotTable.find('.sensitivity-shifted-mean-input input');
					shiftedMeanInput.getDOMNode().value = '0.03';
					shiftedMeanInput.simulate('change');

					const shiftedSdInput = wrapPivotTable.find('.sensitivity-shifted-sd-input input');
					shiftedSdInput.getDOMNode().value = '0.01';
					shiftedSdInput.simulate('change');

					sendNativeEventToElement($('button.run-sensitivity')[0], 'click');

					await waitCondition(() => queryResult.sensitivity.shiftedMean !== null, 500);

					expect(queryResult.sensitivity.columnIndex).equal(17, 'should change column index');
					expect(queryResult.sensitivity.shiftedMean).equal(0.03, 'should change shifted mean');
					expect(queryResult.sensitivity.shiftedStandardDeviation).equal(0.01, 'should change shifted standard deviation');
					expect(queryResult.sensitivity.unshiftedMean).equal(0.020423604980335706, 'should change reference mean');
					expect(queryResult.sensitivity.unshiftedStandardDeviation).equal(0.008395735060584048, 'should change reference standard devaition');

					await waitCondition(() => {
						return !_.isEqual(pivotTable.cache, beforePivotTable)
					});

					expect(pivotTable.cache).to.deep.not.equal(beforePivotTable, 'pivot data should have been updated');
				});


				it(`should be able to turn off sensitivity`, async function () {
					// Leave sensitivity mode
					sendNativeEventToElement($('.toggle-sensitivty').get(0), 'click');

					await waitCondition(() => queryResult.sensitivityEnabled === false);

					expect($('.toggle-sensitivty').hasClass('bp3-active')).to.be.false;

					// should restore previous statistic's status
					await waitCondition(() => queryResult.showStatisticsPivot === false);
					expect($('.select-statistics-button').hasClass('bp3-active')).to.be.false;
				});
			});

			describe(`PivotTable file export ${JULIA_TAG}`, function () {

				before(async function () {
					// enable statistic for export test cases
					sendNativeEventToElement($('.select-statistics-button').get(0), 'click');
					await waitCondition(() => queryResult.showStatisticsPivot === true);
					expect($('.select-statistics-button').hasClass('bp3-active')).to.be.true;
				});

				it(`should be able export csv`, async function() {
					this.timeout(timeouts.export);
					await downloadFile(xhr.createAuthUrl(queryResult.query.CSVDownloadLinkUrl));
					await verifyDownloadFile(expect, {
						type: 'text/csv',
						fileName: 'Test Query.csv'
					});
				});

				it(`should be able export xlsx`, async function() {
					this.timeout(timeouts.export);
					await downloadFile(xhr.createAuthUrl(queryResult.query.XLSXDownloadLinkUrl));
					await verifyDownloadFile(expect, {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						fileName: 'Test Query.xlsx'
					});
				});
			});
		}
	}
}

testScheduler.register(new PivotTableTests());

function getViewBounds() {
	const $testContainer = get$Container();
	const detailCells =$testContainer.find('.detail-cells .wj-cells .wj-cell[role="gridcell"]')
	const bounds: {topLeft?:HTMLElement, topRight?:HTMLElement, bottomRight?:HTMLElement; bottomLeft?:HTMLElement} = {}

	bounds.topLeft = detailCells.get(0);
	bounds.topRight = [].slice.call(detailCells).filter((cell) => $(cell).css("top") == "0px").slice(-1)[0]
	bounds.bottomRight = detailCells.get(detailCells.length - 1);
	bounds.bottomLeft = [].slice.call(detailCells).filter((cell) => $(cell).css("top") == $(bounds.bottomRight).css("top"))[0]

	return bounds;
}

async function validateBounds(position, expected, message){
	let innerHTML = '';
	await waitCondition(() => {
		const bounds = getViewBounds();
		if (!bounds[position]) {
			return false;
		}

		innerHTML = bounds[position].innerHTML;
		return innerHTML === expected;
	}, 500) // Sometimes requires delay.
	expect(innerHTML).to.equal(expected, message)
}

async function runScrollTest(pivotTable, expect) {
	const $testContainer = get$Container();
	let $cells = $testContainer.find('.detail-cells div[wj-part=cells]');
	let $root  = $testContainer.find('.detail-cells div[wj-part=root]');

	await speedScroll($root, 0, $cells.width(), true);

	const cache = pivotTable.cache;
	await validateBounds('topRight', pivotTable.formatDetailCell(cache.getCell(0, cache.cols - 1).detailCell), "should match first row last column content")

	await speedScroll($root, $cells.width(), 0, true);
	await validateBounds('topLeft', pivotTable.formatDetailCell(cache.getCell(0, 0).detailCell), "should match first row first column")

	await speedScroll($root, 0, $cells.height(), false);
	await validateBounds('bottomLeft', pivotTable.formatDetailCell(cache.getCell(cache.rows - 1, 0).detailCell), "should match last row frist column content")

	await speedScroll($root, 0, $cells.width(), true);
	await validateBounds('bottomRight', pivotTable.formatDetailCell(cache.getCell(cache.rows - 1, cache.cols - 1).detailCell), "should match last row last column content")
}

function speedScroll($node, startPos, endPos, scrollHorizontally) {
	return new Promise<void>(accept => {
		console.log(`speedScroll() ${startPos} ${endPos} ${scrollHorizontally}`);

		const slowScrollEnd = 10000;
		const reverse       = endPos < startPos;
		let slowScrollPos = Math.min(endPos, slowScrollEnd);
		const scrollDelta   = reverse ? -100 : 100;

		if (reverse) {
			slowScrollPos = Math.max(startPos - slowScrollEnd, 0);
		}

		const scrollComplete = () => {
			if (Math.abs(endPos - startPos) > slowScrollEnd) {
				scrollToPos($node, slowScrollPos, endPos, (endPos - slowScrollPos) / 100, 100, scrollHorizontally, accept);
			}
			else {
				accept();
			}
		}

		scrollToPos($node, startPos, slowScrollPos, scrollDelta, 100, scrollHorizontally, scrollComplete);
	})
}

function scrollToPos($node, currentPos, endPos, increment, waitTime, scrollHorizontally, done) {
	window.setTimeout(() => {

		if (scrollHorizontally) {
			$node.scrollLeft(currentPos);
		} else {
			$node.scrollTop(currentPos);
		}

		if ((increment > 0 && currentPos >= endPos) || (increment < 0 && currentPos <= endPos)) {
			done();
		} else {
			scrollToPos($node, currentPos + increment, endPos, increment, waitTime, scrollHorizontally, done);
		}

	}, waitTime);

}
