import {Option} from 'components';
import * as React from 'react';
import * as css from 'components/system/inputSpecification/InputSpecificationComponent.css';

export const LineBreak = () => <div className={css.lineBreak}></div>;

export function getFormattedDescription(description){
	let descriptionSplit = description.split("\n");
	return <>{descriptionSplit.map((d, i) => <React.Fragment key={i}>{d} { i != descriptionSplit.length - 1 && <LineBreak/>}</React.Fragment>)}</>;
}