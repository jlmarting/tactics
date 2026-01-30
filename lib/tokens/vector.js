"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = exports.IntersectionPoint = void 0;
const point_1 = require("../point/point");
class IntersectionPoint extends point_1.Point {
    constructor(x, y, vector) {
        super(x, y);
        this.config.color = 'orange';
        this.tokens = [vector];
    }
}
exports.IntersectionPoint = IntersectionPoint;
class Vector {
    constructor(id, x0, y0, x1, y1) {
        this.id = id;
        this.a = new point_1.Point(x0, y0);
        this.b = new point_1.Point(x1, y1);
        this.config = { color: 'green' };
    }
    draw(ctx, offset) {
        const pa = this.a.getRelPos(offset);
        const pb = this.b.getRelPos(offset);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.strokeStyle = this.config.color;
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
    }
    inRangeX(p) {
        return (p.x <= this.a.x && p.x >= this.b.x) || (p.x >= this.a.x && p.x <= this.b.x);
    }
    inRangeY(p) {
        return (p.y <= this.a.y && p.y >= this.b.y) || (p.y >= this.a.y && p.y <= this.b.y);
    }
    inRange(p) {
        return this.inRangeX(p) && this.inRangeY(p);
    }
    intersection(v) {
        // Comprobamos que no son vectores del mismo objeto
        const id1 = this.id.split('_')[0];
        const id2 = v.id.split('_')[0];
        if (id1 === id2)
            return null;
        const m0 = (this.a.y - this.b.y) / (this.a.x - this.b.x);
        const m1 = (v.b.y - v.a.y) / (v.b.x - v.a.x);
        let x = null;
        let y = null;
        const b0 = (this.a.y) - (m0 * this.a.x);
        const b1 = (v.a.y) - (m1 * v.a.x);
        // Paralelos
        if ((!isFinite(m1) && !isFinite(m0)) || (m0 === m1)) {
            return null;
        }
        if (!isFinite(m0) && isFinite(m1)) {
            x = this.a.x;
            y = (m1 * x) + b1;
        }
        else if (!isFinite(m1) && isFinite(m0)) {
            x = v.a.x;
            y = (m0 * x) + b0;
        }
        else {
            x = (b1 - b0) / (m0 - m1);
            y = (m0 * x) + b0;
        }
        if (x !== null && y !== null) {
            const p = new IntersectionPoint(Math.round(x), Math.round(y), this);
            if (this.inRange(p) && v.inRange(p)) {
                p.tokens.push(v);
                return p;
            }
        }
        return null;
    }
}
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map