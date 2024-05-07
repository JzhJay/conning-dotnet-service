require("lib/semantic/dist/semantic.min.js");
require("lib/Iconic/js/iconic.min.js");

//require("lib/semantic/dist/semantic.css");
//require("ui/fonts/font-awesome/css/font-awesome.min.css");;

import {ServerStatus} from 'components/system/ExpireDialog/ExpireDialog';
import {IOComponent} from 'components/system/IO/IOComponent';
import * as css from 'components/system/Book/BookComponent.css';
import {IOApplicationBarItems} from 'components/system/IO/IOApplicationBarItems';
import {IO, IOStatus, ioTestData} from "stores/io";
import {sleep, waitCondition} from 'utility/utility';
import {IOContextMenu} from "../IOContextMenu";
import {testScheduler, ITestable, simulateMouseEvent, enzymeMount, enzymeUnmount, get$Container} from "test"

const enzyme: any = require('enzyme');
const expect: any = chai.expect;
const contextMenuItemsCount = 19;

class IOComponentTest implements ITestable {
    describeTests = () => {
        describe("IOComponent Tests", function () {
            this.timeout(180 * 1000);
            let result = null;
            let io: IO = null;

            before(async function() {
                io = await ioTestData.loadTestData();
	            result = enzymeMount(<IOContextMenu io={io}> </IOContextMenu>);
            })

	        after(() => enzymeUnmount(result));

            const getEnzymeContainer = (update: boolean = false) => {
                if (update)
                    result.update(); // Enzyme 3 doesn't correctly update the render tree after certain operation, so lets force it to update.
                return result
            };

            it("should render", async function () {
	            await waitCondition( ()=> {
		            result.update();
		            return result.find("li").length > 1;
	            } , 300 , 2000);
	            expect(result.find("li").length).to.equal(contextMenuItemsCount);
            })

            it("should display available pages when hover over pages menu and the sub menu item", async function () {
                let currentMenuPopOverTarget = result.find(".bp3-popover-target");
                let currentBpMenu = result.find(".bp3-menu");
	            expect(currentBpMenu.length).to.equal(1);
                expect(get$Container().find(".bp3-menu").length).to.equal(1);
            })
        })
    }
}
testScheduler.register(new IOComponentTest());

class IOComponentToolBarCtrlTest implements ITestable {
	describeTests = () => {
		describe("IOComponent test toolbar visible control on navbar", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;

			before(async function() {
				io = await ioTestData.loadTestData();
				result = enzymeMount(<IOApplicationBarItems io={io}> </IOApplicationBarItems>);
			})

			after(() => enzymeUnmount(result));

			const awaitMenu = async(menuCnt, interval=200, timeout=3000) => {
				let pagesBpMenu = null;
				await waitCondition(() => {
					result.update();
					pagesBpMenu = result.find('.bp3-menu');
					return pagesBpMenu.length == menuCnt;
				}, interval, timeout).catch(()=>{
					expect(pagesBpMenu.length).to.eq(menuCnt);
				});
			}

			it("should render", async function () {
				await waitCondition( ()=> {
					result.update();
					return result.find('.bp3-popover-target').length > 0;
				} , 300 , 2000);
				result.update();
			});

			it("open menus and check items mutually exclusive", async function () {
				const pageBtn =  result.find('.bp3-popover-target').first();
				pageBtn.simulate('click');
				await awaitMenu(1);

				let title = result.find('.bp3-menu-header').filterWhere(n => (n.text().indexOf('Toolbars') >= 0));
				expect(title.length).to.eq(1);
				title = $(title.getDOMNode());

				const ctrls = [
					title.next(),
					title.next().next(),
					title.next().next().next()
				]

				ctrls.forEach((elem) => expect($(elem).is('.bp3-switch')).to.eq(true))

				ctrls.forEach( async(elem) => {
					$(elem).click();
					await sleep(100);
					ctrls.forEach((checkelem) => expect($(checkelem).find('input').prop('checked')).to.eq(elem == checkelem));
				})

				pageBtn.simulate('click');
				await awaitMenu(0);
			});
		})
	}
}
testScheduler.register(new IOComponentToolBarCtrlTest());


