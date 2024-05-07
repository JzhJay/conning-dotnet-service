import gql from 'graphql-tag';
import {testScheduler, ITestable, expect, JULIA_TAG} from "test"
import {omdb, apolloStore, user, utility, IOmdbChangedEvent, IOmdbQueryGraph, fragments, OmdbUserTag, OmdbUserTagValue, OmdbFolder} from 'stores';
import { Subscription } from 'zen-observable-ts';

var {client} = apolloStore;

interface IOmdbConfigQuery {
	omdb: { config: { db?: string, server?: string } }
};

const {graph} = omdb;

class OmdbStoreTests implements ITestable {
	testTypeName: string = "TestType_ForKarmaTest";
	testTypeNameCamelCase: string = "testType_ForKarmaTest";
	objects = [];

	describeTests = () => {
		var instance = this;

		describe(`Omdb Store`, function () {
			it(`can be reset`, async function () {
				this.timeout(5000);
				omdb.reset();
				//expect(omdb.store.connected).to.be.true;

				if (!user.isLoggedIn) {
					await testScheduler.loginTestUser();
				}
			});

			describe(`GraphQL API`, function () {
					it(`waits 30s for the GraphQL server to be reachable`, async function () {
						this.timeout(30 * 1000);
						do {
							try {
								const config = await client.query({query: graph.config});
								break;
							}
							catch (e) {
								if (e.message) {
									await utility.sleep(500);
								}
							}
						} while (true);
					});

					it(`config - fails if unauthorized`, async function () {
						this.timeout(30 * 1000);

						if (user.isLoggedIn) {
							user.logout();
						}

						var threwException = false;
						try {
							await client.query({query: graph.config, fetchPolicy: 'network-only'});
						}
						catch (e) {
							threwException = true;
						}

						expect(threwException, "Config should require valid user.").to.be.true
					});

					let config: { db?: string, server?: string };

					it(`config - requires a user be logged in to retrieve`, async function () {
						this.timeout(120 * 1000);

						await testScheduler.loginTestUser();
						client = apolloStore.client; // Update reference to client with new auth token;
						var q = await client.query<IOmdbConfigQuery>({query: graph.config});

						const {db, server} = q.data.omdb.config;

						expect(db).to.not.be.null;
						expect(server).to.not.be.null;

						console.info(`OMDB config - Server: ${server}\n\tDatabase: ${db}`);
					});
					//});

					let objectTypes: string[];

					it(`exposes a list of object types`, async function () {
						this.timeout(10 * 1000);

						var q = await client.query<IOmdbQueryGraph>({
							query: graph.objectTypes
						})

						objectTypes = q.data.omdb.objectTypes.map(ot => ot.id);
						expect(objectTypes).to.not.be.empty;
					});
					
					let subscriptionUpdates = {insert: 0, update: 0, del: 0};

					const onOmdbSubscriptionChanged = async (value: IOmdbChangedEvent) => {
						const {data: {omdb_changed: {objectType, _id, operation}}} = value;
						console.log('onOmdbSubscriptionChanged', value, 'testTypeName', instance.testTypeName);

						if (objectType == instance.testTypeName) {
							switch (operation) {
								case "Insert": {
									subscriptionUpdates.insert++;
									break;
								}
								case "Update": {
									subscriptionUpdates.update++;
									break;
								}
								case "Delete": {
									subscriptionUpdates.del++;
									break;
								}
							}
						}
					};

					let subscription: Subscription;
					it(`allows hooking up a subscription`, async function () {
						this.timeout(10 * 1000);

						subscription = apolloStore.client.subscribe({
							query: gql`subscription omdb {
								omdb_changed {
									_id
									operation
									objectType
								}
							}`
						}).subscribe(onOmdbSubscriptionChanged, (error) => {
							throw error;
						});
					});

					var objects: Array<any> = [
						{name: 'Test 1', status: 1},
						{name: 'Test 2', status: 1, json: {deep: {nested: {value: 100}}}},
						{name: 'Test 3', status: 2, json: {other: 123}},
						{name: 'Test 4', status: 3, json: "foobar"},  // The json is invalid - should be an object
					];
					instance.objects = objects;

					// describe(`Insert Operations`, function () {
					var insertMutation;

					// We don't actually want to reject bad json as we use the Json type to return arbitrary data where it may be scalar or may be an object
					// Instead the nested object will be nulled in the da
					/*it.skip(`rejects invalid data`, async function () {
                        insertMutation = gql`
                            mutation insertOmdbObject($values: [omdb_${testTypeName}_insert]!) {
                                omdb {
                                    typed {
                                        ${testTypeNameCamelCase} {
                                        insert(values: $values) {
                                            _id
                                        }
                                    }
                                }
                            }
                            }
                        `;

                        var threw = false;
                        try {
                            var m = await client.mutate<{ omdb: { typed: { [id: string]: { insert: Array<{ _id: string }> } } } }>({
                                mutation:  insertMutation,
                                variables: {
                                    values: objects
                                }
                            });
                        }
                        catch (e) {
                            threw = true;
                        }

                        expect(threw).to.be.true;
                    });*/

					it(`allows multiple objects to be inserted (including objects with nested properties)`, async function () {
						this.timeout(10 * 1000);

						insertMutation = gql`
							mutation insertOmdbObject($values: [omdb_${instance.testTypeName}_insert]!) {
								omdb {
									typed {
										${instance.testTypeNameCamelCase} {
										insert(values: $values) {
											_id
										}
									}
								}
							}
							}
						`;

						// Remove the bad json and reinsert
						objects[3].json = {a: 'b'};

						var m = await client.mutate<{ omdb: { typed: { [id: string]: { insert: Array<{ _id: string }> } } } }>({
							mutation:  insertMutation,
							variables: {
								values: objects
							}
						});

						const {omdb: {typed}} = m.data;
						var inserts = typed[instance.testTypeNameCamelCase].insert;

						expect(inserts.length).to.equal(objects.length);

						inserts.forEach((r, i) => objects[i]._id = r._id);
					});

					var queryRawGet;

					it(`allows objects to be queried directly`, async function () {
						this.timeout(10 * 1000);

						queryRawGet = gql`
							query directLookup( $id: ID!) {
								omdb {
									raw {
										get(_id: $id, objectType: "${instance.testTypeName}") {
											... on ${instance.testTypeName} {
												_id,
												name,
												json,
												createdBy {
													_id
												},
												createdTime,
												modifiedTime,
												modifiedBy {
													_id
												}
											}
										}
									}
								}
							}`;

						for (var i = 0; i < objects.length; i++) {
							var q = await client.query<{ omdb: { raw: { get: any } } }>({
								query:     queryRawGet,
								variables: {id: objects[i]._id}
							});

							const {data: {omdb: {raw: {get}}}} = q;
							const o = objects[i];

							expect(get).to.not.be.null;
							var record = get;

							expect(record.name).to.equal(o.name);

							if (o.json && _.isObject(o.json)) {
								expect(record.json).to.deep.equal(o.json);
							}
							else {
								expect(record.json).to.be.null;
							}

							expect(record.createdBy._id).to.equal(user.currentUser.sub);
							expect(record.createdTime).to.not.be.null;
							expect(record.modifiedTime, 'Modified time should be null').to.be.null;
							expect(record.modifiedBy, 'Modified by should be null').to.be.null;
						}
					});

					it(`should be able to find an object with a null field`, async function () {
						this.timeout(10 * 1000);

						var q = await client.query<any>(
							{
								query:     gql`
									query rawCatalogSearch($input: omdb_queryResultInput) {
										omdb {
											raw {
												find(input: $input) {
													resultsRaw,
													total,
												}
											}
										}
									}
								`,
								variables: {input: {objectTypes: [instance.testTypeName], where: {json: null}}}
							}
						);
						const {data: {omdb: {raw: {find: {resultsRaw, total}}}}} = q;

						expect(total).to.equal(1);
						expect(resultsRaw[0].name).to.equal(objects.find(o => !o.json).name);
					});
					
					instance.runCatalogTests(instance);
					instance.hierarchicalViewTests(instance);

					// Todo:
					// Supports finding multiple matching clauses
					// Query: [simulationID, simulationID, simulationID]
					// Should be findable regardless of order or if only 1/2 or 1/3 are specified

					it(`allows objects to be independently updated`, async function () {
						this.timeout(10 * 1000);

						for (var i = 0; i < objects.length; i++) {
							const o = objects[i] as any;
							o.name += ' (modified)';
							if (!o.json) {
								o.json = {}
							}
							o.json.modified = "abcd";
							o.json.newStructure = {foo: 'bar', also: {deep: 123.45}}
							// Modify existing deep data
							if (o.json.deep) {
								o.json.deep.nested.value++;
							}

							const m = await client.mutate<any>({
								mutation:  gql`
									mutation directUpdate($id: ID!, $value: omdb_${instance.testTypeName}_update!) {
										omdb {
											typed {
												${instance.testTypeNameCamelCase} {
												update(id: $id, value: $value)
											}
										}
									}
									}`,
								variables: {
									id:    o._id,
									value: _.omit(o, ['_id', 'createdBy', 'createdTime', 'modifiedBy', 'modifiedTime'])
								}
							});

							// Returns raw json
							const {update} = m.data.omdb.typed[instance.testTypeNameCamelCase];

							var record = update;

							expect(record.modifiedBy).to.equal(user.currentUser.sub);
							expect(record.modifiedTime).to.not.be.null;
							expect(record.name).to.equal(o.name);

							// Reget the item
							const q = await client.query<any>({
								query:       queryRawGet,
								variables:   {id: o._id},
								fetchPolicy: 'network-only'
							});

							const {data: {omdb: {raw: {get}}}} = q;

							expect(get).to.not.be.null;
							record = get;

							expect(record.json).to.deep.equal(o.json);
							expect(record.newStructure).to.deep.equal(o.newStructure);
						}
					});

					it(`prevents type deletion while records are outstanding`, async function () {
						this.timeout(10 * 1000);

						let threw = false;

						try {
							const m = await client.mutate<any>({
								mutation:  gql`
									mutation deleteObjectType($name: String!) {
										omdb {
											objectTypes {
												delete(name: $name)
											}
										}
									}
									}`,
								variables: {name: instance.testTypeName}
							});
						}
						catch (e) {
							threw = true;
						}
						expect(threw).to.be.true;
					});

					it.skip(`correctly monitored subscriptions`, async function () {
						this.timeout(30 * 1000);

						await utility.sleep(20000);
						expect(subscriptionUpdates.insert).to.equal(objects.length);
						expect(subscriptionUpdates.update).to.equal(objects.length);
					})

					// Todo:
					// Supports finding multiple matching clauses
					// Query: [simulationID, simulationID, simulationID]
					// Should be findable regardless of order or if only 1/2 or 1/3 are specified

					instance.userTagTests(instance);
					instance.folderTests(instance);

					// it(`supports organizing objects into folders`, async function() {
					//
					// });

					after('Unsubscribe subscription', function() {
						if (subscription) {
							console.log('[OmdbStore.tests] Unsubscribe subscription');
							subscription.unsubscribe();
						}
					});

					describe.skip(`Cleans up the dynamic type`, function () {

						it(`allows individual objects to be deleted`, async function () {
							var toDelete = objects;

							for (var i = 0; i < toDelete.length; i++) {
								const o = toDelete[i] as any;

								const m = await instance.deleteObject(o);

								const {d} = m.data.omdb.typed[instance.testTypeNameCamelCase];

								expect(d).to.not.be.null;

								expect(d.DeletedCount).to.equal(1);

								// Reget the item
								const q = await client.query<any>({
									query:       queryRawGet,
									variables:   {id: o._id},
									fetchPolicy: 'network-only'
								});

								const {data: {omdb: {raw: {get}}}} = q;

								expect(get).to.be.null;
							}
						});

						it(`allows type deletion when no records remain`, async function () {
							const m = await client.mutate<any>({
								mutation:  gql`
									mutation delete($name: String!) {
										omdb {
											objectTypes {
												delete(name: $name)
											}
										}
									}`,
								variables: {name: instance.testTypeName}
							});

							const {data} = m;

							expect(data).to.not.be.null;

							const q = await client.query<IOmdbQueryGraph>({
								query:       graph.objectTypes,
								fetchPolicy: 'network-only'
							});
							expect(_.includes(q.data.omdb.objectTypes.map(ot => ot.id), instance.testTypeName)).to.be.false;
						});
					})
					// verify IDs cannot be modified
				}
			);
		});
	}

