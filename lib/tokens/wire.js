"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WireToken = void 0;
// Token poligonal. Sin imagen. Se forma con la unión de una sucesión de puntos ordenada
const point_1 = require("../point/point");
const cursorpoint_1 = require("../point/cursorpoint");
const vector_1 = require("./vector");
class WireToken extends cursorpoint_1.CursorPoint {
    constructor(id, p) {
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
    draw(ctx, lColor, fColor, offset) {
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
    move(cmd, displ) {
        if (this.config.enabled === false) {
            this.x = JSON.parse(this.bkpx);
            this.y = JSON.parse(this.bkpy);
            this.points = JSON.parse(this.bkppoints).map((p) => new point_1.Point(p.x, p.y));
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
    load(p) {
        if (p instanceof point_1.Point) {
            this.points.push(p);
        }
    }
    getVectors() {
        const vectors = [];
        for (let i = 0; i < this.points.length; i++) {
            let next = i + 1;
            if (next >= this.points.length) {
                if (this.config.closed) {
                    next = 0;
                }
                else {
                    return vectors;
                }
            }
            const v = new vector_1.Vector(this.id + `_${i}`, this.points[i].x, this.points[i].y, this.points[next].x, this.points[next].y);
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }
    getRadialVectors() {
        const vectors = [];
        for (let i = 0; i < this.points.length; i++) {
            const v = new vector_1.Vector(this.id + `_r_${i}`, this.x, this.y, this.points[i].x, this.points[i].y);
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }
    getIntersections(otherWire) {
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
exports.WireToken = WireToken;
//# sourceMappingURL=wire.js.map