class IOComponentToolBarTest implements ITestable {
	describeTests = () => {
		describe("IOComponent toolbar visible on hover Tests", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;

			before(async function() {
				io = await ioTestData.loadTestData();

				io.pages[0].views = io.pages[0].views.splice(0, io.pages[0].views.length-1 );

				console.log("requiredOptimization: ", io.requiredOptimization);
				/*
				if (io.requiredOptimization != "none") {
					console.log("Reset requiredOptimization to none");
					await io.optimize(false, true);
				}*/

				result = enzymeMount(<IOComponent investmentOptimization={io} />);
			})

			after(() => enzymeUnmount(result));

			it("should render", async function () {
				await waitCondition( ()=> {
					result.update();
					return result.find("div.bp3-navbar").length > 0;
				} , 300 , 15000);
			})

			function getView(){
				return $(`div.bp3-navbar`)
					.filter((i, elem) =>  $(elem).parents(`div.${css.view}`).length )
					.last()
					.parents(`div.${css.view}`)
					.first();
			}

			it("should display Toolbar when hover over Toolbar space", async function () {

				const $view = getView();
				expect($view.length).to.equal(1, 'expected has view with toolbar');

				$view.removeClass(css.hideToolbars).addClass(css.hoverToolbars);
				await sleep(1000);
				$view.addClass(css.popoverOpened);

				const $navBar = $view.find('div.bp3-navbar');
				expect(getComputedStyle($navBar[0]).getPropertyValue('opacity')).to.equal('1');

				$view.removeClass(css.popoverOpened);
			})

			it("when call a popover, toolbar will keep visible", async function () {
				this.timeout(10*1000);

				const $view = getView();
				expect($view.length).to.equal(1, 'expected has view with toolbar');

				const $navBar = $view.find('div.bp3-navbar');

				const $popoverBtn = $navBar.find('.bp3-button');

				simulateMouseEvent($popoverBtn[0], 'click');

				await waitCondition(
					() => {
						return parseInt( getComputedStyle($navBar[0]).getPropertyValue('opacity')) == 1;
					}, 100, 4000
				);

				simulateMouseEvent($popoverBtn[0], 'click');

				await waitCondition(
					() => {
						return parseInt(  getComputedStyle($navBar[0]).getPropertyValue('opacity')) == 0;
					}, 100, 4000
				);
			})

		})
	}
}
testScheduler.register(new IOComponentToolBarTest());

/*
class IOComponentPageSwitchShortcutTest implements ITestable {
	describeTests = () => {
		describe("IOComponent test switch page using keyboard short cut", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;
			let container = null;

			before(async function() {
				io = await ioTestData.loadTestData();
				await io.addPage();
				await io.addPage();

				get$Container().remove();
				container = $(`<div id='testContainer' class="conning app ui" style="display:flex; width:1000px; height:1000px"></div>`);
				$(document.body).append(container);

				return new Promise((accept, reject) => {
					//io.currentPage.showViewToolbars = false;
					result = enzyme.mount(<NavBarItems io={io}> </NavBarItems>, { attachTo: container.get(0) });
					accept(result);
				});
			})


			after(function (done) {
				get$Container().remove();
				done();
			})

			it("should render", async function () {
				await waitCondition( ()=> {
					result.update();
					const pageBtn =  result.find('.NavBarItems__page-number-button').first();
					return pageBtn.length == 1 && pageBtn.find('.bp3-button-text').first().text() == '3';
				} , 300 , 1000);
			});

			it("test keyboard short cut", async function () {
				result.update();
				const pagetext =  result.find('.NavBarItems__navigation .bp3-button-text').first();

				let url = location.href;

				expect(pagetext.text()).to.equal('3');
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 37, altKey: true } as any) );
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 37, metaKey: true } as any) );
				expect(pagetext.text()).to.equal('2');
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 37, altKey: true } as any) );
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 37, metaKey: true } as any) );
				expect(pagetext.text()).to.equal('1');
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 37, altKey: true } as any) );
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 37, metaKey: true } as any) );
				expect(pagetext.text()).to.equal('1');

				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 39, altKey: true } as any) );
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 39, metaKey: true } as any) );
				expect(pagetext.text()).to.equal('2');
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 39, altKey: true } as any) );
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 39, metaKey: true } as any) );
				expect(pagetext.text()).to.equal('3');
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 39, altKey: true } as any) );
				document.dispatchEvent( new KeyboardEvent("keydown", { keyCode: 39, metaKey: true } as any) );
				expect(pagetext.text()).to.equal('3');

				window.history.pushState(null, null, url);


			});

		})
	}
}
testScheduler.register(new IOComponentPageSwitchShortcutTest());
*/

