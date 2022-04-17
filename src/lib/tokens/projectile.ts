import { Point } from './point.js'
import { ColliderToken } from './collider.js'

// Proyectil básico (sin impacto)
export class Projectile extends Point{
    from: any;
    rad: any;
    displ: any;
    originalRange: number;
    range: any;
    effect: any;

    constructor(x: any, y: any, rad: any, displ: any) {
        super(x, y);
        this.from = null;
        this.rad = rad;
        this.displ = displ;
        this.originalRange = 1000;
        this.range = this.originalRange;
        this.effect = function () { console.log(this.id + ': No effect'); return true }.bind(this);
    }
    
    setEffect = function (effectType: any) {


        let effect = new Effect();
        switch (effectType) {
            case "damage": this.effect = effect.damage;
            case "split": this.effect = effect.split;
            case "brick": this.effect = effect.brick;
        }
    
    }
    
    move = function () {
        if (this.displ <= 0) return -1;
        if (this.range == 0) return -1;
    
        if (this.range > this.displ) {
            this.range -= this.displ;
        } else {
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
    }
    
    shot = function (id:any) {
        var d = this.move();
        if (this.displ == 0) {
            d = -1;
        }
        return d;
    }
    

}



// Effects: funciones de efectos de impacto    
export class Effect{

    RND(tokenHitted: any, bullet: any) {
        var sel = Math.round(Math.random() * 3);
        switch (sel) {
            case 0: this.damage(tokenHitted, bullet); break;
            case 1: this.spin(tokenHitted, bullet); break;
            case 2: this.damage(tokenHitted, bullet); break;
        }
    }
    
    damage(tokenHitted: any, bullet: any) {
        tokenHitted.health -= Math.round(Math.random() * 200);
        let hitTime = window.performance.now() - bullet.startTime;
        let hitDistance = bullet.originalRange - bullet.range;
        //bullet.destroy = true;
        console.log(`Tiempo de impacto de ${bullet.id} en ${tokenHitted.id}: ${hitTime}ms` +
            `  ${hitDistance}px vel: ${Math.round((hitDistance / hitTime) * 1000)}px/s`);
        if (tokenHitted.health <= 0) {
            tokenHitted.health = 0;
            tokenHitted.destroy = true;
        }
    }
    
    spin(tokenHitted: any, bullet: any) {
        tokenHitted.rad -= Math.round(Math.random() * 1);
    }
    
    displace(tokenHitted: any, bullet: any, tokens: Array<any>) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move("up", 100, tokens);
    }
    
    split(tokenHitted: any, bullet: any) {
        tokenHitted.delete = true;
    }
    
    brick(tokenHitted: any, bullet: any, tokens: Array<any>) {
        var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
        brick1.health = 150;
        brick1.config.viewName = false;
        tokens.push(brick1); tokens.push(brick2); tokens.push(brick3); tokens.push(brick4);
        //tokens.loadImg();
        return brick1;
    }
    

}