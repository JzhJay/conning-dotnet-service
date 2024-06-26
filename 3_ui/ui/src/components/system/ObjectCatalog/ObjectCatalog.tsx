import {Hotkey} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {SortableCardsPanel} from '../../widgets/SmartBrowser';
import * as css from './ObjectCatalog.css';
import type {IObjectTypeDescriptor} from 'stores';
import {ObjectCatalogContext, user, settings} from 'stores';
import Splitter from 'm-react-splitters';
import { computed, observable, makeObservable } from 'mobx';
import {AutoSizer} from 'react-virtualized'
import {ObjectCatalogSearchResults, ObjectCatalogSidebar} from './internal';

interface MyProps {
	objectTypes?: Array<IObjectTypeDescriptor>;
}

@observer
export class ObjectCatalog extends React.Component<MyProps, {}> {
    @observable catalogContext : ObjectCatalogContext;

	constructor(props) {
		super(props);

		makeObservable(this);

		this.catalogContext = new ObjectCatalogContext({view: this.prefs.view});

		this.catalogContext.objectTypes.replace(this.props.objectTypes);
		this.catalogContext.reset();
	}

    componentDidUpdate() {
		this.catalogContext.objectTypes.replace(this.props.objectTypes);
		this.catalogContext.reset();
	}

	componentWillUnmount(): void {
		this.catalogContext?.dispose();
	}

    @computed get prefs() { return settings.catalog}

    render() {
		const {catalogContext, prefs, props} = this;

		return <div className={css.root}>
			<SortableCardsPanel
				view={prefs.view}
				selectable multiselect
				onSetView={v => prefs.view = v}
				showUserFilter={true}
				catalogContext={catalogContext}/>
		</div>
	}
}