class IOComponentAddRemovePageTest implements ITestable {
	describeTests = () => {
		describe("IOComponent add / remove page Tests", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;

			before(async function() {
				io = await ioTestData.loadTestData();
				result = enzymeMount(<IOContextMenu io={io} />);
			})

			after(() => enzymeUnmount(result));

			const getEnzymeContainer = (update: boolean = false) => {
				if (update)
					result.update(); // Enzyme 3 doesn't correctly update the render tree after certain operation, so lets force it to update.
				return result
			};

			it("should render", async function () {
				await waitCondition( ()=> {
					result.update();
					return result.find("li").length > 1;
				} , 300 , 5000);
				expect(result.find("li").length).to.equal(contextMenuItemsCount);
			})

			it("should add page and remove page function works", async function () {

				const awaitMenu = async(menuCnt) => {
					let pagesBpMenu = null;
					await waitCondition(() => {
						result.update();
						pagesBpMenu = result.find('.bp3-menu');
						return pagesBpMenu.length == menuCnt;
					}, 200, 3000).catch((e)=>{
						throw e;
					});
				}

				// do - addPage
				let bookMenu = result.find(".bp3-popover-target").filterWhere(n => n.text().indexOf('Book') >= 0).at(0);
				bookMenu.simulate("mouseenter");
				await awaitMenu(2);

				const sortableItemCount = result.find('.SortableBookMenu__sortable-menu-item').length;
				result.find(".bp3-menu-item").filterWhere(n => n.text().indexOf('Insert Page') >= 0).at(0).simulate("click");

				bookMenu.simulate('mouseleave');
				await awaitMenu(1);

				bookMenu.simulate("mouseenter");
				await awaitMenu(2);
				expect(result.find('.SortableBookMenu__sortable-menu-item').length).to.eq(sortableItemCount+1);

				const page = result.find('.SortableBookMenu__sortable-menu-item').last();
				page.simulate("mouseenter");
				page.find('.SortableBookMenu__sortable-menu-item-right svg').simulate("click");
				bookMenu.simulate('mouseleave');
				await awaitMenu(1);

				bookMenu.simulate("mouseenter");
				await awaitMenu(2);
				expect(result.find('.SortableBookMenu__sortable-menu-item').length).to.eq(sortableItemCount);

				bookMenu.simulate('mouseleave');
				await awaitMenu(1);
			})
		})
	}
}
testScheduler.register(new IOComponentAddRemovePageTest());


class IOComponentAddRemovePage2Test implements ITestable {
	describeTests = () => {
		describe("IOComponent remove page on pageNav dropdown Tests", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;

			before(async function() {
				io = await ioTestData.loadTestData();
				await io.book.addPage();
				await io.book.addPage();

				result = enzymeMount(<IOApplicationBarItems io={io} />);
			})

			after(() => enzymeUnmount(result));

			const awaitMenu = async(menuCnt, interval=200, timeout=3000) => {
				let pagesBpMenu = null;
				await waitCondition(() => {
					result.update();
					pagesBpMenu = result.find('.bp3-menu');
					return pagesBpMenu.length == menuCnt;
				}, interval, timeout).catch(()=>{
					expect(pagesBpMenu.length).to.eq(menuCnt);
				});
			}

			it("should render", async function () {
				await waitCondition( ()=> {
					result.update();
					const pageBtn =  result.find('.ArrowNavigation__page-number-button').first();
					return pageBtn.length == 1 && pageBtn.find('.bp3-button-text').first().text() == '3';
				} , 300 , 3000);
			});

			it("should insert amd navigate page function on page dropdown works", async function () {
				result.update();
				const pageDropDown = result.find('.bp3-popover-target').filterWhere((n) => !!n.find('.ArrowNavigation__page-number-button').length);
				pageDropDown.simulate('click');
				await awaitMenu(1);

				let nowPageCount = $('.SortableBookMenu__sortable-menu-item').length;
				result.find('.bp3-menu-item').filterWhere(n => n.text().indexOf('Insert Page') >= 0).first().simulate('click');
				await awaitMenu(0);

				pageDropDown.simulate('click');
				await awaitMenu(1);
				expect($('.SortableBookMenu__sortable-menu-item').length).to.eq(nowPageCount+1);
				expect(pageDropDown.find('.bp3-button-text').text()).to.eq(''+(nowPageCount+1));
				pageDropDown.simulate('click');
				await awaitMenu(0);
			});

			it("should remove page function on page navigation dropdown works", async function () {

				result.update();
				const pageDropDown = result.find('.bp3-popover-target').filterWhere((n) => !!n.find('.ArrowNavigation__page-number-button').length);
				pageDropDown.simulate('click');
				await awaitMenu(1);

				const pages =  result.find('.SortableBookMenu__sortable-menu-item');
				let nowPageCount = pages.length;

				pages.last().find('.SortableBookMenu__sortable-menu-item-right svg').simulate('click');
				await waitCondition( ()=> {
					result.update();
					return $('.SortableBookMenu__sortable-menu-item').length == nowPageCount - 1;
				} , 100 , 1000);

				expect($('.SortableBookMenu__sortable-menu-item').length).to.eq(nowPageCount-1);
				expect(pageDropDown.find('.bp3-button-text').text()).to.eq(''+(nowPageCount-1));
				pageDropDown.simulate('click');
				await awaitMenu(0);

			});
		})
	}
}
testScheduler.register(new IOComponentAddRemovePage2Test());

