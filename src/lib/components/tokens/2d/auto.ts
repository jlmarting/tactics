import { ColliderToken } from "./collidertoken.js";

// Token con movimiento programado (sigue comandos del plan)
export class AutoToken extends ColliderToken {
    plan: any[];

    constructor(id: string, x:number, y:number, rad: number, src: string, w: number, h:number) {
        super(id, x, y, rad, src, w, h);
        this.plan = [];
    }


    autopilot(tokens: any) {
        //se envían movimientos (keyCodes) de la pila "plan"
        if (this.plan.length > 0) {
            var order = this.plan.pop();
            this.plan.unshift(order);
            this.move(order, 2, tokens);
        }
    }

}

