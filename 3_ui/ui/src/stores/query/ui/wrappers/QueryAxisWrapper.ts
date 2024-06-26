import { AxisCode, AxisCoordinate, QueryAxis } from 'stores/query'

export class QueryAxisWrapper implements QueryAxis {
	constructor(axis: QueryAxis) {
		Object.assign(this, axis);
	}

	id: number;
	label: string;
	description: string;
	code : AxisCode;
	coordinates: AxisCoordinate[];
	sortIndex: number = -1;

	coordinateById(id: number) : AxisCoordinate {
		const result = this.coordinates.find(c => c.id === id);
		if (!result) throw new Error(`Could not find coordinate '${id}' in axis ${this.label}`);

		return result;
	}

	coordinateByLabel(label: string) : AxisCoordinate {
		const result = this.coordinates.find(c => c.label === label);
		if (!result) throw new Error(`Could not find coordinate '${label}' in axis ${this.label}`);

		return result;
	}
}