import { CursorPoint } from '../point/cursorpoint.js';
import { WireToken } from './wire.js';
import { Collider } from './collider.js';
import { Point } from '../point/point.js';

export class Rectangle extends CursorPoint {
    w: number;
    h: number;
    wire: WireToken;

    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, 0);
        this.w = w;
        this.h = h;
        this.wire = new WireToken("wire_" + this.id, this);
        this.wire.load(new Point(x + w / 2, y + h / 2));
        this.wire.load(new Point(x + w / 2, y - h / 2));
        this.wire.load(new Point(x - w / 2, y - h / 2));
        this.wire.load(new Point(x + w / 2, y + h / 2));
    }

    placeAt(x: number, y: number) {
        super.placeAt(x, y);
    }

    isCollisioning(otherElement: any): boolean {
        if (otherElement instanceof Rectangle) {
            const intersections = this.wire.getIntersections(otherElement.wire);
            return intersections.length > 0;
        } else if (otherElement instanceof Collider) {
            // TODO: colisión con Collider
            return false;
        }
        return false;
    }

    isInside(x: number, y: number): boolean {
        const rw = Math.round(this.w / 2);
        const rh = Math.round(this.h / 2);
        return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
    }

    move(cmd: string, displ: number = 5, tokens?: any[], debugMode?: boolean): any {
        const dXY = super.move(cmd, displ);
        console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
        this.wire.move(cmd, displ, tokens, debugMode);
        return dXY;
    }

    draw(ctx: CanvasRenderingContext2D, lColor?: string, fColor?: string, offset?: { x: number, y: number }, debugMode?: boolean) {
        super.draw(ctx, lColor, fColor, offset, debugMode);
        this.wire.draw(ctx, undefined, undefined, offset, debugMode);
    }
}
