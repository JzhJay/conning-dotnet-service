import {apolloStore} from '../index';
import {getGraphqlQueryFunctionComponent} from '../objectMetadata/OmdbGraph';

export interface ConningUser {
	name: string;
	nickname: string;
	picture: string;
	_id: string;
	username?: string;
	fullName?: string;
	lastLogin?: Date;
	phoneNumber?: string;
	phoneVerified?: boolean;
	email?: string;
	emailVerified?: boolean;
	createdAt: Date;
}

export const GetUserQuery = getGraphqlQueryFunctionComponent<{user: {get?: ConningUser}}, {id: string}>();

export class ConningUserComponent extends React.Component<{id: string}, {}> {
	render() {
		const {id} = this.props;
		return <GetUserQuery query={apolloStore.graph.user.get} variables={{id: id}}>
			{({data, loading, error}) => {
				if (loading) { return '...' }
				else if (error) return error.message
				else { return data.user.get ? data.user.get.fullName : 'Not Found'; }
			}}
		</GetUserQuery>
	}
}
