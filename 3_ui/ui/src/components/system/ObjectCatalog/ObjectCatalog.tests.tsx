import {SimulationBrowser} from 'components';
import * as React from 'react';
import {ApolloProvider} from '@apollo/client';
import {apolloStore, ObjectCatalogContext, Simulation, user} from 'stores';
import {testScheduler, ITestable, expect, enzyme, sendNativeEventToElement, enzymeMount, enzymeUnmount, get$Container} from "test"
import {reactionToPromise, sleep, waitCondition} from 'utility/utility';

const timeouts = {
	load: 60 * 1000,
	render: 10 * 1000,
	test: 10 * 1000,
	query: 30 * 1000,
}

class ObjectCatalogTests implements ITestable {
	describeTests = () => {
		describe(`Object Catalog`, function () {
			let container;
			let result;
			let catalogContext: ObjectCatalogContext;

			const itemsPerPage = 2;

			before('', async function () {
				this.timeout(timeouts.load);

				user.settings.searchers.simulation.view = 'card';
				result = enzymeMount(<ApolloProvider client={apolloStore.client}><SimulationBrowser ref={r => catalogContext= r?.catalogContext} queryParams={{
						itemsPerPage: `${itemsPerPage}`,
						page:         "0",
						sortOrder:    "asc",
					}} /></ApolloProvider>);

				container = get$Container();
			})

			after(() => enzymeUnmount(result));

			async function checkIsNotRunningQuery( sleepTime: number = 10) {
				sleepTime && await sleep(sleepTime);
				catalogContext.isRunningQuery && await reactionToPromise(() => catalogContext.isRunningQuery, false);
			}
			async function checkHadResult(sleepTime: number = 0) {
				sleepTime && await sleep(sleepTime);
				catalogContext.queryResults.size == 0 && await reactionToPromise(() => catalogContext.queryResults.size > 0, true);
			}

			it(`can load`, async function () {
				this.timeout(timeouts.load);
				await checkIsNotRunningQuery();
				await checkHadResult()
				expect(catalogContext.queryResults.size).to.equal(itemsPerPage);
				expect(container.find('.cards .card').length).to.equal(itemsPerPage);
			});

			it(`can turn page`, async function () {
				this.timeout(timeouts.query);
				expect(container.find('.pagination .page-item.active').first().text()).to.equal('1');
				catalogContext.page = 1;
				await checkIsNotRunningQuery();
				expect(container.find('.pagination .page-item.active').first().text()).to.equal('2');
			});

			it(`can change number of case showing on page`, async function () {
				this.timeout(timeouts.query);
				expect(container.find('.SortableCardsPanel__paginate-navbar .bp3-button span').first().text()).to.equal('2');
				const total = catalogContext.lastQueryResult.total;
				catalogContext.page = 0;
				catalogContext.itemsPerPage = total;
				await checkIsNotRunningQuery();
				expect(container.find('.SortableCardsPanel__paginate-navbar .bp3-button span').first().text()).to.equal(`${total}`);
				expect(catalogContext.queryResults.size).to.equal(total);
				expect(container.find('.cards .card').length).to.equal(total);
			});

			describe(`test filter created by me`, function () {

				let userId;
				let filterButton;

				before('', async function () {
					userId = user.currentUser.sub;
					filterButton = container.find('.bp3-navbar .bp3-button').filter((i,elem) => {
						return $(elem).find('.bp3-button-text .bp3-button-text').text() == 'Me'
					});
				})

				it(`do filter`, async function () {
					this.timeout(timeouts.query);
					expect(filterButton.length).to.equal(1);
					expect(filterButton.hasClass('bp3-active')).to.equal(false);
					sendNativeEventToElement(filterButton.get(0), 'click');
					await checkIsNotRunningQuery();
					expect(filterButton.hasClass('bp3-active')).to.equal(true);
					expect(catalogContext.selectedTagValues.get('createdBy')[0]).to.equal(userId);
				});

				it(`all results should be filtered`, function () {
					this.timeout(timeouts.test);
					catalogContext.queryResults.forEach( (v:Simulation) => {
						expect(v.createdBy._id).to.equal(userId);
					});
				});

				it(`filter panel should be checked`, async function () {
					this.timeout(timeouts.test);
					let filterGroup = container.find('.ObjectCatalogSidebar__tag').filter((i,elem) => {
						return $(elem).find('.ObjectCatalogSidebar__title').text() == 'Created By';
					})
					expect(filterGroup.length).to.equal(1);
					let filter = filterGroup.find(`.ObjectCatalogSidebar__tag-value[title="${userId}"]`);
					expect(filter.length).to.equal(1);
					const isChecked = () => filter.parents('.ObjectCatalogSidebar__tag-values').first().find('input').first().prop('checked');
					await waitCondition(isChecked, 100, 10_000); // wait for the value to be checked if it isn't immediately.
					expect(isChecked()).to.eq(true);
				});

				it(`restore filter`, async function () {
					this.timeout(timeouts.query);
					let restoreButton = filterButton.next();
					expect(restoreButton.hasClass('bp3-active')).to.equal(false);
					restoreButton.click();
					await checkIsNotRunningQuery();
					expect(restoreButton.hasClass('bp3-active')).to.equal(true);
					expect(filterButton.hasClass('bp3-active')).to.equal(false);
				});
			});

			describe(`test sorter`, function () {

				let sorterButton;

				before('', async function () {
					sorterButton = container.find('.bp3-navbar .bp3-button').filter((i,elem) => {
						return $(elem).find('.bp3-button-text').text() == 'Name'
					});
				})

				it(`do sorter`, async function () {
					this.timeout(timeouts.query);
					expect(sorterButton.length).to.equal(1);
					expect(sorterButton.hasClass('bp3-active')).to.equal(false);
					sorterButton.click();
					await checkIsNotRunningQuery();
					expect(sorterButton.hasClass('bp3-active')).to.equal(true);
					expect(sorterButton.find('.bp3-icon').attr('icon')).to.equal('caret-up');

				});

				it(`check order`, function () {
					this.timeout(timeouts.test);
					let compare = "";
					catalogContext.queryResults.forEach( (v:Simulation) => {
						if(v.isFavorite) { return; }
						compare && expect(compare <= v.name).to.eq(true);
						compare = v.name;
					});
				});

				it(`do sort again`, async function () {
					sorterButton.click();
					await checkIsNotRunningQuery();
					expect(sorterButton.hasClass('bp3-active')).to.equal(true);
					expect(sorterButton.find('.bp3-icon').attr('icon')).to.equal('caret-down');

				});

				it(`check order again`, function () {
					this.timeout(timeouts.test);
					let compare = "";
					catalogContext.queryResults.forEach( (v:Simulation) => {
						if(v.isFavorite) { return; }
						compare && expect(compare >= v.name).to.eq(true);
						compare = v.name;
					});
				});

				it(`restore sorter`, async function () {
					this.timeout(timeouts.query);
					catalogContext.sortBy = "";
					catalogContext.sortOrder = "asc";
					await checkIsNotRunningQuery();
					expect(sorterButton.hasClass('bp3-active')).to.equal(false);
				});
			});

			describe(`test sidebar filter`, function () {

				let filterGroup;
				let filteredValues = [];

				before('', async function () {
					filterGroup = container.find('.ObjectCatalogSidebar__tag').filter((i,elem) => {
						return $(elem).find('.ObjectCatalogSidebar__title').text() == 'Scenarios';
					})
				})

				it(`check filter clear`, async function () {
					this.timeout(timeouts.test);
					expect(filterGroup.length).to.equal(1);
					expect(filterGroup.find('input').filter((i,elem) => $(elem).prop('checked')).length).to.equal(0);
				});

				it(`add filter`, async function () {
					this.timeout(timeouts.query);
					let filter = filterGroup.find('.bp3-control').first();
					filteredValues.push(parseInt(filter.find('.ObjectCatalogSidebar__tag-value').attr('title'), 10));
					filter.click();
					await checkIsNotRunningQuery();
					expect(filter.find('input').prop('checked')).to.equal(true);
				});

				it(`all results should be filtered by 1 filter`, function () {
					this.timeout(timeouts.test);
					catalogContext.queryResults.forEach( (v:Simulation) => {
						expect(filteredValues.indexOf(v.scenarios)).to.gte(0);
					});
				});

				it(`add more filter`, async function () {
					this.timeout(timeouts.query);
					let filter = filterGroup.find('.bp3-control').filter((i,elem) => !$(elem).find('input').prop('checked')).first();
					filteredValues.push(parseInt(filter.find('.ObjectCatalogSidebar__tag-value').attr('title'), 10));
					filter.click();
					await checkIsNotRunningQuery();
					expect(filter.find('input').prop('checked')).to.equal(true);
				});

				it(`all results should be filtered by 2 filter`, function () {
					this.timeout(timeouts.test);
					catalogContext.queryResults.forEach( (v:Simulation) => {
						expect(filteredValues.indexOf(v.scenarios)).to.gte(0);
					});
				});

				it(`restore filter`, async function () {
					this.timeout(timeouts.query);
					filterGroup.find('.bp3-control').filter((i,elem) => $(elem).find('input').prop('checked')).click();
					await checkIsNotRunningQuery();
					expect(filterGroup.find('input').filter((i,elem) => $(elem).prop('checked')).length).to.equal(0);
				});
			});

			describe(`test searcher`, function () {

				let searcher;

				before('', async function () {
					result.update();
					searcher = result.find('.ObjectCatalogSearcher__search-input input');
				})

				it(`show suggestion`, async function () {
					this.timeout(timeouts.query);
					expect(searcher.length).to.equal(1);
					searcher.getDOMNode().value = 's';
					searcher.simulate('focus');
					await checkHadResult();
					await waitCondition(() => $('.bp3-portal').length > 0 );
				});

				it(`move search index`, async function () {
					this.timeout(timeouts.test);
					let currentIndex = catalogContext.searchModel.searchIndex;
					expect(catalogContext.searchModel.searchResults.length).to.gte(1);
					searcher.simulate('keyDown', {keyCode: 38, key:'ArrowUp'});
					expect(catalogContext.searchModel.searchIndex).to.equal(currentIndex-1);
					searcher.simulate('keyDown', {keyCode: 40, key:'ArrowDown'});
					expect(catalogContext.searchModel.searchIndex).to.equal(currentIndex);
				});

				it(`test normal search`, async function () {
					this.timeout(timeouts.query);
					searcher.getDOMNode().value = 'tester';
					searcher.simulate('focus');
					catalogContext.searchModel.searchIndex = null;
					searcher.simulate('keyDown', {keyCode: 13, key:'Enter'});

					await checkIsNotRunningQuery();
					expect(catalogContext.searchText).to.equal('tester');

					catalogContext.searchModel.reset();
					searcher.simulate('blur');

					await checkIsNotRunningQuery();
					expect(catalogContext.searchText).to.equal('');
				});

				it(`test suggestion`, async function () {
					this.timeout(timeouts.test);
					searcher.getDOMNode().value = 'f';
					searcher.simulate('focus');
					await checkHadResult();
					await waitCondition(() => $('.bp3-portal').length > 0 );
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Field').length).to.gt(0, "search has field");
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Distinct').length).to.gt(0, "search has distinct");
				});

				let numOfResult_field = 0;
				it(`test suggestion - field search`, async function () {
					this.timeout(timeouts.test);
					searcher.getDOMNode().value = '';
					catalogContext.searchModel.reset();
					await sleep(50);
					searcher.getDOMNode().value = 'sce=';
					searcher.simulate('focus');
					await checkHadResult();
					await waitCondition(() => $('.bp3-portal').length > 0 );
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Field').length).to.eq(0, "search has field");
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Distinct').length).to.gt(0, "search has distinct");
					numOfResult_field = catalogContext.searchModel.searchResults.length;
				});

				let numOfResult_distinct = 0;
				it(`test suggestion - distinct search`, async function () {
					this.timeout(timeouts.test);
					searcher.getDOMNode().value = '';
					catalogContext.searchModel.reset();
					await sleep(50);
					searcher.getDOMNode().value = '=c';
					searcher.simulate('focus');
					await checkHadResult();
					await waitCondition(() => $('.bp3-portal').length > 0 );
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Field').length).to.eq(0, "search has field");
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Distinct').length).to.gt(0, "search has distinct");
					numOfResult_distinct = catalogContext.searchModel.searchResults.length;
				});

				it(`test suggestion - both field and distinct search`, async function () {
					this.timeout(timeouts.test);
					searcher.getDOMNode().value = '';
					catalogContext.searchModel.reset();
					await sleep(50);
					searcher.getDOMNode().value = 's=c';
					searcher.simulate('focus');
					await checkHadResult();
					await waitCondition(() => $('.bp3-portal').length > 0 );
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Field').length).to.eq(0, "search has field");
					expect($('.ObjectCatalogSearcher__type-label').filter((i,elem) => $(elem).text() == 'Distinct').length).to.gt(0, "search has distinct");
					expect(catalogContext.searchModel.searchResults.length).to.lt(numOfResult_field);
					expect(catalogContext.searchModel.searchResults.length).to.lt(numOfResult_distinct);
				});

				it(`add filter by searcher`, async function () {
					this.timeout(timeouts.query);
					const totalCount = catalogContext.lastQueryResult.total;
					searcher.getDOMNode().value = 'Scenarios';
					searcher.simulate('focus');
					await checkHadResult(50);
					await waitCondition(() => $('.bp3-portal').length > 0 );
					$('.ObjectCatalogSearcher__object-catalog-search-result-root').first().trigger('click');
					await sleep(50);
					$('.ObjectCatalogSearcher__object-catalog-search-result-root').first().trigger('click');
					await checkIsNotRunningQuery();
					expect(catalogContext.lastQueryResult.total).to.lt(totalCount);
					expect(catalogContext.lastQueryResult.input.where.scenarios.length).to.eq(1);
				});

				it(`clear filter`, async function () {
					this.timeout(timeouts.query);
					const totalCount = catalogContext.lastQueryResult.total;
					searcher.getDOMNode().value = '';
					catalogContext.searchModel.reset();
					await sleep(50);
					$('.ObjectCatalogSearcher__object-catalog-search-result-root').first().trigger('click');
					await checkIsNotRunningQuery();
					expect(catalogContext.lastQueryResult.total).to.gt(totalCount);
				});
			});

		});

	}
}

testScheduler.register(new ObjectCatalogTests());