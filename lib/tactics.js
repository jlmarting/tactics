//Escena: canvas, tokens, teclas...
function Scene(canvasId){    
    this.canvas =  document.getElementById(canvasId);
    this.arrTokens = [];  
    
    //teclas pulsadas
    this.mapkey = [];

    //eventos de teclas    
    document.onkeydown = (function(e){
                            if(this.mapkey.indexOf(e.keyCode)==-1){                         
                                this.mapkey.push(e.keyCode);      
                            }    
                            //movemos si mantenemos pulsado
                            var i = document.getElementById('tokens').value; //TODO: fallará si no está en el DOM
                            var self = this;
                            this.mapkey.forEach(function(key){self.arrTokens[i].move(key)});
                        }).bind(this);

    document.onkeyup = (function(e){    
                            var index = this.mapkey.indexOf(e.keyCode)
                            if(index>-1){
                                this.mapkey.splice(index,1);
                                console.log('<<< ' + e.keyCode);
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
    this.move = function(keyCode){
                    console.log('move, procesando:' + keyCode);
                    var i = document.getElementById('tokens').value;
                    var desplazamiento = 0;    
                    switch (keyCode){      
                        case 38: desplazamiento = this.despl; break;
                        case 40: desplazamiento = (this.despl)*(-1); break;
                        case 37: this.rad -= this.grad;break;
                        case 39: this.rad += this.grad;break;
                    }    
                    console.log(' ' + this.x + ' ' + this.y + ' ' + this.rad);
                    this.x = this.x + (Math.cos(this.rad) * desplazamiento); 
                    this.y = this.y + (Math.sin(this.rad) * desplazamiento); 
                    this.img.x = this.x;
                    this.img.y = this.y;
                    this.draw(scene.canvas);    
                }

    this.draw = function(canvas){   
                    if(canvas.getContext){
                        var ctx = canvas.getContext('2d');                        
                        ctx.clearRect(0, 0, canvas.width, canvas.height);                       
                                  
                        scene.arrTokens.forEach(function(t){
                                            ctx.save();
                                            ctx.translate(t.x+(t.img.width/2), t.y+(t.img.height/2));
                                            ctx.rotate(t.rad);                        
                                            ctx.translate(-(t.x+(t.img.width/2)), -(t.y+(t.img.height/2)));
                                            //volcamos figuras
                                            ctx.drawImage(t.img, t.x, t.y);
                                            ctx.restore();
                                        });                                                             
                    }
                    else{
                        alert('_ERR_NO CANVAS');
                        return -1;        
                    }
                };
}


var sel = document.createElement('select');
sel.id = 'tokens';
document.body.appendChild(sel);

//inicializacion de ejemplo
var theScene = new Scene('tactics');
var theToken = new Token('one',150,100,0,'img/token.png', theScene);
var theOtherToken = new Token('two', 250,140,0,'img/token_winter.png', theScene);
var theOtherToken2 = new Token('two2', 250,340,0,'img/token.png', theScene);
var theOtherToken3 = new Token('two3', 550,40,0,'img/token_winter.png', theScene);
theScene.arrTokens.push(theToken);
theScene.arrTokens.push(theOtherToken);
theScene.arrTokens.push(theOtherToken2);
theScene.arrTokens.push(theOtherToken3);



var i = 0;
theScene.arrTokens.forEach(function(item){
    var o = document.createElement('option');
    o.text = item.id;
    o.value = i;
    sel.appendChild(o);
    i++;
})




