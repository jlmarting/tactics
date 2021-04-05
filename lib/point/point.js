"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
        this.info;
        this.startTime = window.performance.now();
        this.id = 'point_' + this.startTime;
        this.config = { position: 'relative', color: 'red', viewName: false };
    }
    Point.prototype.placeAt = function (x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    };
    Point.prototype.getCenter = function () {
        return { "x": Math.round(this.x), "y": Math.round(this.y) };
    };
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=point.js.map