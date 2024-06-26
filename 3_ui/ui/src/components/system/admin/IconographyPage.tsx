import {ApplicationPage, sem, AppIcon, bp} from "components";
import {api, appIcons, ActiveTool} from 'stores';
import {observer} from 'mobx-react';
import * as css from './IconographyPage.css'

@observer
export class IconographyPage extends React.Component<{}, {}> {
	constructor(props) {
		super(props);
		const {site}    = api;
		site.activeTool = {tool: ActiveTool.preferences, title: () => "Iconography"}
		site.header     = {
			editable: false
		}
	}

	render2() {
		const {Card, Container} = sem;

		const renderCard = (key: string, val: any, depth = 0) => {
			if (val == null) {
				return null;
			}
			else if (val.type) {
				return <AppIcon key={key} icon={val} label={key}/>
			}
			else {
				return <div key={key} className={css.panel}>
					<span className={css.header}>
							{key}
					</span>
					<div className={css.contents} data-depth={depth}>
						<div>
							{_.keys(val).map((childKey: any) => {
								const childVal = val[childKey];

								return renderCard(childKey, childVal, depth + 1)
							})}
						</div>
					</div>
				</div>
			}
		}

		return (
			<ApplicationPage className={classNames("ui form", css.root)}>
				<Container fluid>
					{_.keys(appIcons).map(key => {
						const val = appIcons[key]
						return renderCard(key, val);
					})}
				</Container>
			</ApplicationPage>
		)
	}

	render() {
		const {Card, Container} = sem;

		const walkTree = (key: string, val: any, parentKeys = []) => {
			if (val == null) {
				return null;
			}
			else if (val.type) {
				return {...val, key: key, parentKeys: parentKeys};
			}
			else {
				return _.flatMap(_.keys(val), (childKey: any) => walkTree(childKey, val[childKey], [...parentKeys, key].filter(k => k != null)))
					.filter(v => v != null);  // Remove nulls
			}
		}

		const nodes = _.flatMap(walkTree(null, appIcons));
		return (
			<ApplicationPage className={classNames("ui form", css.root)}>
				<div className={classNames(bp.Classes.CARD, "fluid")}>
					<Card.Group itemsPerRow={6}
					            stackable
					            className={classNames("fluid", {centered: true}) }>
						{nodes.map((v: any, i) =>
							<Card key={i.toString()} centered>
								<Card.Content>
									<Card.Header>{v.parentKeys.join(' : ')} : {api.utility.camelToRegular(v.key)}</Card.Header>
									<Card.Description><AppIcon icon={v} large/></Card.Description>
									<sem.Label attached="bottom right" color={v.type == 'semantic' ? 'black' : v.type == 'blueprint' ? 'blue' : 'orange' } content={v.type}/>
								</Card.Content>

								{v.customAttributes && !_.isEmpty(v.customAttributes) && <Card.Content>
									{_.keys(v.customAttributes).map(k => {
										const attrValues = v.customAttributes[k];
										return <Card.Description key={k}>{k}:  {JSON.stringify(attrValues)}</Card.Description>
									})}
								</Card.Content>}
							</Card>)}
					</Card.Group>
				</div>
			</ApplicationPage>
		)
	}
}

