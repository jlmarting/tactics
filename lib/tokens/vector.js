"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var point_1 = require("../point/point");
var tactics_1 = require("../tactics");
var Vector = function (id, x0, y0, x1, y1) {
    this.id = id;
    this.a = new point_1.Point(x0, y0);
    this.b = new point_1.Point(x1, y1);
    this.config = { color: 'green' };
};
exports.Vector = Vector;
exports.Vector.prototype.draw = function (ctx) {
    this.a = this.a.getRelPos();
    this.b = this.b.getRelPos();
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.strokeStyle = this.config.color;
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
};
exports.Vector.prototype.inRangeX = function (p) {
    if ((p.x <= this.a.x) && (p.x >= this.b.x)) {
        return true;
    }
    if ((p.x >= this.a.x) && (p.x <= this.b.x)) {
        return true;
    }
    return false;
};
exports.Vector.prototype.inRangeY = function (p) {
    if ((p.y <= this.a.y) && (p.y >= this.b.y)) {
        return true;
    }
    if ((p.y >= this.a.y) && (p.y <= this.b.y)) {
        return true;
    }
    return false;
};
exports.Vector.prototype.inRange = function (p) {
    return this.inRangeX(p) && this.inRangeY(p);
};
exports.Vector.prototype.intersection = function (v) {
    //Comprobamos que no son vectores del mismo objeto
    var id1 = this.id.split('_')[0];
    var id2 = v.id.split('_')[0];
    if (id1 == id2) {
        return null;
    }
    ;
    var m0 = (this.a.y - this.b.y) / (this.a.x - this.b.x);
    var m1 = (v.b.y - v.a.y) / (v.b.x - v.a.x);
    var x = null;
    var y = null;
    var b0 = (this.a.y) - (m0 * this.a.x);
    var b1 = (v.a.y) - (m1 * v.a.x);
    //Comprobamos rectas notables
    if ((!isFinite(m1) && !isFinite(m0)) || ((m0 == 0) && (m1 == 0))) {
        console.log("Vectores: " + this.a.x + "," + this.a.y + " - " + this.b.x + "," + this.b.y + " --> " + v.a.x + "," + v.a.y + " - " + v.b.x + "," + v.b.y);
        console.log("Paralelos");
        return null;
    }
    if (!isFinite(m0) && isFinite(m1)) {
        //Ax+By+C = 0 , si m = -A/B = infinito, B = 0 --> Ax+C = 0
        x = this.a.x;
        y = (m1 * x) + b1;
        // if((x>v.b.x)|| (x<v.a.x) || (y>this.b.y) || (y<this.a.y)){
        //     return null;
        // }             
        var p = new tactics_1.IntersectionPoint(Math.round(x), Math.round(y), this);
        if ((this.inRange(p)) && (v.inRange(p))) {
            p.tokens.push(v);
            console.log("* recta 0 vertical --> x:" + x + " y:" + y + "   m0:" + m0 + "  m1:" + m1);
            return p;
        }
    }
    if (!isFinite(m1) && isFinite(m0)) {
        x = v.a.x;
        y = (m0 * x) + b0;
        // if((x>this.b.x)|| (x<this.a.x) || (y>v.b.y) || (y<v.a.y)){
        //     return null;
        // }             
        var p = new tactics_1.IntersectionPoint(Math.round(x), Math.round(y), this);
        if (x < v.a.x) {
            if ((this.inRange(p)) && (v.inRange(p))) {
                p.tokens.push(v);
                console.log("* recta 1 vertical --> x:" + x + " y:" + y + "   m0:" + m0 + "  m1:" + m1);
                return p;
            }
            else {
                return null;
            }
        }
    }
    if (m0 == 0) {
        y = b0;
        x = (y - b1) / m1;
        var p = new tactics_1.IntersectionPoint(Math.round(x), Math.round(y), this);
        if ((this.inRange(p)) && (v.inRange(p))) {
            p.tokens.push(v);
            console.log("* recta 0 horizontal --> x:" + x + " y:" + y + "   m0:" + m0 + "  m1:" + m1);
            return;
        }
    }
    if (m1 == 0) {
        y = b1;
        x = (y - b0) / m0;
        var p = new tactics_1.IntersectionPoint(Math.round(x), Math.round(y), this);
        if ((this.inRange(p)) && (v.inRange(p))) {
            p.tokens.push(v);
            console.log("* recta 1 horizontal --> x:" + x + " y:" + y + "   m0:" + m0 + "  m1:" + m1);
            return p;
        }
    }
    //  Igualamos las dos rectas: m0x+b0 = m1x+b1 --> (b1-b0)/(m0-m1) --> x
    x = (b1 - b0) / (m0 - m1);
    y = (m0 * x) + b0;
    if (!isFinite(x) || !isFinite(y)) {
        console.log(" infinitos --> x:" + x + " y:" + y + "   m0:" + m0 + "  m1:" + m1);
        return null;
    }
    var p = new tactics_1.IntersectionPoint(Math.round(x), Math.round(y), this);
    if ((this.inRange(p)) && (v.inRange(p))) {
        p.tokens.push(v);
        console.log("* Rectas no notables x:" + x + " y:" + y + "   m0:" + m0 + "  m1:" + m1);
        return p;
    }
    return null;
};
//# sourceMappingURL=vector.js.map