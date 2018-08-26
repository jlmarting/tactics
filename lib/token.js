//Punto, para posicionamiento básico en el canvas
var Point = function(x,y){    
    this.x = x;
    this.y = y;  
    this.info; 
    this.id;  
};

Point.prototype.placeAt = function(x,y){
    this.x = x;
    this.y = y;    
}


Point.prototype.getCenter = function(){
    return {"x": this.x , "y": this.y}   
}


//Punto con movimiento de cursor (comandos up down left right)
//rad, radianes, indica la dirección del movimiento
var CursorPoint = function(x,y,rad){
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
            this.x = x;
            this.y = y;
            
            var dXY = {"x":x,"y":y,"dx":dx,"dy":dy, "rad":this.rad, "displ":displ}; 
            return dXY;
        };  



//Token vinculado a una imagen
var ImgToken = function(id,x,y,rad,src,width,height){
        CursorPoint.call(this,x,y,rad);    
        this.id = id;  
        this.idColor = 'red';    
        this.src = src;
        this.w = width;
        this.h = height;                                       
        this.config = {viewName:true}; 
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


// C O L L I D E R
//Colisionador circular
var Collider = function(id,x,y,rad,cradius){
    CursorPoint.call(this,x,y,rad);    
    this.id = id;    
    this.radius=cradius; 
    this.subColliders = []; //colisionadores internos 
    this.config = {enabled:true,visible: true}
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

//Indica si hay colisión: devuelve la distancia (negativa, hay colisión)
//Tenemos colisionador y subcolisionadores. el colisionador es una forma rápida de determinar si hay colisión.
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
            //console.log(`sin colision ${self.id} ${diff}`);                   
            return false;
        } 
        else {
            console.log(`colision ${self.id} ${diff}`);  
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

Collider.prototype.move = function(cmd,displ,tokens,callback){
        
        var colPromise = new Promise(function(resolve, reject){                                        
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
                                        var pos = this.back.pop();
                                        this.rad = pos.rad;
                                        this.placeAt(pos.x,pos.y);
                                        if(this.subColliders.length>0){
                                            this.subColliders.forEach(function(sc){
                                                var possc = sc.back.pop();
                                                sc.placeAt(possc.x,possc.y);
                                                sc.rad = possc.rad;
                                            });
                                        }     
                                        return false;  
                                    }
                                    else{                            
                                        return true;
                                    }   
                                }.bind(this));
}


// ImgToken +  Colisionador. El movimiento es dependiente del colisionador.
var ColliderToken = function(id,x,y,rad,src,w,h){         
    ImgToken.call(this,id,x,y,rad,src,w,h); 
    this.collider = new Collider(id,x,y,rad,w/2);
}

ColliderToken.prototype = Object.create(ImgToken.prototype);

ColliderToken.prototype.placeAt = function(x,y){
    Point.prototype.placeAt.call(this,x,y); 
    //this.collider.reloadCollider(x,y,this.w,this.h);
}

//Redifinición del método usando además el del prototipo
ColliderToken.prototype.move = function(cmd,displ,tokens){ 
        
    var colliderMovePromise = function(cmd,displ,tokens){
                                    return new Promise(function(resolve,reject){
                                        var canMove = Collider.prototype.move.call(this.collider,cmd,displ,tokens);                                                                                
                                        resolve(canMove);
                                        }.bind(this));
                                    }.bind(this);                               
                                
     
        colliderMovePromise(cmd,displ,tokens).then(function(canMove){
            if (canMove) {
                ImgToken.prototype.move.call(this,cmd,displ);
            }
        }.bind(this));
        
    }
                




// Token con movimiento programado

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
                                }



// Proyectil básico

var Projectile = function(x,y,rad,displ){
    Point.call(this,x,y);    
    this.from = null;
    this.rad = rad;        
    this.displ = displ;
    this.callback;
    this.range = 800; //rango corto para pruebas
    this.effect =  function(){
                        console.log(`Default effect/callback... ${this.id}`);  
                        var i = theScene.arrTokens.indexOf(this);
                        theScene.arrTokens.splice(i,1);                                        
                    };                              
}

Projectile.prototype = Object.create(Point.prototype);

Projectile.prototype.move = function(){
    
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
                                if(this.displ==0){this.range=0;d=-1;}
                                return d;
                            }                        


var BulletProjectile = function(id,x,y,rad,displ){
    Projectile.call(this,x,y,rad,displ);    
    this.collider = new Collider(id,x,y,rad,5);  
}

BulletProjectile.prototype = Object.create(Projectile.prototype);

BulletProjectile.prototype.shot = function(tokens){
    var promiseBullet = new Promise(function(resolve, reject){
        var canMove = Collider.prototype.move.call(this.collider,"up",this.displ, tokens);           
        resolve(canMove);
    }.bind(this));   
    
    return promiseBullet.then(function(canMove){
        if ((canMove==false)||(this.range==0)){
            this.displ=0;            
            this.effect(); 
        }
        Projectile.prototype.shot.call(this);
        return this.range;
    }.bind(this));
    
}


// Shooter: un tanque que dispara ColliderToken + shoot
// Como crea elementos a pintar, deberemos de saber en qué canvas

var Shooter = function(id,x,y,rad,src,width, height){
    ColliderToken.call(this,id,x,y,rad,src,width,height);
    this.rad = rad;
    //this.scene = scene;
    this.reloading = false; //para limitar disparo automático.
    this.bulletCount = 2000;
}

Shooter.prototype = Object.create(ColliderToken.prototype);

Shooter.prototype.shot = function(callback){    
    var shotLapse = 50;
    var shotDispl = 6;  
    if((this.reloading==true)||(this.bulletCount == 0)) return null;
    var xy = this.getCenter();
    var dist = 10;
    xy.x = xy.x + Math.cos(this.rad)*dist;
    xy.y = xy.y + Math.sin(this.rad)*dist;
    var bullet = new BulletProjectile(this.id, (xy.x), (xy.y), this.rad, shotDispl);
    bullet.id = this.id + '_' + this.bulletCount;    
    this.bulletCount--;     
    this.reloading = true;
    var shooter = this;
    setTimeout(function(){shooter.reloading= false;}, shotLapse);
    return bullet;    
}

