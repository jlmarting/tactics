//Punto, para posicionamiento básico en el canvas
const Point = function(x,y){    
    this.x = x;
    this.y = y;  
    this.info; 
    this.id;  
    this.startTime = window.performance.now();
    this.config = {position: 'relative'};    
};


Point.prototype.placeAt = function(x,y){
    this.x = Math.round(x);
    this.y = Math.round(y);    
}

Point.prototype.getCenter = function(){
    return {"x": Math.round(this.x) , "y": Math.round(this.y)}   
}

//Punto con movimiento de cursor (comandos up down left right)
//rad, radianes, indica la dirección del movimiento
const CursorPoint = function(x,y,rad){
    Point.call(this,x,y);   
    this.rad = rad;
    this.incrGrad = 5;
    this.displ =  1;
    this.grad = (Math.PI/360)*this.incrGrad;  
    this.path = []; 
}

CursorPoint.prototype = Object.create(Point.prototype);

CursorPoint.prototype.move = 
        function(cmd, displ){                                            
            switch (cmd){  
                case "left": this.rad -= this.grad;displ=0;break;  //37
                case "right": this.rad += this.grad;displ=0;break; //39    
                case "up": break;                                   //38
                case "down": displ = (displ)*(-1); break;           //40
            }                                            

            var dx = Math.cos(this.rad) * displ; 
            var dy = Math.sin(this.rad) * displ; 
            
            var x = this.x + dx;
            var y = this.y + dy;
            this.x = Math.round(x);
            this.y = Math.round(y);
            
            var dXY = {"x":x,"y":y,"dx":dx,"dy":dy, "rad":this.rad, "displ":displ}; 
            return dXY;
        };  


//Token vinculado a una imagen
const ImgToken = function(id,x,y,rad,src,width,height){
        CursorPoint.call(this,x,y,rad);    
        this.id = id;  
        this.idColor = 'red';    
        this.src = src;
        this.w = width;
        this.h = height;                                       
        this.config = {viewName:false, selectable:false, position: 'relative'};         
        
}

ImgToken.prototype = Object.create(CursorPoint.prototype);

ImgToken.prototype.getCenter = function(){
        return {"x": this.x, "y": this.y}
    }

ImgToken.prototype.move = 
    function(cmd, displ){
        var dXY = CursorPoint.prototype.move.call(this,cmd,displ)                                                   
        return dXY;
    };    



//x,y: coordenadas centro, w,h:width, height
const Rectangle = function(x,y,w,h){
    Point.call(this,x,y);
    this.w=w;
    this.h=h;
}

Rectangle.prototype.placeAt = function(x,y){
    Point.prototype.placeAt.call(this,x,y);
}

Rectangle.prototype.isInside = function(x,y){
    var rw = this.w/2;
    var rh = this.h/2;
    //return !((x < this.x-rw)||(x > this.x+rw)||(y < this.y-rh)||(y > this.y+rh))
    return !((x-70 < this.x-rw)||(x-70 > this.x+rw)||(y+70 < this.y-rh)||(y-70 > this.y+rh))
}

Rectangle.prototype.isCollisioning = function(s){
    if(s instanceof Rectangle == true){
        var rw = this.w/2;
        var rh = this.h/2;
        return(this.isInside(s.x-rw,s.y)||this.isInside(s.x+rw,s.y)||this.isInside(s.x,s.y-rh)||this.isInside(s.x-r,s.y+rh));
    }else{
        if(s instanceof Collider == true){
            //TODO colisión con Collider
            return false;
        }else{
            return false;
        }
    }
}

const Tile = function(id,x,y,src,width,height){       
    Rectangle.call(this,x,y,width,height);   
    this.src = src;
    this.id = id;
}

Tile.prototype.draw = function(){
    Rectangle.prototype.draw.call(this);
    ImgToken.prototype.draw.call(this);
}



// C O L L I D E R
//Colisionador circular
const Collider = function(id,x,y,rad,cradius){
    CursorPoint.call(this,x,y,rad);    
    this.id = id;    
    this.radius=cradius; 
    this.subColliders = []; //colisionadores internos 
    this.config = {enabled:true,visible: true, innerColor : "rgba(255, 255, 15, 0.60)", borderColor : "magenta", borderWidth: 5}
    this.back = [];             
}


