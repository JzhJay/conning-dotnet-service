import {cg} from 'codegen';
import {getGraphqlQueryFunctionComponent} from '../objectMetadata/OmdbGraph';
import * as runBillingReport from './billingReport.graphql';

export const billingGraph = {
	runBillingReport
};

export const RunBillingReportQuery = getGraphqlQueryFunctionComponent<cg.RunBillingReportQuery, { startDate?: Date, endDate?: Date, userIds?: string[] }>();