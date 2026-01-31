import { Collider } from "./collider";
import { ImgToken } from "./image";

export class ColliderToken extends ImgToken {
    collider: Collider;

    constructor(id: string, x: number, y: number, rad: number, src: string, width: number, height: number) {
        super(id, x, y, rad, src, width, height);
        this.collider = new Collider(id, x, y, width);
    }
}