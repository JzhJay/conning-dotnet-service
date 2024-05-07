import {IOApplicationBarItems} from 'components/system/IO/IOApplicationBarItems';
import * as React from 'react';
import {ApolloProvider} from '@apollo/client';
import {testScheduler, ITestable, expect, sleep, enzyme, sendNativeEventToElement, enzymeMount, enzymeUnmount} from "test"
import {api, user, mobx, xhr, omdb, JuliaIO, ioTestData, site, apolloStore, userFileStore} from 'stores';
import { ioStore as store, IO } from 'stores/io';
import {reactionToPromise, waitCondition} from '../../../../../utility';
import {IOComponent} from '../../IOComponent';
import * as css from 'components/system/inputSpecification/InputSpecificationComponent.css';
import * as interestRatesCss from './internal/InterestRates.css'
import {IOInputSpecificationComponent} from './IOInputSpecificationComponent';

const timeouts = {
	load: 120 * 1000,
	render: 10 * 1000,
	delete: 10 * 1000
}

class IOInputTests implements ITestable {

	describeTests = () => {
		let ioId: string, connectionId: string;
		let io: IO;
		let result;

		describe(`IO Input Component Tests`, async function () {
			before('', async function () {
				this.timeout(timeouts.load);

				let result = await xhr.putUntilSuccess<{ioId: string, connectionId: string}>(store.apiRoute + "?mock=true", { data: { name: "Mock IO", "dfioPath": "test" } }, "io_id");
				({ioId, connectionId} = result);
				//ioId = "5f283612afa3ee53d412dd32";
				//connectionId = "6a47f562-2b5b-4e4e-9d71-5759c63689b1";

				user.settings.searchers.simulation.view = 'card';
				io = await store.loadDescriptor(ioId);
				io.connectionID = connectionId;
				await io.loadInputState();
				await io.book.addPage();
			})

			after(() => enzymeUnmount(result));

			describe(`Custom IO Inputs`, function () {

				describe(`Data Sources`, function () {

					before('can render', async function () {
						this.timeout(timeouts.render)
						await mount();
					})

					/*
					after(async function (done) {
						this.timeout(timeouts.delete);
						await io.pages[0].deleteView(0);
					})*/

					async function mount() {

						const page = io.pages[0];
						await page.insertView("dataSources");
						const view = page.selectedViews[0];

						result = enzymeMount(<ApolloProvider client={apolloStore.client}> <IOInputSpecificationComponent
							io={io}
							view={page.selectedViews[0]}
							page={page}
							userOptions={page.getViewUserOptions(view.id)}/></ApolloProvider>)
					}

					const verifyLoad = () => {
						expect(result).to.not.eq(null);
						result.update();

						// verify fields
						let titles = result.find(`.${css.title}`);
						expect(titles.filterWhere(n => n.html().includes("Asset Returns"))).to.have.lengthOf(1);
						expect(titles.filterWhere(n => n.html().includes("Time Horizon"))).to.have.length.of.at.least(1);
					}


					it("can load", function() {
						verifyLoad();
					})

					it("can modify and persist", async function () {
						this.timeout(10 * 1000);

						const waitSiteNotBusy = async () => {
							await sleep(10);
							site.busy && await reactionToPromise(() => site.busy , false);
						};

						const simulationField = () => {
							result.update();
							const tag = result.find(`.${css.control} span.bp3-tag`);
							expect(tag.length).to.eq(1);
							return tag;
						};

						const timeHorizonField = () => {
							result.update();
							return result.find(`.${css.focusable}`).childAt(0).childAt(0).children().filterWhere(n => {
								const title = n.find(`.${css.title}`);
								return title.length && title.html().includes("Time Horizon");
							}).at(0);
						}

						const defaultTitle = simulationField().text();

						// modify simulation fields
						simulationField().simulate("click");
						await waitCondition(() => {
							return $(".bp3-portal .bp3-card").length > 0;
						});

						const choiceCard = $(".bp3-portal .bp3-card .header").first();
						const choose = choiceCard.find('.SmartCard__is-title').text();
						sendNativeEventToElement(choiceCard.find("svg").get(0), 'click');

						const save = $(".bp3-portal .bp3-button.bp3-intent-primary").get(0);
						sendNativeEventToElement(save, 'click');
						await waitSiteNotBusy();
						await waitCondition(() => simulationField().text() != defaultTitle, null, 3000);
						expect(simulationField().text()).to.eq(choose);

						// modify timeHorizon fields
						timeHorizonField().find("." + css.listItem).at(1).find("input").at(0).simulate("change");
						await waitSiteNotBusy();

						enzymeUnmount(result);
						result = null;
						// remove current view, it will add a new view when mounting.
						await io.pages[0].deleteView(0);
						await waitSiteNotBusy();

						await mount();
						verifyLoad();

						// validate by remounting and verifying changes are still present.
						await waitCondition(() => simulationField().text() != defaultTitle, null, 3000);
						expect(simulationField().text()).to.eq(choose);
						expect(timeHorizonField().find("." + css.listItem).at(1).find("input").at(0).getDOMNode().checked).to.be.true;

						// Must wait till the request is complete. Attempting to run other tests before a simulation switch is complete will blow away newly inserted views.
						await waitSiteNotBusy();
					})
				})

				describe("IO Input tooltip when hover title", function () {

					before('can render', async function () {
						this.timeout(timeouts.render)
						await mount();
					})

					/*
					after(async function (done) {
						this.timeout(timeouts.delete);
						await io.pages[0].deleteView(0);
					})*/

					async function mount() {

						const page = io.pages[0];
						await page.insertView("dataSources");
						const view = page.selectedViews[0];

						result = enzymeMount(<IOInputSpecificationComponent
							io={io}
							view={page.selectedViews[0]}
							page={page}
							userOptions={page.getViewUserOptions(view.id)}/>)
					}

					it("can load", function() {
						// verify fields
						let titles = result.find(`.${css.title}`);

						expect(titles.filterWhere(n => n.html().includes("Asset Returns"))).to.have.lengthOf(1);
						expect(titles.filterWhere(n => n.html().includes("Time Horizon"))).to.have.length.of.at.least(1);

					})

					it("test hover on item, it can display tooltips", async function () {
						result.update();
						const tooltipDescriptions = result.find(`.${css.tooltipDescription}`).filterWhere( n => {
							let t = n.find('.bp3-popover-target');
							if (!t.length) return false;
							t = t.first();
							if (t.getDOMNode().getAttribute('countMark')) return false;
							t.getDOMNode().setAttribute('countMark', 'Y' );
							return true;
						});
						expect(tooltipDescriptions.length).to.eq(4);

						tooltipDescriptions.map( n => {
							let target = n.find('.bp3-popover-target');
							target.simulate('mouseenter');
							waitCondition( () => {
								result.update();
								let tooltip = result.find('.bp3-tooltip').first();
								if (tooltip.length == 1) {
									tooltip.simulate('mouseleave');
									target.simulate('mouseleave');
									return true;
								} else {
									return false;
								}
							}, 100 , 2000);
						})
					})
				})
/*
				describe(`Interest Rates`, function () {
					before('can render', async function () {
						this.timeout(timeouts.render);
						await mount();
					})

					async function mount() {

						const page = io.pages[0];
						await page.insertView("interestRates");
						const view = page.selectedViews.filter(view => view.name == "interestRates")[0];

						result && result.unmount();
						result = enzyme.mount(<InputSpecificationComponent
							io={io}
							view={view}
							page={page}
							userOptions={page.getViewUserOptions(view.id)}
							specification={inputSpecification(view.name, io.getInputOptions())}/>, {attachTo: container.get(0)})
					}

					it("can load", function() {
						let titles = result.find(`.${css.title}`);

						expect(titles.filterWhere(n => n.html().includes("Risk Free Rate"))).to.have.lengthOf(1);
						expect(titles.filterWhere(n => n.html().includes("Hurdle Rate"))).to.have.lengthOf(1);
						expect(titles.filterWhere(n => n.html().includes("Borrowing Rate"))).to.have.lengthOf(1);

					})

					it("can modify and persist", async function() {
						this.timeout(30 * 1000);

						// modify fields
						const additiveSpreads = () => result.find(`.${interestRatesCss.additive} input`);
						additiveSpreads().forEach((spread, i) => {
							spread.instance().value = i;
							spread.simulate('blur');
						})

						const multiplicativeSpreads = () => result.find(`.${interestRatesCss.multiplicative} input`);
						multiplicativeSpreads().forEach((spread, i) => {
							spread.instance().value = 3 + i;
							spread.simulate('blur');
						})

						await mount();
						additiveSpreads().forEach((spread, i) => {
							expect(spread.instance().value).to.equal(i.toString());
						})

						multiplicativeSpreads().forEach((spread, i) => {
							expect(spread.instance().value).to.equal((3 + i).toString());
						})
					})
				})*/
			})


			describe(`Generic IO Inputs`, function () {

				before('can render', async function () {
					this.timeout(timeouts.render);
					await io.sendOptimizationInputsUpdate({optimizationTarget: {scope: "presentValueOfDistributableEarnings"}})
					await mount();
				})

				async function mount() {
					const page = io.pages[0];
					await page.insertView("assetValuesAndTrading");
					const view = page.selectedViews.filter(view => view.name == "assetValuesAndTrading")[0];

					result = enzymeMount(<IOInputSpecificationComponent
						io={io}
						view={view}
						page={page}
						userOptions={page.getViewUserOptions(view.id)}/>)
				}

				it("can load", function() {
					let titles = result.find("." + css.title);

					io.inputOptions["assetValuesAndTrading"].options.forEach(option => {
						if (option.applicable)
							expect(titles.filterWhere(n => n.html().includes(option.title))).to.have.length.of.at.least(1);
					})
				})

				// it("can modify and persist", async function () {
				// 	this.timeout(30 * 1000);
				// 	let titles = () => result.find(`.${css.title}`);
				// 	await waitCondition(() => titles().filterWhere(n => n.html().includes("Starting Market Values")).length > 0)

				// 	const startingMarketValues = () => titles().filterWhere(n => n.html().includes("Starting Market Values")).at(0);
				// 	startingMarketValues().parents().at(0).find("input").at(0).simulate("change");

				// 	const multiplier = () => titles().filterWhere(n => n.html().includes("Multiplier")).at(0).parents().at(0).find("input");
				// 	multiplier().instance().value = 25;
				// 	multiplier().simulate('blur');

				// 	const assetAllocationTolerances = () => titles().filterWhere(n => n.html().includes("Asset Allocation Tolerances")).at(0);
				// 	assetAllocationTolerances().parents().at(0).find(".bp3-popover-target").simulate("click");

				// 	await waitCondition(() => {
				// 		result.update();
				// 		return result.find(".bp3-menu-item").length > 0
				// 	});

				// 	const choice = result.find(".bp3-menu-item").filterWhere(n => n.html().includes("None")).at(0);
				// 	choice.simulate("click");

				// 	await mount();

				// 	const toleranceValue = () => assetAllocationTolerances().parents().at(0).find("span").filterWhere(n => n.html().includes("None"));
				// 	await waitCondition(() => toleranceValue().length > 0);
				// 	expect(toleranceValue()).to.have.length.greaterThan(1);
				// 	expect(startingMarketValues().parents().at(0).find("input").at(0).getDOMNode().checked).to.be.true;
				// 	expect(multiplier().instance().value).to.equal("25");

				// })
			})
		})
	}
}

testScheduler.register(new IOInputTests());
