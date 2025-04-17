import { Collider } from "./collider.js";
import { ImgToken } from "./image.js";
export class ColliderToken extends ImgToken {
    constructor(id, x, y, rad, src, w, h) {
        super(id, x, y, rad, src, w, h);
        this.collider = new Collider(id, x, y, rad, w / 2);
        this.health = 1000;
        this.destroy = false;
    }
    move(cmd, displ, tokens) {
        let movement = null;
        movement = this.collider.move(cmd, displ, tokens);
        if (movement != null) {
            movement = super.move(cmd, displ);
        }
        return movement;
    }
}
//# sourceMappingURL=collidertoken.js.map