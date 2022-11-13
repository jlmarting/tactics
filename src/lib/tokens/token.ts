//@ts-nocheck
import { Point } from './point';
import { Rectangle } from './rectangle';
import { Projectile } from './projectile';
import { ColliderToken } from './collider';

// //Punto, para posicionamiento básico en el canvas
// export class Point {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         this.info;
//         this.id = 'point_' + Date.now();
//         this.startTime = window.performance.now();
//         this.config = { position: 'relative', color: 'red', viewName: false };
//     }


//     placeAt = function (x, y) {
//         this.x = Math.round(x);
//         this.y = Math.round(y);
//     }

//     getCenter = function () {
//         return { "x": Math.round(this.x), "y": Math.round(this.y) }
//     }
// }




// //Punto con movimiento de cursor (comandos up down left right)
// //rad, radianes, indica la dirección del movimiento
// export class CursorPoint extends Point{

//     constructor(x, y, rad) {
//         super(this, x, y);
//         this.rad = rad;
//         this.incrGrad = 10;
//         this.displ = 1;
//         this.grad = (Math.PI / 360) * this.incrGrad;
//         this.path = [];
//         this.config.borderColor = 'cyan';
//         this.config.borderWidth = 1;
//     }
    
//     //CursorPoint.prototype = Object.create(Point.prototype);
    
//     move(cmd, displ) {
//             switch (cmd) {
//                 case "left": this.rad -= this.grad; displ = 0; break;  //37
//                 case "right": this.rad += this.grad; displ = 0; break; //39    
//                 case "up": break;                                   //38
//                 case "down": displ = (displ) * (-1); break;           //40
//             }
//             console.log(`${cmd} ${this.x},${this.y} - ${this.rad} rad`);
//             var dx = (Math.cos(this.rad) * displ);
//             var dy = (Math.sin(this.rad) * displ);
    
//             var x = this.x + dx;
//             var y = this.y + dy;
//             this.x = Math.round(x);
//             this.y = Math.round(y);
    
//             this.rad = this.rad % (Math.PI * 2);
    
//             var dXY = { "x": x, "y": y, "dx": dx, "dy": dy, "rad": this.rad, "displ": displ };
//             return dXY;
//         };
    

// } 
export class TText{
    draw: () => void;
    constructor(id, x, y, msg) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.config = { color: 'green' };
    }
    

}


//Punto de intersección
export class IntersectionPoint extends Point{
    constructor(x, y, vector) {
        super(x,y)
        //Point.call(this, x, y);
        this.config.color = 'orange';
        this.tokens = []; //Tokens que intervienen en la intersección
        this.tokens.push(vector);
    }
} 



export class Tile extends Rectangle{
    img: HTMLImageElement;
    src: any;
    constructor(id, x, y, src, width, height) {
        super( x, y, width, height);
        this.src = src;
        this.id = id;
    }
    draw() {
        Rectangle.prototype.draw.call(this);
        ImgToken.prototype.draw.call(this);
    }
}





// // Proyectil básico (sin impacto)
// export class Projectile extends Point{

//     constructor(x, y, rad, displ) {
//         super(x, y);
//         this.from = null;
//         this.rad = rad;
//         this.displ = displ;
//         this.originalRange = 1000;
//         this.range = this.originalRange;
//         this.effect = function () { console.log(this.id + ': No effect'); return true }.bind(this);
//     }
    
//     setEffect = function (effectType) {
//         switch (effectType) {
//             case "damage": this.effect = self.effects.damage();
//             case "split": this.effect = self.effects.split();
//             case "brick": this.effect = self.effects.brick();
//         }
    
//     }
    
//     move = function () {
//         if (this.displ <= 0) return -1;
//         if (this.range == 0) return -1;
    
//         if (this.range > this.displ) {
//             this.range -= this.displ;
//         } else {
//             this.displ = this.range;
//             this.range = 0;
//         }
    
//         var dx = Math.round(Math.cos(this.rad) * this.displ);
//         var dy = Math.round(Math.sin(this.rad) * this.displ);
    
//         var x = Math.round(this.x + dx);
//         var y = Math.round(this.y + dy);
//         this.x = x;
//         this.y = y;
    
//         var dXY = { "dx": dx, "dy": dy, "displ": this.displ };
    
//         return dXY;
//     }
    
//     shot = function (id) {
//         var d = this.move();
//         if (this.displ == 0) {
//             d = -1;
//         }
//         return d;
//     }
    

// }


//Añadimos colisionador y efecto tras impacto                            
export class BulletProjectile extends Projectile {
    bulletEffect: (collisions: any, bullet: any) => boolean;
    collider: any;
    constructor(id, x, y, rad, displ) {
        super(Math.round(x), Math.round(y), rad, displ);
        this.collider = new Collider(id, Math.round(x), Math.round(y), rad, 1);
    }
    
    shot(tokens) {
        var promiseBullet = new Promise(function (resolve, reject) {
            var moveResult = Collider.prototype.move.call(this.collider, "up", this.displ, tokens);
            resolve(moveResult);
        }.bind(this));
    
        return promiseBullet.then(function (moveResult) {
            if ((moveResult.canMove == false) || (this.range == 0)) {
                this.displ = 0;
                this.delete = true;
                this.bulletEffect(moveResult.collisions, this);
            }
            Projectile.prototype.shot.call(this);
            return this.range;
        }.bind(this));
    }
    
} 

// Effects: funciones de efectos de impacto    
export class Effect{

    RND(tokenHitted, bullet) {
        var sel = Math.round(Math.random() * 3);
        switch (sel) {
            case 0: self.effects.damage(tokenHitted, bullet); break;
            case 1: self.effects.spin(tokenHitted, bullet); break;
            case 2: self.effects.damage(tokenHitted, bullet); break;
        }
    }
    
    damage(tokenHitted, bullet) {
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
    
    spin(tokenHitted, bullet) {
        tokenHitted.rad -= Math.round(Math.random() * 1);
    }
    
    displace(tokenHitted, bullet) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move("up", 100, scene.arrTokens);
    }
    
    split(tokenHitted, bullet) {
        tokenHitted.delete = true;
    }
    
    brick(tokenHitted, bullet) {
        var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
        brick1.health = 150;
        brick1.config.viewName = false;
        theScene.arrTokens.push(brick1); theScene.arrTokens.push(brick2); theScene.arrTokens.push(brick3); theScene.arrTokens.push(brick4);
        theScene.arrTokens.loadImg();
        return brick1;
    }
    

}




