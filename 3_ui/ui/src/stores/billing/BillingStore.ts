import {routing, xhr} from '../index';
import {ObservableMap} from 'mobx';
import {billingGraph} from './BillingGraph';

class BillingStore {
	graph = billingGraph;
}

export const billing = new BillingStore();