import {api} from "stores";

import * as css from './SiteHeader.css'
import {observer} from 'mobx-react';

@observer
export class DocumentStatusIndicator extends React.Component<{}, {}> {
    render() {
        return (
            <span className={css.saveIndicator}>
                {api.site.header.status}
            </span>
        )
    }
}

