import { Token2D } from './Token2D.js';
import { Collider } from './collider.js';
import { Token2DCursor } from './Token2DCursor.js';
import { WireToken } from '../../poligons/2d/wire.js';
import { Coord2D } from '../../../models/Coord2D';
export class Rectangle extends Token2DCursor {
    constructor(x, y, w, h) {
        console.log(`Rectangle x:[${x}] y:[${y}] w:[${w}] h:[${h}]`);
        super(new Coord2D(x, y), 0);
        this.w = w;
        this.h = h;
        this.wire = new WireToken("wire_" + this.id, new Token2D(new Coord2D(x, y)));
        this.wire.load(new Token2DCursor(new Coord2D((x + w) / 2, (y + h) / 2), 0));
        this.wire.load(new Token2DCursor(new Coord2D((x + w / 2), (y - h) / 2), 0));
        this.wire.load(new Token2DCursor(new Coord2D((x - w) / 2, (y - h) / 2), 0));
        this.wire.load(new Token2DCursor(new Coord2D((x + w) / 2, (y + h) / 2), 0));
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
        return !((x < this.position.x - rw) || (x > this.position.x + rw) || (y < this.position.y - rh) || (y > this.position.y + rh));
    }
    move() {
        var dXY = Token2DCursor.prototype.move.call(this);
        console.log('rectangle move ' + dXY.x + ' ' + dXY.y);
        this.wire.move();
        return dXY;
    }
    ;
    getRelPos() {
        return Token2D.prototype.getRelPos.call(this, this.position);
    }
}
//# sourceMappingURL=rectangle.js.map