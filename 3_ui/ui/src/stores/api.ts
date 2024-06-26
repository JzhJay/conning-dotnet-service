/* Export the underlying stores in a handy data structure */

import * as constants from './constants'
export { constants }

export * from './xhr';

export {viewDescriptors} from './constants';

import * as utility from '../utility';
export { utility }

export * from './routing';
export * from './user';
import {user} from './user';

export type {JuliaColor} from './julia';
export {julia} from './julia'; // Depends on user store
export {admin} from './admin';
export {site} from './site';

export * from './simulation';
export {queryStore} from './query';
export {org} from './organization'
export {workspace} from './workspace';
export {sidebar} from './sidebar';
export {queryResultStore} from './queryResult';
export * from './queryResult';
export * from './query';
export * from './site';
export * from './sidebar';
export * from './objectMetadata';
export * from './aws'
export * from './notifications'
export * from './graphQL';
export * from './io';
export * from './respository';
export * from './userFile';
export * from './climateRiskAnalysis';
export * from './rsSimulation';
export * from './controlPanel';
export * from './i18n';

const {settings} = user;
export {settings}

export * from './billing';
export * from './report';
export * from './softwareNotices';

import gql from 'graphql-tag';
export {gql};

import * as copyToClipboard from 'copy-to-clipboard';
export {copyToClipboard}
