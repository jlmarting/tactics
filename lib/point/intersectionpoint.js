import { Point } from './point.js';
export class IntersectionPoint extends Point {
    constructor(x, y, vector) {
        super(x, y);
        this.config.color = 'orange';
        this.tokens = []; //Tokens que intervienen en la intersección
        if (vector) {
            this.tokens.push(vector);
        }
    }
}
//# sourceMappingURL=intersectionpoint.js.map