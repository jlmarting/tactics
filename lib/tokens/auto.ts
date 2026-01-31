import { ColliderToken } from './collider.js';

// Token con movimiento programado (sigue comandos del plan)
export class AutoToken extends ColliderToken {
    plan: string[];

    constructor(id: string, x: number, y: number, rad: number, src: string, w: number, h: number) {
        super(id, x, y, rad, src, w, h);
        this.plan = [];
    }

    autopilot(tokens: any[]) {
        // se envían movimientos (keyCodes) de la pila "plan"
        if (this.plan.length > 0) {
            const order = this.plan.pop();
            if (order) {
                this.plan.unshift(order);
                this.move(order, 2, tokens);
            }
        }
    }
}
