"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewPort = void 0;
const point_1 = require("../point/point");
const rectangle_1 = require("../tokens/rectangle");
class ViewPort extends point_1.Point {
    constructor(x, y, width, height) {
        super(x, y);
        this.config = {};
        this.config.innerColor = null;
        this.enabled = true;
        this.viewPort = new rectangle_1.Rectangle(0 - (width - 5 / 2), 0 - (height - 5 / 2), this.x, this.y);
    }
    attachTo(t) {
        let pos = t.getRelPos();
        this.placeAt(pos.x, pos.y);
    }
}
exports.ViewPort = ViewPort;
//# sourceMappingURL=viewport.js.map