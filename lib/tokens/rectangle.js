import { CursorPoint } from '../point/cursorpoint.js';
import { WireToken } from './wire.js';
import { Collider } from './collider.js';
import { Point } from '../point/point.js';
export class Rectangle extends CursorPoint {
    constructor(x, y, w, h) {
        super(x, y, 0);
        this.w = w;
        this.h = h;
        this.wire = new WireToken("wire_" + this.id, this);
        this.wire.load(new Point(x + w / 2, y + h / 2));
        this.wire.load(new Point(x + w / 2, y - h / 2));
        this.wire.load(new Point(x - w / 2, y - h / 2));
        this.wire.load(new Point(x + w / 2, y + h / 2));
    }
    placeAt(x, y) {
        super.placeAt(x, y);
    }
    isCollisioning(otherElement) {
        if (otherElement instanceof Rectangle) {
            const intersections = this.wire.getIntersections(otherElement.wire);
            return intersections.length > 0;
        }
        else if (otherElement instanceof Collider) {
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
//# sourceMappingURL=rectangle.js.map