	private runCatalogTests(instance: OmdbStoreTests) {
		describe(`Catalog functionality`, function () {
			it(`supports catalog paging (pg1)`, async function () {
				this.timeout(5000);
				var q = await client.query<any>({
					query:     gql`
						query rawCatalogSearch($objectTypes: [String!]!, $limit: Int, $skip: Int) {
							omdb {
								raw {
									find(input: { objectTypes: $objectTypes, limit: $limit, skip: $skip }) {
										resultsRaw,
										total,
										skipped
									}
								}
							}
						}`,
					variables: {objectTypes: [instance.testTypeName], limit: 2}
				});

				const {data: {omdb: {raw: {find: {resultsRaw, total, skipped}}}}} = q;

				expect(total).to.equal(instance.objects.length);
				expect(resultsRaw.length).to.equal(2);
				for (var i = 0; i < resultsRaw.length; i++) {
					expect(resultsRaw[i].name).to.equal(instance.objects[i].name);
				}
			});

			it(`supports catalog paging (pg2)`, async function () {
				var q = await client.query<any>({
					query:     gql`
						query rawCatalogSearch($objectTypes: [String!]!, $limit: Int, $skip: Int) {
							omdb {
								raw {
									find(input: { objectTypes: $objectTypes, limit: $limit, skip: $skip }) {
										resultsRaw,
										total,
										skipped
									}
								}
							}
						}`,
					variables: {objectTypes: [instance.testTypeName], skip: 2}
				});

				const {data: {omdb: {raw: {find: {resultsRaw, total}}}}} = q;

				expect(total).to.equal(instance.objects.length);
				expect(resultsRaw.length).to.equal(2);
				for (var i = 0; i < resultsRaw.length; i++) {
					expect(resultsRaw[i].name).to.equal(instance.objects[i + 2].name);
				}
			});

			it(`supports catalog distinct queries`, async function () {
				var q = await client.query<any>({
					query:     gql`
						query rawCatalogDistinctSearch($objectTypes: [String!]!) {
							omdb {
								raw {
									distinct(input: { objectTypes: $objectTypes, tags: ["name", "createdBy"] }) {
										results {
											tags {
												distinct,
												tagName,
												tagType
											}
										}
									}
								}
							}
						}`,
					variables: {objectTypes: [instance.testTypeName]}
				});

				const {data: {omdb: {raw: {distinct: {results}}}}} = q;

				// distinct is an array conforming to object types
				expect(results.length).to.equal(1);

				const {tags} = results[0];

				expect(tags.length).to.equal(2)

				let checkTag = _.find<any>( tags, tag => tag.tagName == "name");
				expect(checkTag).to.not.be.null;
				expect(checkTag.tagType).to.equal("String");
				// TestType_ForKarmaTest is dynamic object type and it doesn't exist in omdb_ui, so distinct is 0
				expect(checkTag.distinct.length).to.equal(0);

				checkTag = _.find<any>( tags, tag => tag.tagName == "createdBy");
				expect(checkTag).to.not.be.null;
				expect(checkTag.tagType).to.equal("ConningUser");
				expect(checkTag.distinct.length).to.equal(0);
			});

			it(`supports catalog searching (full-text)`, async function () {
				var q = await client.query<any>({
					query:     gql`
						query rawCatalogSearch($objectTypes: [String!]!, $searchText: String!) {
							omdb {
								raw {
									find(input: { objectTypes: $objectTypes, searchText: $searchText, searchTags: "name" }) {
										resultsRaw,
										total,
										skipped
									}
								}
							}
						}`,
					variables: {objectTypes: [instance.testTypeName], searchText: "est 1"}
				});

				const {data: {omdb: {raw: {find: {resultsRaw, total}}}}} = q;

				expect(total).to.equal(1);
				expect(resultsRaw.length).to.equal(1);
			});

			it(`supports catalog searching (status = 1 should result in 2 rows)`, async function () {
				var q = await client.query<any>({
					query:     gql`
						query rawCatalogSearch_status($objectTypes: [String!]!) {
							omdb {
								raw {
									find(input: { objectTypes: $objectTypes, where: { status: 1} }) {
										resultsRaw,
										total,
										skipped
									}
								}
							}
						}`,
					variables: {objectTypes: [instance.testTypeName]}
				});

				const {data: {omdb: {raw: {find: {resultsRaw, total}}}}} = q;

				var filtered = instance.objects.filter(o => o.status == 1);

				expect(total).to.equal(filtered.length);
				expect(resultsRaw.length).to.equal(total);
			});
		})
	}

