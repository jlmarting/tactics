(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();


//Escena: canvas, tokens, teclas...
function Scene(canvasId){    
    this.canvas =  document.getElementById(canvasId);
    this.arrTokens = [];  
    this.selectedToken = 0;
    
    //teclas pulsadas
    this.mapkey = [];

    var self = this;
    this.draw = function(){
                    self.arrTokens.forEach(function(t){
                        t.autopilot();t.draw(self.canvas)});
                        requestAnimationFrame(self.draw);                    
                    };

    //eventos de teclas    
    document.onkeydown = (function(e){
                            if(this.mapkey.indexOf(e.keyCode)==-1){                         
                                this.mapkey.push(e.keyCode);      
                            }    
                            //movemos si mantenemos pulsado                            
                            self.arrTokens[self.selectedToken].plan = []; //destruimos el plan para evitar autopilot                            
                            self.mapkey.forEach(function(key){self.arrTokens[self.selectedToken].move(key)});
                        }).bind(this);

    document.onkeyup = (function(e){    
                            var index = this.mapkey.indexOf(e.keyCode)
                            if(index>-1){
                                this.mapkey.splice(index,1);
                            }
                        //disparamos el evento onkeydown para seguir moviendo y evitar parones  
                        document.onkeydown(37);      
                        }).bind(this);
}

//Clase Token
function Token(id,x,y,rad,src,scene){
    this.img = new Image();
    this.id = id
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.grad = (Math.PI/360)*6;
    this.despl = 6;
    this.img.src = src;
    this.img.x = this.x;
    this.img.y = this.y;
    this.collider = new CCollider(this.x+50 , this.y+25, 35);
    this.plan = [];   
    
    var self = this; 
    
    this.move = (function(keyCode){                   
                    var i = scene.selectedToken;
                    var desplazamiento = 0;    
                    
                    switch (keyCode){      
                        case 38: desplazamiento = this.despl; break;
                        case 40: desplazamiento = (this.despl)*(-1); break;
                        case 37: this.rad -= this.grad;break;
                        case 39: this.rad += this.grad;break;
                    }    

                    var dx = Math.cos(this.rad) * desplazamiento; 
                    var dy = Math.sin(this.rad) * desplazamiento; 
                    
                    this.x = this.x + dx;
                    this.y = this.y + dy;
                    this.collider.x = this.collider.x + dx;
                    this.collider.y = this.collider.y + dy; 
                    
                    //gestión de colisiones
                    var myCollider = this.collider;
                    var myCanvas = scene.canvas;
                    var colId = this.id;
                    var self = this;
                    scene.arrTokens.forEach(function(item){
                        if(self.id!==item.id){ 
                            if (self.collider.isCollisioning(item.collider)){                                
                                colId = item.id;
                                requestAnimationFrame((function(){ //mostramos colisión mientras dura
                                                        self.collider.draw(myCanvas);
                                                        item.collider.draw(myCanvas);
                                                        })
                                                    );                                
                            }                           
                        }
                    });

                    if(colId == this.id){ // mismo id, sin colisión                       
                        this.img.x = this.x;
                        this.img.y = this.y;                        
                    }else{ //deshacemos
                        this.x -= dx;
                        this.y -= dy; 
                        this.collider.x -= dx;
                        this.collider.y -= dy;                         
                    }
                }).bind(this);
               
    this.draw = function(canvas){   
                    if(canvas.getContext){
                        var ctx = canvas.getContext('2d');                        
                        ctx.clearRect(0, 0, canvas.width, canvas.height);                                                        
                        scene.arrTokens.forEach(function(t){
                                            ctx.save();
                                            ctx.translate(t.x+(t.img.width/2), t.y+(t.img.height/2));
                                            ctx.rotate(t.rad);                        
                                            ctx.translate(-(t.x+(t.img.width/2)), -(t.y+(t.img.height/2)));                                            
                                            ctx.drawImage(t.img, t.x, t.y);                                            
                                            ctx.restore();
                                        });                                                             
                    }
                    else{
                        alert('_ERR_NO CANVAS');
                        return -1;        
                    }
                };
                    
    this.autopilot = function(){ //se envían movimientos (keyCodes) de la pila "plan"
                          if(self.plan.length>0){            
                            var order = self.plan.pop();
                            self.plan.unshift(order);                        
                            self.move(order);                               
                        }       
                    }
}

var CCollider = function(cx,cy,cradius,canvas){
    this.x=cx;
    this.y=cy;
    this.radius=cradius;

    this.isCollisioning = function(otherCollider){
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

    this.draw = function(canvas){
        var ctx = canvas.getContext('2d');        
        ctx.beginPath();
        ctx.strokeStyle = '#AA0000';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false);        
        ctx.stroke();    
    }
}


/******inicializacion de ejemplo*******/

var theScene = new Scene('tactics');
var theToken = new Token('one',150,100,0,'img/token.png', theScene);
var theOtherToken = new Token('two', 250,140,0,'img/token.png', theScene);
var theOtherToken2 = new Token('two2', 250,340,0,'img/token.png', theScene);
var theOtherToken3 = new Token('two3', 550,40,0,'img/token_winter.png', theScene);

// Planes: secuencia de pulsaciones para piloto automático
theOtherToken.plan  = [38,0,0,0,0,0,37,0,0,0,37,0,0,0];
theOtherToken3.plan = [38,38,38,38,0,0,0,0,0,0,0,39,39];
theOtherToken2.plan = [38,0,0,0,0,0,0,0,38,0,0,0,0,0,38,37,37,37,37];

theScene.arrTokens.push(theToken);
theScene.arrTokens.push(theOtherToken);
theScene.arrTokens.push(theOtherToken2);
theScene.arrTokens.push(theOtherToken3);



// selector de tokens - provisional

var sel = document.createElement('select');
sel.id = 'tokens';
document.body.appendChild(sel);
sel.addEventListener("change", function(){
    theScene.selectedToken = sel.selectedIndex;
});

var i = 0;
theScene.arrTokens.forEach(function(item){
    var o = document.createElement('option');
    o.text = item.id;
    o.value = i;
    sel.appendChild(o);
    i++;
})


theScene.draw();
requestAnimationFrame(theScene.draw);



