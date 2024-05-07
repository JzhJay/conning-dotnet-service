
require("lib/semantic/dist/semantic.min.js");
require("lib/Iconic/js/iconic.min.js");

//require("lib/semantic/dist/semantic.css");
//require("ui/fonts/font-awesome/css/font-awesome.min.css");;

import { repositoryStore, Repository } from "stores";
import {RepositoryComponent} from "../RepositoryComponent";
import {autorun, observable, runInAction} from 'mobx';
import {testScheduler, ITestable, JULIA_TAG, sendNativeEventToElement, sleep, enzymeMount, get$Container, enzymeUnmount} from "test";
import {waitCondition} from "utility/utility";

const enzyme: any = require('enzyme');
const expect: any = chai.expect;

class RepositoryComponentTest implements ITestable {
	describeTests = () => {
		describe("Repository Component Tests", function () {
			this.timeout(180 * 1000);
			let result = null;
			let repo: Repository = null;
			let location = observable({query: {page: 1}})
			before(async function() {
				repo = await repositoryStore.createTestRepository();

				return new Promise((accept, reject) => {
					result = enzymeMount(<RepositoryComponent repository={repo} location={location}/>);

					window.setTimeout(() => {
						accept(result);
					}, 5000)
				});
			})

			after(() => enzymeUnmount(result));

			const getEnzymeContainer = (update: boolean = false) => {
				if (update)
					result.update(); // Enzyme 3 doesn't correctly update the render tree after certain operation, so lets force it to update.
				return result
			};

			const waitContextMenu = () => waitCondition(() => $('.bp3-menu').length > 0);

			const changePage = async (page: number) => {
				runInAction(() => location.query.page = page)
				await waitCondition(()=> {return true;} , 100);
			};

			const mouseDownAndUp = target => {
				sendNativeEventToElement(target, "mousedown");
				sendNativeEventToElement(target, "mouseup");
			}


			it("should show/hide time aggregators based on input/output frequencies", async function () {
				await changePage(2);
				expect(get$Container().find(".wj-colheaders").children().first().children().length).to.equal(6);
				await changePage(1);
				mouseDownAndUp($('.form-group').eq(2).find('.wj-btn').get(0));
				//sendNativeEventToElement($('.form-group').eq(2).find('.wj-btn').get(0), "click");
				sendNativeEventToElement($('.wj-dropdown-panel').children().get(2), "click");
				await sleep(100); //wait for RepoTool to return
				await changePage(2);
				expect(get$Container().find(".wj-colheaders").children().first().children().length).to.equal(7);
			})

			it("should show/hide axis coordinates based on single axis input", async function () {
				expect(get$Container().find(".wj-colheaders").children().first().children().length).to.equal(7);
				await changePage(1);
				sendNativeEventToElement($('.form-group').eq(7).find('input').get(0), "click");
				await sleep(100); //wait for RepoTool to return
				await changePage(2);
				expect(get$Container().find(".wj-colheaders").children().first().children().length).to.equal(5);
			})

			it("should be able to insert fields", async function () {
				// Add from header
				sendNativeEventToElement(get$Container().find(".wj-colheaders").children().first().children().get(2), "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.bp3-menu .bp3-menu-item').get(0), "click");
				await sleep(100);
				expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(2);
				//insert before
				sendNativeEventToElement(get$Container().find(".wj-cells").eq(0).children().eq(1).children().get(0), "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.bp3-menu .bp3-menu-item').get(0), "click");
				await sleep(100);
				expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(3);
				//insert after
				sendNativeEventToElement(get$Container().find(".wj-cells").eq(0).children().eq(1).children().get(0), "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.bp3-menu .bp3-menu-item').get(1), "click");
				await sleep(100);
				expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(4);
			})

			it("should be able to delete fields", async function () {
				sendNativeEventToElement(get$Container().find(".wj-cells").eq(0).children().eq(1).children().get(0), "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.bp3-menu .bp3-menu-item').get(2), "click");
				await sleep(100);
				expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(3);
			})

			it("should be able to hide/unhide fields", async function () {
				// sendNativeEventToElement(get$Container().find(".wj-cells").eq(0).children().eq(1).children().eq(0).find('input').get(0), "click");
				// await sleep(100);
				// expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(2);

				sendNativeEventToElement(get$Container().find(".wj-colheaders").children().first().children().get(0), "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.bp3-menu .bp3-menu-item').get(0), "click");
				await sleep(100);
				expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(1);

				sendNativeEventToElement(get$Container().find(".wj-colheaders").children().first().children().get(0), "contextmenu");
				await waitContextMenu();
				sendNativeEventToElement($('.bp3-menu .bp3-switch').get(0), "click");
				await sleep(100);
				expect(get$Container().find(".wj-cells").eq(0).children().length).to.equal(3);
			})


		})
	}
}
testScheduler.register(new RepositoryComponentTest());
