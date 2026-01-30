"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorPoint = void 0;
const point_1 = require("./point");
//Punto con movimiento de cursor (comandos up down left right)
//rad, radianes, indica la dirección del movimiento
class CursorPoint extends point_1.Point {
    constructor(x, y, rad) {
        super(x, y);
        this.rad = rad;
        this.incrGrad = 10;
        this.displ = 1;
        this.grad = (Math.PI / 360) * this.incrGrad;
        this.path = [];
        this.config.borderColor = 'cyan';
        this.config.borderWidth = 1;
    }
    move(cmd, displ) {
        switch (cmd) {
            case "left":
                this.rad -= this.grad;
                displ = 0;
                break; //37
            case "right":
                this.rad += this.grad;
                displ = 0;
                break; //39    
            case "up": break; //38
            case "down":
                displ = (displ) * (-1);
                break; //40
        }
        console.log(`${cmd} ${this.x},${this.y} - ${this.rad} rad`);
        var dx = (Math.cos(this.rad) * displ);
        var dy = (Math.sin(this.rad) * displ);
        var x = this.x + dx;
        var y = this.y + dy;
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.rad = this.rad % (Math.PI * 2);
        var dXY = { "x": x, "y": y, "dx": dx, "dy": dy, "rad": this.rad, "displ": displ };
        return dXY;
    }
    ;
}
exports.CursorPoint = CursorPoint;
//# sourceMappingURL=cursorpoint.js.map