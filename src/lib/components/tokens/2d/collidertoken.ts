import { KeyCmd } from "../../../../artifacts/control/control.js";
import { Collider } from "./collider.js";
import { ImgToken } from "./image.js";
import { IDestructible } from "../../../interfaces/IDestructible.js";
import { Movement2D } from "../../../models/movement.js";
import { IDrawableCanvas2D } from "../../../interfaces/IDrawableCanvas2D.js";


export class ColliderToken extends ImgToken implements IDestructible{

    health: number;
    collider: Collider;
    destroy: Boolean;

    constructor(id: string, x: number, y: number, rad: number, src: string, w: number, h: number) {
        super(id, x, y, rad, src, w, h);
        this.collider = new Collider(id, x, y, rad, w / 2);
        this.health = 1000;
        this.destroy = false;
    }


    // placeAt(x, y) {
    //     Point2D.prototype.placeAt.call(this, Math.round(x), Math.round(y));
    // }

    //Redifinición del método usando además el del prototipo
    move(cmd: KeyCmd, displ: number, tokens?: any): Movement2D {

        let movement: Movement2D = null;
        movement = this.collider.move(cmd, displ,tokens);
        if(movement != null){
            movement = super.move(cmd, displ);
        }
        return movement;
        // var colliderMovePromise = function (cmd, displ, tokens) {
        //     return new Promise(function (resolve, reject) {
        //         var moveResult = Collider.prototype.move.call(this.collider, cmd, displ, tokens);
        //         resolve(moveResult);
        //     }.bind(this));
        // }.bind(this);


        // colliderMovePromise(cmd, displ, tokens).then(function (moveResult) {
        //     if (moveResult.canMove) {
        //         ImgToken.prototype.move.call(this, cmd, displ);
        //     }
        // }.bind(this));

    }

    // async move(cmd: string, displ: number, tokens?: IToken[]) {
    //     await this.collider.move(cmd, displ, tokens) ? this.move(cmd, displ, tokens) : null;
    // }
}