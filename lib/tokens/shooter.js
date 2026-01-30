"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shooter = void 0;
const collider_1 = require("./collider");
const bulletprojectile_1 = require("../projectile/bulletprojectile");
// Shooter: un tanque que dispara ColliderToken + shoot
class Shooter extends collider_1.ColliderToken {
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
        const bullet = new bulletprojectile_1.BulletProjectile(this.id + '_' + this.bulletCount, xy.x, xy.y, this.rad, shotDispl);
        this.bulletCount--;
        this.reloading = true;
        setTimeout(() => {
            this.reloading = false;
        }, shotLapse);
        return bullet;
    }
}
exports.Shooter = Shooter;
//# sourceMappingURL=shooter.js.map