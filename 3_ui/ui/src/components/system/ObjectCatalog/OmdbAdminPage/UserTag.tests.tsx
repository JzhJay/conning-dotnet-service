import {OmdbAdminPageContext, SortableCardsPanel} from 'components';
import {CatalogSidebarTags, OmdbTagsEditor} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs';
import gql from 'graphql-tag';
import * as React from 'react';
import {ApolloProvider} from '@apollo/client';
import type {IObjectTypeDescriptor, IOmdbQueryGraph, OmdbUserTag} from 'stores';
import {apolloStore, ObjectCatalogContext, omdb, OmdbTag, Simulation, site, user, utility} from 'stores';
import {testScheduler, ITestable, expect, enzyme, simulateMouseEvent, enzymeMount, get$Container, enzymeUnmount} from "test"
import {reactionToPromise, sleep, waitCondition} from 'utility/utility';

const timeouts = {
	load: 60 * 1000,
	render: 10 * 1000,
	test: 10 * 1000,
	query: 30 * 1000,
	applyingTag: 3 * 60 * 1000
}

const sleepTimes = {
	contextMenuOpenAnimation: 305, // blueprint default animation time = 300;
	hoverSubMenuOpenAnimation: 505, // blueprint default animation time = 500;
	waitUserTagChangeSaving: 1000 // wait data write into database and sync back.
}

