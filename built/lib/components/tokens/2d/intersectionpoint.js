import { Coord2D } from "../../../models/Coord2D.js";
import { Token2D } from "./Token2D.js";
export class IntersectionPoint extends Token2D {
    constructor(x, y, vector) {
        let pos = new Coord2D(x, y);
        super(pos);
        this.config.color = 'orange';
        this.tokens = [];
        this.tokens.push(vector);
    }
    draw() {
        super.draw();
    }
}
//# sourceMappingURL=intersectionpoint.js.map