import type {IconName} from '@blueprintjs/core';
import {Alignment, Navbar, NavbarDivider, NavbarGroup} from '@blueprintjs/core';
import { action, computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {bp, OmdbAdminPageContext} from 'components';
import * as React from 'react';
import type {IObjectTypeDescriptor} from 'stores';
import {appIcons, i18n} from 'stores';
import {OmdbCardBuilder} from './CardBuilder';
import {OmdbTableBuilder} from './TableBuilder';
import * as css from './OmdbUiLayoutTab.css';

@observer
export class OmdbUiLayoutTab extends React.Component<{context: OmdbAdminPageContext, objectTypeDescriptor: IObjectTypeDescriptor}, {}> {
    _omdbCardBuilder;
    _omdbTableBuilder;

    constructor(
        props: {context: OmdbAdminPageContext, objectTypeDescriptor: IObjectTypeDescriptor}
    ) {
        super(props);
        makeObservable(this);
    }

    @computed get viewIsCard() {
		return (this.props.context.preferences.previewView || 'card') != 'table';
	}

    set view(v) {
		this.props.context.preferences.previewView = v;
	}

    @observable isDirty = false;

    @action reset = () => {
		this.viewIsCard ? this._omdbCardBuilder?.reset() : this._omdbTableBuilder?.reset();
	}

    render() {
		const {viewIsCard, props:{context, objectTypeDescriptor}} = this;
		const icons = appIcons.widgets.sortableCardsPanel;

		const cardsTab = i18n.common.WORDS.BROWSER_CARDS_VIEW;
	    const tableTab = i18n.common.WORDS.BROWSER_TABLE_VIEW;
	    const resetTab = i18n.intl.formatMessage({defaultMessage:`Reset`, description: "[OmdbUiLayoutTab] Reset the layout setting changes since switch to the page or view"});

		return <div className={css.layouts}>
			<Navbar>
				<NavbarGroup align={Alignment.RIGHT}>
					<NavbarDivider/>

					<bp.ButtonGroup>
						<bp.Button icon={icons.cardView.name as IconName} text={cardsTab} active={viewIsCard} onClick={() => this.view = 'card'}/>
						<bp.Button icon={icons.tableView.name as IconName} text={tableTab} active={!viewIsCard} onClick={() => this.view = 'table'}/>
					</bp.ButtonGroup>

					<NavbarDivider/>

					<bp.ButtonGroup>
						<bp.Button disabled={!this.isDirty} onClick={this.reset} text={resetTab}/>
					</bp.ButtonGroup>
				</NavbarGroup>
			</Navbar>
			{ viewIsCard && <OmdbCardBuilder context={context} objectTypeDescriptor={objectTypeDescriptor} tab={this} ref={ r => this._omdbCardBuilder = r}/> }
			{ !viewIsCard && <OmdbTableBuilder context={context} objectTypeDescriptor={objectTypeDescriptor} tab={this} ref={ r => this._omdbTableBuilder = r}/> }
		</div>
	}
}