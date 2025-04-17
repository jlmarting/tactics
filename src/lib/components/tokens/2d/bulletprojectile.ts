import { Collider } from "./collider.js";
import { Projectile } from "./projectile.js";
import { IToken2D } from "../../../interfaces/IToken2D.js";

//Proyectil que resuelve impacto
//Añadimos colisionador y efecto tras impacto                            
export class BulletProjectile extends Projectile {
    bulletEffect: (collisions: any, bullet: any) => boolean;
    collider: Collider;
    constructor(id: string, x: number, y: number, rad: number, displ: any) {
        super(Math.round(x), Math.round(y), rad, displ);
        this.collider = new Collider(id, Math.round(x), Math.round(y), rad, 1);
    }

    //
    shot(tokens: IToken2D[]) {        
        var promiseBullet = new Promise(function (resolve: (arg0: any) => void, reject: any) {
            // var moveResult = Collider.prototype.move.call(this.collider, "up", this.displ, tokens);
            let moveResult = this.collider.move("up", this.displ, tokens);
            resolve(moveResult);
        }.bind(this));
    
        return promiseBullet.then(function (moveResult: { canMove: boolean; collisions: any; }) {
            if ((moveResult.canMove == false) || (this.range == 0)) {
                this.displ = 0;
                this.delete = true;
                this.bulletEffect(moveResult.collisions, this);
            }
            //Projectile.prototype.shot.call(this);            
            this.super.move();
            return this.range;
        }.bind(this));
    }
    
} 