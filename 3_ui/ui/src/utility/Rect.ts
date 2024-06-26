export class Rect {
    left = 0;
    right = 0;
    top = 0;
    bottom = 0;

    constructor(rect:ClientRect) {
        this.left = rect.left;
        this.right = rect.right;
        this.top = rect.top;
        this.bottom = rect.bottom;
    }

    get width() {
        return this.right - this.left
    }

    get height() {
        return this.bottom - this.top
    }
}
