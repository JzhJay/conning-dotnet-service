import gql from 'graphql-tag';
import {Query} from '@apollo/client/react/components';
import * as css from './ObjectCatalogDemoPage.css';
import {ApplicationPage, bp, LoadingUntil, sem} from 'components';
import {settings, site, ActiveTool, Link, SUPPORT_EMAIL, omdb, fragments, IOmdbQueryGraph} from 'stores';
import {observer} from 'mobx-react';
import { observable, autorun, computed, runInAction, makeObservable } from "mobx";
import {ObjectCatalog} from './ObjectCatalog';

interface QueryString {
	poppedOut?: boolean;
}

interface MyProps {
	params?: { instanceKid?: string, docEntryId?: string, model?: string }
	location?: HistoryModule.LocationDescriptorObject;
}

@observer
export class ObjectCatalogDemoPage extends React.Component<MyProps, {}> {
	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get tags() { return [];}

    catalog: ObjectCatalog;

    render() {
		const {tags, catalog} = this;

		return (
			<ApplicationPage id="object-catalog-demo-page"
			                 className={classNames(css.root)}
			                 title={() => 'Object Catalog (Demo)'}
			                 breadcrumbs={() => [
				                 <div className={bp.Classes.BREADCRUMB}>
					                 <bp.AnchorButton className={bp.Classes.MINIMAL} icon="lightbulb">Object Metadata (Demo)</bp.AnchorButton>
				                 </div>
			                 ]}>
				<Query query={
					gql`
						${fragments.objectType}
						query getAllObjectTypes {
							omdb {
								objectTypes {
									...objectType
								}
							}
						}
				`}>
					{({data, loading, error = null}) => {
						var objectTypes = data as IOmdbQueryGraph;

						console.log(objectTypes?.omdb?.objectTypes?.map(ot => ot.id));
						//["Simulation","ClimateRiskAnalysis","Query","InvestmentOptimization","UserFile"]
						//

						return <LoadingUntil className={classNames("pusher")}
						                     message={'Loading tags...'}
						                     loaded={tags && !loading}>
							<ObjectCatalog ref={r => this.catalog = r} objectTypes={objectTypes && objectTypes.omdb && objectTypes.omdb.objectTypes?.filter((ot) => _.indexOf(["Simulation","ClimateRiskAnalysis","Query","InvestmentOptimization","UserFile"], ot.id) >= 0)}/>

						</LoadingUntil>
					}}
				</Query>
			</ApplicationPage>
		)
	}
}