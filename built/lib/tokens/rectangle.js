var Rectangle = function (x, y, w, h) {
    CursorPoint.call(this, x, y, 0);
    this.w = w;
    this.h = h;
    this.wire = new WireToken("wire_" + this.id, x, y);
    this.wire.load(new CursorPoint(x + w / 2, y + h / 2, 0));
    this.wire.load(new CursorPoint(x + w / 2, y - h / 2, 0));
    this.wire.load(new CursorPoint(x - w / 2, y - h / 2, 0));
    this.wire.load(new CursorPoint(x + w / 2, y + h / 2, 0));
};
Rectangle.prototype.placeAt = function (x, y) {
    CursorPoint.prototype.placeAt.call(this, x, y);
};
Rectangle.prototype.isCollisioning = function (otherElement) {
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
        if (s instanceof Collider == true) {
            return false;
        }
        else {
            return false;
        }
    }
};
Rectangle.prototype.isInside = function (x, y) {
    var rw = Math.round(this.w / 2);
    var rh = Math.round(this.h / 2);
    return !((x < this.x - rw) || (x > this.x + rw) || (y < this.y - rh) || (y > this.y + rh));
};
Rectangle.prototype.move = function (cmd) {
    var dXY = CursorPoint.prototype.move.call(this, cmd, 5);
    console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);
    this.wire.move(cmd, 5);
    return dXY;
};
Rectangle.prototype.getRelPos = function () {
    return Point.prototype.getRelPos.call(this, this.x, this.y);
};
Rectangle.prototype.draw = function (ctx, lColor, fColor) {
    Point.prototype.draw.call(ctx);
    this.wire.draw(ctx);
};
//# sourceMappingURL=rectangle.js.map