	private userTagTests(instance: OmdbStoreTests) {
		describe(`User-Defined Tags`, function () {
			var testUserTag1 = `TestUserTag_${uuid.v4().replace(/-/g, '_')}`;
			var testUserTagMultiple = `TestUserTag_multiple_${uuid.v4().replace(/-/g, '_')}`;
			var testUserTagInvalidObjectType = `TestUserTag_invalid_${uuid.v4().replace(/-/g, '_')}`;
			var userTag1: any, userTag2: any;

			var userTags: Array<OmdbUserTag>;

			it(`Users can define their own tags`, async function () {
				var m = await apolloStore.client.mutate({
					mutation:  gql`
						${fragments.userTag}
						mutation addUserTag($objectType: String!) {
							omdb {
								typed {
									userTag {
										insert(values: [{ name: "${testUserTag1}", objectTypes: [$objectType]},
											{ name: "${testUserTagMultiple}", objectTypes: [$objectType], multiple: true},
											{ name: "${testUserTagInvalidObjectType}", objectTypes: ["invalid"] }]) {
											...userTag
										}
									}
								}
							}
						}
					`,
					variables: {objectType: instance.testTypeName}
				});
				const {data: {omdb: {typed: {userTag: {insert}}}}} = m;
				userTags = insert;

				expect(userTags.length).to.equal(3);
				expect(_.every(userTags, ut => ut._id != null)).to.be.true;
			});

			let userTagValues: Array<OmdbUserTagValue>;

			it(`and specify available values`, async function () {
				var m = await apolloStore.client.mutate({
					mutation: gql`
						${fragments.userTagValue}
						mutation addUserTagValue {
							omdb {
								typed {
									userTagValue {
										insert(values: [{ value: "Value 1", tag: "${userTags[0]._id}" }, { value: "Value 2", tag: "${userTags[0]._id}" },
											{ value: "Value 1", tag: "${userTags[1]._id}" }, { value: "Value 2", tag: "${userTags[1]._id}" },
											{ value: "Value 1", tag: "${userTags[2]._id}" }, { value: "Value 2", tag: "${userTags[2]._id}" }]) {
											...userTagValue
										}
									}
								}
							}
						}
					`
				});
				const {data: {omdb: {typed: {userTagValue: {insert}}}}} = m;
				userTagValues = insert;

				expect(userTagValues.length).to.equal(6);
				expect(_.every(userTagValues, utv => utv._id != null)).to.be.true;
			});

			it(`and apply them to OMDB objects`, async function () {

				var m = await apolloStore.client.mutate({
					mutation:  gql`
						mutation addUserTagValue($objectId: ID!, $tagValueId: ID!) {
							omdb {
								typed {
									${instance.testTypeNameCamelCase} {
									addUserTagValue(id: $objectId, tagValueId: $tagValueId)
								}
							}
						}
						}
					`,
					variables: {
						objectId:   instance.objects[0]._id,
						tagValueId: userTagValues[0]._id
					}
				})

				const {data: {omdb: {typed: {[instance.testTypeNameCamelCase]: {addUserTagValue}}}}} = m;
				expect(addUserTagValue).to.exist;
			});

			it('should disallow application of multiple tag values if multiple:false', async function () {
				this.timeout(10 * 1000);
				var threw = false;
				try {
					var m = await apolloStore.client.mutate({
						mutation:  gql`
							mutation addUserTagValue($objectId: ID!, $tagValueId: ID!) {
								omdb {
									typed {
										${instance.testTypeNameCamelCase} {
										addUserTagValue(id: $objectId, tagValueId: $tagValueId)
									}
								}
							}
							}
						`,
						variables: {
							objectId:   instance.objects[0]._id,
							tagValueId: userTagValues[1]._id
						}
					})
				}
				catch (Error) {
					threw = true;
				}

				expect(threw).to.be.true;
			});

			it.skip('should disallow tagging of object types that are not specified on the user tag', async function () {
			});

			it.skip('should allow tags with multiple:true to apply multiple tags', async function () {
			});

			it.skip(`Tags can be hierarchical`, async function () {

			});
		});

	}

