import { Point2D } from './components/point2d.js';
import { Collider } from './collider.js';
import { CursorPoint } from './cursorpoint.js';
import { WireToken } from './wire.js';
export class Rectangle extends CursorPoint {
    constructor(x, y, w, h) {
        console.log(`Rectangle x:[${x}] y:[${y}] w:[${w}] h:[${h}]`);
        super(x, y, 0);
        this.w = w;
        this.h = h;
        this.wire = new WireToken("wire_" + this.id, new Point2D(x, y));
        this.wire.load(new CursorPoint((x + w) / 2, (y + h) / 2, 0));
        this.wire.load(new CursorPoint((x + w / 2), (y - h) / 2, 0));
        this.wire.load(new CursorPoint((x - w) / 2, (y - h) / 2, 0));
        this.wire.load(new CursorPoint((x + w) / 2, (y + h) / 2, 0));
    }
    isCollisioning(otherElement) {
        if (otherElement instanceof Rectangle == true) {
            var intersections = this.wire.getIntersections(otherElement.wire);
            if (intersections.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (otherElement instanceof Collider == true) {
                return false;
            }
            else {
                return false;
            }
        }
    }
    isInside(x, y) {
        var rw = Math.round(this.w / 2);
        var rh = Math.round(this.h / 2);
        return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
    }
    move(cmd) {
        var dXY = CursorPoint.prototype.move.call(this, cmd, 5);
        console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
        this.wire.move(cmd, 5);
        return dXY;
    }
    ;
    getRelPos() {
        return Point2D.prototype.getRelPos.call(this, this.x, this.y);
    }
}
//# sourceMappingURL=rectangle.js.map