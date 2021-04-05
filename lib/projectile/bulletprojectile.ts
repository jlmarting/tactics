import { Projectile } from './projectile';
import { Collider } from './tokens/collider';

//Añadimos colisionador y efecto tras impacto                            

export const BulletProjectile = function(id,x,y,rad,displ){
    Projectile.call(this,Math.round(x),Math.round(y),rad,displ);    
    this.collider = new Collider(id,Math.round(x),Math.round(y),rad,1);     
}

BulletProjectile.prototype = Object.create(Projectile.prototype);

BulletProjectile.prototype.shot = function(tokens){
                                    var promiseBullet = new Promise(function(resolve, reject){
                                                                        var moveResult = Collider.prototype.move.call(this.collider,"up",this.displ,tokens);           
                                                                        resolve(moveResult);
                                                                    }.bind(this));   
    
                                    return promiseBullet.then(function(moveResult){
                                                                if ((moveResult.canMove==false)||(this.range==0)){
                                                                    this.displ=0;
                                                                    this.delete = true;            
                                                                    this.bulletEffect(moveResult.collisions,this);             
                                                                }
                                                                Projectile.prototype.shot.call(this);
                                                                return this.range;
                                                            }.bind(this));  
                                }

