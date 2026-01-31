//Token vinculado a una imagen
import { Point } from "../point/point";
import { CursorPoint } from "../point/cursorpoint";
import { IToken } from "./interfaces/itoken";


export class ImgToken extends CursorPoint implements IToken {

    w: any;
    h: any;
    idColor: string;
    src: any;
    img: any; // Añadido para evitar errores en scene.js

    constructor(id: string, x: number, y: number, rad: number, src: string, width: number, height: number) {
        super(x, y, rad);
        this.id = id;
        this.idColor = 'red';
        this.src = src;
        this.w = width;
        this.h = height;
        this.config = { viewName: false, selectable: false, position: 'relative' };
    }
    center: Point;
    delete: boolean;

    getCenter() {
        return { "x": this.x, "y": this.y };
    }

    move(cmd: string, displ: number) {
        var dXY = super.move(cmd, displ);
        return dXY;
    }
}
