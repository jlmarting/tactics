// Shooter: un tanque que dispara ColliderToken + shoot
// Como crea elementos a pintar, deberemos de saber en qué canvas
import { ColliderToken } from "./collidertoken.js";
import { BulletProjectile } from "./bulletprojectile.js";

export class Shooter extends ColliderToken{

    reloading: boolean; //recargando: para limitar disparo automático.
    bulletCount: number; //Contador de balas
    startTime: number; //Tiempo de inicio del disparo
    


    constructor(id:string,x: number,y:any,rad:number,src: string,width:number,height:number){
        super(id,x,y,rad,src,width,height);
        this.rad = rad;
        this.reloading = false; //recargando: para limitar disparo automático.
        this.bulletCount = 2000;
        this.startTime = 0;
    }
    
    //Shooter.prototype = Object.create(ColliderToken.prototype);
    
    shot(){    
        const SHOT_LAPSE = 90;
        const SHOT_DISPLACEMENT = 8;  
        if((this.reloading==true)||(this.bulletCount == 0)) return null;
        var xy = this.getCenter();
        var dist = 65; //distancia respecto al centro
        xy.x = xy.x + Math.cos(this.rad)*dist;
        xy.y = xy.y + Math.sin(this.rad)*dist;
        var bullet = new BulletProjectile(this.id, (xy.x), (xy.y), this.rad, SHOT_DISPLACEMENT);    
        bullet.id = this.id + '_' + this.bulletCount;    ; 
        this.bulletCount--;     
        this.reloading = true;
        var shooter = this;
        setTimeout(function(){shooter.reloading= false;}, SHOT_LAPSE);
        return bullet;    
    }

}

