import { ConfigPoint2D } from "../../../models/ConfigPoint2D.js";
export class Token2D {
    constructor(position) {
        this.position = position;
        this.id = 'point_' + Date.now();
        this.time = window.performance.now();
        this.config = new ConfigPoint2D();
        this.config.borderColor = 'blue';
        this.config.borderWidth = 1;
        this.config.position = 'relative';
        this.config.color = 'red';
        this.config.selectable = false;
    }
    setContext(ctx) {
        ctx = ctx;
    }
    draw() {
        let lColor = "white";
        let fColor = this.config.color;
        this.ctx.beginPath();
        this.ctx.strokeStyle = lColor;
        this.ctx.fillStyle = fColor;
        if (this.config.position == 'relative') {
            this.ctx.fillRect(this.position.x + this.position.x, this.position.y + this.position.y, 4, 4);
            this.ctx.fillText('*(' + this.position.x + ',' + this.position.y + ')', this.position.x + this.position.x, this.position.y + this.position.y);
        }
        else {
            this.ctx.fillRect(this.position.x, this.position.y, 2, 2);
            this.ctx.fillText('**(' + this.position.x + ',' + this.position.y + ')', Math.round(this.position.x), Math.round(this.position.y));
        }
        this.ctx.stroke();
    }
    getRelPos() { return this.position; }
    getCenter() {
        return { "x": Math.round(this.position.x), "y": Math.round(this.position.y) };
    }
    placeAt(position) {
        this.position = position;
    }
}
//# sourceMappingURL=Token2D.js.map