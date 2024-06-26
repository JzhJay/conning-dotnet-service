import {FormattedMessage} from 'react-intl';
import {AppIcon, bp, sem} from 'components';
import type {DashboardTypeSetting} from 'components/pages/dashboard/DashboardTypeSettings';
import {dashboardTypeSettings} from 'components/pages/dashboard/DashboardTypeSettings';
import type {IOmdbQueryResult} from 'stores';
import {appIcons, omdb, settings, user, i18n } from 'stores';
import {formatLabelText} from 'utility';
import {observer} from 'mobx-react';
import {computed, observable, makeObservable, action} from 'mobx';
import * as css from './DashboardPanel.css';
import * as pageCss from './DashboardPage.css';

@observer
export class DashboardPanel extends React.Component<{setting: DashboardTypeSetting}, {}> {
	constructor(props) {
		super(props);
	}

    componentDidMount(): void {
		this.props.setting.onPanelComponentDidMount && this.props.setting.onPanelComponentDidMount();
	}

    render() {
		const setting = this.props.setting;
		if (!setting) { return null; }
		if (!setting.browse && !setting.open && !setting.create ) { return null; } // without any functions


		return (
			<div className={classNames([css.root, css.typeBlock, css[setting.type]])} data-type={setting.type}>
				<div className={css.iconOuter}>
					{setting.icon.type != "blueprint" ?
					 <AppIcon icon={setting.icon} fitted large className={css.icon} iconningSize={48}/> :
					 <bp.Icon icon={setting.icon.name as any} iconSize={100}/>
					}
				</div>
				<div className={css.ctrlOuter}>
					<h4 className={css.title}>{setting.displayTitle || formatLabelText(setting.type)}</h4>
					<div className={css.ctrls}>
						<bp.ButtonGroup>
							{setting.create && <bp.Tooltip position={bp.Position.BOTTOM} content={setting.preventCreateMessage} intent={bp.Intent.DANGER}>
								<bp.Button text={setting.createButtonText || i18n.intl.formatMessage({defaultMessage: 'New', description: 'Create a new object'})} disabled={setting.preventCreateMessage != null}  className={classNames([pageCss.roundBtn, css.createBtn])} onClick={setting.create} />
							</bp.Tooltip>}
							{setting.open   && <bp.Button text={setting.openButtonText   || i18n.intl.formatMessage({defaultMessage: 'Open', description: 'Open a object'})} className={pageCss.roundBtn} onClick={setting.open} />}
							{setting.browse && <bp.Button text={_.first(setting.browseButtons)?.buttonText || i18n.intl.formatMessage({defaultMessage: 'Browse', description: 'Browse Objects'})} className={pageCss.roundBtn} onClick={() => setting.browse(_.first(setting.browseButtons)?.params)} />}
							{setting.browse && setting.browseButtons.length > 1 && <bp.Popover content={
								<bp.Menu>{
									setting.browseButtons.map((btnProp, i) => {
										if (i == 0) { return null;}
										return <bp.MenuItem key={`DashboardPanel_${setting.type}_browser_${i}`} text={btnProp.buttonText} onClick={() => setting.browse(btnProp.params)} />
									})
								}</bp.Menu>
							} position={bp.Position.BOTTOM_RIGHT}>
								<bp.Button icon={<AppIcon icon={appIcons.dropdown} />} className={pageCss.roundBtn}/>
							</bp.Popover>}
						</bp.ButtonGroup>
					</div>
				</div>
			</div>
		)
	}
}

@observer
export class RecentPanel extends React.Component<{queryTypes?:String[]}, {}> {
    @observable myRecent: boolean = false;

    @observable dataList: any[];

    @observable loading = 0;

    queryTypes: DashboardTypeSetting[];
	queryObjectTypes: string[];

	constructor(props) {
		super(props);

		makeObservable(this);

		this.queryTypes = ( this.props.queryTypes?.length ? this.props.queryTypes.map((queryType) => {
			return _.find(dashboardTypeSettings.get(), ts => ts.type == queryType);
		}) : dashboardTypeSettings.get()).filter(s => s?.applicable && s?.cardCreator);

		this.queryObjectTypes = _.uniq(this.queryTypes.map((setting)=> setting.type));

		this.updateDataList("recent");
	}

    @computed get selectTab() {
		return this.myRecent ? "myRecent" : "recent";
	}

    reloadList = () => {
		this.updateDataList(this.selectTab);
	}

    updateDataList = (newTabId) => {
		this.myRecent = (newTabId == 'myRecent');
		this.dataList = [];
		this.queryRecent();
	}

    getItemLastUpdateTime = (detail): number => {
		const modifiedTime = detail.modifiedTime;
		const createdTime = detail.createdTime;
		return modifiedTime ? new Date(modifiedTime).getTime() : createdTime ? new Date(createdTime).getTime() : 0;
	}

