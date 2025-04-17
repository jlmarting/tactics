import { Rectangle } from "../../tokens/2d/rectangle.js";


export class Tile extends Rectangle{
    img: HTMLImageElement;
    src: any;
    constructor(id: string, x: number, y: number, src: any, width: number, height: number) {
        super( x, y, width, height);
        this.src = src;
        this.id = id;
    }
    // draw() {
    //     super.draw();
    //     Rectangle.prototype.draw.call(this);
    //     ImgToken.prototype.draw.call(this);
    // }
    getRelPos(){
        return super.getRelPos();
    };
}