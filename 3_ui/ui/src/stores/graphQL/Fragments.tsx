import gql from 'graphql-tag';

class Fragments {

	conningUser = gql`
		fragment conningUser on ConningUser {
			_id,
			createdAt,
			email
			emailVerified
			fullName
			lastLogin
			phoneNumber
			phoneVerified
		}`;

	dbObject = gql`
		fragment dbObject on DbObject {
			_id,
			createdBy {
				_id
			},
			createdTime,
			modifiedBy {
				_id
			},
			modifiedTime
		}`;

	userTagValue = gql`
		fragment userTagValue on UserTagValue {
			background
			color
			value
			label
			align
			tag {
				_id
				name
				label
				multiple
				hierarchy
			}
			order
			isDefault
			...dbObject
		}
		${this.dbObject}
	`;

	ui = gql`
		fragment ui on UI {
			name
			comments
			userTagValues {
				...userTagValue
			},
		}
		${this.userTagValue}
	`;

	userTag = gql`
		fragment userTag on UserTag {
			_id
			multiple
			name
			label
			objectTypes
			required
			mutates
			canSort
			canSearch

			values {
				...userTagValue
			}

			...dbObject
		}
	${this.userTagValue}`;

	objectType = gql`
		fragment objectType on OmdbObjectType {
			id,
			tags {
				name
				defaultValue
				description
				multiple
				required
				reserved
				type
				label

				ui {
					catalog {
						index
					}
					table {
						index
						props
					}
				}
			}

			userTags {
				...userTag
			}

			ui {
				card
				catalog
				table {
					frozenColumns
					columns
				}
				uniqueName
			}
		}

		${this.userTag}
	`;

	simulation = gql`
		fragment simulation on Simulation {
			...dbObject
			...ui

			gridName
			economies
			frequencies
			modules
			version
			status
			variables
			scenarios
			dfsPath
			periods {
				month quarter year
			}
			sourceType
			useCase
			productVersion
			userFile
			locked
			inputsVersion
            parameterizationMeasure
		}
		${this.dbObject}
		${this.ui}
	`;

	query = gql`
		fragment query on Query {
			...dbObject
			...ui

			hasResult
			frequencies
			variables
			scenarios
			periods {
				month quarter year
			}
			simulations {
				...simulation
			}
		}
		${this.dbObject}
		${this.ui}
		${this.simulation}
	`;

	investmentOptimization = gql`
		fragment investmentOptimization on InvestmentOptimization {
			...dbObject
			...ui

			version
			status
			gridName

			assetReturnsSimulation,
			companyDataSimulation,
			companyDataRepository,
			locked
		}
		${this.dbObject}
		${this.ui}
	`;

	userFile = gql`
		fragment userFile on UserFile {
			...dbObject
			...ui

			type
			status
		}
		${this.dbObject}
		${this.ui}
	`;

	climateRiskAnalysis = gql`
		fragment climateRiskAnalysis on ClimateRiskAnalysis {
			name
			status
			comments

			_id,
			createdBy {
				_id
			},
			createdTime,
			modifiedBy {
				_id
			},
			modifiedTime,
			simulation,
			userTagValues {
				...userTagValue
			}
			locked
		}
	`;

	DistinctFields_untyped = gql`
		fragment distinctFields_untyped on OmdbDistinctResultGraph {
			input {
				searchText tags where
			}
			results {
				objectType,
				tags {
					distinct
					tagType
					tagName
					isUserTag
				}
			}
		}
	`;

	hierarchyGroup = gql`
		fragment hierarchyGroup on HierarchyGroup {
			_id,
			name,
			numObjects,
			createdTime,
			modifiedTime
		}
		${this.ui}
	`;

	folder = gql`
		${this.dbObject}
		${this.ui}
		fragment folder on Folder {
			_id,
			name,
			path,
			hasChildren
			contents {
				_id
				_folder {
					_id
				}
				itemId,
				itemType,
				item {
					...ui
					...dbObject
					... on Folder {
						contents {
							_id
							itemId,
							itemType
							item {
								...dbObject
								...ui
								...on Folder {
									hasChildren
								}
							}
						}
					}
				}
			},
			createdBy {
				_id
			},
			createdTime,
			modifiedBy {
				_id
			},
			modifiedTime
		}
	`;
	folderItem = gql`
		fragment folderItem on FolderItem {
			_id,
			itemId,
			item {
				...folder
				...ui
				...dbObject
			}
			itemType,
			_folder {
				_id
			}
			...dbObject
		}
	${this.folder}`;

	billingReport = gql`
		fragment billingReport on BillingReportGraph {
			startDate,
			endDate,
		#	user {
		#		...conningUser
		#	}
			reports,
			total {
				dataElements,
				dataServingChargeSimulation,
				dataStorageCharge,
				ongoingDataStorageChargePerDay,
				simulationCharge
			}
		}`
}

export const fragments = new Fragments();