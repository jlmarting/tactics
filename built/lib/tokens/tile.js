import { Rectangle } from "./rectangle.js";
export class Tile extends Rectangle {
    constructor(id, x, y, src, width, height) {
        super(x, y, width, height);
        this.src = src;
        this.id = id;
    }
    getRelPos() {
        return super.getRelPos();
    }
    ;
}
//# sourceMappingURL=tile.js.map