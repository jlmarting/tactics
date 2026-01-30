"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
const cursorpoint_1 = require("../point/cursorpoint");
const wire_1 = require("./wire");
const collider_1 = require("./collider");
const point_1 = require("../point/point");
class Rectangle extends cursorpoint_1.CursorPoint {
    constructor(x, y, w, h) {
        super(x, y, 0);
        this.w = w;
        this.h = h;
        this.wire = new wire_1.WireToken("wire_" + this.id, this);
        this.wire.load(new point_1.Point(x + w / 2, y + h / 2));
        this.wire.load(new point_1.Point(x + w / 2, y - h / 2));
        this.wire.load(new point_1.Point(x - w / 2, y - h / 2));
        this.wire.load(new point_1.Point(x + w / 2, y + h / 2));
    }
    placeAt(x, y) {
        super.placeAt(x, y);
    }
    isCollisioning(otherElement) {
        if (otherElement instanceof Rectangle) {
            const intersections = this.wire.getIntersections(otherElement.wire);
            return intersections.length > 0;
        }
        else if (otherElement instanceof collider_1.Collider) {
            // TODO: colisión con Collider
            return false;
        }
        return false;
    }
    isInside(x, y) {
        const rw = Math.round(this.w / 2);
        const rh = Math.round(this.h / 2);
        return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
    }
    move(cmd, displ = 5) {
        const dXY = super.move(cmd, displ);
        console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
        this.wire.move(cmd, displ);
        return dXY;
    }
    draw(ctx, lColor, fColor, offset) {
        super.draw(ctx, lColor, fColor, offset);
        this.wire.draw(ctx, undefined, undefined, offset);
    }
}
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map