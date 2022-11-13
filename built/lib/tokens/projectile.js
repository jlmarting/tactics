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
import { Point } from './point.js';
import { ColliderToken } from './collider.js';
var Projectile = (function (_super) {
    __extends(Projectile, _super);
    function Projectile(x, y, rad, displ) {
        var _this = _super.call(this, x, y) || this;
        _this.setEffect = function (effectType) {
            var effect = new Effect();
            switch (effectType) {
                case "damage": this.effect = effect.damage;
                case "split": this.effect = effect.split;
                case "brick": this.effect = effect.brick;
            }
        };
        _this.move = function () {
            if (this.displ <= 0)
                return -1;
            if (this.range == 0)
                return -1;
            if (this.range > this.displ) {
                this.range -= this.displ;
            }
            else {
                this.displ = this.range;
                this.range = 0;
            }
            var dx = Math.round(Math.cos(this.rad) * this.displ);
            var dy = Math.round(Math.sin(this.rad) * this.displ);
            var x = Math.round(this.x + dx);
            var y = Math.round(this.y + dy);
            this.x = x;
            this.y = y;
            var dXY = { "dx": dx, "dy": dy, "displ": this.displ };
            return dXY;
        };
        _this.shot = function (id) {
            var d = this.move();
            if (this.displ == 0) {
                d = -1;
            }
            return d;
        };
        _this.from = null;
        _this.rad = rad;
        _this.displ = displ;
        _this.originalRange = 1000;
        _this.range = _this.originalRange;
        _this.effect = function () { console.log(this.id + ': No effect'); return true; }.bind(_this);
        return _this;
    }
    return Projectile;
}(Point));
export { Projectile };
var Effect = (function () {
    function Effect() {
    }
    Effect.prototype.RND = function (tokenHitted, bullet) {
        var sel = Math.round(Math.random() * 3);
        switch (sel) {
            case 0:
                this.damage(tokenHitted, bullet);
                break;
            case 1:
                this.spin(tokenHitted, bullet);
                break;
            case 2:
                this.damage(tokenHitted, bullet);
                break;
        }
    };
    Effect.prototype.damage = function (tokenHitted, bullet) {
        tokenHitted.health -= Math.round(Math.random() * 200);
        var hitTime = window.performance.now() - bullet.startTime;
        var hitDistance = bullet.originalRange - bullet.range;
        console.log("Tiempo de impacto de " + bullet.id + " en " + tokenHitted.id + ": " + hitTime + "ms" +
            ("  " + hitDistance + "px vel: " + Math.round((hitDistance / hitTime) * 1000) + "px/s"));
        if (tokenHitted.health <= 0) {
            tokenHitted.health = 0;
            tokenHitted.destroy = true;
        }
    };
    Effect.prototype.spin = function (tokenHitted, bullet) {
        tokenHitted.rad -= Math.round(Math.random() * 1);
    };
    Effect.prototype.displace = function (tokenHitted, bullet, tokens) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move("up", 100, tokens);
    };
    Effect.prototype.split = function (tokenHitted, bullet) {
        tokenHitted["delete"] = true;
    };
    Effect.prototype.brick = function (tokenHitted, bullet, tokens) {
        var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
        brick1.health = 150;
        brick1.config.viewName = false;
        tokens.push(brick1);
        tokens.push(brick2);
        tokens.push(brick3);
        tokens.push(brick4);
        return brick1;
    };
    return Effect;
}());
export { Effect };
//# sourceMappingURL=projectile.js.map