"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.info = "";
        this.startTime = window.performance.now();
        this.id = 'point_' + this.startTime;
        this.config = { position: 'relative', color: 'red', viewName: false };
    }
    placeAt(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
    getCenter() {
        return { "x": Math.round(this.x), "y": Math.round(this.y) };
    }
    getRelPos(offset) {
        if (offset) {
            return { x: Math.round(this.x + offset.x), y: Math.round(this.y + offset.y) };
        }
        // Si no hay offset, devolvemos la posición absoluta (o relativa al origen 0,0)
        return { x: Math.round(this.x), y: Math.round(this.y) };
    }
    draw(ctx, lColor, fColor, offset) {
        if (!ctx)
            return;
        if (this.config.color !== undefined) {
            lColor = "white";
            fColor = this.config.color;
        }
        else {
            lColor = lColor || "red";
            fColor = fColor || "white";
        }
        ctx.beginPath();
        ctx.strokeStyle = lColor;
        ctx.fillStyle = fColor;
        const pos = this.getRelPos(offset);
        if (this.config.position === 'relative') {
            ctx.fillRect(pos.x, pos.y, 4, 4);
            ctx.fillText('*(' + this.x + ',' + this.y + ')', pos.x, pos.y);
        }
        else {
            ctx.fillRect(this.x, this.y, 2, 2);
            ctx.fillText('**(' + this.x + ',' + this.y + ')', Math.round(this.x), Math.round(this.y));
        }
        ctx.stroke();
    }
}
exports.Point = Point;
//# sourceMappingURL=point.js.map