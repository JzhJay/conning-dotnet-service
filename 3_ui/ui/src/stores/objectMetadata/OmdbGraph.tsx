import gql from 'graphql-tag';
import {useQuery} from '@apollo/client/react/hooks';
import type {ConningUser} from '../graphQL';
import {fragments} from '../graphQL';
import {ClimateRiskAnalysis, JuliaSimulation, UserFile} from '../index';
import type {IObjectTypeDescriptor} from './OmdbTag';

export interface IOmdbQueryGraph {
	omdb: {
		config?: { db?: string, server?: string }
		objectTypes?: Array<IObjectTypeDescriptor>
		objectType?: IObjectTypeDescriptor
	}
}

class OmdbGraph {
	config = gql`
		{
			omdb {
				config {
					db,
					server
				}
			}
		}
	`;

	catalogQuery = gql`
		query runOmdbQuery($input: omdb_queryResultInput!) {
			omdb {
				raw {
					find(input: $input) {
						input {
							limit,
							where
							searchText
							sortBy
							sortOrder
							objectTypes
						}
						skipped
						total
						#results: resultsRaw
						results {
							...dbObject
							...ui
							...query
							...simulation
							...folder
							...investmentOptimization
							...userFile
							...climateRiskAnalysis
							...hierarchyGroup
						}
					}
				}
			}
		}
		${fragments.query}
		${fragments.folder}
		${fragments.investmentOptimization}
		${fragments.userFile}
		${fragments.climateRiskAnalysis}
		${fragments.hierarchyGroup}
	`;

	objectType = gql`
		query getObjectType($objectType: String!) {
			omdb {
				objectType(id: $objectType) {
					...objectType
				}
			}
		}
		${fragments.objectType}
	`;
	objectTypes = gql`
		query getObjectTypes {
			omdb {
				objectTypes {
					...objectType
				}
			}
		}

		${fragments.objectType}
	`;

	folder = {
		mutation: {
			newFolder: gql`
				${fragments.folder}
				mutation newFolder($name: String!, $path: String) {
					omdb {
						folder {
							newFolder(name: $name, path: $path) {
								...folder
							}
						}
					}
				}`,

			deleteFolderItem: gql`
				mutation deleteFromFolder($id: ObjectId!, $type: String!) {
					omdb {
						folder {
							deleteFolderItem(id: $id, type: $type)
						}
					}
				}
			`,

			addItems: gql`
				mutation addItemsToFolder($folderId: ObjectId!, $items: [FolderItemInputType!]!) {
					omdb {
						folder {
							addItems(folderId: $folderId, items: $items)
						}
					}
				}
			`
		},
		query:    {
			concreteFolderItem: gql`
				${fragments.folder}
				query getFolderItemAsConcrete($id: ID!, $type: String!) {
					omdb {
						raw {
							get(_id: $id, objectType: $type) {
								__typename
								...ui
								...folder
							}
						}}}`,
			get:                gql`
				${fragments.folder}
				query getFolder($id: ID!) { omdb { typed { folder { get(_id: $id) { ...folder }}}}}`,
			foldersAtPath:      gql`
				${fragments.folder}
				query foldersAtPath($path: String) {
					omdb {
						typed {
							folder {
								find(input: {where: {path: [$path]}}) {
									results {
										...folder
									}
								}
							}
						}
					}
				}`
		}
	};

	simulation = {
		get: gql`
			${fragments.simulation}
			query getSimulation($id: ID!) {
				omdb {
					typed {
						simulation {
							get(_id: $id) {
								...simulation
							}
						}
					}
				}
			}
		`
	}
	query = {
		get: gql`
			query getQuery($id: ID!) {
				omdb {
					typed {
						query {
							get(_id: $id) {
								...query
							}
						}
					}
				}
			}
			${fragments.query}
		`
	}

	getUserTagValues = gql`
		query getUserTagValues($ids: [ID!]!) {
			omdb {
				typed {
					userTagValue {
						gets(_ids: $ids) {
							...userTagValue
						}
					}
				}
			}
		}
		${fragments.userTagValue}
	`

	// cardUi: gql`
	// 	query getCardUi($objectTypes: [String!]!) {
	// 		omdb {
	// 			objectTypes(objectTypes: $objectTypes) {
	// 				ui {
	// 					card
	// 					catalog
	// 					table
	// 				}
	// 			}
	// 		}
	// 	}`

	userFile = {
		get: gql`
			${fragments.userFile}
			query getUserFile($id: ID!) {
				omdb {
					typed {
						userFile {
							get(_id: $id) {
								...userFile
							}
						}
					}
				}
			}
		`
	}

	climateRiskAnalysis = {
		get: gql`
			${fragments.climateRiskAnalysis}
			query getClimateRiskAnalysis($id: ID!) {
				omdb {
					typed {
						climateRiskAnalysis {
							get(_id: $id) {
								...climateRiskAnalysis
							}
						}
					}
				}
			}
		`
	}

}

export const omdbGraph = new OmdbGraph();

export interface OmdbFolder {
	//parent?: { _id: string };
	path?: string;
	name?: string;
	_id: string;
	contents?: OmdbFolderItem[];
	hasChildren?: boolean;

	createdBy?: ConningUser
	createdTime?: Date
	modifiedBy?: ConningUser
	modifiedTime?: Date
}

export interface OmdbFolderItem {
	item?: any;
	itemType: string;
	itemId: string;
	_folder?: OmdbFolder;
}

export function getGraphqlQueryFunctionComponent<TData, TVariables>() {
	return (props) => {
		const children = props.children, query = props.query, options = _.omit(props, ['children', 'query']);
		const result = useQuery<TData, TVariables>(query, options);
		return result ? children(result) : null;
	};
}

export const GetSimulationQuery = getGraphqlQueryFunctionComponent<{ omdb: { typed: { simulation: { get: JuliaSimulation } } } }, { id: string }>();

export const GetFolderQuery = getGraphqlQueryFunctionComponent<{ omdb: { typed: { folder: { get: OmdbFolder } } } }, {}>();

export const ChildFolderQuery = getGraphqlQueryFunctionComponent<any & { omdb: { typed: { folder: { find: { results: Array<OmdbFolder> } } } } }, { path?: string }>();

export const ObjectTypesQuery = getGraphqlQueryFunctionComponent<IOmdbQueryGraph, { ids?: string }>();

export const ObjectTypeQuery = getGraphqlQueryFunctionComponent<IOmdbQueryGraph, { objectType?: string }>();

//export class CardUiQuery extends Query<{ omdb: { objectTypes: Array<{ ui?: {card?: any, catalog?: any, table?: any} }> } }, { objectTypes?: Array<string> }> {}

export const GetUserFileQuery = getGraphqlQueryFunctionComponent<{ omdb: { typed: { userFile: { get: UserFile } } } }, { id: string }>();

export const GetClimateRiskAnalysisQuery = getGraphqlQueryFunctionComponent<{ omdb: { typed: { climateRiskAnalysis: { get: ClimateRiskAnalysis } } } }, { id: string }>();