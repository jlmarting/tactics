var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ColliderToken } from './collider.js';
import { BulletProjectile } from './token.js';
var Shooter = (function (_super) {
    __extends(Shooter, _super);
    function Shooter(id, x, y, rad, src, width, height) {
        var _this = _super.call(this, id, x, y, rad, src, width, height) || this;
        _this.rad = rad;
        _this.reloading = false;
        _this.bulletCount = 2000;
        _this.startTime = 0;
        return _this;
    }
    Shooter.prototype.shot = function () {
        var shotLapse = 90;
        var shotDispl = 8;
        if ((this.reloading == true) || (this.bulletCount == 0))
            return null;
        var xy = this.getCenter();
        var dist = 65;
        xy.x = xy.x + Math.cos(this.rad) * dist;
        xy.y = xy.y + Math.sin(this.rad) * dist;
        var bullet = new BulletProjectile(this.id, (xy.x), (xy.y), this.rad, shotDispl);
        bullet.id = this.id + '_' + this.bulletCount;
        ;
        this.bulletCount--;
        this.reloading = true;
        var shooter = this;
        setTimeout(function () { shooter.reloading = false; }, shotLapse);
        return bullet;
    };
    return Shooter;
}(ColliderToken));
export { Shooter };
//# sourceMappingURL=shooter.js.map