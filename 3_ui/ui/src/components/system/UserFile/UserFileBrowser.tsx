import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {GenericCommentsEditor} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import {ObjectTypeQuery} from '../../../stores/objectMetadata/OmdbGraph';
import {UserFile} from '../../../stores/userFile';
import {settings, ObjectCatalogContext, omdb, site} from "stores";
import {SortableCardsPanel} from '../../widgets/SmartBrowser/SortableCardsPanel';
import {bp, LoadingUntil, ErrorMessage, ObjectBrowserProps} from 'components';
import {Observer, observer} from 'mobx-react'
import { observable, makeObservable } from 'mobx';
import {UserFileCardToolbarButtons} from "./UserFileCard";

@observer
export class UserFileBrowser extends React.Component<ObjectBrowserProps<UserFile>, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    componentDidMount() {
		this.$node = $(ReactDOM.findDOMNode(this))
	}

    get preferences() {
		return settings.searchers.userFile;
	}

    @observable panel: SortableCardsPanel;
    @observable catalogContext      = new ObjectCatalogContext({objectTypes: [{id: UserFile.ObjectType}]});

    rename = (userFile) => {
		return async (val) => {
			try {
				site.busy = true;
				await userFile.rename(val);
				if (this.catalogContext && this.catalogContext.isHierarchicalViewEnabled) {
					await this.catalogContext.refresh();
				}
			} finally {
				site.busy = false;
			}
		}
	}

	getObjectTypeForRender = _.memoize((objectType) => {
		const { catalogContext } = this;
		const newObjectType = _.cloneDeep(objectType);
		const { ui } = newObjectType;
		const nameColumn = ui.table.columns.find(f => f.name == SortableCardsPanel.NAME_FIELD);
		nameColumn && ( nameColumn.renderValue = (model) => <GenericNameEditor model={model} catalogContext={catalogContext} /> );

		const actionsColumn = ui.table.columns.find(f => f.name == SortableCardsPanel.ACTIONS_FIELD);
		if (actionsColumn) {
			actionsColumn.renderValue = (userFile) => <UserFileCardToolbarButtons userFile={userFile} className={classNames(bp.Classes.BUTTON_GROUP, bp.Classes.MINIMAL)} onDelete={catalogContext.delete} onDuplicate={catalogContext.insert}/>
		}
		return newObjectType;
	})

    render() {
		const {preferences, catalogContext, props:{ view: propsView}} = this;

		return <ObjectTypeQuery query={omdb.graph.objectType} variables={{objectType: UserFile.ObjectType}}>
			{({loading, error, data}) => {
				if (!loading && !error) {
					setTimeout(() => catalogContext.replaceNewObjectTypes([this.getObjectTypeForRender(data.omdb.objectType)]), 0);
				}

				return <LoadingUntil loaded={!loading}>
					{error ? <ErrorMessage error={error}/>
					: <Observer>{() => {
						const objectType = this.getObjectTypeForRender(data.omdb.objectType);
						const { ui } = objectType;

						const commentsColumn = ui.table.columns.find(f => f.name == SortableCardsPanel.COMMENTS_FIELD);
						commentsColumn && ( commentsColumn.renderValue = (model) => <GenericCommentsEditor model={model} panel={this.panel} /> );

						return <SortableCardsPanel ref={panel => this.panel = panel}
						                           objectType={UserFile.ObjectType}
						                           {...this.props}
						                           selectable
						                           view={propsView || preferences.view}
						                           onSetView={v => preferences.view = v}

						                           catalogContext={catalogContext}
						                           hideToolbar={propsView != null}
						                           showUserFilter={true}
						                           uiDefinition={ui}
						                           tags={objectType.tags}

						/>
					}}</Observer>}
				</LoadingUntil>
			}}
		</ObjectTypeQuery>
	}

    static defaultProps = {
		allowDelete: true,
	}


    $node: JQuery;
    _toRemove = [];

    componentWillUnmount() {
		this._toRemove.forEach(f => f());
		this.catalogContext?.dispose();
	}
}
