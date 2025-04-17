import { Movement2D } from "../../../models/movement.js";
import { Token2D } from "./Token2D.js";
import { KeyCmd } from "../../../../artifacts/control/control.js";
import { MovementCallbacks } from "../../../tools/callbacks/movementCallbacks.js";
import { KeyBinder } from "../../../tools/KeyBinder.js";
export class Token2DCursor extends Token2D {
    constructor(position, rad) {
        super(position);
        this.incrGrad = 10;
        this.displ = 1;
        this.path = [];
        this.config.borderColor = 'cyan';
        this.config.borderWidth = 1;
        this.turn(rad);
        this.keyBinder = new KeyBinder();
        this.keyBinder.bindKey(KeyCmd.UP, () => { return this.moveUp(); });
        this.keyBinder.bindKey(KeyCmd.RIGHT, () => { return this.moveRight(); });
        this.keyBinder.bindKey(KeyCmd.DOWN, () => { return this.moveDown(); });
        this.keyBinder.bindKey(KeyCmd.LEFT, () => { return this.moveLeft(); });
    }
    move() {
        const mov = new Movement2D();
        let result = this.keyBinder.executeKey(this.key);
        if (result) {
            return result;
        }
        return mov;
    }
    moveUp() {
        return MovementCallbacks.moveUp(this.position, this.displ);
    }
    moveLeft() {
        this.turn(this.incrGrad);
        return MovementCallbacks.moveLeft(this.position, this.incrGrad, this.displ);
    }
    moveDown() {
        this.displ = (this.displ) * (-1);
        return MovementCallbacks.moveDown(this.position, this.displ);
    }
    moveRight() {
        this.turn(this.rad - (this.incrGrad * -1));
        return MovementCallbacks.moveRight(this.position, this.grad, this.displ);
    }
    turn(rad) {
        this.rad = rad;
        this.grad = (Math.PI / 360) * this.incrGrad;
    }
}
//# sourceMappingURL=Token2DCursor.js.map