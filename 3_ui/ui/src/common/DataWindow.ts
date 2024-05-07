import { observable, makeObservable } from 'mobx';

/**
 * Represents a rectangular area
 *   Has utility methods for comparing rectangular regions (equals/contains)
 */
export class DataWindow {
    x:number;
    y:number;
    rows:number;
    columns:number;
	@observable invalidated:boolean;

    constructor(args:{ x:number, columns:number, y:number, rows:number }) {
        makeObservable(this);
        this.x = args.x;
        this.y = args.y;
        this.rows = args.rows;
        this.columns = args.columns;
        this.invalidated = false;
    }

    equals(other: DataWindow) {
        if (other == null) { return false; }

        return (this.x === other.x && this.y === other.y && this.rows === other.rows && this.columns === other.columns);
    }

    get x2() {
        return this.x + this.columns - 1;
    }

    set x2(x2:number) {
        this.columns = x2 - this.x + 1;
    }

    get y2() {
        return this.y + this.rows - 1;
    }

    set y2(y2:number) {
        this.rows = y2 - this.y + 1;
    }

    contains(other: DataWindow) {
        return (this.x <= other.x && this.y <= other.y && this.x2 >= other.x2 && this.y2 >= other.y2);
    }

    toString() {
        return `{ x: ${this.x}, columns: ${this.columns}, y: ${this.y}, rows: ${this.rows} }`
    }
}
