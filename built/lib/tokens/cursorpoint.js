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
import { Point } from './point.js';
var CursorPoint = (function (_super) {
    __extends(CursorPoint, _super);
    function CursorPoint(x, y, rad) {
        var _this = _super.call(this, x, y) || this;
        _this.rad = rad;
        _this.incrGrad = 10;
        _this.displ = 1;
        _this.grad = (Math.PI / 360) * _this.incrGrad;
        _this.path = [];
        _this.config.borderColor = 'cyan';
        _this.config.borderWidth = 1;
        return _this;
    }
    CursorPoint.prototype.move = function (cmd, displ) {
        switch (cmd) {
            case "left":
                this.rad -= this.grad;
                displ = 0;
                break;
            case "right":
                this.rad += this.grad;
                displ = 0;
                break;
            case "up": break;
            case "down":
                displ = (displ) * (-1);
                break;
        }
        console.log(cmd + " " + this.x + "," + this.y + " - " + this.rad + " rad");
        var dx = (Math.cos(this.rad) * displ);
        var dy = (Math.sin(this.rad) * displ);
        var x = this.x + dx;
        var y = this.y + dy;
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.rad = this.rad % (Math.PI * 2);
        var dXY = { "x": x, "y": y, "dx": dx, "dy": dy, "rad": this.rad, "displ": displ };
        return dXY;
    };
    ;
    return CursorPoint;
}(Point));
export { CursorPoint };
//# sourceMappingURL=cursorpoint.js.map