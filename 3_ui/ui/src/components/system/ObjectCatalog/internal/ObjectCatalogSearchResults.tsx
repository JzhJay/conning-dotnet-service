import * as css from './ObjectCatalogSearchResults.css'
import {observer} from 'mobx-react';
import {} from 'components'
import {ObjectCatalogContext} from 'stores'

interface MyProps {
	context: ObjectCatalogContext;
}

@observer
export class ObjectCatalogSearchResults extends React.Component<MyProps, {}> {
	render() {
		return (
			<div className={css.root}>
				Search Results
			</div>
		);
	}
}
