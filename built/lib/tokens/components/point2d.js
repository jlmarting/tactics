import { ConfigPoint2D } from "../models/ConfigPoint2D.js";
export class Point2D {
    constructor(x, y) {
        this.placeAt = function (x, y) {
            this.x = Math.round(x);
            this.y = Math.round(y);
        };
        this.getCenter = function () {
            return { "x": Math.round(this.x), "y": Math.round(this.y) };
        };
        this.delete = false;
        this.x = x;
        this.y = y;
        this.info;
        this.id = 'point_' + Date.now();
        this.startTime = window.performance.now();
        this.config = new ConfigPoint2D();
        this.config.borderColor = 'blue';
        this.config.borderWidth = 1;
        this.config.position = 'relative';
        this.config.color = 'red';
        this.config.selectable = false;
    }
    setCanvas(id) {
        let canvas = document.getElementById("id");
        this.ctx = canvas.getContext('2d');
    }
    draw() {
        let lColor = "white";
        let fColor = this.config.color;
        this.ctx.beginPath();
        this.ctx.strokeStyle = lColor;
        this.ctx.fillStyle = fColor;
        if (this.config.position == 'relative') {
            this.ctx.fillRect(this.x + this.x, this.y + this.y, 4, 4);
            this.ctx.fillText('*(' + this.x + ',' + this.y + ')', this.x + this.x, this.y + this.y);
        }
        else {
            this.ctx.fillRect(this.x, this.y, 2, 2);
            this.ctx.fillText('**(' + this.x + ',' + this.y + ')', Math.round(this.x), Math.round(this.y));
        }
        this.ctx.stroke();
    }
    getRelPos() { return { x: this.x, y: this.y }; }
    ;
}
//# sourceMappingURL=point2d.js.map