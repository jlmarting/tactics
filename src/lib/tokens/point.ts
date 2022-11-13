//@ts-nocheck
//Punto, para posicionamiento básico en el canvas
export class Point {
    x: number;
    y: number;
    draw: (lColor: any, fColor: any) => void;
    getRelPos: () => { x: number; y: number; };
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.info;
        this.id = 'point_' + Date.now();
        this.startTime = window.performance.now();
        this.config = { position: 'relative', color: 'red', viewName: false };
    }


    placeAt = function (x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }

    getCenter = function () {
        return { "x": Math.round(this.x), "y": Math.round(this.y) }
    }
}
