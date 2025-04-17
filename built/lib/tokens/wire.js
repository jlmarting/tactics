import { Point2D } from './components/point2d.js';
import { CursorPoint } from './cursorpoint.js';
import { ConfigPoint2D } from './models/ConfigPoint2D.js';
import { Vector } from './vector.js';
export class WireToken extends CursorPoint {
    constructor(id, p) {
        if (p == null) {
            console.log('Empty wire created...');
            super(0, 0, 0);
        }
        else {
            super(p.x, p.y, 0);
            this.x = p.x;
            this.y = p.y;
        }
        this.id = id;
        this.config = new ConfigPoint2D();
        this.config.viewName = false;
        this.config.selectable = true;
        this.config.position = 'relative';
        this.config.color = 'white';
        this.config.radial = false;
        this.config.enabled = true;
        this.config.message = "";
        this.config.closed = false;
        this.points = [];
        this.mod_points = [];
        this.bkpx;
        this.bkpy;
        this.bkrad;
        this.bkppoints = [];
        this.lastRad = this.rad;
    }
    getRelPos() {
        return Point2D.prototype.getRelPos.call(this);
    }
    draw(ctx) {
        if (this.config.enabled == false) {
            this.x = this.bkpx;
            this.y = this.bkpy;
            this.points = this.bkppoints;
            this.rad = this.bkrad;
            this.config.enabled = true;
        }
        var vectors = this.getVectors();
        CursorPoint.prototype.draw.call(this, ctx);
        vectors.forEach(e => {
            e.draw(ctx);
        });
        if (this.config.radial == true) {
            vectors = this.getRadialVectors();
            CursorPoint.prototype.draw.call(this, ctx);
            vectors.forEach(e => {
                e.config.color = 'cyan';
                e.draw(ctx);
            });
        }
    }
    move(cmd, displ) {
        if (this.config.enabled == false) {
            this.x = this.bkpx;
            this.y = this.bkpy;
            this.points = this.bkppoints;
            this.rad = this.bkrad;
            this.config.enabled = true;
            return;
        }
        this.bkrad = this.rad;
        this.bkpx = this.x;
        this.bkpy = this.y;
        this.bkppoints = this.points;
        if (this.rad > Math.PI * 2) {
            this.rad -= Math.PI * 2;
        }
        if (this.lastRad == null) {
            this.lastRad = this.rad;
        }
        console.log(`1.- Centro antes de mover: (${this.x}, ${this.y}) ${this.rad} rad`);
        var dXY = CursorPoint.prototype.move.call(this, cmd, displ);
        console.log(`Vector move ${dXY.x}, ${dXY.y}`);
        console.log(`2.- Centro despues de mover: (${this.x}, ${this.y}) ${this.rad} rad`);
        var rad = (this.lastRad - this.rad) * (-1);
        console.log(`Giro: ${rad}`);
        var distancias = [];
        this.points.forEach(element => {
            distancias.push(0);
        });
        this.config.message = "MOVE:";
        this.mod_points = this.points.slice(0);
        for (var i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            var temp = new Point2D(0, 0);
            temp.x = this.x + (Math.cos(rad) * Math.round(p.x - this.x)) - (Math.sin(rad) * Math.round(p.y - this.y));
            temp.y = this.y + (Math.sin(rad) * Math.round(p.x - this.x)) + (Math.cos(rad) * Math.round(p.y - this.y));
            temp.x += dXY.dx;
            temp.y += dXY.dy;
            p.x = temp.x;
            p.y = temp.y;
            var distancia = Math.sqrt(Math.pow((p.y - this.y), 2) + Math.pow((p.x - this.x), 2));
            console.log(`Distancia punto ${i} al centro: ${distancia}`);
            if (distancias[i] == 0) {
                distancias[i] = distancia;
            }
            else {
                distancias[i] -= distancia;
            }
            console.log(`Diferencia Distancia punto ${i} al centro: ${distancias[i]}`);
            this.points[i] = p;
        }
        this.lastRad = this.rad;
        return dXY;
    }
    ;
    load(p) {
        if (p instanceof Point2D) {
            this.points.push(p);
        }
        var d = Math.sqrt(Math.pow((p.y - this.y), 2) + Math.pow((p.x - this.x), 2));
        console.log('Distancia: ' + d);
    }
    setCenter() {
        var sX = 0;
        var sY = 0;
        this.points.forEach(p => {
            sX += p.x;
            sY += p.y;
        });
        this.x = Math.round(sX / this.points.length);
        this.y = Math.round(sY / this.points.length);
    }
    getVectors() {
        var vectors = [];
        for (var i = 0; i < this.points.length; i++) {
            var next = i + 1;
            if (next >= this.points.length) {
                if (this.config.closed) {
                    next = 0;
                }
                else {
                    return vectors;
                }
            }
            var v = new Vector(this.id + `_${i}`, this.points[i].x, this.points[i].y, this.points[next].x, this.points[next].y);
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }
    getRadialVectors() {
        var vectors = [];
        for (var i = 0; i < this.mod_points.length; i++) {
            var v = new Vector(this.id + `_r_${i}`, this.x, this.y, this.mod_points[i].x, this.mod_points[i].y);
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }
    getIntersections(otherWire) {
        let ownVectors = this.getVectors();
        let otherVectors = otherWire.getVectors();
        let intersections = [];
        for (var i = 0; i < ownVectors.length; i++) {
            for (var j = 0; j < otherVectors.length; j++) {
                var p = ownVectors[i].intersection(otherVectors[j]);
                if (p != null) {
                    intersections.push(p);
                }
            }
        }
        return intersections;
    }
}
//# sourceMappingURL=wire.js.map