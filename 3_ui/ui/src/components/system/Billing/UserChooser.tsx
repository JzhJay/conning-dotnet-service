import {MenuItem} from '@blueprintjs/core';
import {MultiSelect} from '@blueprintjs/select';
import { observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import * as mobx from 'mobx';
import type {JuliaUser} from 'stores';
import {user} from 'stores';

var UserMultiSelect = MultiSelect.ofType<JuliaUser>();


interface MyProps {
	multiple?: boolean;
}

@observer
export class UserChooser extends React.Component<MyProps,{}> {
    @observable selectedUsersMap = observable.map<string, JuliaUser>();

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    get selectedUsers() {
		return Array.from(this.selectedUsersMap.values())
	}

    render() {
		const {selectedUsersMap, selectedUsers, props: {}} = this;

		return <UserMultiSelect resetOnSelect={true}
		                        tagRenderer={(user: JuliaUser) => user.fullName}
		                        items={Array.from(user.users.values())}
		                        selectedItems={selectedUsers}
		                        itemListPredicate={(query, items) => {
			                        var needleRegExp = new RegExp(query, "i");
		                        	return items.filter(u => (u.fullName && needleRegExp.test(u.fullName)) || needleRegExp.test(u.email))
		                        }}
		                        onItemSelect={user => {
			                        if (selectedUsersMap.has(user._id)) {
				                        selectedUsersMap.delete(user._id);
			                        }
			                        else {
				                        selectedUsersMap.set(user._id, user);
			                        }

			                        //pageContext.isDirty = true;
		                        }}
		                        itemRenderer={(user: JuliaUser, {modifiers, handleClick}) => {
			                        if (!modifiers.matchesPredicate) {
				                        return null;
			                        }
			                        return (
				                        <MenuItem
					                        active={modifiers.active}
					                        icon={selectedUsersMap.has(user._id) ? "tick" : "blank"}
					                        key={user._id}
					                        onClick={handleClick}
					                        text={`${user.fullName} (${user.email})`}
					                        shouldDismissPopover={false}
				                        />
			                        );
		                        }}
								onRemove={(tag, i) => {
									selectedUsersMap.delete(mobx.values(selectedUsersMap).find(t => t.fullName == tag.fullName)._id);
									//pageContext.isDirty = true;
								}}
		                        tagInputProps={{
			                        tagProps:   (v, i) => ({minimal: true}),
			                        inputProps: {placeholder: selectedUsersMap.size == 0 ? 'All Users' : 'Select More...'},
		                        }}/>
	}
}