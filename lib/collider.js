
var _Collider = function(id,cx,cy,cradius){
    this.id = id;
    this.x=cx;
    this.y=cy;
    this.backX = cx;
    this.backY = cy;
    this.radius=cradius;        
}


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
