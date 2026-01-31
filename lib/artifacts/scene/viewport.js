import { Point } from "../../point/point";
import { Rectangle } from "../../tokens/rectangle";
class ViewPort extends Point {
    constructor(x, y, width, height) {
        super(x, y);
        this.config = {};
        this.config.innerColor = null;
        this.enabled = true;
        this.viewPort = new Rectangle(0 - (width - 5 / 2), 0 - (height - 5 / 2), this.x, this.y);
    }
    attachTo(t) {
        let pos = t.getRelPos();
        this.placeAt(pos.x, pos.y);
    }
}
//# sourceMappingURL=viewport.js.map