class UserTagTests implements ITestable {
	describeTests = () => {
		describe(`User Tag`, function () {
			const newTagName = `newTestingTag${uuid.v4().substr(0,5)}`;
			const formattedLabelText = utility.formatLabelText(newTagName);
			let newUserTag: OmdbUserTag;

			let _result;
			let pageContext: OmdbAdminPageContext;

			const mount = (component: JSX.Element) : {container: JQuery, wrapper: any} => {
				_result = enzymeMount(component);
				return {container: get$Container(), wrapper: _result};
			}

			const waitSiteNotBusy = async () => {
				await sleep(10);
				site.busy && await reactionToPromise(() => site.busy , false);
			};

			before('', async function () {
				this.timeout(timeouts.load);
				console.log(`testing tag: ${formattedLabelText}`);
			});

			after( '', async function (done) {
				enzymeUnmount(_result);
				catalogContext?.dispose();
				pageContext?.dispose();
				user.settings.searchers.simulation.view = 'card';
				done();
			})

			it ('can create pageContext', async function (){
				this.timeout(timeouts.load);
				pageContext = new OmdbAdminPageContext(Simulation.ObjectType);
				pageContext.loading && await reactionToPromise(()=> pageContext.loading, false);
				expect(pageContext.loading).to.eq(false);
				expect(pageContext.selectedObjectTypes).to.deep.eq([Simulation.ObjectType]);
			})

			it (`remove dirty tags`, async function() {
				let userTags = pageContext.userTags;
				this.timeout(timeouts.load * (userTags.length + 1));
				if(userTags.length) {
					for (let i = 0; i < userTags.length; i++) {
						let ut = userTags[i];
						await apolloStore.client.mutate<any>({
							mutation:  gql`mutation delete($id: ObjectId!) { omdb { typed { userTag { delete(id: $id) } } } }`,
							variables: {id: ut._id}
						}).then(() => {
							console.log(`remove dirty user tag (${i+1}/${userTags.length}): ${ut._id} / ${ut.name}`)
						});
					}
				}
				pageContext?.dispose();
				pageContext = new OmdbAdminPageContext(Simulation.ObjectType);
				pageContext.loading && await reactionToPromise(()=> pageContext.loading, false);
				userTags = _.filter(pageContext.userTags, ut => ut.name.indexOf("labels") < 0);
				expect(userTags.length).to.eq(0);
			})

			describe(`OmdbTagsEditor(create & edit)`, function () {

				let $container;
				let omdbTagsEditorRef;
				let newTagRowClass;
				const nameCellClass = '.bp3-table-body-cells .bp3-table-cell-col-0';

				before('', async function () {
					this.timeout(timeouts.render);
					$container = mount(<OmdbTagsEditor context={pageContext} ref={r => omdbTagsEditorRef = r} />).container;
				})

				const numberOfNameCells = (): number => {
					let cells = $container.find(nameCellClass);
					return cells.length;
				}

				it(`can load`, async function () {
					this.timeout(timeouts.load);
					await waitCondition(()=>$('.bp3-table-body-cells').length > 0);
					expect(numberOfNameCells()).to.eq(pageContext.userTags.length);
				});

				it(`Show Reserved Tags`, async function () {
					this.timeout(timeouts.test);
					const checkBox = $('.bp3-navbar .bp3-control-indicator').trigger('click');
					expect(numberOfNameCells()).to.gt(pageContext.userTags.length);
					expect(numberOfNameCells()).to.lte(pageContext.tags.length);
					checkBox.trigger('click');
					expect(numberOfNameCells()).to.eq(pageContext.userTags.length);
				});

				it(`add new Tag`, async function () {
					this.timeout(timeouts.load);

					const existTags = pageContext.userTags.map( ut => ut._id);
					const rowLength = numberOfNameCells();
					expect(rowLength, existTags.length);

					$('.bp3-navbar .bp3-button').trigger('click');
					await waitSiteNotBusy();
					await waitCondition(() => numberOfNameCells() != rowLength, 100, timeouts.load);
					const newRowLength = numberOfNameCells();
					expect(newRowLength).to.eq(pageContext.userTags.length);
					if (_.some(pageContext.userTags, ut=>!ut._id)) {
						await waitCondition(()=>!_.some(pageContext.userTags, ut=>!ut._id))
					}
					expect(newRowLength).to.eq(rowLength + 1);

					newUserTag = _.find(pageContext.userTags, ut => existTags.indexOf(ut._id) < 0);
					expect(newUserTag != null).to.eq(true);

					// user.settings.catalog.visibleTags['card:Simulation'].push(newUserTag._id);
					// user.settings.catalog.visibleTags['table:["Simulation"]'].push(newUserTag._id);

				});

				it(`rename Tag`, async function () {
					this.timeout(timeouts.test);
					await omdbTagsEditorRef.saveUpdate( newUserTag as OmdbTag , "name", newTagName);
					await waitSiteNotBusy();

					let renameCell = $(nameCellClass).filter((i, cell) => $(cell).text() == newTagName);
					expect(renameCell.length).to.gte(1);

					renameCell.attr('class').split(/\s+/).forEach( c => {
						if (c.match(/^bp3-table-cell-row-(\d+)$/)) {
							newTagRowClass = c;
						}
					});
				});

				function checkColumnCheckBox(colName) {
					let columnHeader = $container.find('.bp3-table-column-header-cell').filter((i, header) => {
						return $(header).find('.bp3-table-truncated-text').text().trim() == colName
					});
					expect(columnHeader.length).to.gte(1);

					let columnClass = '';
					columnHeader.attr('class').split(/\s+/).forEach( c => {
						if (c.match(/^bp3-table-cell-col-(\d+)$/)) {
							columnClass = c;
						}
					});
					expect(!!columnClass).to.eq(true);

					let actionCell = $container.find(`.${newTagRowClass}.${columnClass} input`);
					expect(actionCell.length).to.eq(1);
					expect(!!actionCell.prop('checked')).to.eq(true);
				}

				it(`test 'Catalog' checked by default`, async function () {
					this.timeout(timeouts.test);
					$container.find('.bp3-table-quadrant-scroll-container').scrollLeft(10000);
					await waitCondition( () => {
						return $container.find('.bp3-table-column-header-cell').filter((i, header) => {
							return $(header).find('.bp3-table-truncated-text').text().trim() == 'Table';
						}).length > 0
					});
					checkColumnCheckBox('Catalog');
				});

				it(`test 'Card' checked by default`, async function () {
					this.timeout(timeouts.test);
					checkColumnCheckBox('Card');
				});

				it(`test 'Table' checked by default`, async function () {
					this.timeout(timeouts.test);
					checkColumnCheckBox('Table');
				});

				it(`test 'Can Sort' checked by default`, async function () {
					this.timeout(timeouts.test);
					checkColumnCheckBox('Can Sort');
				});

				describe(`OmdbTagValuesEditor`, function () {

					let tag, portal;
					const valueItemClass = '.TagValuesEditor__tag-value';
					const newTagName = 'newTagValue';

					before('', async function () {
						this.timeout(timeouts.load);
						expect(newTagRowClass != null).to.eq(true);

						const tagName = $(`${nameCellClass}.${newTagRowClass}`).text();
						tag = _.find(pageContext.userTags, ut => ut.name == tagName);
						expect(tag != null).to.eq(true);

						let btn = $(`.bp3-table-body-cells .${newTagRowClass} .bp3-button .bp3-icon-properties`);
						expect(btn.length).to.eq(1);
						btn.trigger('click');
					})

					it(`open tag value editor dialog`, async function () {
						this.timeout(timeouts.render);
						await sleep(sleepTimes.contextMenuOpenAnimation); //opening duration
						portal = $('.bp3-portal').filter((i,p) => {
							return $(p).find('.bp3-heading').text().match(/^Values\sfor\sTag\s/);
						});
						expect(portal.length).to.eq(1);
					});

					it(`add new tag value`, async function () {
						this.timeout(timeouts.test);
						let actionBtn = portal.find('.bp3-dialog-body a').filter((i,a) => $(a).text() == 'Add A New Tag Value');
						expect(actionBtn.length).to.eq(1);

						let currentValueLength = tag.values?.length || 0;
						expect(portal.find(valueItemClass).length).to.eq(currentValueLength);

						// add tag value 1
						simulateMouseEvent(actionBtn[0], "click");
						await waitSiteNotBusy();
						expect(tag.values.length).to.eq(currentValueLength + 1);
						expect(portal.find(valueItemClass).length).to.eq(currentValueLength + 1);
						currentValueLength++;

						// add tag value 2
						simulateMouseEvent(actionBtn[0], "click");
						await waitSiteNotBusy();
						expect(tag.values.length).to.eq(currentValueLength + 1);
						expect(portal.find(valueItemClass).length).to.eq(currentValueLength + 1);
					});

					it(`rename tag value`, async function () {
						this.timeout(timeouts.test);
						const inputs = portal.find(`${valueItemClass} .input input`);
						expect(inputs.length).to.eq(tag.values?.length || 0);
						expect(inputs.length).to.gt(0);

						tag.values[0].value = newTagName;
						expect(inputs.first().val()).to.eq(newTagName);
						expect(portal.find(`${valueItemClass} .bp3-tag`).first().text()).to.eq(newTagName);
					});

					it(`change tag color`, async function () {
						this.timeout(timeouts.test);
						const swatches = portal.find(`${valueItemClass} .TagValuesEditor__swatch`);
						expect(swatches.length).to.eq(tag.values?.length || 0);
						expect(swatches.length).to.gt(0);

						const popupTarget = swatches.first().parents('.bp3-popover-target').first();
						simulateMouseEvent(popupTarget[0], "click");
						await waitSiteNotBusy();

						const colorChooser = $('.bp3-portal .flexbox-fix').last().children('div').first().find('div');
						expect(colorChooser.length).to.gt(0);

						const formatColor = (c) => c ? c.match(/^rgb\(/) ? c.replace(/^rgb\(/, "rgba(").replace(/\)$/, ", 1)") : c : "";
						let setColor = formatColor(colorChooser.css('backgroundColor'));
						simulateMouseEvent(colorChooser[0], "click");
						await waitSiteNotBusy();

						expect(formatColor(tag.values[0].background)).to.eq(setColor);
						expect(formatColor(swatches.first().css('backgroundColor'))).to.eq(setColor);
						expect(formatColor(portal.find(`${valueItemClass} .bp3-tag`).first().css('backgroundColor'))).to.eq(setColor);

						simulateMouseEvent(popupTarget[0], "click");
					});

					it(`can close popup`, async function () {
						this.timeout(timeouts.test);
						const closeBtn = portal.find(`.bp3-dialog-header button`);
						expect(closeBtn.length).to.eq(1);

						simulateMouseEvent(closeBtn[0], "click");
						await sleep(sleepTimes.contextMenuOpenAnimation); //close duration
						portal = $('.bp3-portal').filter((i,p) => {
							return $(p).find('.bp3-heading').text() == "Values for Tag 'xxx'"
						});
						expect(portal.length).to.eq(0);
					});
				});
			});

			describe(`OmdbTagsEditor(CatalogSidebarTags setting)`, function () {

				let $container;
				let objectTypeDescriptors;

				before('', async function () {
					this.timeout(timeouts.render);
					objectTypeDescriptors = pageContext.selectedObjectTypeDescriptors[0];
					$container = mount(<CatalogSidebarTags context={pageContext} objectTypeDescriptor={objectTypeDescriptors}/>).container;
				})

				it(`can load`, async function () {
					this.timeout(timeouts.load);
					$container.find('.CatalogSidebarTags__tags').css('position','absolute');
					await waitCondition(()=>$container.find('.CatalogSidebarTags__tag').length > 0);
					const ui = objectTypeDescriptors.ui;
					expect($container.find('.CatalogSidebarTags__tag').length).to.eq(ui.catalog.tags.length);
				});

				it(`remove tag by item button`, async function () {
					this.timeout(timeouts.test);
					const itemElem = $container.find('.CatalogSidebarTags__tag-name').filter((i,tag)=>$(tag).text() == formattedLabelText).first().parents('.CatalogSidebarTags__tag').first();
					expect(itemElem.length).to.eq(1);

					const ui = objectTypeDescriptors.ui;
					const currentLength = ui.catalog.tags.length;
					simulateMouseEvent(itemElem.find('.bp3-icon-trash').parent().first()[0], "click");
					await waitSiteNotBusy();
					expect(ui.catalog.tags.length).to.eq(currentLength - 1);
					expect($container.find('.CatalogSidebarTags__tag').length).to.eq(currentLength - 1);
				});

				it(`add tag by navbar selection`, async function () {
					this.timeout(timeouts.test);
					const selectElem = $container.find('.bp3-navbar .bp3-button-text').filter((i,s) => $(s).text() == "Add a catalog field...").first().parents('.bp3-popover-target').first();
					expect(selectElem.length).to.eq(1);

					simulateMouseEvent(selectElem[0], "click");
					const ui = objectTypeDescriptors.ui;
					const currentLength = ui.catalog.tags.length;
					const item = $('.bp3-portal .bp3-menu-item').filter((i, mi)=> $(mi).text() == formattedLabelText);
					expect(item.length).to.eq(1);

					simulateMouseEvent(item[0], "click");
					await waitSiteNotBusy();
					expect(ui.catalog.tags.length).to.eq(currentLength + 1);
					expect($container.find('.CatalogSidebarTags__tag').length).to.eq(currentLength + 1);
				});

				it(`remove tag from item contextMeun`, async function () {
					this.timeout(timeouts.test);
					const itemElem = $container.find('.CatalogSidebarTags__tag-name').filter((i,tag)=>$(tag).text() == formattedLabelText).first().parents('.CatalogSidebarTags__tag').first();
					expect(itemElem.length).to.eq(1, 'without main menu item');
					simulateMouseEvent(itemElem[0], "contextmenu");

					const ui = objectTypeDescriptors.ui;
					const currentLength = ui.catalog.tags.length;
					const item = $('.bp3-portal .bp3-menu-item').filter((i, mi) => $(mi).find('.bp3-fill').text() == `Remove "${formattedLabelText}"`).last();
					expect(item.length).to.eq(1, 'without sub menu item');

					simulateMouseEvent(item[0], "click");
					await waitSiteNotBusy();
					expect(ui.catalog.tags.length).to.eq(currentLength - 1);
					expect($container.find('.CatalogSidebarTags__tag').length).to.eq(currentLength - 1);
				});

				it(`add tag from item contextMeun`, async function () {
					this.timeout(timeouts.test);
					const itemElem = $container.find('.CatalogSidebarTags__tag').first();
					simulateMouseEvent(itemElem[0], "contextmenu");

					const ui = objectTypeDescriptors.ui;
					const currentLength = ui.catalog.tags.length;
					const item = $('.bp3-portal .bp3-menu-item').filter((i, mi) => $(mi).text() == formattedLabelText).last();
					expect(item.length).to.eq(1);

					simulateMouseEvent(item[0], "click");
					await waitSiteNotBusy();
					expect(ui.catalog.tags.length).to.eq(currentLength + 1);
					expect($container.find('.CatalogSidebarTags__tag').length).to.eq(currentLength + 1);
				});
			});

			let catalogContext: ObjectCatalogContext;

			async function  getObjectCatalogContext (): Promise<ObjectCatalogContext> {
				if (!catalogContext) {
					const objectTypeDesc: IObjectTypeDescriptor = (await apolloStore.client.query<IOmdbQueryGraph>({
						query:       omdb.graph.objectType,
						variables:   {objectType: Simulation.ObjectType},
						fetchPolicy: "network-only"
					})).data.omdb.objectType;

					catalogContext = new ObjectCatalogContext({objectTypes: [objectTypeDesc]});
					newUserTag = _.find(objectTypeDesc.userTags, tag => tag._id == newUserTag._id);
					//catalogContext = pageContext.catalogContext;
				} else {
					await catalogContext.reset();
				}
				catalogContext.sort('_id', 'asc');
				if (!catalogContext.initialized) {
					await catalogContext.initialize();
					!catalogContext.initialized && await reactionToPromise(()=> catalogContext.initialized, true);
				}
				catalogContext.isLoadingDistinct && await reactionToPromise(() => catalogContext.isLoadingDistinct, false);
				catalogContext.isRunningQuery && await reactionToPromise(()=> catalogContext.isRunningQuery, false);
				return catalogContext;
			}

			async function noOverlay () {
				await waitCondition(() => $('.SortableCardsPanel__catalog-loading-overlay.SortableCardsPanel__loading').length == 0 , 500, timeouts.load);
			}

			async function openContextMenuForTestingUserTag(target) {
				simulateMouseEvent(target, "contextmenu");

				const formattedLabelText = utility.formatLabelText(newUserTag.name);
				let menuItem = $('.bp3-portal .bp3-menu-item').filter((i,cell) => $(cell).find('.bp3-fill').text() == 'Apply User Tag');
				expect(menuItem.length).to.eq(1, 'should have menu item => Apply User Tag');

				simulateMouseEvent(menuItem[0], "mouseover");
				await waitCondition(() => menuItem.parent().is('.bp3-popover-open'));
				await sleep(sleepTimes.hoverSubMenuOpenAnimation);
				let tagMenuItem = $('.bp3-overlay .bp3-menu-item').filter((i,cell) => {
					return $(cell).find('.bp3-fill').text() == formattedLabelText
				});
				expect(tagMenuItem.length).to.gte(1, `should have menu item => ${formattedLabelText}`);

				tagMenuItem = tagMenuItem.last();
				simulateMouseEvent(tagMenuItem[0], "mouseover");
				await waitCondition(() => tagMenuItem.parent().is('.bp3-popover-open'));
				await sleep(sleepTimes.hoverSubMenuOpenAnimation);
				let valueList = $('.bp3-overlay .bp3-overlay .bp3-overlay .bp3-menu-item');
				expect(valueList.length).to.gte(1, `should have menu items under ${formattedLabelText}`);

				return valueList;
			}

			function getTagNames(target) {
				const data = [];
				$(target).find('.bp3-tag').each((i, elem) => data.push($(elem).text()));
				console.log(`[${$(target).find('.UserTagList__tag').length}] ${data}`);
				return data;
			}

			async function applyingTag(target, index: number, shouldInclude = true) {
				let tagNames_before = getTagNames(target);
				let valueList = await openContextMenuForTestingUserTag(target);
				const clickMenu = valueList[index];
				const tagValue = $(clickMenu).find('.bp3-tag').text();
				simulateMouseEvent(clickMenu, "click");
				console.log(`click ${newUserTag.name} / ${tagValue}`);

				await waitCondition(() => !_.isEqual(tagNames_before, getTagNames(target)), 500, timeouts.applyingTag);
				expect(_.includes(getTagNames(target), tagValue)).to.eq(shouldInclude);

				return tagValue;
			}

			async function checkUserTagOnSidebar(tagName, $container) {
				const hasTag = () => {
					const tags = $container.find('.ObjectCatalogSidebar__root .bp3-tag').map((i, elem) => $(elem).text());
					return _.includes(tags, tagName);
				}
				catalogContext.isLoadingDistinct && await reactionToPromise(() => catalogContext.isLoadingDistinct, false);
				if (hasTag) {
					return;
				}
				await waitCondition(hasTag, 500, timeouts.query);
			}

			describe(`SortableCardsPanel userTag test(card)`, function () {

				let $container;

				before(async function () {
					this.timeout(timeouts.load);

					await getObjectCatalogContext();

					$container = mount(<ApolloProvider client={apolloStore.client}><SortableCardsPanel
						catalogContext={catalogContext}
						view={"card"}
						updateUrl={false}
					/></ApolloProvider>).container;
				});

				const getFirstCard = async (rtnJQueryObject = false) => {
					await waitCondition(()=>$container.find('.ui.card').length > 0);
					const testCard = $container.find('.ui.card');
					expect(testCard.length).to.gt(0);
					return rtnJQueryObject ? testCard.first() : testCard[0];
				}

				it('confirm ui setting', function () {
					const uiSetting = catalogContext.getObjectType(Simulation.ObjectType).ui.card;
					const allTags = _.flatten<any>(uiSetting.sections.map(s => s.tags));
					// console.log(`find: ${newUserTag.name}/${newUserTag._id}`);
					// console.log(_.map(allTags, tag => `${tag.name}/${tag._id}`));
					expect(_.some(allTags, tag => tag._id == newUserTag._id))
						.to.eq(true, `tag should exist in ui settings`);
				})

				it(`can load`, async function () {
					this.timeout(timeouts.load);
					await noOverlay();
					await getFirstCard();
				});

				const applyingTag_card = async (index: number) => {
					const tagValue = await applyingTag(await getFirstCard(), index);

					const valueList = await openContextMenuForTestingUserTag(await getFirstCard());
					expect($(valueList[index]).find('.bp3-icon-tick')).to.have.length(1);

					// had tag on card
					// await objectCatalogContextForceUpdate(catalogContext);
					const formattedLabelText = utility.formatLabelText(newUserTag.name);
					let cardSection = (await getFirstCard(true)).find('.SmartCard__tag')
						.filter((i, selection) => {
							return $(selection).find('.SmartCard__tag-label').text() == `${formattedLabelText}:`
						});
					expect(cardSection.length).to.eq(1, `tag ${formattedLabelText} should in the card`);
					expect(cardSection.find('.bp3-tag').length).to.eq(1, `should had 1 tag on card under section ${formattedLabelText}`);
					expect(cardSection.find('.bp3-tag').text()).to.eq(tagValue);

					await checkUserTagOnSidebar(tagValue, $container);
				}

				it(`can apply tag`, async function () {
					this.timeout(timeouts.applyingTag + timeouts.load);
					await applyingTag_card(0);
				});

				it(`can exchange tag`, async function () {
					this.timeout(timeouts.applyingTag + timeouts.load);
					await applyingTag_card(1);
				});
			});

			describe(`ObjectCatalogSidebar filter workable`, function () {

				let $container;
				let numOfCards;

				before(async function () {
					this.timeout(timeouts.load);

					await getObjectCatalogContext();

					$container = mount(<ApolloProvider client={apolloStore.client}><SortableCardsPanel
						catalogContext={catalogContext}
						view={"card"}
						updateUrl={false}
					/></ApolloProvider>).container;
				});

				it('confirm ui setting', function () {
					const uiSetting = catalogContext.getObjectType(Simulation.ObjectType).ui.catalog;
					// console.log(`find: ${newUserTag.name}/${newUserTag._id}`);
					// console.log(_.map(uiSetting.tags, tag => `${tag.name}/${tag._id}`));
					expect(_.some(uiSetting.tags, tag => tag._id == newUserTag._id))
						.to.eq(true, `tag should exist in ui settings`);

					const userTags = catalogContext.getObjectType(Simulation.ObjectType).userTags;
					userTags.forEach(userTag => {
						console.log(`userTag ===== ${userTag._id}/${userTag.name}, values: ${userTag.values.map(v => `${v._id}/${v.value||v.tag}`)}`);
					})
				})

				const filters = [];
				it (`should have data with tag`, async function () {
					this.timeout(timeouts.load);
					catalogContext.isRunningQuery && await reactionToPromise(() => catalogContext.isRunningQuery, false);
					await catalogContext.runQuery(true);
					await sleep(100); // runQuery has a debounce delay
					catalogContext.isRunningQuery && await reactionToPromise(() => catalogContext.isRunningQuery, false);
					expect(catalogContext.queryResults.size).to.gt(0, `the length of query data should bigger than 0`);

					catalogContext.pageResults.forEach( r => {
						_.forEach(r.userTagValues, utv => {
							// console.log(`${utv.tag.name} == ${newTagName}  && !_.includes(${filters}, ${utv._id})`)
							if (utv.tag.name == newTagName && !_.includes(filters, utv._id)) {
								filters.push(utv.value);
							}
						});

					});

					console.log(`record with tag values: ${filters}`);
					expect(filters.length).to.gte(1, "record should had 1 user Tag");

					await noOverlay();
					numOfCards = $container.find('.SmartCard__smart-card').length;
				});

				it(`can filter`, async function () {
					this.timeout(timeouts.test);
					catalogContext.extraWhere = {[newTagName]: filters};
					await catalogContext.runQuery(true);
					await sleep(100); // runQuery has a debounce delay
					catalogContext.isRunningQuery && await reactionToPromise(() => !catalogContext.isRunningQuery, true);
					await noOverlay();

					await waitCondition(() => {
						return pageContext.userTags.length > 0 &&
							pageContext.userTags.length != numOfCards
					});
					expect($container.find('.SmartCard__smart-card').length).to.eq(1);
				});

				it(`can cancel filter`, async function () {
					this.timeout(timeouts.test);
					catalogContext.extraWhere = {};
					await catalogContext.runQuery(true);
					await sleep(100); // runQuery has a debounce delay
					catalogContext.isRunningQuery && await reactionToPromise(() => !catalogContext.isRunningQuery, true);
					await noOverlay();

					await waitCondition(() => $container.find('.SmartCard__smart-card').length > 1);
					expect($container.find('.SmartCard__smart-card').length).to.eq(numOfCards);
				});
			});

			describe(`SortableCardsPanel userTag test(table)`, function () {

				let $container;

				before(async function () {
					this.timeout(timeouts.load);
					await getObjectCatalogContext()

					const ui = catalogContext.objectTypes[0].ui;
					$container = mount(<ApolloProvider client={apolloStore.client}><SortableCardsPanel
						catalogContext={catalogContext}
						view={"table"}
						uiDefinition={ui}
						updateUrl={false}
					/></ApolloProvider>).container;
				});

				after(async function () {
					await sleep(1000); // There is a 500ms timeout in blueprints table code (viewSyncDelay in tableQuadrantStack) that might run after the component is destroyed
				})

				let columnClass;
				const getTestCell = (rtnJQueryObject = false) : any => {
					let cell = $(`.bp3-table-cell-row-0.${columnClass}`);
					expect(cell.length).to.eq(1, `test cell should be found. (.bp3-table-cell-row-0.${columnClass})`);
					return rtnJQueryObject ? cell : cell[0];
				}

				it('confirm ui setting', function () {
					const uiSetting = catalogContext.getObjectType(Simulation.ObjectType).ui.table;
					// console.log(`find: ${newUserTag.name}/${newUserTag._id}`);
					// console.log(_.map(uiSetting.columns, tag => `${tag.name}/${tag._id}`));
					expect(_.some(uiSetting.columns, column => column._id == newUserTag._id))
						.to.eq(true, `tag should exist in ui settings`);
				})

				it(`can load`, async function () {
					this.timeout(timeouts.load);

					await noOverlay();
					catalogContext.isRunningQuery && await reactionToPromise(() => catalogContext.isRunningQuery, false);
					expect(catalogContext.queryResults.size).to.gt(0, `the length of query data should bigger than 0`);

					await waitCondition(()=>$container.find('.bp3-table-container').length > 0);
					await waitCondition(()=>$container.find('.bp3-table-column-name').length > 0);
					expect($container.find('.bp3-table-column-name').length).to.gt(0, `the table should created. the cell header should greater than 0`);
				})

				it(`can find user tag column in table`, async function () {
					this.timeout(timeouts.load);

					let scrollContainer = $container.find('.bp3-table-quadrant-scroll-container');
					const labelText = newUserTag.name;
					// console.log(`find: ${formattedLabelText}`);
					await waitCondition( () => {
						// console.log($container.find('.bp3-table-column-name-text').map((i, headerCell) => $(headerCell).text()))
						$container.find('.bp3-table-column-name-text').each((i, headerCell) => {
							if (!columnClass && $(headerCell).text() == labelText) {
								$(headerCell).parents('.bp3-table-header').first().attr('class').split(/\s+/).forEach( c => {
									if (c.match(/^bp3-table-cell-col-(\d+)$/)) {
										columnClass = c;
									}
								});
							}
						});
						if (!columnClass) {
							scrollContainer.scrollLeft(scrollContainer.scrollLeft() + 500);
						}
						return !!columnClass;
					}, 200 , timeouts.load);
					console.log(`columnClass = ${columnClass}`)
					getTestCell();
				});

				it(`had tag in table`, async function () {
					this.timeout(timeouts.load);
					let userTagCell = getTestCell(true);
					expect(userTagCell.find('.bp3-tag').length).to.eq(1);
				});

				it.skip(`can exchange tag`, async function () {
					this.timeout(timeouts.applyingTag);
					const tagValue = await applyingTag(getTestCell(), 0);

					const valueList = await openContextMenuForTestingUserTag(getTestCell());
					expect($(valueList[0]).find('.bp3-icon-tick')).to.have.length(1);

					// had tag on table
					// await objectCatalogContextForceUpdate(catalogContext);
					const userTagCell = getTestCell(true);
					const formattedLabelText = utility.formatLabelText(newUserTag.name);
					expect(userTagCell.find('.bp3-tag').length).to.eq(1, `should had 1 tag on card under section ${formattedLabelText}`);
					expect(userTagCell.find('.bp3-tag').text()).to.eq(tagValue);

					await checkUserTagOnSidebar(tagValue, $container);
				});

				it.skip(`can unapply Tag`, async function () {
					this.timeout(timeouts.applyingTag);
					const tagValue = await applyingTag(getTestCell(), 0, false);

					const valueList = await openContextMenuForTestingUserTag(getTestCell());
					expect(valueList.find('.bp3-icon-tick')).to.have.length(0);

					catalogContext.isLoadingDistinct && await reactionToPromise(() => catalogContext.isLoadingDistinct, false);
				});
			});

			describe(`OmdbTagsEditor(delete)`, function () {

				const nameCellClass = '.bp3-table-body-cells .bp3-table-cell-col-0';

				before('', async function () {
					this.timeout(timeouts.render);
					mount(<OmdbTagsEditor context={pageContext} />);

					await waitCondition(()=>$('.bp3-table-body-cells').length > 0);
				})

				it(`delete Tag`, async function () {
					this.timeout(timeouts.test);
					let renameCell = $(nameCellClass).filter((i, cell) => $(cell).text() == newTagName);
					expect(renameCell.length).to.gte(1);

					let newTagRowClass;
					renameCell.attr('class').split(/\s+/).forEach( c => {
						if (c.match(/^bp3-table-cell-row-(\d+)$/)) {
							newTagRowClass = c;
						}
					});

					let delBtn = $(`.${newTagRowClass} .bp3-button`).filter((i,c) => $(c).find('.bp3-icon-trash').length > 0);
					expect(delBtn.length).to.gte(1);

					const currentTagLength = $('.bp3-table-body-cells .bp3-table-cell-col-0').length;
					expect(pageContext.userTags.length).to.eq(currentTagLength, 'number of user tag row should match data');
					simulateMouseEvent(delBtn[0], 'click');
					await reactionToPromise(() => pageContext.userTags.length , currentTagLength-1);
					await waitSiteNotBusy();
					expect($('.bp3-table-body-cells .bp3-table-cell-col-0').length).to.eq(currentTagLength-1, `Amount of row should -1`);
				});
			});
		});
	}
}

testScheduler.register(new UserTagTests());