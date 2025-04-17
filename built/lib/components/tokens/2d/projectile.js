import { Token2D } from './Token2D.js';
import { ColliderToken } from './collidertoken.js';
import { Movement2D } from '../../../models/movement.js';
import { Coord2D } from '../../../models/Coord2D.js';
export class Projectile extends Token2D {
    constructor(x, y, rad, displ) {
        super(new Coord2D(x, y));
        this.from = null;
        this.rad = rad;
        this.displ = displ;
        this.originalRange = 1000;
        this.range = this.originalRange;
        this.effect = function () { console.log(this.id + ': No effect'); return true; }.bind(this);
    }
    setEffect(effectType) {
        let effect = new Effect();
        switch (effectType) {
            case "damage": this.effect = effect.damage;
            case "split": this.effect = effect.split;
            case "brick": this.effect = effect.brick;
        }
    }
    move() {
        let dXY = new Movement2D();
        dXY.origin = this.position;
        dXY.destination = dXY.origin;
        if (this.displ <= 0)
            return dXY;
        if (this.range == 0)
            return dXY;
        if (this.range > this.displ) {
            this.range -= this.displ;
        }
        else {
            this.displ = this.range;
            this.range = 0;
        }
        let dx = Math.round(Math.cos(this.rad) * this.displ);
        let dy = Math.round(Math.sin(this.rad) * this.displ);
        let x = Math.round(dXY.origin.x + dx);
        let y = Math.round(dXY.origin.y + dy);
        dXY.destination.x = x;
        dXY.destination.y = y;
        return dXY;
    }
}
export class Effect {
    RND(tokenHitted, bullet) {
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
    }
    damage(tokenHitted, bullet) {
        tokenHitted.health -= Math.round(Math.random() * 200);
        let hitTime = window.performance.now() - bullet.startTime;
        let hitDistance = bullet.originalRange - bullet.range;
        console.log(`Tiempo de impacto de ${bullet.id} en ${tokenHitted.id}: ${hitTime}ms` +
            `  ${hitDistance}px vel: ${Math.round((hitDistance / hitTime) * 1000)}px/s`);
        if (tokenHitted.health <= 0) {
            tokenHitted.health = 0;
            tokenHitted.destroy = true;
        }
    }
    spin(tokenHitted, bullet) {
        tokenHitted.rad -= Math.round(Math.random() * 1);
    }
    displace(tokenHitted, bullet, tokens) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move("up", 100, tokens);
    }
    split(tokenHitted, bullet) {
        tokenHitted.delete = true;
    }
    brick(tokenHitted, bullet, tokens) {
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
    }
}
//# sourceMappingURL=projectile.js.map