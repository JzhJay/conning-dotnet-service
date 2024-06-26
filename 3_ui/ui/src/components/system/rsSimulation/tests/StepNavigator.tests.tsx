import {container} from 'components/site/header/ErrorIndicator.css';
import {RSSimulationApplication} from 'components/system/rsSimulation/RSSimulationApplication';
import {BreadcrumbComponent, StepNavigationController} from 'components/system/rsSimulation/StepNavigator';
import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import {when} from 'mobx';
import * as React from 'react';
import {testScheduler, ITestable, expect, enzyme, simulateMouseEvent, enzymeUnmount, enzymeMount} from "test"
import {RSSimulation, site} from 'stores';
import {waitCondition} from 'utility';

const timeouts = {
	load: 60 * 1000,
	render: 10 * 1000,
	delete: 10 * 1000,
	test: 5 * 60 * 1000,
}

class StepNavigatorTests implements ITestable {

	describeTests = () => {
		let rsSimulationId: string;
		let rsSimulation: RSSimulation;
		let controller: StepNavigationController;
		let result;

		const contentBodySelector = ".RSSimulationApplication__content-body>div:first-child";

		describe(`Step Navigator Tests`, async function () {

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				rsSimulation = await rsSimulationKarmaTool.getRSSimulation(false);
				rsSimulationId = rsSimulation._id;

				result = enzymeMount(<RSSimulationApplication rsSimulation={rsSimulation} location={null} />)
			})

			after(() => enzymeUnmount(result));

			it("controller created", async function() {
				this.timeout(timeouts.test);

				await when(() => !!rsSimulation.stepNavigationController)
				controller = rsSimulation.stepNavigationController;
				expect(controller.displayType).to.eq("step-by-step");
				expect(controller.stepItems?.length).to.eq(7);
				expect(controller.stepItems.filter(item => item.navigatorOnly).length).to.eq(1);
				expect(controller.stepItems.filter(item => !item.navigatorOnly).length).to.eq(6);
			})

			it("page can render", async function() {
				this.timeout(timeouts.render);
				await waitCondition(() => $(contentBodySelector).length > 0);
				expect($(contentBodySelector).length).to.eq(1);

				let testSelector = ".StepNavigator__item-root";
				await waitCondition(() => $(testSelector).length > 0);
				expect($(testSelector).length).to.eq(controller.stepItems.filter(item => !item.navigatorOnly).length);

				testSelector = ".StepNavigator__nav-button";
				await waitCondition(() => $(testSelector).length > 0);
				expect($(testSelector).length).to.eq(1);
			})

			it("navigator can work", async function() {
				this.timeout(timeouts.test);
				expect($(contentBodySelector).text()).to.eq("Loading page content...");
				expect(controller.activeItem.title).to.eq("Data Selection");
				expect(controller.prevItem).to.eq(null);
				expect(controller.nextItem?.title).to.eq("Data Format");

				controller.setActiveByItem(controller.nextItem);
				expect($(contentBodySelector).text()).to.eq("Loading page content...");
				expect(controller.activeItem.title).to.eq("Data Format");
				expect(controller.prevItem?.title).to.eq("Data Selection");
				expect(controller.nextItem?.title).to.eq("Calibration");
			})

			it("using navigator button change page", async function() {
				this.timeout(timeouts.test);
				const navButtons = $('.StepNavigator__nav-button');
				expect(navButtons.length).to.eq(2);
				simulateMouseEvent(navButtons[1], 'click');

				expect($(contentBodySelector).text()).to.eq("Loading page content...");
				expect(controller.activeItem.title).to.eq("Calibration");
				expect(controller.prevItem?.title).to.eq("Data Format");
				expect(controller.nextItem?.title).to.eq("Execution");
			})

			it("using step-by-step component change page", async function() {
				this.timeout(timeouts.test);
				const navButtons = $('.StepNavigator__item-root');
				expect(navButtons.length).to.eq(controller.stepItems.filter(item => !item.navigatorOnly).length);
				simulateMouseEvent(navButtons.last()[0], 'click');

				expect($(contentBodySelector).text()).to.eq("Loading page content...");
				expect(controller.activeItem.title).to.eq("Data Selection");
				expect(controller.prevItem).to.eq(null);
				expect(controller.nextItem?.title).to.eq("Data Format");
			})

			it("using tree-navigator component change page", async function() {
				this.timeout(timeouts.render);
				controller.displayType = 'tree-navigator';
				let testSelector = '.bp3-tree-node';
				await waitCondition(() => $(testSelector).length > 0);
				expect($(testSelector).length).to.eq(6);

				const navButtons = $('.bp3-tree-node-content');
				const selectedNavButtons = $('.bp3-tree-node-selected');
				expect(navButtons.length).to.eq(controller.stepItems.filter(item => !item.navigatorOnly).length);
				expect(selectedNavButtons.length).to.eq(1);
				expect(selectedNavButtons.find('.bp3-tree-node-label').first().text()).to.eq('Data Selection');
				simulateMouseEvent(navButtons[1], 'click');

				expect($(contentBodySelector).text()).to.eq("Loading page content...");
				expect(controller.activeItem.title).to.eq("Data Format");
				expect(controller.prevItem?.title).to.eq("Data Selection");
				expect(controller.nextItem?.title).to.eq("Calibration");
			})

			it("switch sub-step on", async function() {
				this.timeout(timeouts.test);
				_.set(rsSimulation, "userInputs.calibrationNodes.enableCustomCalibration", true);
				_.set(rsSimulation, "userInputs.calibrationNodes.enableDirectParameterViewingAndEditing", true);
				await rsSimulation.getParametersUserInterface();
				await rsSimulation.recalibration.getRecalibration();

				await waitCondition( () => controller.stepItems.length != 7);
				await waitCondition( () => $('.bp3-tree-node').length != 6);

				expect($('.bp3-tree-node').length).to.eq(8);
				const navButtons = $('.bp3-tree-node-content');

				let testNav = navButtons.filter((i,elem) => $(elem).find('.bp3-tree-node-label').text() == 'Targets');
				expect(testNav.length).to.eq(1);
				testNav = navButtons.filter((i,elem) => $(elem).find('.bp3-tree-node-label').text() == 'Parameters');
				expect(testNav.length).to.eq(1);
			})

			it("can into sub-step", async function() {
				this.timeout(timeouts.test);
				const navButtons = $('.bp3-tree-node-content');
				let testNav = navButtons.filter((i,elem) => $(elem).find('.bp3-tree-node-label').text() == 'Parameters');
				expect(testNav.length).to.eq(1);
				expect(testNav.find('.bp3-icon').is('.bp3-tree-node-caret-closed')).to.eq(true);
				simulateMouseEvent(testNav[0], 'click');

				await waitCondition( () => $('.bp3-tree-node').length > 8);
				navButtons.filter((i,elem) => $(elem).find('.bp3-tree-node-label').text() == 'Parameters');
				expect(testNav.length).to.eq(1);
				expect(testNav.find('.bp3-icon').is('.bp3-tree-node-caret-open')).to.eq(true);

				expect($('.bp3-tree-node-list').length).to.gt(1);
				expect($(contentBodySelector).text()).to.eq("Loading page content...");
			})

			it("step status sync on step-by-step mode", async function() {
				this.timeout(timeouts.test);

				let currentNumOfLevel = $('.bp3-tree-node-selected').length;

				controller.displayType = 'step-by-step';
				await waitCondition( () => $('.StepNavigator__step-item-list-root').length > 0);

				expect($('.StepNavigator__active').length).to.eq(currentNumOfLevel);
				expect($(contentBodySelector).text()).to.eq("Loading page content...");
			})

			it("navigator can work (switch between sub items)", async function() {
				this.timeout(timeouts.test);
				expect(controller.activeItem.itemPathString).to.eq("allParameters.global");
				const nextPath = controller.nextItem.itemPathString;

				controller.setActiveByItem(controller.nextItem);
				expect($(contentBodySelector).text()).to.eq("Loading page content...");
				expect(controller.activeItem.itemPathString).to.eq(nextPath);
			});

			it("append breadcrumb component", async function() {
				this.timeout(timeouts.test);
				let currentNumOfLevel = $('.StepNavigator__active').length;

				result = enzymeMount(<BreadcrumbComponent controller={controller} />);
				await waitCondition( () => $('.StepNavigator__breadcrumb').length > 0);

				expect($('.StepNavigator__breadcrumb').children('.bp3-popover-wrapper').length).to.eq(currentNumOfLevel);
			});

			it("can switch page in breadcrumb component", async function() {
				this.timeout(timeouts.test);
				simulateMouseEvent($('.bp3-popover-target')[0], 'click');
				await waitCondition( () => $('.bp3-menu-item').length > 0);

				const menuItems = $('.bp3-menu-item');
				expect(menuItems.length).to.eq(controller.stepItems.filter(item => !item.navigatorOnly).length);
				expect(menuItems.first().find('.bp3-fill').text().trim()).to.eq("Data Selection");

				simulateMouseEvent(menuItems[0], 'click');
				expect(controller.activeItem.title).to.eq("Data Selection");
				expect($('.StepNavigator__breadcrumb').children('.bp3-popover-wrapper').length).to.eq(1);

			});

		})

	}
}

testScheduler.register(new StepNavigatorTests());
