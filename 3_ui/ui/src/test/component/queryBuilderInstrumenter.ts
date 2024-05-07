import {AccordionComponent} from '../../components/system/query-tool/query-builder/SuperPanel/Accordion/AccordionComponent';
import {AccordionHeader} from '../../components/system/query-tool/query-builder/SuperPanel/Accordion/AccordionHeader';
import {sleep, sendNativeEventToElement} from "test"
import { waitCondition } from "../../utility";
import { reactionToPromise, waitAction } from "../../utility/utility";
import { site } from "../../stores/site/SiteStore";

export class QueryBuilderInstrumenter {
	constructor(public queryBuilderWrapper, public responseDelay){

	}

	getAccordionComponentByLabel = (label) => {
		const accordionComponents = this.queryBuilderWrapper.find('.SuperPanelComponent__superPanel[data-part="variables"]').find('.AccordionComponent__accordion');

		for (let i = 0; i < accordionComponents.length; i++)
		{
			if (accordionComponents.at(i).find('.AccordionComponent__header-text').text().trim().indexOf(label) == 0)
				return accordionComponents.at(i);
		}
		return null;
	}

	expandAccordion(label) {
		const accordionComponentWrapper = this.getAccordionComponentByLabel(label)
		const accordionComponentTitle = accordionComponentWrapper.find('.AccordionComponent__header-text').at(0);
		accordionComponentTitle.simulate('doubleclick')

		return waitCondition(() => {
			return !$(accordionComponentWrapper.getDOMNode()).hasClass('.AccordionComponent__collapsed');
		}, 100 , 5000)
	}

	selectAccordionValue(accordionLabel, findValue) {
		const accordionComponent = this.getAccordionComponentByLabel(accordionLabel);

		const values = accordionComponent.find('.AccordionComponent__accordion-value');
		for(let i = 0 ; i < values.length ; i++ ){
			const value = values.at(i);
			if(value.find('label').at(1).text().trim() == findValue ){
				sendNativeEventToElement(value.find('input').at(0).getDOMNode(), "click");
			}
		}

	}
}