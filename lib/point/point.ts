export class Point {

    x: number;
    y: number;
    info: string;
    id: string;
    startTime: number;
    config: any;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.info;        
        this.startTime = window.performance.now();
        this.id = 'point_' + this.startTime;
        this.config = { position: 'relative', color: 'red', viewName: false };
    }

    placeAt(x: number, y: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }

    getCenter() {
        return { "x": Math.round(this.x), "y": Math.round(this.y) }
    }

    
}
