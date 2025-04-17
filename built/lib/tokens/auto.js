import { ColliderToken } from './collider.js';
export class AutoToken extends ColliderToken {
    constructor(id, x, y, rad, src, w, h) {
        super(id, x, y, rad, src, w, h);
        this.plan = [];
    }
    autopilot(tokens) {
        if (this.plan.length > 0) {
            var order = this.plan.pop();
            this.plan.unshift(order);
            this.move(order, 2, tokens);
        }
    }
}
//# sourceMappingURL=auto.js.map