import { CursorPoint } from '../point/cursorpoint';
import { WireToken } from './wire';
import { Collider } from './collider';
import { Point } from '../point/point';

//x,y: coordenadas centro, w,h:width, height
export class Rectangle extends CursorPoint {
    w: number;
    h: number;
    wire: WireToken;

    constructor(x: number, y: number, w: number, h: number) {
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

    public placeAt(x: number, y: number) {
        super.placeAt(x, y);
    }

    public isCollisioning(otherElement: any):boolean {
        if (otherElement instanceof Rectangle) {
            var intersections = this.wire.getIntersections(otherElement.wire);
            if (intersections.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            if (otherElement instanceof Collider) {
                //TODO colisión con Collider
                return false;
            } else {
                return false;
            }
        }
    }

    public isInside(x: number, y: number): boolean {
        var rw = Math.round(this.w / 2);
        var rh = Math.round(this.h / 2);
        return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
    }

    public move(cmd: string, displ: number) {
        var dXY = super.move(cmd, 5);
        console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
        this.wire.move(cmd, 5);
        return dXY;
    }

    // public getRelPos() {
    //     return super.getRelPos();
    // }

    draw(ctx: any) {
        super.draw(ctx);
        this.wire.draw(ctx);
    }
}