//Punto, para posicionamiento básico en el canvas
var Point = function(x,y){    
    this.x = x;
    this.y = y;     
};

Point.prototype.draw = function(canvas){
    var ctx = canvas.getContext('2d');        
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 5,5);        
    ctx.stroke();    
}        


//Punto con movimiento de cursor (comandos up down left right)
//rad, radianes, indica la dirección del movimiento
var CursorPoint = function(x,y,rad){
    Point.call(this,x,y);    
    this.rad = rad;
    this.incrGrad = 6;
    this.grad = (Math.PI/360)*this.incrGrad;        
}

CursorPoint.prototype = Object.create(Point.prototype);

CursorPoint.prototype.move = 
        function(cmd, displ){                                       
            switch (cmd){  
                case "left": this.rad -= this.grad;return 0;break;  //37
                case "rigth": this.rad += this.grad;return 1;break; //39    
                case "up": break;                                   //38
                case "down": displ = (displ)*(-1); break;           //40
            }                                            

            var dx = Math.cos(this.rad) * displ; 
            var dy = Math.sin(this.rad) * displ; 
            
            var x = this.x + dx;
            var y = this.y + dy;
            this.x = x;
            this.y = y;
            
            var dXY = {"dx":dx,"dy":dy, "displ":displ}; //devolvemos desplazamiento cartesiano
            return dXY;
        };  




//Token vinculado a una imagen
var ImgToken = function(id,x,y,rad,src){
        CursorPoint.call(this,x,y,rad);    
        this.id = id;                                  
        this.img = new Image();       
        this.img.src = src;                         
        this.img.x = x;
        this.img.y = y;                      
}

ImgToken.prototype = Object.create(CursorPoint.prototype);

ImgToken.prototype.getCenter = function(){
        return {"x": this.x + (this.img.width/2), "y": this.y + (this.img.height/2)}
    }


ImgToken.prototype.move = 
    function(cmd, displ){
        var dXY = CursorPoint.prototype.move.call(this,cmd,displ)                                       
        this.img.x = dXY.dx;
        this.img.y = dXY.dy;
        return dXY;
    };    
    
ImgToken.prototype.draw = function(canvas){    
        var ctx = canvas.getContext('2d');  
        if(ctx){                        
            ctx.save();
            ctx.translate(this.x+(this.img.width/2), this.y+(this.img.height/2));
            ctx.rotate(this.rad);                        
            ctx.translate(-(this.x+(this.img.width/2)), -(this.y+(this.img.height/2)));                    
            ctx.drawImage(this.img, this.x, this.y);                                            
            ctx.restore();              
            return 1;
        }
        else{
            return -1;        
        }
    };




// C O L L I D E R

var Collider = function(id,x,y,rad,cradius){
    CursorPoint.call(this,x,y,rad);    
    this.id = id;
    this.backX = x;
    this.backY = y;
    this.backTokenX = x;
    this.backTokenY = y;
    this.radius=cradius; 
    this.subColliders = []; //colisionadores internos 
    
    this.reloadCollider = function(x,y,w,h){    
        console.log('reload ' + this.id);
        var centerX = x + (w/2);
        var centerY = y + (h/2);           
        var radius = (Math.sqrt((h*h)+(w*w)))/2;       
        this.x = centerX;
        this.y = centerY;
        this.backX = x;
        this.backY = y;
        this.backTokenX = x;
        this.backTokenY = y;
        this.radius = radius;

        if (this.subColliders.length>0){   
            //console.log('reload subcolliders');         
            this.subColliders.forEach(function(c){
                c.reloadCollider(x,y,w,h);
                c.radius = c.radius/2;
            });
        }
    }
}

Collider.prototype = Object.create(CursorPoint.prototype);

Collider.prototype.back = function(){
                                this.x = this.backX;
                                this.y = this.backY;
                            }
Collider.prototype.go = function(){
                                this.backX = this.x;
                                this.backY = this.y;
                            }

Collider.prototype.addSubCollider = function(){
    var id = this.id + '_sc_' + this.subColliders.length; //seguimos esta convención en la nomenclatura de identificadores
     var sc = new Collider(id,this.x,this.y,this.rad,this.radius/1.5);
    this.subColliders.push(sc);
}

