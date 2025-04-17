import { Collider } from "./collider.js";
import { Projectile } from "./projectile.js";
export class BulletProjectile extends Projectile {
    constructor(id, x, y, rad, displ) {
        super(Math.round(x), Math.round(y), rad, displ);
        this.collider = new Collider(id, Math.round(x), Math.round(y), rad, 1);
    }
    shot(tokens) {
        var promiseBullet = new Promise(function (resolve, reject) {
            let moveResult = this.collider.move("up", this.displ, tokens);
            resolve(moveResult);
        }.bind(this));
        return promiseBullet.then(function (moveResult) {
            if ((moveResult.canMove == false) || (this.range == 0)) {
                this.displ = 0;
                this.delete = true;
                this.bulletEffect(moveResult.collisions, this);
            }
            this.super.move();
            return this.range;
        }.bind(this));
    }
}
//# sourceMappingURL=bulletprojectile.js.map