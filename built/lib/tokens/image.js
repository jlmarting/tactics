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
import { CursorPoint } from './cursorpoint.js';
var ImgToken = (function (_super) {
    __extends(ImgToken, _super);
    function ImgToken(id, x, y, rad, src, width, height) {
        var _this = _super.call(this, x, y, rad) || this;
        _this.id = id;
        _this.idColor = 'red';
        _this.src = src;
        _this.w = width;
        _this.h = height;
        _this.config = { viewName: false, selectable: false, position: 'relative' };
        return _this;
    }
    ImgToken.prototype.draw = function (ctx) {
        if (ctx) {
            var pos;
            if (this.config.position == 'relative') {
                pos = this.getRelPos();
            }
            else {
                pos = { x: this.x, y: this.y };
            }
            var posImg = { x: pos.x - (this.w / 2), y: pos.y - (this.h / 2) };
            ctx.save();
            if (typeof this.img !== 'undefined') {
                ctx.translate(pos.x, pos.y);
                ctx.rotate(this.rad);
                ctx.translate(-(pos.x), -(pos.y));
                ctx.drawImage(this.img, posImg.x, posImg.y);
                ctx.restore();
                if ((this.config['viewName']) && (this.config['viewIds'])) {
                    ctx.font = '14px serif';
                    ctx.fillStyle = this.idColor;
                    ctx.fillText('(' + Math.round(this.x) + ' ,' + Math.round(this.y) + ')', pos.x - 90, pos.y);
                    ctx.font = '24px serif';
                    ctx.fillText(this.id, pos.x - 20, pos.y - 30);
                    if (typeof this.health !== 'undefined') {
                        ctx.fillStyle = "red";
                        ctx.fillRect(pos.x - 30, pos.y - 70, (1000 * 120) / 1200, 10);
                        ctx.fillStyle = "green";
                        ctx.fillRect(pos.x - 30, pos.y - 70, (this.health * 120) / 1200, 10);
                        ctx.fillStyle = "red";
                        ctx.font = '14px serif';
                    }
                }
                return 1;
            }
            else {
                var p = new Point(this.x, this.y);
                ;
                p.draw();
                return 1;
            }
        }
        else {
            return -1;
        }
    };
    ;
    ImgToken.prototype.getCenter = function () {
        return { "x": this.x, "y": this.y };
    };
    ImgToken.prototype.move = function (cmd, displ) {
        var dXY = CursorPoint.prototype.move.call(this, cmd, displ);
        return dXY;
    };
    ;
    return ImgToken;
}(CursorPoint));
export { ImgToken };
//# sourceMappingURL=image.js.map