var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Point } from './point';
import { CursorPoint } from './cursorpoint';
import { WireToken } from './wire';
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, w, h) {
        var _this = this;
        console.log("Rectangle x:[" + x + "] y:[" + y + "] w:[" + w + "] h:[" + h + "]");
        _this = _super.call(this, x, y, 0) || this;
        _this.w = w;
        _this.h = h;
        _this.wire = new WireToken("wire_" + _this.id, new Point(x, y));
        _this.wire.load(new CursorPoint((x + w) / 2, (y + h) / 2, 0));
        _this.wire.load(new CursorPoint((x + w / 2), (y - h) / 2, 0));
        _this.wire.load(new CursorPoint((x - w) / 2, (y - h) / 2, 0));
        _this.wire.load(new CursorPoint((x + w) / 2, (y + h) / 2, 0));
        return _this;
    }
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
    ;
    Rectangle.prototype.getRelPos = function () {
        return Point.prototype.getRelPos.call(this, this.x, this.y);
    };
    Rectangle.prototype.draw = function (ctx, lColor, fColor) {
        Point.prototype.draw.call(ctx);
        this.wire.draw(ctx);
    };
    return Rectangle;
}(CursorPoint));
export { Rectangle };
//# sourceMappingURL=rectangle.js.map