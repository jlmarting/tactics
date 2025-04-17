export class Coord2D {
    constructor(x, y, timed = false) {
        this.time = 0;
        this.x = x;
        this.y = y;
        if (timed) {
            this.time = window.performance.now();
        }
    }
    toString() {
        return (`(${this.x},${this.y})`);
    }
}
//# sourceMappingURL=Coord2D.js.map