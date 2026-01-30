// Token poligonal. Sin imagen. Se forma con la unión de una sucesión de puntos ordenada
import { Point } from "../point/point";
import { CursorPoint } from '../point/cursorpoint';
import { Vector } from './vector';

export class WireToken extends CursorPoint {
    points: Point[];
    mod_points: Point[];
    bkpx: string;
    bkpy: string;
    bkpRad: string;
    bkppoints: string;
    lastRad: number;

    constructor(id: string, p: Point) {
        super(p.x, p.y, 0);
        this.id = id;
        this.config = {
            viewName: false,
            selectable: true,
            position: 'relative',
            color: 'white',
            radial: false,
            enabled: true,
            closed: true,
            message: ""
        };
        this.points = [];
        this.mod_points = [];
        this.lastRad = this.rad;
    }

    draw(ctx: CanvasRenderingContext2D, lColor?: string, fColor?: string, offset?: { x: number, y: number }) {
        if (this.config.enabled === false) {
            this.x = JSON.parse(this.bkpx);
            this.y = JSON.parse(this.bkpy);
            this.points = JSON.parse(this.bkppoints);
            this.rad = JSON.parse(this.bkpRad);
            this.config.enabled = true;
        }
        const vectors = this.getVectors();
        super.draw(ctx, undefined, undefined, offset);
        vectors.forEach(e => {
            e.draw(ctx, offset);
        });
        if (this.config.radial === true) {
            const radialVectors = this.getRadialVectors();
            radialVectors.forEach(e => {
                e.config.color = 'cyan';
                e.draw(ctx, offset);
            });
        }
    }

    move(cmd: string, displ: number): any {
        if (this.config.enabled === false) {
            this.x = JSON.parse(this.bkpx);
            this.y = JSON.parse(this.bkpy);
            this.points = JSON.parse(this.bkppoints).map((p: any) => new Point(p.x, p.y));
            this.rad = JSON.parse(this.bkpRad);
            this.config.enabled = true;
            return;
        }

        this.bkpRad = JSON.stringify(this.rad);
        this.bkpx = JSON.stringify(this.x);
        this.bkpy = JSON.stringify(this.y);
        this.bkppoints = JSON.stringify(this.points);

        const dXY = super.move(cmd, displ);
        
        const radDelta = (this.lastRad - this.rad) * (-1);

        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            const temp = { x: 0, y: 0 };

            temp.x = this.x + (Math.cos(radDelta) * Math.round(p.x - this.x)) - (Math.sin(radDelta) * Math.round(p.y - this.y));
            temp.y = this.y + (Math.sin(radDelta) * Math.round(p.x - this.x)) + (Math.cos(radDelta) * Math.round(p.y - this.y));

            temp.x += dXY.dx;
            temp.y += dXY.dy;

            p.x = temp.x;
            p.y = temp.y;
        }

        this.lastRad = this.rad;
        return dXY;
    }

    load(p: Point) {
        if (p instanceof Point) {
            this.points.push(p);
        }
    }

    /**
     * Calcula el centro geométrico del polígono basado en el promedio de sus vértices
     * y actualiza la posición del token.
     */
    setCenter() {
        if (this.points.length === 0) return;

        let sX = 0;
        let sY = 0;
        this.points.forEach(p => {
            sX += p.x;
            sY += p.y;
        });

        // Punto central promedio
        this.x = Math.round(sX / this.points.length);
        this.y = Math.round(sY / this.points.length);
    }

    getVectors() {
        const vectors = [];
        for (let i = 0; i < this.points.length; i++) {
            let next = i + 1;
            if (next >= this.points.length) {
                if (this.config.closed) {
                    next = 0;
                } else {
                    return vectors;
                }
            }
            const v = new Vector(this.id + `_${i}`, this.points[i].x, this.points[i].y, this.points[next].x, this.points[next].y);
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }

    getRadialVectors() {
        const vectors = [];
        for (let i = 0; i < this.points.length; i++) {
            const v = new Vector(this.id + `_r_${i}`, this.x, this.y, this.points[i].x, this.points[i].y);
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }

    getIntersections(otherWire: WireToken) {
        const ownVectors = this.getVectors();
        const otherVectors = otherWire.getVectors();
        const intersections = [];

        for (let i = 0; i < ownVectors.length; i++) {
            for (let j = 0; j < otherVectors.length; j++) {
                const p = ownVectors[i].intersection(otherVectors[j]);
                if (p != null) {
                    intersections.push(p);
                }
            }
        }
        return intersections;
    }
}
