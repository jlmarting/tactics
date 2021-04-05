import { Point } from './point/point';
import { Tactics } from './tactics';


// Proyectil básico (sin impacto)
export const Projectile = function(x,y,rad,displ){
    Point.call(this,x,y);    
    this.from = null;
    this.rad = rad;        
    this.displ = displ;
    this.originalRange = 1000;    
    this.range = this.originalRange; 
    this.effect = function(){console.log(this.id + ': No effect');return true}.bind(this);      
}

Projectile.prototype.setEffect= function(effectType){
    switch(effectType){
        case "damage"   : this.effect = Tactics.damage();
        case "split"   : this.effect = Tactics.split();
        case "brick"   : this.effect = Tactics.effects.brick();
    }

}

Projectile.prototype = Object.create(Point.prototype);

Projectile.prototype.move = function(){
    if(this.displ <= 0) return -1;
    if(this.range == 0) return -1;

    if(this.range>this.displ){
        this.range -= this.displ;
    }else{
        this.displ = this.range;
        this.range = 0;
    }
        
    var dx = Math.round(Math.cos(this.rad) * this.displ); 
    var dy = Math.round(Math.sin(this.rad) * this.displ); 
            
    var x = Math.round(this.x + dx);
    var y = Math.round(this.y + dy);
    this.x = x;
    this.y = y;
            
    var dXY = {"dx":dx,"dy":dy, "displ": this.displ}; 
    
    return dXY;
}

Projectile.prototype.shot = function(id){                                    
                                var d = this.move();
                                if(this.displ==0){                                    
                                    d=-1;}
                                return d;
                            }                        