	private folderTests(instance: OmdbStoreTests) {
		describe.skip(`OMDB Folders (WEB-1945)`, function () {
			it(`Folders can be listed`, async function () {
				var q = await apolloStore.client.query({
					query: omdb.graph.folder.query.foldersAtPath
				});

				expect(q.data).to.not.be.null;

			});

			let rootFolders: OmdbFolder[] = [];

			it(`Can create multiple root folders`, async function () {
				var m = await apolloStore.client.mutate({
					mutation: gql`
						${fragments.folder}
						mutation createRootFolders {
							omdb {
								folder {
									root1: newFolder(name: "Root 1") { ...folder }
									root2: newFolder(name: "Root 2") { ...folder }
								}
							}
						}
					`
				});

				const {root1, root2}: { root1: OmdbFolder, root2: OmdbFolder } = m.data.omdb.folder;
				expect(root1).to.not.be.null;
				expect(root1.name).to.equal("Root 1");
				expect(root2).to.not.be.null;
				expect(root1.createdBy._id).to.equal(user.currentUser.sub)
				expect(root1.createdTime).to.not.be.null;
				rootFolders.push(root1, root2);
			});

			it(`allows folders to be renamed`, async function () {
				let newName = "Root 1 (renamed)";
				var m = await apolloStore.client.mutate({
					mutation:  gql`
						${fragments.folder}
						mutation renameFolder($id: ObjectId!, $name: String!) {
							omdb {
								folder {
									rename(id: $id, name: $name) { ...folder }
								}
							}
						}
					`,
					variables: {id: rootFolders[0]._id, name: newName}
				});

				expect(rootFolders[0].modifiedBy).to.be.null;
				expect(rootFolders[0].modifiedTime).to.be.null;

				const {rename} = m.data.omdb.folder;
				expect(rename.name).to.equal(newName);
				expect(rename.modifiedBy._id).to.equal(user.currentUser.sub);
				expect(rename.modifiedBy._id).to.equal(user.currentUser.sub);

				rootFolders[0] = rename;
			});

			let grandchild: OmdbFolder;

			it(`can create subfolders`, async function () {
				let path = rootFolders[0]._id;

				var m = await apolloStore.client.mutate({
					mutation:  gql`
						${fragments.folder}
						mutation createSubFolders($path: String!) {
							omdb {
								folder {
									c1: newFolder(path: $path, name: "Child 1") { ...folder }
									c2: newFolder(path: $path, name: "Child 2") { ...folder }
								}
							}
						}
					`,
					variables: {path}
				});

				const {c1, c2}: { c1: OmdbFolder, c2: OmdbFolder } = m.data.omdb.folder;

				expect(c1).to.not.be.null;
				expect(c2).to.not.be.null;
				expect(c1.path).to.equal(path);

				path = c1.path + "." + c1._id
				m = await apolloStore.client.mutate({
					mutation:  gql`
						${fragments.folder}
						mutation createSubFolders($path: String!) {
							omdb {
								folder {
									gc1: newFolder(path: $path, name: "Grandchild 1") { ...folder }
									gc2: newFolder(path: $path, name: "Grandchild 2") { ...folder }
								}
							}
						}
					`,
					variables: {path}
				});

				const {gc1, gc2}: { gc1: OmdbFolder, gc2: OmdbFolder } = m.data.omdb.folder;
				expect(gc1).to.not.be.null;
				expect(gc2).to.not.be.null;

				expect(gc1.path).to.equal(path)

				// This will not have updated c1
				expect(c1.hasChildren).to.be.false;

				var q = await apolloStore.client.query<any>({
					query:     omdb.graph.folder.query.foldersAtPath,
					variables: {path}
				});

				grandchild = gc1;

				const {results} = q.data.omdb.typed.folder.find;
				expect(results.length).to.equal(2);
				expect(results[0]._id).to.equal(gc1._id)
				expect(results[1]._id).to.equal(gc2._id)

				/*
					Current folder structure:
						- Root 1 (renamed)
							- Child 1
								- Grandchild 1
								- Grandchild 2
							- Child 2
						- Root 2
				 */
			});

			it(`Business objects can be placed in the folder tree`, async function () {
				let m = await apolloStore.client.mutate({
					mutation:  omdb.graph.folder.mutation.addItems,
					variables: {
						folderId: grandchild._id,
						items:    instance.objects.map(item => ({itemId: item._id, objectType: instance.testTypeName}))
					},
				});

				var q = await apolloStore.client.query<any>({query: omdb.graph.folder.query.get, variables: {id: grandchild._id}});
				const node: OmdbFolder = q.data.omdb.typed.folder.get;
				expect(node.contents.length).to.equal(instance.objects.length);
			});

			it(`Should automatically remove items from folders when the underlying omdb item is deleted`, async function () {
				var toDelete = _.last(instance.objects);

				var q = await apolloStore.client.query<any>({query: omdb.graph.folder.query.get, variables: {id: grandchild._id}});

				let node: OmdbFolder = q.data.omdb.typed.folder.get;
				expect(node.contents.find(c => c.itemId == toDelete._id)).to.not.be.null;
				let priorLength = node.contents.length;

				// Delete the last object
				instance.deleteObject(toDelete);

				q = await apolloStore.client.query<any>({query: omdb.graph.folder.query.get, variables: {id: grandchild._id}, fetchPolicy: 'network-only'});
				node = q.data.omdb.typed.folder.get;
				expect(node.contents.find(c => c.itemId == toDelete._id)).be.null;
				expect(node.contents.length).to.equal(priorLength - 1);
			});

			it.skip(`Should be able to handle deleting the folder 'child' from the folder hierarchy 'root/child/grandchild' without orphaning grandchild in the db`);

			it.skip(`Catalog searches can restrict based on folder`, async function () {

			});

			it.skip(`Folders can be moved around`, async function () {

			});

			it.skip(`Business objects can locate their place(s) within the folder tree`, async function () {

			});

			it.skip(`Should automatically remove items from folders when the underlying omdb item is deleted`, async function () {

			});


		});
	}

