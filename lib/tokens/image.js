import { CursorPoint } from "../point/cursorpoint";
export class ImgToken extends CursorPoint {
    constructor(id, x, y, rad, src, width, height) {
        super(x, y, rad);
        this.id = id;
        this.idColor = 'red';
        this.src = src;
        this.w = width;
        this.h = height;
        this.config = { viewName: false, selectable: false, position: 'relative' };
    }
    getCenter() {
        return { "x": this.x, "y": this.y };
    }
    move(cmd, displ) {
        var dXY = super.move(cmd, displ);
        return dXY;
    }
}
//# sourceMappingURL=image.js.map