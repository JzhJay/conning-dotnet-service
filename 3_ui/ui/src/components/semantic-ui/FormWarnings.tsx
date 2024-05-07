import { observer } from "mobx-react";
import { sem } from 'components';
import FlipMove from 'react-flip-move';

interface WarningsProps {
	messages: Array<React.ReactNode>;
}

@observer
export class FormWarnings extends React.Component<WarningsProps, {}> {
	render() {
		const { messages } = this.props;

		return <sem.Card.Content extra>
			<sem.Message warning>
				<sem.Message.Header content={`Something's not quite right...`}/>
				<sem.Message.List as={FlipMove} maintainContainerHeight>
					{messages}
				</sem.Message.List>
			</sem.Message>
		</sem.Card.Content>
	}
}