    checkReturnList = (result: IOmdbQueryResult): boolean => {
		if (!result || !result.results || !result.results.length) {
			return false;
		}
		return true;
	}

    insertItemToList = (detail): void => {
		const item_time = this.getItemLastUpdateTime(detail);
		let insertIndex = 0;
		this.dataList.forEach((d)=>{
			const d_time = this.getItemLastUpdateTime(d)
			if (d_time > item_time) {
				insertIndex++;
			}
		})
		if (insertIndex >= this.dataList.length) {
			this.dataList.push(detail);
		} else {
			this.dataList.splice(insertIndex,null,detail);
		}
	}

    @action queryRecent = async () => {
		if (!this.queryObjectTypes?.length) return;

		this.loading += 2;
		omdb.runQuery({
			objectTypes: this.queryObjectTypes,
			limit:       settings.maxRecentItems,
			sortBy:      'modifiedTime',
			sortOrder:   'desc',
			where:       this.myRecent ? {createdBy:[user.currentUser.sub]} : {}
		}).then(action((value) => {
			if (this.checkReturnList(value.result)) {
				value.result.results.forEach((qd) => {
					if(!qd.modifiedTime){ return; }
					this.insertItemToList(qd);
				})
			}
			this.loading--;
		}));

		// Run a second query to only pick up items with modifiedTime == null. These items may need to still appear in the results list if they were newly created but never modified.
		// The first query is sorted and limited so these newly created items may not be returned in the first query.
		omdb.runQuery({
			objectTypes: this.queryObjectTypes,
			limit:       settings.maxRecentItems,
			sortBy:      'modifiedTime',
			sortOrder:   'desc',
			where:       this.myRecent ? {createdBy:[user.currentUser.sub], modifiedTime: null} : {modifiedTime: null}
		}).then(action((value) => {
			if (this.checkReturnList(value.result)) {
				value.result.results.forEach((qd) => {
					this.insertItemToList(qd);
				})
			}
			this.loading--;
		}));
	}

	private refresher_id: string;
    componentDidMount() {
		if (this.queryObjectTypes?.length) {
			this.refresher_id = omdb.registerQueryRefreshers({
				objectTypes: this.queryObjectTypes,
				refresher: () => this.updateDataList(this.selectTab)
			})
		}
    }

	componentWillUnmount() {
		this.refresher_id && omdb.removeSavedQueryRefreshers(this.refresher_id);
	}

	render() {
		return (
			<div className={classNames([css.root, css.recentBlock])}>
				<bp.Tabs id="TabsExample" onChange={this.updateDataList} selectedTabId={this.selectTab}>
					<bp.Tab id="recent" title={<FormattedMessage defaultMessage="Recent" description="Recent Items" />} />
					<bp.Tab id="myRecent" title={<FormattedMessage defaultMessage="My Recent" description="My Recent Items" />} />
				</bp.Tabs>
				{(this.loading != 0) ?
				<div className={css.loading}><bp.Spinner/></div> :
				(!this.dataList || !this.dataList.length) ?
				<sem.Message className={css.noCards} warning>
					<sem.Message.Header>Search returned no results.</sem.Message.Header>
				</sem.Message> :
				<div className={css.smartCards}>
					{this.dataList && this.dataList.filter((d, i) => i < settings.maxRecentItems).map((d) => <RecentCard key={d._id} cardData={d} reloadList={this.reloadList}/>)}
				</div>}
			</div>
		)
	}
}


export class RecentCard extends React.Component<{cardData:any, reloadList: () => void}, {}> {

	smartCartEvents = {
		onDuplicate: this.props.reloadList,
		onDelete: this.props.reloadList,
	}

	statusText = [
		i18n.intl.formatMessage({defaultMessage: 'more...', description: 'More Information'}),
		i18n.intl.formatMessage({defaultMessage: 'less...', description: 'Less Information'})
	]

	changeStatus = (e) => {
		const $target = $(e.target);
		let showAllCard = $target.text() == this.statusText[0];
		$target.text(showAllCard ? this.statusText[1] : this.statusText[0]);
		$target.parent().toggleClass(css.smartCardHover,showAllCard);
	}

	render() {

		const data = this.props.cardData;
		const setting = _.find(dashboardTypeSettings.get(), ts => ts.type == data.__typename);
		if (!setting?.cardCreator) {
			return <></>;
		}
		const smartCard = setting.cardCreator(data, this.smartCartEvents);

		return <div className={classNames([css.smartCard])}>
		    {smartCard}
		    <div className={css.toggle} onClick={this.changeStatus}>{this.statusText[0]}</div>
		</div>
	}
}
