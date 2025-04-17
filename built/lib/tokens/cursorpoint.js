import { Movement } from "./models/movement.js";
import { Point2D } from "./components/point2d.js";
import { KeyCmd } from "../../artifacts/control/control.js";
export class CursorPoint extends Point2D {
    constructor(x, y, rad) {
        super(x, y);
        this.incrGrad = 10;
        this.displ = 1;
        this.path = [];
        this.config.borderColor = 'cyan';
        this.config.borderWidth = 1;
        this.turn(rad);
    }
    turn(rad) {
        this.rad = rad;
        this.grad = (Math.PI / 360) * this.incrGrad;
    }
    move(cmd, displ) {
        switch (cmd) {
            case KeyCmd.LEFT:
                this.rad -= this.grad;
                displ = 0;
                break;
            case KeyCmd.RIGHT:
                this.rad += this.grad;
                displ = 0;
                break;
            case KeyCmd.UP: break;
            case KeyCmd.DOWN:
                displ = (displ) * (-1);
                break;
        }
        console.log(`${cmd} ${this.x},${this.y} - ${this.rad} rad`);
        var dx = (Math.cos(this.rad) * displ);
        var dy = (Math.sin(this.rad) * displ);
        var x = this.x + dx;
        var y = this.y + dy;
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.rad = this.rad % (Math.PI * 2);
        let movement = new Movement();
        movement.x = this.x;
        movement.y = this.y;
        movement.dx = dx;
        movement.dy = dy;
        movement.rad = this.rad;
        movement.displ = displ;
        return movement;
    }
    ;
}
//# sourceMappingURL=cursorpoint.js.map