	private hierarchicalViewTests(instance: OmdbStoreTests) {
		describe(`OMDB Hierarchical View`, function () {
			var objects: Array<any> = [
				{name: 'A/O1', status: 1},
				{name: 'A/C/O2', status: 1},
				{name: 'A/C/O3', status: 1},
				{name: 'A/C/D/O4', status: 1},
				{name: 'A/C/D/O5', status: 1},
			];

			it(`Can insert items with path names`, async function () {
				var insertMutation = gql`
					mutation insertOmdbObject($values: [omdb_${instance.testTypeName}_insert]!) {
						omdb {
							typed {
								${instance.testTypeNameCamelCase} {
								insert(values: $values) {
									_id
								}
							}
						}
					}
					}
				`;

				var m = await client.mutate<{ omdb: { typed: { [id: string]: { insert: Array<{ _id: string }> } } } }>({
					mutation:  insertMutation,
					variables: {
						values: objects
					}
				});

				const {omdb: {typed}} = m.data;
				var inserts = typed[instance.testTypeNameCamelCase].insert;

				expect(inserts.length).to.equal(objects.length);

				inserts.forEach((r, i) => objects[i]._id = r._id);
			});

			it(`Produces correct hierarchical groupings`, async function () {

				const runQuery = async (path) => {
					var q = await client.query<any>({
						query:     gql`
							query rawCatalogSearch_hierarchical ($objectTypes: [String!]!, $path: String!) {
								omdb {
									raw {
										find(input: { objectTypes: $objectTypes, path: $path }) {
											resultsRaw,
											total,
											skipped
										}
									}
								}
							}`,
						variables: {objectTypes: [instance.testTypeName], path}
					});

					const {data: {omdb: {raw: {find: {resultsRaw, total}}}}} = q;

					return resultsRaw;
				}

				const root = await runQuery("");
				expect(root.length).to.equal(instance.objects.length + 1);
				expect(root[0].numObjects).to.equal(5);

				// Objects have numObjects of 1
				const folderA = await runQuery("A");
				expect(folderA[1].name).to.equal("A/O1");
				expect(folderA[1].numObjects).to.equal(1);

				// Folders have numObjects > 1
				const folderC = await runQuery("A/C");
				expect(folderC[0].name).to.equal("A/C/D");
				expect(folderC[0].numObjects).to.equal(2);
				expect(folderC[1].name).to.equal("A/C/O2");
			});
		})
	}

	deleteObject = async (o) => {
		this.objects = this.objects.filter(existing => existing != o);

		return await client.mutate<any>({
			mutation:  gql`
				mutation delete($id: ObjectId!) {
					omdb {
						typed {
							${this.testTypeNameCamelCase} {
							d: delete(id: $id)
						}
					}
				}
				}`,
			variables: {id: o._id}
		});

	}
}

testScheduler.register(new OmdbStoreTests());