Collider.prototype.isCollisioning = function(otherCollider){
    //console.log("isCollisioning " + this.id +',' + otherCollider.id);
    if (this.id == otherCollider.id) return false;
    
    var dx = this.x - otherCollider.x; 
    var dy = this.y - otherCollider.y; 
    var distance = Math.sqrt((dx*dx)+(dy*dy)); //distancia entre centros     
    var diff = distance - (this.radius + otherCollider.radius); //margen de maniobra
    if (diff<0) {
        if(this.subColliders.length > 0){
            if(otherCollider.subColliders.length > 0){
                //console.log('Buscamos subcolisionadores en ambos');                
                for(var i=0;i<this.subColliders.length;i++){             
                        var sc = this.subColliders[i];                     
                        for(var j=0;j<otherCollider.subColliders.length;j++){
                            var osc = otherCollider.subColliders[j];
                            if(sc.isCollisioning(osc)){
                                //console.log('Colision: ' + sc.id + ' ' + osc.id);                                
                                return true;                                
                            }else{
                                //console.log('No hay colision: ' + sc.id + ' ' + osc.id);
                                var dx = (sc.x - osc.x);
                                var dy =  (sc.y - osc.y);
                                var distance = Math.sqrt((dx*dx)+(dy*dy));      
                                console.log('*' + distance + ' ' + (sc.radius + osc.radius));
                            }                            
                        }                        
                }
                //console.log('No hay colisiones...');
                return false;
            }
            else{
                //console.log('Buscamos qué subcolisionador nuestro impacta con su colisionador');
                for(var i = 0; i<this.subColliders.length; i++){
                    var sc = this.subColliders[i];
                    if(sc.isCollisioning(otherCollider)){
                        //console.log('Colision: ' + sc.id + ' ' + otherCollider.id);
                        return true;
                    }
                }
                return false;                
            }
    
        }
        else{

            if(otherCollider.subColliders.length >0){
                //console.log('Buscamos si hay algún subcolisionador que impactan con nuestro colisionador ' +  this.id);                                
                for(var i=0; i<otherCollider.subColliders.length;i++){
                    var osc = otherCollider.subColliders[i];
                    //console.log('Comprobando colisión con ' + osc.id);
                    if(osc.isCollisioning(this)){
                        //console.log('Colision: ' + this.id + ' ' + osc.id);
                        return true;
                    }else{
                        //console.log('Sin colisión:' + this.id + ' ' + osc.id);
                    }
                }
                return false; //no hemos encontrado colisiones           
            }            
        }
        //console.log('Colisión de colisionadores externos');
        return true;
    } 
    else{
        return false;
    }        
}

//Se devuelven tokens implicados en colisiones con el token en uso
Collider.prototype.getTokenCollisions =  function(tokens){
                                            var collisionsId = []; 
                                            var self = this;                                           
                                                tokens.forEach(function(t){                                                   
                                                    if((t.collider !== 'undefined')&&(t.id!==self.id)){
                                                        //console.log('Comprobado colisiones de ' + self.id);
                                                        if(t.collider instanceof Collider){
                                                            if(self.isCollisioning(t.collider)){
                                                                    //Si hay subcolisiones, sólo tendremos el token si se produce una de estas
                                                                    //Si no hay subcolisiones consideraremos sólo el colisionador para hacer la comprobación
                                                                    if (self.subColliders.length == 0){
                                                                        collisionsId.push(t.id);
                                                                        //console.log('Agregando colisión: '+ self.id + ' con ' + t.id );
                                                                    }
                                                                    else {
                                                                        var cc = t.collider;
                                                                        self.subColliders.forEach(function(sc){
                                                                            if(sc.isCollisioning(cc)){
                                                                                collisionsId.push(t.id);
                                                                                //console.log('Agregando subcolision: ' + sc.id +' con ' + cc.id);
                                                                            }
                                                                        });
                                                                    }
                                                            }
                                                        }
                                                    }
                                                });
                                            return collisionsId;
                                        }

Collider.prototype.draw = function(canvas){        
    var ctx = canvas.getContext('2d');        
    ctx.beginPath();
    ctx.strokeStyle = '#FF0000';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false);        
    ctx.stroke();    
    var canvas = canvas;
    this.subColliders.forEach(function(sc){      
        sc.draw(canvas)}
    );
}       

Collider.prototype.move = function(cmd,displ){
    var dXY = CursorPoint.prototype.move.call(this,cmd,displ);
    var cmd = cmd; var displ = displ;
    this.subColliders.forEach(function(sc){     
        sc.move(cmd, displ);
    });
    return dXY;    
}


// C O L L I D E R T O K E N 
var ColliderToken = function(id,x,y,rad,src){         
    ImgToken.call(this,id,x,y,rad,src); 
    this.collider = new Collider(id,x+50,y+50,rad,80);
    this.img.onload = (function(){
                        //console.log('Reajustando ' + this.id + ' con imagen ' + this.img.src);
                        this.collider.reloadCollider(x,y,this.img.width, this.img.height);
                    }).bind(this);    
}

ColliderToken.prototype = Object.create(ImgToken.prototype);

//Redifinición del método usando además el del prototipo
ColliderToken.prototype.move = function(cmd,displ){
    ImgToken.prototype.move.call(this,cmd,displ);   
    Collider.prototype.move.call(this.collider,cmd,displ);
}
  

// Token con movimiento programado

var AutoToken = function(id,x,y,rad,src){
    ColliderToken.call(this,id,x,y,rad,src);
    this.plan = [];
} 

AutoToken.prototype = Object.create(ColliderToken.prototype);

AutoToken.prototype.autopilot = function(){
                                    //se envían movimientos (keyCodes) de la pila "plan"
                                    if(this.plan.length>0){            
                                        var order = this.plan.pop();
                                        this.plan.unshift(order);                        
                                        this.move(order,2);                                 
                                    }
                                }

// Proyectil básico

var Projectile = function(x,y,rad,displ){
    Point.call(this,x,y);    
    this.rad = rad;        
    this.displ = displ;
    this.range = 1200;
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
            
    var dXY = {"dx":dx,"dy":dy, "displ": this.displ}; //devolvemos desplazamiento cartesiano
    
    return dXY;
}

Projectile.prototype.shot = function(){
                                this.move();
                            }

/*** Shooter ***/

var Shooter = function(id,x,y,rad,src,scene){
    ColliderToken.call(this,id,x,y,rad,src);
    this.scene = scene;
}

Shooter.prototype = Object.create(ColliderToken.prototype);

Shooter.prototype.shot = function(){
    var xy = this.getCenter();
    var bullet = new Projectile(xy.x, xy.y, this.rad, 10);
    this.scene.arrTokens.push(bullet);
    bullet.shot();
}


