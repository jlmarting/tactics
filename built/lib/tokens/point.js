var Point = (function () {
    function Point(x, y) {
        this.placeAt = function (x, y) {
            this.x = Math.round(x);
            this.y = Math.round(y);
        };
        this.getCenter = function () {
            return { "x": Math.round(this.x), "y": Math.round(this.y) };
        };
        this.x = x;
        this.y = y;
        this.info;
        this.id = 'point_' + Date.now();
        this.startTime = window.performance.now();
        this.config = { position: 'relative', color: 'red', viewName: false };
    }
    return Point;
}());
export { Point };
//# sourceMappingURL=point.js.map