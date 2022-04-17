//@ts-nocheck
import { ColliderToken } from './collider'
// Token con movimiento programado (sigue comandos del plan)
export class AutoToken extends ColliderToken {

    constructor(id, x, y, rad, src, w, h) {
        super(id, x, y, rad, src, w, h);
        this.plan = [];
    }


    autopilot(tokens) {
        //se envían movimientos (keyCodes) de la pila "plan"
        if (this.plan.length > 0) {
            var order = this.plan.pop();
            this.plan.unshift(order);
            this.move(order, 2, tokens);
        }
    }

}

