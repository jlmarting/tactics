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
import { Point } from './point';
import { Rectangle } from './rectangle';
import { Projectile } from './projectile';
import { ColliderToken } from './collider';
var TText = (function () {
    function TText(id, x, y, msg) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.config = { color: 'green' };
    }
    return TText;
}());
export { TText };
var IntersectionPoint = (function (_super) {
    __extends(IntersectionPoint, _super);
    function IntersectionPoint(x, y, vector) {
        var _this = _super.call(this, x, y) || this;
        _this.config.color = 'orange';
        _this.tokens = [];
        _this.tokens.push(vector);
        return _this;
    }
    return IntersectionPoint;
}(Point));
export { IntersectionPoint };
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(id, x, y, src, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.src = src;
        _this.id = id;
        return _this;
    }
    Tile.prototype.draw = function () {
        Rectangle.prototype.draw.call(this);
        ImgToken.prototype.draw.call(this);
    };
    return Tile;
}(Rectangle));
export { Tile };
var BulletProjectile = (function (_super) {
    __extends(BulletProjectile, _super);
    function BulletProjectile(id, x, y, rad, displ) {
        var _this = _super.call(this, Math.round(x), Math.round(y), rad, displ) || this;
        _this.collider = new Collider(id, Math.round(x), Math.round(y), rad, 1);
        return _this;
    }
    BulletProjectile.prototype.shot = function (tokens) {
        var promiseBullet = new Promise(function (resolve, reject) {
            var moveResult = Collider.prototype.move.call(this.collider, "up", this.displ, tokens);
            resolve(moveResult);
        }.bind(this));
        return promiseBullet.then(function (moveResult) {
            if ((moveResult.canMove == false) || (this.range == 0)) {
                this.displ = 0;
                this["delete"] = true;
                this.bulletEffect(moveResult.collisions, this);
            }
            Projectile.prototype.shot.call(this);
            return this.range;
        }.bind(this));
    };
    return BulletProjectile;
}(Projectile));
export { BulletProjectile };
var Effect = (function () {
    function Effect() {
    }
    Effect.prototype.RND = function (tokenHitted, bullet) {
        var sel = Math.round(Math.random() * 3);
        switch (sel) {
            case 0:
                self.effects.damage(tokenHitted, bullet);
                break;
            case 1:
                self.effects.spin(tokenHitted, bullet);
                break;
            case 2:
                self.effects.damage(tokenHitted, bullet);
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
    Effect.prototype.displace = function (tokenHitted, bullet) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move("up", 100, scene.arrTokens);
    };
    Effect.prototype.split = function (tokenHitted, bullet) {
        tokenHitted["delete"] = true;
    };
    Effect.prototype.brick = function (tokenHitted, bullet) {
        var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
        brick1.health = 150;
        brick1.config.viewName = false;
        theScene.arrTokens.push(brick1);
        theScene.arrTokens.push(brick2);
        theScene.arrTokens.push(brick3);
        theScene.arrTokens.push(brick4);
        theScene.arrTokens.loadImg();
        return brick1;
    };
    return Effect;
}());
export { Effect };
//# sourceMappingURL=token.js.map