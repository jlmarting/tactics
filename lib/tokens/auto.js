"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoToken = void 0;
const collider_1 = require("./collider");
// Token con movimiento programado (sigue comandos del plan)
class AutoToken extends collider_1.ColliderToken {
    constructor(id, x, y, rad, src, w, h) {
        super(id, x, y, rad, src, w, h);
        this.plan = [];
    }
    autopilot(tokens) {
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
exports.AutoToken = AutoToken;
//# sourceMappingURL=auto.js.map