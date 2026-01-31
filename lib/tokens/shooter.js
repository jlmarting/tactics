import { ColliderToken } from "./collider.js";
import { BulletProjectile } from '../projectile/bulletprojectile.js';
// Shooter: un tanque que dispara ColliderToken + shoot
export class Shooter extends ColliderToken {
    constructor(id, x, y, rad, src, width, height) {
        super(id, x, y, rad, src, width, height);
        this.reloading = false; // recargando: para limitar disparo automático.
        this.bulletCount = 2000;
        this.startTime = 0;
    }
    shot() {
        const shotLapse = 90;
        const shotDispl = 8;
        if (this.reloading === true || this.bulletCount === 0)
            return null;
        const xy = this.getCenter();
        const dist = 65; // distancia respecto al centro
        xy.x = xy.x + Math.cos(this.rad) * dist;
        xy.y = xy.y + Math.sin(this.rad) * dist;
        const bullet = new BulletProjectile(this.id + '_' + this.bulletCount, xy.x, xy.y, this.rad, shotDispl);
        this.bulletCount--;
        this.reloading = true;
        setTimeout(() => {
            this.reloading = false;
        }, shotLapse);
        return bullet;
    }
}
//# sourceMappingURL=shooter.js.map