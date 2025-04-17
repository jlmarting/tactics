import { Point2D } from "./components/point2d.js";
export class IntersectionPoint extends Point2D {
    constructor(x, y, vector) {
        super(x, y);
        this.config.color = 'orange';
        this.tokens = [];
        this.tokens.push(vector);
    }
    draw() {
        super.draw('yellow', 'yellow');
    }
}
//# sourceMappingURL=intersectionpoint.js.map