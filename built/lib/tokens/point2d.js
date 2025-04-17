export class ConfigPoint2D {
    constructor(borderColor, borderWidth, position, color, viewName) {
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
        this.position = position;
        this.color = color;
        this.viewName = viewName;
    }
}
export class Point2D {
    constructor(x, y) {
        this.placeAt = function (x, y) {
            this.x = Math.round(x);
            this.y = Math.round(y);
        };
        this.getCenter = function () {
            return { "x": Math.round(this.x), "y": Math.round(this.y) };
        };
        this.delete = false;
        this.x = x;
        this.y = y;
        this.info;
        this.id = 'point_' + Date.now();
        this.startTime = window.performance.now();
        this.config = new ConfigPoint2D('blue', 1, 'relative', 'red', false);
    }
    draw(lColor, fColor) {
    }
    getRelPos() { return { x: this.x, y: this.y }; }
    ;
}
//# sourceMappingURL=point2d.js.map