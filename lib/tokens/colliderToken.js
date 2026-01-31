import { Collider } from "./collider";
import { ImgToken } from "./image";
export class ColliderToken extends ImgToken {
    constructor(id, x, y, rad, src, width, height) {
        super(id, x, y, rad, src, width, height);
        this.collider = new Collider(id, x, y, width);
    }
}
//# sourceMappingURL=colliderToken.js.map