//@ts-nocheck
// Shooter: un tanque que dispara ColliderToken + shoot
// Como crea elementos a pintar, deberemos de saber en qué canvas

const Shooter = function(id,x,y,rad,src,width,height){
    ColliderToken.call(this,id,x,y,rad,src,width,height);
    this.rad = rad;
    this.reloading = false; //recargando: para limitar disparo automático.
    this.bulletCount = 2000;
    this.startTime = 0;
}

Shooter.prototype = Object.create(ColliderToken.prototype);

Shooter.prototype.shot = function(){    
    var shotLapse = 90;
    var shotDispl = 8;  
    if((this.reloading==true)||(this.bulletCount == 0)) return null;
    var xy = this.getCenter();
    var dist = 65; //distancia respecto al centro
    xy.x = xy.x + Math.cos(this.rad)*dist;
    xy.y = xy.y + Math.sin(this.rad)*dist;
    var bullet = new BulletProjectile(this.id, (xy.x), (xy.y), this.rad, shotDispl);    
    bullet.id = this.id + '_' + this.bulletCount;    ; 
    this.bulletCount--;     
    this.reloading = true;
    var shooter = this;
    setTimeout(function(){shooter.reloading= false;}, shotLapse);
    return bullet;    
}