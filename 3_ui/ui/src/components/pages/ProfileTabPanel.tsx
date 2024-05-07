import {EditableText, Intent} from '@blueprintjs/core';
import {computed, observable} from 'mobx';
import {appIcons} from '../../stores';
import {AppIcon} from '../widgets';
import * as css from './ProfileTabPanel.css';

import {site, routing, ActiveTool, user} from 'stores'
import {sem, ApplicationPage, bp} from 'components'
import {observer} from 'mobx-react';

//var ReactCardFlip: any = require('react-card-flip');

const {List, Card, Grid, Image} = sem;

/*
@observer
export class ProfileTabPanel extends React.Component<{}, {}> {
	@observable cardState = "view";

	render() {
		const {profile}   = user;
		const {cardState} = this;

		return null;

		return !profile ? null : (
			<div className={css.root}>
				<ReactCardFlip isFlipped={cardState != "view"}>
					<Card as='div' className={css.card} key="front">
						<Card.Content className={css.content}>
							<Grid columns={5} as="div" className={css.form}>
								<Grid.Row>
									<Grid.Column width={7}>
										<Image className={css.profilePic} src={profile.picture}/>
									</Grid.Column>
								</Grid.Row>

								<Grid.Row className={css.row}>
									<Grid.Column width={7}>
										Name
									</Grid.Column>
									<Grid.Column width={7}>
										{profile.name}
									</Grid.Column>
								</Grid.Row>

								<Grid.Row className={css.row}>
									<Grid.Column width={7}>
										Email
									</Grid.Column>
									<Grid.Column width={7}>
										<List className={css.value}>
											{user.emails.map((email, i) => <List.Item key={i.toString()}>{email.value}</List.Item>)}
										</List>
									</Grid.Column>
									<Grid.Column className={css.button} width={1} onClick={() => this.cardState = "editEmail"}>
										<AppIcon icon={{type: 'blueprint', name: 'chevron-right'}} className="iconic-sm"/>
									</Grid.Column>
								</Grid.Row>

								<Grid.Row className={css.row}>
									<Grid.Column width={7}>
										Phone
									</Grid.Column>
									<Grid.Column width={7}>
										<List className={css.value}>
											{user.phoneNumbers.map((phone, i) => <List.Item key={i.toString()}>{phone.value}</List.Item>)}
										</List>
									</Grid.Column>
									<Grid.Column className={css.button} width={1} onClick={() => this.cardState = "editPhoneNumbers"}>
										<AppIcon icon={{type: 'blueprint', name: 'chevron-right'}} className="iconic-sm"/>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Card.Content>
					</Card>
					<ManageNotificationEndpointsPanel key="back" isEditingEmails={cardState == "editEmail"}/>
				</ReactCardFlip>
			</div>);
	}
}

@observer
export class ManageNotificationEndpointsPanel extends React.Component<{ isEditingEmails?: boolean }, {}> {
	@computed get entryContainer() {
		return this.props.isEditingEmails ? user.emails : user.phoneNumbers
	}

	addEntry = () => {
		this.entryContainer.push(undefined)
	}

	@observable errorEntry  = -1;
	@observable updateCount = 0;

    editEntry   = (index, entry) => {
    	const {isEditingEmails} = this.props;
        let error = false;
        var num   = parseNumber(entry, 'US');
        if (isEditingEmails && !this.validateEmail(entry)) {
            error = true;
        }
        else if (!isEditingEmails) {
            let number = parseNumber(entry, 'US');
            if (Object.keys(number).length == 0)
	            error = true;
            else {
	            entry = formatNumber(entry, 'US', 'International');
	            this.updateCount++; // Force field to refresh
            }
        }

        if (error)
            this.errorEntry = index;
        else
            this.entryContainer[index] = entry
    }

	validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	deleteEntry = (index) => {
		this.entryContainer.splice(index, 1)
	}

	render() {
		const {props: {isEditingEmails}} = this;
		const {emails} = user;
		const offset            = isEditingEmails ? 1 : 0;
		const entryContainer    = isEditingEmails ? emails : user.phoneNumbers;

		return (
			<Card as='div' className={css.card}>
				<Card.Content className={css.content}>
					<List>
						{entryContainer.map((entry, i) =>
							<List.Item key={`${i}${entry.value}${this.updateCount}`} style={{display: 'flex'}}>
								<EditableText
									intent={i - offset > 0 && this.errorEntry == i - offset ? Intent.DANGER : Intent.NONE}
									onChange={() => this.errorEntry = -1}
									defaultValue={entry.value}
									disabled={isEditingEmails && i == 0}
									onConfirm={(entry) => this.editEntry(i - offset, entry)}/>
								{(!isEditingEmails || i > 0) && <AppIcon style={{marginLeft: "auto"}} icon={{type: 'blueprint', name: 'delete'}} onClick={() => this.deleteEntry(i - offset)}/>}
							</List.Item>)}
						<List.Item><AppIcon className={css.add} style={{margin: "auto"}} icon={{type: 'blueprint', name: 'add'}} onClick={this.addEntry}/></List.Item>
					</List>
				</Card.Content>
			</Card>)
	}
}
*/