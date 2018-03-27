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
            
            var dXY = {"dx":dx,"dy":dy}; //devolvemos desplazamiento cartesiano
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
    
    this.reloadCollider = function(x,y,w,h){    
        console.log(this.src);
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

Collider.prototype.isCollisioning = function(otherCollider){
    if (this.id == otherCollider.id) return false;

    var dx = this.x - otherCollider.x; 
    var dy = this.y - otherCollider.y; 
    var distance = Math.sqrt((dx*dx)+(dy*dy));      
    if (distance < (this.radius + otherCollider.radius)) {
        return true;
    } 
    else{
        return false;
    }        
}

//Comprobación de colisiones con tokens del escenario (scene.js)
Collider.prototype.getSceneCollisions =  function(tokens){
                                            var collisionsId = []; 
                                            var self = this;                                           
                                                tokens.forEach(function(t){
                                                    if((t.collider !== 'undefined')&&(t.id!==self.id)){
                                                        if(t.collider instanceof Collider){
                                                            if(self.isCollisioning(t.collider)){
                                                                    collisionsId.push(t.id);
                                                            }
                                                        }
                                                    }
                                                });
                                            return collisionsId;
                                        }

Collider.prototype.draw = function(canvas){        
    var ctx = canvas.getContext('2d');        
    ctx.beginPath();
    ctx.strokeStyle = '#AA0000';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false);        
    ctx.stroke();    
}       

Collider.prototype.move = function(cmd,displ){
    CursorPoint.prototype.move.call(this,cmd,displ);    
}


// C O L L I D E R T O K E N 
var ColliderToken = function(id,x,y,rad,src){         
    ImgToken.call(this,id,x,y,rad,src); 
    this.collider = new Collider(id,x+50,y+50,rad,80);
    this.img.onload = (function(){
                        console.log('Reajustando ' + this.id + ' con imagen ' + this.img.src);
                        this.collider.reloadCollider(x,y,this.img.width, this.img.height);
                    }).bind(this);    
}



ColliderToken.prototype = Object.create(ImgToken.prototype);

//Redifinición del método usando además el del prototipo
ColliderToken.prototype.move = function(cmd,displ){
    ImgToken.prototype.move.call(this,cmd,displ);   
    Collider.prototype.move.call(this.collider,cmd,displ);
   // ColliderToken.prototype.centerCollider();
    //el token por sí solo no gestiona la colisión y la posibilidad de movimiento
    //el colisionador del token gestiona esto, pero en el contexto del escenario
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
    this.range = 800;
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
            
    var dXY = {"dx":dx,"dy":dy}; //devolvemos desplazamiento cartesiano
    
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


