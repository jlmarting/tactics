"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletProjectile = void 0;
var projectile_1 = require("./projectile");
var collider_1 = require("./tokens/collider");
//Añadimos colisionador y efecto tras impacto                            
var BulletProjectile = function (id, x, y, rad, displ) {
    projectile_1.Projectile.call(this, Math.round(x), Math.round(y), rad, displ);
    this.collider = new collider_1.Collider(id, Math.round(x), Math.round(y), rad, 1);
};
exports.BulletProjectile = BulletProjectile;
exports.BulletProjectile.prototype = Object.create(projectile_1.Projectile.prototype);
exports.BulletProjectile.prototype.shot = function (tokens) {
    var promiseBullet = new Promise(function (resolve, reject) {
        var moveResult = collider_1.Collider.prototype.move.call(this.collider, "up", this.displ, tokens);
        resolve(moveResult);
    }.bind(this));
    return promiseBullet.then(function (moveResult) {
        if ((moveResult.canMove == false) || (this.range == 0)) {
            this.displ = 0;
            this.delete = true;
            this.bulletEffect(moveResult.collisions, this);
        }
        projectile_1.Projectile.prototype.shot.call(this);
        return this.range;
    }.bind(this));
};
//# sourceMappingURL=bulletprojectile.js.map