class IOComponentAddRemoveViewTest implements ITestable {
	describeTests = () => {
		describe("IOComponent add / remove view on page menu dropdown Tests", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;

			before(async function() {
				io = await ioTestData.loadTestData();
				await io.book.addPage();
				result = enzymeMount(<IOApplicationBarItems io={io} />);
			})

			after(() => enzymeUnmount(result));

			const awaitMenu = async(menuCnt, interval=200, timeout=3000) => {
				let pagesBpMenu = null;
				await waitCondition(() => {
					result.update();
					pagesBpMenu = result.find('.bp3-menu');
					return pagesBpMenu.length == menuCnt;
				}, interval, timeout).catch(()=>{
					expect(pagesBpMenu.length).to.eq(menuCnt);
				});
			}

			it("should render", async function () {
				let pageBtn = null;
				await waitCondition( ()=> {
					result.update();
					pageBtn =  result.find('.ArrowNavigation__page-number-button').first();
					return pageBtn.length == 1;
				} , 300 , 3000);
				expect(pageBtn.find('.bp3-button-text').first().text()).to.eq('2');
			});

			it("should add view function on page menu dropdown works", async function () {

				result.update();
				const pageDropDown =  result.find('.bp3-popover-target').first();
				pageDropDown.simulate('click');

				await awaitMenu(1);
				let nowViewCount = $('.SortableBookMenu__sortable-menu-item').length;
				result.find('.bp3-popover-target').filterWhere(n => n.text().indexOf('Insert View') >= 0).first().simulate('mouseenter')

				await awaitMenu(2);
				let viewBpMenu = result.find('.bp3-menu').last();
				viewBpMenu.find('.bp3-menu-item').first().simulate('click');

				pageDropDown.simulate('click');
				await awaitMenu(0);

				pageDropDown.simulate('click');
				await awaitMenu(1);
				expect($('.SortableBookMenu__sortable-menu-item').length).to.eq(nowViewCount + 1);

				pageDropDown.simulate('click');
				await awaitMenu(0);

			});


			it("should remove view function on page menu dropdown works", async function () {
				result.update();
				const pageDropDown =  result.find('.bp3-popover-target').first();
				pageDropDown.simulate('click');
				await awaitMenu(1);
				const views =  result.find('.SortableBookMenu__sortable-menu-item');
				let nowViewCount = views.length;

				views.last().find('.SortableBookMenu__sortable-menu-item-right svg').simulate('click');
				await awaitMenu(1);

				expect($('.SortableBookMenu__sortable-menu-item').length).to.eq(nowViewCount-1);

				pageDropDown.simulate('click');
				await awaitMenu(0);
			});
		})
	}
}
testScheduler.register(new IOComponentAddRemoveViewTest());

class IOComponentRestartSessionTest implements ITestable {
	describeTests = () => {
		describe("IOComponent Restart session Tests", function () {
			const startupTime = 180 * 1000;
			let result = null;
			let io: IO = null;

			before(async function() {
				this.timeout(startupTime);
				io = await ioTestData.loadTestData();
				await io.loadExistingIO();

				result = enzymeMount(<IOContextMenu io={io}> </IOContextMenu>);
			})

			after(() => enzymeUnmount(result));

			it("should render", async function () {
				await waitCondition( ()=> {
					result.update();
					return result.find("li").length > 1;
				} , 300 , 5000);
				expect(result.find("li").length).to.equal(contextMenuItemsCount);
			})

			const get$MenuItem = () => {
				let menuItem =  get$Container().find('li .bp3-menu-item')
					.filter((i, elem) => $(elem).find('.bp3-fill').text() == 'Restart Session');
				expect(menuItem.length).to.gt(0);
				return menuItem.first();
			}

			let beforeStatus;
			it("should ready", async function () {
				this.timeout(startupTime);
				await waitCondition( ()=> {
					return !get$MenuItem().is('.bp3-disabled');
				} , 1000 , startupTime - 1000);
				expect(get$MenuItem().is('.bp3-disabled')).to.eq(false);
				beforeStatus = io.serverStatus;
			})


			it("should restart session function works", async function () {
				simulateMouseEvent(get$MenuItem()[0], 'click');
				await waitCondition( ()=> {
					return !_.eq(io.serverStatus, beforeStatus);
				});
				expect(io.serverStatus).to.eq(ServerStatus.closed);
				expect(get$MenuItem().is('.bp3-disabled')).to.eq(true);
			})

			it("should session restore", async function () {
				this.timeout(startupTime);
				await waitCondition( ()=> {
					return !get$MenuItem().is('.bp3-disabled');
				} , 1000 , startupTime - 1000);
				expect(io.serverStatus).to.eq(beforeStatus);
				expect(get$MenuItem().is('.bp3-disabled')).to.eq(false);
			})
		})
	}
}
testScheduler.register(new IOComponentRestartSessionTest());
