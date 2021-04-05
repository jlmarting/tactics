"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
var cursorpoint_1 = require("../point/cursorpoint");
var wire_1 = require("./wire");
var collider_1 = require("./collider");
var point_1 = require("../point/point");
//x,y: coordenadas centro, w,h:width, height
var Rectangle = function (x, y, w, h) {
    cursorpoint_1.CursorPoint.call(this, x, y, 0);
    this.w = w;
    this.h = h;
    this.wire = new wire_1.WireToken("wire_" + this.id, x, y);
    //this.wire.load(new CursorPoint(x,y,0));
    this.wire.load(new cursorpoint_1.CursorPoint(x + w / 2, y + h / 2, 0));
    this.wire.load(new cursorpoint_1.CursorPoint(x + w / 2, y - h / 2, 0));
    this.wire.load(new cursorpoint_1.CursorPoint(x - w / 2, y - h / 2, 0));
    this.wire.load(new cursorpoint_1.CursorPoint(x + w / 2, y + h / 2, 0));
};
exports.Rectangle = Rectangle;
exports.Rectangle.prototype.placeAt = function (x, y) {
    cursorpoint_1.CursorPoint.prototype.placeAt.call(this, x, y);
};
exports.Rectangle.prototype.isCollisioning = function (otherElement) {
    if (otherElement instanceof exports.Rectangle == true) {
        var intersections = this.wire.getIntersections(otherElement.wire);
        if (intersections.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (s instanceof collider_1.Collider == true) {
            //TODO colisión con Collider
            return false;
        }
        else {
            return false;
        }
    }
};
exports.Rectangle.prototype.isInside = function (x, y) {
    var rw = Math.round(this.w / 2);
    var rh = Math.round(this.h / 2);
    return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
};
exports.Rectangle.prototype.move = function (cmd) {
    var dXY = cursorpoint_1.CursorPoint.prototype.move.call(this, cmd, 5);
    console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
    this.wire.move(cmd, 5);
    return dXY;
};
exports.Rectangle.prototype.getRelPos = function () {
    return point_1.Point.prototype.getRelPos.call(this, this.x, this.y);
};
exports.Rectangle.prototype.draw = function (ctx, lColor, fColor) {
    point_1.Point.prototype.draw.call(ctx);
    this.wire.draw(ctx);
};
//# sourceMappingURL=rectangle.js.map