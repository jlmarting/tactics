import { Point } from './point.js';

export class IntersectionPoint extends Point {
    tokens: any[];

    constructor(x: number, y: number, vector: any) {
        super(x, y);
        this.config.color = 'orange';
        this.tokens = []; //Tokens que intervienen en la intersección
        if (vector) {
            this.tokens.push(vector);
        }
    }
}