Collider.prototype = Object.create(CursorPoint.prototype);

Collider.prototype.addSubCollider = function(){
    var id = this.id + '_sc_' + this.subColliders.length; //seguimos esta convención en la nomenclatura de identificadores    
    var sc = new Collider(id,this.x,this.y,this.rad,this.radius/2);    
    this.subColliders.push(sc);
}

Collider.prototype.getParentId = function(){
    var arrIds = [];
    arrIds = this.id.split('_sc_');
    return arrIds[0];        
}

//Tenemos colisionador y subcolisionadores. el colisionador es una forma rápida de descartar colisiones.
Collider.prototype.isCollisioning = function(otherCollider){
    var self = this;
    if(this.config.enabled==false) return false;
    if (this.id == otherCollider.id) return false;    
    if((this instanceof Collider)&&(otherCollider instanceof Collider)){        
        var dx = this.x - otherCollider.x; 
        var dy = this.y - otherCollider.y; 
        var distance = Math.sqrt((dx*dx)+(dy*dy)); //distancia entre centros                    
        var diff = distance - (this.radius + otherCollider.radius); //margen de maniobra           
        
        if(diff>=0){            
            return false;
        } 
        else {            
            if(this.subColliders.length==0){
                if(otherCollider.subColliders.length==0){                  
                    return true;
                }
                else{
                    var isCol = false;
                    otherCollider.subColliders.forEach(function(sc){
                        isCol = isCol || self.isCollisioning(sc);
                    });
                    return isCol;
                }
            }
            else{
                if(otherCollider.subColliders.length==0){
                    var isCol = false;
                    this.subColliders.forEach(function(sc){
                        isCol = isCol || sc.isCollisioning(otherCollider);
                    });
                    return isCol;
                }
                else{
                    var isCol = false;
                    this.subColliders.forEach(function(sc){                    
                        otherCollider.subColliders.forEach(function(oc){
                            isCol = isCol || sc.isCollisioning(oc);
                        });                  
                    });
                    return isCol;
                }
            }            
        }       
    }
    else {  //No estamos analizando colliders
        return false;;
    }
}

Collider.prototype.getCollisions = function(tokens){
    if((typeof tokens == 'undefined')||(tokens.length==0)){
        return [];
    }
    var collisions = [];
    for(var i=0;i<tokens.length;i++){
        var currCollider = tokens[i].collider;
        if(typeof currCollider !== 'undefined'){
            var currentCol = tokens[i].collider;
            if(this.isCollisioning(currentCol)){
                collisions.push(tokens[i].id);
            }
        }             
    }
    return collisions;
}

/* 
    El colisionador se moverá a una nueva posición.
    Las colisiones recogidas son identificadores de tokens en un array.
    Si existen colisiones el colisionador se posicionará en sus coordenadas anteriores (almacenadas en back).
    Se devolverá un objeto con las colisiones y con la propiedad canMove para que el objeto que tiene el colisionador
    actúe en consecuencia.
*/
Collider.prototype.move = function(cmd,displ,tokens,callback){
       
        var colPromise = new Promise(function(resolve, reject){    
                                        if(typeof this.back == 'undefined'){
                                            console.log('<<collider sin back >>' + JSON.stringify(this.id));
                                            return  {canMove:false, collisions:[]};
                                        }                                    
                                        this.back.push({x:this.x,y:this.y,rad:this.rad});
                                        CursorPoint.prototype.move.call(this,cmd,displ);
                                        if(this.subColliders.length>0){
                                            this.subColliders.forEach(function(sc){
                                                sc.move(cmd,displ);                                                
                                            });
                                        }                                                  
                                        var collisions = this.getCollisions(tokens);
                                        resolve(collisions);   
                                    }.bind(this));
     
        return colPromise.then(function(collisions){                                                                                                        
                                    if(collisions.length>0){
                                        let pos = this.back.pop();
                                        this.rad = pos.rad;
                                        this.placeAt(pos.x,pos.y);
                                        if(this.subColliders.length>0){
                                            this.subColliders.forEach(function(sc){
                                                var possc = sc.back.pop();
                                                sc.placeAt(possc.x,possc.y);
                                                sc.rad = possc.rad;
                                            });
                                        }     
                                        return {canMove:false,collisions:collisions};  
                                    }
                                    else{
                                        if(this.back.length>350){
                                            this.back.shift();                                                                    
                                        }
                                        return {canMove:true, collisions:collisions};
                                    }   
                                }.bind(this));
}


