import { CursorPoint } from '../point/cursorpoint';
import { WireToken } from './wire';
import { Collider } from './collider';
//x,y: coordenadas centro, w,h:width, height
export class Rectangle extends CursorPoint {
    constructor(x, y, w, h) {
        super(x, y, 0);
        this.w = w;
        this.h = h;
        this.wire = new WireToken("wire_" + this.id, x, y);
        //this.wire.load(new CursorPoint(x,y,0));
        this.wire.load(new CursorPoint(x + w / 2, y + h / 2, 0));
        this.wire.load(new CursorPoint(x + w / 2, y - h / 2, 0));
        this.wire.load(new CursorPoint(x - w / 2, y - h / 2, 0));
        this.wire.load(new CursorPoint(x + w / 2, y + h / 2, 0));
    }
    publicplaceAt(x, y) {
        super.placeAt(x, y);
    }
    isCollisioning(otherElement) {
        if (otherElement instanceof Rectangle) {
            var intersections = this.wire.getIntersections(otherElement.wire);
            if (intersections.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (otherElement instanceof Collider) {
                //TODO colisión con Collider
                return false;
            }
            else {
                return false;
            }
        }
    }
    public isInside(x, y) {
        var rw = Math.round(this.w / 2);
        var rh = Math.round(this.h / 2);
        return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
    }
    move(cmd, displ) {
        var dXY = super.move(cmd, 5);
        console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
        this.wire.move(cmd, 5);
        return dXY;
    }
    getRelPos() {
        return super.getRelPos();
    }
    draw(ctx) {
        super.draw(ctx);
        this.wire.draw(ctx);
    }
}
//# sourceMappingURL=rectangle.js.map