// ImgToken +  Colisionador. El movimiento es dependiente del colisionador.
const ColliderToken = function(id,x,y,rad,src,w,h){         
    ImgToken.call(this,id,x,y,rad,src,w,h); 
    this.collider = new Collider(id,x,y,rad,w/2);
    this.health = 1000;
}

ColliderToken.prototype = Object.create(ImgToken.prototype);

ColliderToken.prototype.placeAt = function(x,y){
    Point.prototype.placeAt.call(this,x,y); 
}

//Redifinición del método usando además el del prototipo
ColliderToken.prototype.move = function(cmd,displ,tokens){ 
        
    var colliderMovePromise = function(cmd,displ,tokens){
                                    return new Promise(function(resolve,reject){
                                        var moveResult = Collider.prototype.move.call(this.collider,cmd,displ,tokens);                                                                                
                                        resolve(moveResult);
                                        }.bind(this));
                                    }.bind(this);                               
                                
     
        colliderMovePromise(cmd,displ,tokens).then(function(moveResult){
            if (moveResult.canMove) {
                ImgToken.prototype.move.call(this,cmd,displ);
            }
        }.bind(this));
        
    }
                

// Token con movimiento programado (sigue comandos del plan)
var AutoToken = function(id,x,y,rad,src,w,h){
    ColliderToken.call(this,id,x,y,rad,src,w,h);
    this.plan = [];
} 

AutoToken.prototype = Object.create(ColliderToken.prototype);

AutoToken.prototype.autopilot = function(tokens){
                                    //se envían movimientos (keyCodes) de la pila "plan"
                                    if(this.plan.length>0){            
                                        var order = this.plan.pop();
                                        this.plan.unshift(order);                        
                                        this.move(order,2,tokens);                                 
                                    }
                                };


// Proyectil básico (sin impacto)
const Projectile = function(x,y,rad,displ){
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
        case "damage"   : this.effect = self.effects.damage();
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
        
    var dx = Math.cos(this.rad) * this.displ; 
    var dy = Math.sin(this.rad) * this.displ; 
            
    var x = this.x + dx;
    var y = this.y + dy;
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


//Añadimos colisionador y efecto tras impacto                            
const BulletProjectile = function(id,x,y,rad,displ){
    Projectile.call(this,x,y,rad,displ);    
    this.collider = new Collider(id,x,y,rad,1);     
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
    var shotLapse = 120;
    var shotDispl = 5;  
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


// Effects: funciones de efectos de impacto    
const Effects = {};

Effects.RND = function(tokenHitted,bullet){
    var sel = Math.round(Math.random()*3);
    switch(sel){
        case 0  : self.effects.damage(tokenHitted,bullet);break;
        case 1  : self.effects.spin(tokenHitted,bullet);break;
        case 2  : self.effects.damage(tokenHitted,bullet);break;            
    }
}

Effects.damage = function(tokenHitted,bullet){
        tokenHitted.health -= Math.round(Math.random()*2);
        let hitTime = window.performance.now()-bullet.startTime;
        let hitDistance = bullet.originalRange - bullet.range;
        //bullet.destroy = true;
        console.log(`Tiempo de impacto de ${bullet.id} en ${tokenHitted.id}: ${hitTime}ms`+
        `  ${hitDistance}px vel: ${Math.round((hitDistance/hitTime)*1000)}px/s`);
        if (tokenHitted.health<=0){
            tokenHitted.health = 0;
            tokenHitted.destroy = true;  
        }    
}

Effects.spin = function(tokenHitted,bullet){
    tokenHitted.rad -= Math.round(Math.random()*1);     
    } 

Effects.displace = function(tokenHitted,bullet){
    tokenHitted.rad = Math.round(Math.random()*1);     
    tokenHitted.move("up", 100,scene.arrTokens);
    } 
    




