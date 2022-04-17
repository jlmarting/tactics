//@ts-nocheck
import {Point} from './tokens/point';
import {IntersectionPoint, Effect} from './tokens/token';
import { TText } from './tokens/token';
import { Tile } from './tokens/token';
import { Projectile } from './tokens/Projectile';
import { BulletProjectile } from './tokens/token';
import {Rectangle} from './tokens/rectangle';
import {CursorPoint} from './tokens/cursorpoint';
import {ImgToken} from './tokens/image';
import {AutoToken} from './tokens/auto';
import {Vector} from './tokens/vector';



import { ColliderToken } from './tokens/collider.js';

import { Shooter } from './tokens/shooter.js';
import { WireToken } from './tokens/wire.js';

export class Scene{

    //scenes =  ['simple', 'general', 'linerectangle', '2lines', 'imagebrick', 'wirebrick', 'rectangles', 'textTest', 'empty']

    constructor(canvasId: string, population: Population){    //Lo que veremos en el canvas       
        
        this.population = population;

        this.engineInfo = "";
        this.arrTokens = []; 
        this.buffer = {};  // otros tokens 
            this.buffer.drawing = [];           // buffer de dibujo: secuencia de puntos
            this.buffer.intersections = [];     //buffer de cálculo de intersecciones de vectores
            this.buffer.misc = []; //
        
        this.arr = []; //auxiliar para filtrado de tokens
        
        this.mapkey = []; //comandos que serán agregados por el control
        this.drawing = false;
        this.tokenIndex = 0;    //indica que índice de token tenemos seleccionado para centrar vista, tomar control, etc.
        this.tokenId;           //Análogo con lo anterior. Identificador del token.
        this.pause = false;   
        this.canvas =  document.getElementById(canvasId);   
        this.ctx = this.canvas.getContext('2d');    
        this.config = {viewGrid:true, scale:1, viewColliders: false, viewIds: false, autoFPS: true, viewPortWidth: 1920, viewPortHeight: 900};
        this.config.effect = 'damage';
        this.config.grid = {height: 0, width: 0, granularity: 50};
    
        this.orders = []; //Pila de órdenes a ejecutar (movimientos, disparos, étc)
    
        this.message = " - - - "; //para paso de mensajes de otro módulo
    
            
        //Posición con respecto al mapa
        this.x = 500;
        this.y = 500;
        
        var self = this;
        var viewportpoint = new Point(self.config.viewPortWidth, self.config.viewPortHeight);    
        this.viewPort = new Rectangle(0-(self.config.viewPortWidth-5/2),0-(self.config.viewPortHeight-5/2),viewportpoint.x,viewportpoint.y);
        this.viewPort.config = {};
        this.viewPort.config.innerColor = null;       
        this.viewPort.enabled =  false;    
        this.viewPort.attachTo = function(t){   
            var pos = t.getRelPos();     
            self.viewPort.placeAt(pos.x,pos.y);
        }
    
        this.resize = function(){
            self.canvas.width =  (window.innerWidth)*1;
            self.canvas.height = (window.innerHeight)*0.95;
            self.w = this.canvas.width;
            self.h = this.canvas.height;
            self.ctx.scale(self.config.scale,self.config.scale);
        }
    
        this.reloadSel = function(){
            
            var tokenSelector = document.getElementById('tokens');
    
            tokenSelector.load = function(){
                                        tokenSelector.innerHTML = null;
        
                                        self.arrTokens.forEach(function(t){                                    
                                        if((typeof t.config!== 'undefined')&&(t.config.selectable)){
                                            var opt = document.createElement('option');
                                            opt.value = t.id;
                                            opt.text = t.id;
                                            if(t.id==this.tokenId){
                                                opt.selected="selected";
                                            }
                                            tokenSelector.appendChild(opt);
                                        }
                                    });
                                };
            tokenSelector.load();
    
            tokenSelector.onchange = function(){  
                var sel = tokenSelector.value; 
                if(self.setToken(sel)){
                    tokenSelector.blur();
                };                
            };
        }
       
        this.sceneSelector = document.getElementById('scene');


        let self = this;

        this.sceneSelector.onchange = function(){
             self.population.populateScene(self, this.value);
        }
    
        this.sceneSelectorLoad = function(){
            this.population.scenes.forEach((build)=>{
                let opt = document.createElement('option');
                opt.value = build;
                opt.text = build;
                this.sceneSelector.appendChild(opt);
            });
                                       // sceneSelector.innerHTML = null;
        }
    
        this.resize();
    
        window.onresize = function(){self.resize()};
       
        this.getSelectedToken = function(){
            return self.arrTokens[self.tokenIndex];
        }
    
        //Token de referencia (para centrar vista en él)
        this.setToken = function(tokenId){        
            
            //guardamos identificador y indice del token activo
            self.tokenIndex = self.arrTokens.findIndex(function(element){
                console.log(`tokenId[${tokenId}] setToken.tokenIndex -> ${self.tokenIndex}`);
                return element.id == tokenId;
            });
    
            if(self.tokenIndex > -1){
                self.tokenId = tokenId;
            }else{
                console.log('No se ha encontrado token a asignar..........');
                return false;
            }
            
            //viewport al token activo que acabamos de determinar
            self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);
    
            //Eventos para control de estado del objeto
            if(self.arrTokens[self.tokenIndex] instanceof ColliderToken){
                
                var viewGrid = document.getElementById('lines');
                viewGrid.checked = self.config.viewGrid;
                viewGrid.onchange = function(){
                self.config.viewGrid = !self.config.viewGrid;
                viewGrid.blur();
                };          
            
                var collision = document.getElementById('collision');
                collision.checked = self.arrTokens[self.tokenIndex].collider.config.enabled;
                collision.onchange = function(){            
                    self.arrTokens[self.tokenIndex].collider.config.enabled = !self.arrTokens[self.tokenIndex].collider.config.enabled;
                    collision.blur();
                };   
    
    
                var autoFPS = document.getElementById('autoFPS');
                autoFPS.checked = self.autoFPS;
                autoFPS.onchange = function(){            
                    self.config.autoFPS = !self.config.autoFPS;
                    autoFPS.blur();
                };  
                
    
                var viewcolliders = document.getElementById('colliders');
                viewcolliders.checked = self.config.viewColliders;
                viewcolliders.onchange = function(){
                    self.config.viewColliders = !self.config.viewColliders;
                    viewcolliders.blur();
                }
    
                var viewport = document.getElementById('viewport');
                viewport.checked = self.viewPort.enabled;            
                viewport.onchange = function(){
                    self.viewPort.enabled = !self.viewPort.enabled;
                    viewport.blur();
                }
    
                var viewids = document.getElementById('ids');
                viewids.checked = self.config.viewIds;
                viewids.onchange = function(){
                    self.config.viewIds = !self.config.viewIds;
                    viewids.blur();
                }
    
                var zoomin = document.getElementById('zoomin');
                zoomin.onclick = function(){
                    if(self.config.scale>=0.25){
                        self.config.scale = self.config.scale + 0.1;
                        self.resize();
                        zoomin.blur();
                    }                
                }
    
                var zoomout = document.getElementById('zoomout');
                zoomout.onclick = function(){
                    if(self.config.scale <= 3){
                        self.config.scale = self.config.scale - 0.1;
                        self.resize();
                        zoomout.blur();
                    }
                    
                }
    
                var stopAutomat = document.getElementById('stopAutomat');
                stopAutomat.onclick = function(){
                        self.pause = !self.pause;
                        zoomout.blur();
                    };
                    
                
    
                var fps = document.getElementById('fps');
                fps.value = self.fps;
                fps.onchange = function(){
                        self.fps = fps.value;
                        fps.blur();
                    }
            
                var viewportheight = document.getElementById('viewportheight');
                viewportheight.value = self.config.viewPortHeight;
                viewportheight.onchange = function(){
                        self.config.viewPortHeight = viewportheight.value;
                        self.config.viewPort.height = viewportheight.value;
                        viewportheight.blur();
                    }
    
                var viewportwidth = document.getElementById('viewportwidth');
                viewportwidth.value = self.config.viewPortWidth;            
                viewportwidth.onchange = function(){
                        self.config.viewPortwidth = viewportwidth.value;
                        self.config.viewPort.width = viewportwidth.value;
                        viewportwidth.blur();
                    }
        
    
                var bulletEffect = document.getElementById('effects');
    
                bulletEffect.load = function(){
                                        // bulletEffect.innerHTML = null;  
                                        
                                        // var prop = Object.keys(Effect);
                                        
                                        // prop.forEach(function(e){                                                                            
                                        //     var opt = document.createElement('option');
                                        //     opt.value = e
                                        //     opt.text = e;                                        
                                        //     bulletEffect.appendChild(opt);
                                        //     if(opt.value == self.config.effect){
                                        //         opt.selected="selected";
                                        //     }                                          
                                        // });                               
                                    }
                
                bulletEffect.addEventListener('click',function(){
                                                        bulletEffect.load();
                                                        });
    
    
                bulletEffect.onchange = function(){  
                        var sel = bulletEffect.value; 
                        self.config.effect = sel;
                            tokenSelector.blur();
                        };                
                    
                bulletEffect.load();    
    
    
    
    
                var tokenSelector = document.getElementById('tokens');
    
                tokenSelector.load = function(){
                                            tokenSelector.innerHTML = null;
            
                                            self.arrTokens.forEach(function(t){                                    
                                            if((typeof t.config!== 'undefined')&&(t.config.selectable)){
                                                var opt = document.createElement('option');
                                                opt.value = t.id;
                                                opt.text = t.id;
                                                if(t.id==self.tokenId){
                                                    opt.selected="selected";
                                                }
                                                tokenSelector.appendChild(opt);
                                            }
                                        });
                                    };
                
                tokenSelector.addEventListener('click',function(){
                    tokenSelector.load();
                })
            
                tokenSelector.onchange = function(){  
                    var sel = tokenSelector.value; 
                    if(self.setToken(sel)){
                        tokenSelector.blur();
                    };                
                };
    
                tokenSelector.load();
            }
        };
        
    
        //Cargamos todas las imágenes de los tokens que las tengan
        this.arrTokens.loadImg = function(){
            self.arrTokens.forEach(function(t){
                if(t instanceof ImgToken){
                    t.img = new Image();              
                    t.img.src = t.src;                                       
                }else{
                    if(t instanceof Tile){
                        t.img = new Image();
                        t.img.src = t.src;
                    }
                }
    
    
                });
            }    
    
        //Movimiento de la ventana: transformamos las coordenadas de todos los objetos
        this.move = function(x,y){       
            this.x = x;
            this.y = y;           
        }
    
        //Centrar la escena en un token (para hacer seguimiento)
        this.centerOn = function(t){
            if(typeof t == 'undefined') return false;
            var scale = self.config.scale;                        
            var dx = (self.w/(2*scale))-t.x;
            var dy = (self.h/(2*scale))-t.y;
            self.move(dx,dy);
        };
    
        //centramos vista en el token seleccionado en la escena 
        //generalmente designado por el control, el token que movemos
        this.center = function(){ 
            self.centerOn(self.arrTokens[self.tokenIndex]);        
        }
    
    
        this.drawPath = function(){
                if(self.getSelectedToken()['collider'] !== 'undefined'){
                    self.ctx.strokeStyle = 'orange';
                    var l = self.ctx.lineWidth;
                    self.ctx.lineWidth = 4;
                    self.ctx.beginPath();
                    var rpos;
                    self.arrTokens[self.tokenIndex].collider.back.forEach(function(pos){                    
                                                    rpos = {x:pos.x+self.x,y:pos.y+self.y};                      
                                                    self.ctx.lineTo(rpos.x,rpos.y);                                                                                                                                                             
                                                    });
                                                    self.ctx.stroke();  
                                        if(typeof rpos != 'undefined'){
                                            self.ctx.fillStyle = 'cyan';
                                            self.ctx.fillText('[path steps: '+self.arrTokens[self.tokenIndex].collider.back.length+']', rpos.x,rpos.y);                             
                                        }
                }
                self.ctx.lineWidth = l;
        }
    
        this.drawGrid = function(){        
            
            self.ctx.save();
            self.ctx.strokeStyle = 'white';
            self.ctx.linewidth = 1;       
            
            var grid = self.config.grid;
            
            grid.width = 1900;
            grid.height = 1200;
    
            var numRows = Math.round(grid.height/grid.granularity);        
            var numCols = Math.round(grid.width/grid.granularity);
    
            var dx = (Math.round((self.x-Math.round(grid.width/2))/grid.granularity) * grid.granularity) + Math.round(grid.width/2);
            var dy = (Math.round((self.y-Math.round(grid.height/2))/grid.granularity) * grid.granularity) + Math.round(grid.height/2);
            
            self.ctx.fillStyle = 'green';
            var cont = 0;
            for(var col=0;col<=numCols;col++){
                for(var row=0;row<=numRows;row++){
                    cont++;
                    var x = (col*grid.granularity);var y = (row*grid.granularity);                
                    x-=dx;y-=dy;              
                    var rx = x+self.x;var ry = y+self.y;
                    if(self.viewPort.enabled){
                        if(self.viewPort.isInside(rx,ry)){
                            if((x%(grid.granularity*5)==0)&&(y%(grid.granularity*5)==0)){
                                self.ctx.fillRect(rx,ry,5,5);
                                self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                            }else{
                                self.ctx.fillRect(rx,ry,1,1);
                                //self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                            }
                        }
                    }else{
                        if((x%(grid.granularity*5)==0)&&(y%(grid.granularity*5)==0)){
                            self.ctx.fillRect(rx,ry,5,5);
                            self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                        }else{
                            self.ctx.fillRect(rx,ry,1,1);
                            //self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                        }
                    }
                }
            }
            //console.log(`Puntos generados ${cont}`);
            self.ctx.restore();
        }
    
    
        /*******DRAW*****************/
     
        Point.prototype.draw = function(lColor,fColor){
            if(this.config == undefined){          
                this.config = {};
            }
            
            if(this.config.color == undefined){
    
                if(lColor==undefined){
                    lColor = "red";
                }
                
                if(fColor==undefined){
                    fColor = "white";
                }
            }else{
                lColor = "white";
                fColor = this.config.color;
            }
            
                    
            self.ctx.beginPath();    
            self.ctx.strokeStyle = lColor;
            self.ctx.fillStyle = fColor;   
    
            if(this.config.position == 'relative'){
                self.ctx.fillRect(this.x+self.x, this.y+self.y, 4,4);
                self.ctx.fillText('*('+this.x +',' + this.y+')',this.x+self.x, this.y+self.y);                
            }else{
                self.ctx.fillRect(this.x, this.y, 2,2);   
                self.ctx.fillText('**('+this.x +',' + this.y+')',Math.round(this.x), Math.round(this.y));             
            }
    
            self.ctx.stroke();    
        }
        
        Point.prototype.getRelPos = function(){
            return {x:Math.round(this.x+self.x), y:Math.round(this.y+self.y)};
        }
    
        CursorPoint.prototype.draw = function(ctx){
            self.ctx.save();                          
            self.ctx.beginPath();
            var relPos = this.getRelPos();
            var p0 = new Point(this.x,this.y);
            var p1 = new Point(this.x+(Math.cos(this.rad)*25),this.y+(Math.sin(this.rad)*25));
            var vector = new Vector();
            vector.id = this.id + '_vect';
            vector.a = p0;
            vector.b = p1;
            vector.draw(ctx);
    
            self.ctx.lineWidth = this.config.borderWidth;
            self.ctx.strokeStyle = this.config.borderColor;          
        
            self.ctx.stroke(); 
            self.ctx.restore()
        }
    
        IntersectionPoint.prototype.draw = function(){
            Point.prototype.draw.call(this,'yellow','yellow');
        }
    
        TText.prototype.draw = function(){
            self.ctx.fillStyle = this.color;
            var arrMsg = this.msg.split(';;');
            if(arrMsg.length>1){
                var x0 = this.x;
                var y0 = this.y;
                arrMsg.forEach(m => {
                    self.ctx.fillText(m,x0,y0);
                    y0 += 15;
                });
    
            }else{
                self.ctx.fillText(this.msg[0],this.x,this.y);
            }
            
        }
        
        Tile.prototype.getRelPos = function(){
            return Point.prototype.getRelPos.call(this,this.x,this.y);
        }
    
    
        Tile.prototype.draw = function(){    
            var pos = this.getRelPos();    
            var rw = this.w/2;
            var rh = this.h/2;
            self.ctx.drawImage(this.img, pos.x-rw, pos.y-rh);       
           // Rectangle.prototype.draw.call(this);
        }
    
    
        Projectile.prototype.draw = function(){
            var pos = this.getRelPos(); 
            self.ctx.beginPath();
            self.ctx.strokeStyle = 'red';
            self.ctx.arc(pos.x, pos.y, 5, 0, Math.PI*2,false);        
            self.ctx.fill();
            self.ctx.stroke();        
        }
    
    
        BulletProjectile.prototype.bulletEffect = function(collisions,bullet){                                                            
            if(typeof collisions == 'undefined'){                               
                return false;
            }
            
            var i = self.arrTokens.indexOf(bullet);
            self.arrTokens.splice(i,1);  
            //Buscamos token impactado
            var thPromise = function(collisions){
                                return new Promise(function(resolve,reject){
                                        var tokenHitted = self.arrTokens.find(function(element){
                                                                                return element.id == collisions[0];
                                                                                });
                                        resolve(tokenHitted);
                                });
                            }
        
            thPromise(collisions).then(function(tokenHitted){        
                if(typeof tokenHitted == 'undefined') return false;        
                return bullet.effect(tokenHitted,bullet);
            });
        }
    
    
    
    
        /******* RENDER *************/
    
        // Tratamos cada uno de los objetos a representar en la escena
    
        this.render = function(){
            
            //Ajuste de zoom
            self.ctx.clearRect(0, 0, self.canvas.width/self.config.scale, self.canvas.height/self.config.scale); 
            self.ctx.fillStyle = "black";
            self.ctx.fillRect(0,0,self.canvas.width/self.config.scale, self.canvas.height/self.config.scale);        
       
            
            //Sólo enviamos al render objetos que están en el viewport
            if(self.viewPort.enabled){
                self.arr = [];       
                self.arrTokens = self.arrTokens.concat(self.buffer.drawing).concat(self.buffer.intersections);
                self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);            
                self.arrTokens.forEach(function(e){
                    var p = e.getRelPos();
                    if (self.viewPort.isInside(p.x,p.y)){
                        self.arr.push(e)
                    }
                });
                
            }
            else{
                self.arr = self.arrTokens.concat(self.buffer.drawing).concat(self.buffer.intersections);   
                
            }  
    
    
           
            self.arr.forEach(function(t){  //Según el tipo de token realizaremos unas u otras opciones                                                           
                                                    
                                        if (t.destroy){
                                            t.collider = {};
                                            t = {};
    
                                        // var tokenIndex = this.arrTokens.findIndex(function(element){
                                        //     return element.id == t.id;
                                        // });                                                                   
                                        // this.arrTokens.splice(tokenIndex,1);
                                        // this.tokenIndex = this.arrTokens.findIndex(function(element){
                                        //     return element.id == this.tokenId;
                                        // });
                                        }else{
                                            t.draw(self.ctx); 
                                        }
                                        
                                    
                                        if (t instanceof Projectile){    
                                            
                                            if (t instanceof BulletProjectile){                                                                           
                                                if(self.config.viewColliders){                                                                           
                                                    t.collider.draw(self.canvas);  
                                                }
                                            }                          
                                        }
                                        
                                        if(self.config.viewColliders){                                    
                                                if(t instanceof ColliderToken){                                                                        
                                                    t.collider.draw(self.canvas);                                                                        
                                                }
                                        }  
                                    
                                    
    
                                });
           //self.viewPort.draw();
    
            // Visualización según configuración                    
    
            if(self.config.viewGrid){         
                self.drawGrid(self.ctx);                  
             }
    
    
             
            if(self.viewPort.enabled){
                self.viewPort.draw(self.ctx);            
            }
    
    
            // self.ctx.save();
            // self.ctx.beginPath();
            // self.ctx.lineWidth = 4;
            // self.ctx.strokeStyle = 'red';
            // self.ctx.moveTo(self.x,self.y);
            // self.ctx.lineTo(375+self.x,-250+self.y);
            // self.ctx.stroke();
    
    
             
             return window.performance.now();
        }
        
        
        //Ciclo de dibujo (activamos movimientos automáticos, pintamos en canvas)  
        var now = window.performance.now();
    
        this.fps = 60; //fps objetivo
        var arrIntervals = [];    
        var elapsed = 0;
        var averageInterval = 0;
        var realFPS = 0
    
    
    
        this.drawScene = function(timeStamp){         
            
            elapsed = window.performance.now()-now;  
            
            if(elapsed>=1000/self.fps){                       
                self.center();
                now = self.render();            
            }
    
            //self.resolver(1);               
    
            if(!self.pause){
                //automatTime = self.automat();
            }
    
            //Cálculo de intervalo medio y FPS real
            arrIntervals.push(window.performance.now());
            var sum=0;
            for(var i=0;i<arrIntervals.length-1;i++){
                sum +=arrIntervals[i+1]-arrIntervals[i];
            }  
            averageInterval = sum/arrIntervals.length;
            realFPS = Math.round(1000/averageInterval);
    
            //Ajuste automático de FPS
            if(self.config.autoFPS){
                if(averageInterval>22){
                    if(self.fps>1){self.fps = Math.round(self.fps/1.1);}                
                }
    
                if(averageInterval<17){
                    if(self.fps<60){self.fps++;}
                }                
            }        
            if(arrIntervals.length>40){arrIntervals.shift();}            
            
            //Info
            document.getElementById('info').value = `TOKENS(TOTAL/DRAWED): [${self.arrTokens.length} / ${self.arr.length}] FPS(config/real): [${self.fps} / ${realFPS}]`+ 
            `Draw cycle (config/real): [${Math.round(1000/self.fps)}ms / ${Math.round(averageInterval)}ms] ${self.engineInfo}` + '\n' + self.message;
    
            requestAnimationFrame(self.drawScene);          
           
            
        };
    
    }


    // populateScene = function(build) {

    //     tactics.arrTokens = [];
    
    //     if (build == 'simple') {
    //            //generalmente nuestro token
    //            var theToken = new Shooter('one', 50, 50, 0.3, '../../../img/token.png', 141, 50);
    //            this.arrTokens.push(theToken);
    //            //subimos la velocidad de desplazamiento
    //            theToken.displ = 5;
    //            theToken.collider.addSubCollider();
    //            theToken.config.viewName = true;
    //            //Para que pueda ser seleccionable tendremos que tener esta configuración en el token
    //            theToken.config.selectable = true;

    //            this.arrTokens.push(theToken);

    //            this.setToken("one");

    //     }
    
    
    
    //     if (build == 'general') {
    
    //         //generalmente nuestro token
    //         var theToken = new Shooter('one', 50, 50, 0.3, 'img/token.png', 141, 50);
    //         //subimos la velocidad de desplazamiento
    //         theToken.displ = 5;
    //         theToken.collider.addSubCollider();
    //         theToken.config.viewName = true;
    //         //Para que pueda ser seleccionable tendremos que tener esta configuración en el token
    //         theToken.config.selectable = true;
    
    //         var theGrass1 = new ImgToken('grass1', 0, 0, 2, 'img/grass.png', 150, 100);
    //         var theGrass2 = new ImgToken('grass2', 0, -500, 0, 'img/grass.png', 150, 100);
    //         var theGrass3 = new ImgToken('grass3', 0, 500, 0, 'img/grass.png', 150, 100);
    //         var theGrass4 = new ImgToken('grass4', 500, 0, 0, 'img/grass.png', 150, 100);
    
    //         var theBlock4 = new ColliderToken('block4', 150, 680, 0, 'img/concrete_block.png', 237, 150);
    //         theBlock4.config.viewName = true;
    
    //         var AutoToken1 = new AutoToken('auto1', 550, 670, 0, 'img/token_winter.png', 141, 50);
    //         AutoToken1.plan = ["up", "up", "up", "up", "up", "left", "up", "left"];
    //         AutoToken1.collider.addSubCollider();
    //         AutoToken1.config.viewName = true;
    //         AutoToken1.config.selectable = true;
    
    //         var AutoToken2 = new AutoToken('auto2', 150, 340, 0, 'img/token_winter.png', 141, 50);
    //         AutoToken2.plan = ["up", "up", "up", "up", "up", "left", "up", "left"];
    //         AutoToken2.config.viewName = true;
    //         AutoToken2.config.selectable = true;
    
    //         var AutoToken3 = new AutoToken('auto3', 450, 440, 0, 'img/token_winter.png', 141, 50);
    //         AutoToken3.plan = ["up", "up", "rigth", "right", "right", "right"];
    //         AutoToken3.config.viewName = true;
    //         AutoToken3.config.selectable = true;
    
    //         var AutoToken4 = new AutoToken('auto4', 450, 140, 3.1416 / 2, 'img/token.png', 141, 50);
    //         AutoToken4.plan = ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up"];
    //         AutoToken4.config.viewName = true;
    //         AutoToken4.config.selectable = true;
    
    //         var theBlock1 = new ColliderToken('block1', 250, 50, 0, 'img/concrete_block.png', 237, 150);
    //         theBlock1.collider.addSubCollider();
    //         theBlock1.config.viewName = true;
    //         theBlock1.config.selectable = true;
    
    //         var theBlock2 = new ColliderToken('block2', 725, 150, 0, 'img/concrete_block.png', 237, 150);
    //         theBlock2.config.viewName = true;
    
    //         var theBlock3 = new ColliderToken('block3', 750, 540, 0, 'img/concrete_block.png', 237, 150);
    //         theBlock3.config.viewName = true;
    //         theBlock3.config.selectable = true;
    
    //         //    //Textura suelo
    //         //     for(var i=0;i<30;i++){
    //         //         for(var j=0;j<40;j++){            
    //         //             var soil = new Tile('soil_'+i+'_'+j,-2000+236*(i),-2000+210*(j),'img/tile_desert_237x211.png',237,211);                            
    //         //             this.arrTokens.push(soil);            
    //         //         }        
    //         //     }
    
    
    //         //Muro horizontal superior
    //         var wallPos = { x: -500, y: -900 }
    //         for (var i = 0; i < 1000; i++) {
    //             for (var j = 10; j < 10; j++) {
    //                 var brick = new ColliderToken('brick1_' + i + '_' + j, wallPos.x + (32 * i), wallPos.y + (20 * j), 0, 'img/brick001_32x20.png', 32, 20);
    //                 brick.health = 150;
    //                 brick.config.viewName = false;
    //                 this.arrTokens.push(brick);
    //             }
    //         }
    
    
    //         var wallPos = { x: -500, y: -900 }
    //         for (var i = 0; i < 1000; i++) {
    //             for (var j = 10; j < 10; j++) {
    //                 var theWire = new WireToken('wire1', i, j, 0);
    //                 theWire.points.push({ x: i + 32, y: j });
    //                 theWire.points.push({ x: i + 32, y: j + 20 });
    //                 theWire.points.push({ x: i, y: j + 20 });
    //                 theWire.points.push({ x: i, y: j });
    //                 this.arrTokens.push(theWire);
    //             }
    //         }
    
    
    //         //Muro vertical izquierda
    //         wallPos = { x: -500, y: -200 }
    //         for (var i = 0; i < 10; i++) {
    //             for (var j = 0; j < 400; j++) {
    //                 var brick = new ColliderToken('brick2_' + i + '_' + j, wallPos.x + (20 * i), wallPos.y + (32 * j), 1.5708, 'img/brick001_32x20.png', 32, 20);
    //                 brick.health = 150;
    //                 brick.config.viewName = false;
    //                 this.arrTokens.push(brick);
    //             }
    //         }
    
    //         // //Muro vertical izquierda
    //         wallPos.x += 1200;
    
    //         for (var i = 0; i < 5; i++) {
    //             for (var j = 0; j < 100; j++) {
    //                 var brick = new ColliderToken('brick3_' + i + '_' + j, wallPos.x + (20 * i), wallPos.y + (32 * j), 1.5708, 'img/brick001_32x20.png', 32, 20);
    //                 brick.health = 150;
    //                 brick.config.viewName = false;
    //                 this.arrTokens.push(brick);
    //             }
    //         }
    
    //         wallPos.x += 300;
    //         wallPos.y = 800;
    //         for (var i = 0; i < 200; i++) {
    //             for (var j = 0; j < 20; j++) {
    //                 var brick = new ColliderToken('brick31_' + i + '_' + j, wallPos.x + (20 * i), wallPos.y + (32 * j), 1.5708, 'img/brick001_32x20.png', 32, 20);
    //                 brick.health = 150;
    //                 brick.config.viewName = false;
    //                 this.arrTokens.push(brick);
    //             }
    //         }
    
    //         // Estructura equivalente 32000 x 2000
    //         var wallPos = { x: -325, y: -325 }
    
    //         var theWire = new WireToken('wire1_', wallPos.x, wallPos.y, 0);
    //         theWire.load({ x: 16, y: 10 });
    //         theWire.load({ x: -32016, y: 10 });
    //         theWire.load({ x: -32016, y: 10 });
    //         theWire.load({ x: 16, y: -216 });
    //         this.arrTokens.push(theWire);
    
    //         this.arrTokens.push(theBlock2);
    //         this.arrTokens.push(theBlock1);
    //         this.arrTokens.push(theToken);
    
    //         this.arrTokens.push(theGrass1);
    //         this.arrTokens.push(theGrass2);
    //         this.arrTokens.push(theGrass3);
    //         this.arrTokens.push(theGrass4);
    //         this.arrTokens.push(theBlock3);
    //         this.arrTokens.push(theBlock4);
    //         this.arrTokens.push(AutoToken1);
    //         this.arrTokens.push(AutoToken2);
    //         this.arrTokens.push(AutoToken3);
    //         this.arrTokens.push(AutoToken4);
    
    //         this.setToken("one");
    
    //     }
    
    
    //     //Ejemplo de intersecciones entre un rectángulo y una recta
    //     if (build == 'linerectangle') {
    //         var wire1 = new WireToken('wire1');
    //         wire1.load(new Point(-551, 351));
    //         wire1.load(new Point(600, 250));
    
    //         this.arrTokens.push(wire1);
    
    
    //         var rectangle = new Rectangle(0, 0, 500, 500);
    //         rectangle.wire.config.color = "orange";
    //         rectangle.id = 'rectangle1';
    //         this.arrTokens.push(rectangle);
    
    //         var msg = "";
    
    //         var intersectionPoints = rectangle.wire.getIntersections(wire1);
    
    //         intersectionPoints.forEach(element => {
    //             element.config.color = "yellow";
    //             element.id = 'intersection_' + wire1.id + '_' + element.id;
    //             this.arrTokens.push(element);
    //             msg = msg + '\n' + element.id + ` (${element.x}, ${element.y})`;
    //         });
    
    //         this.message = msg;
    //         this.arrTokens.push(theToken);
    
    //         this.ctx.restore();
    //     }
    
    //     // Test de intersección de dos líneas
    //     if (build == '2lines') {
    //         var wire1 = new WireToken('wire1');
    //         wire1.load(new Point(0, 0));
    //         wire1.load(new Point(0, -350));
    
    
    
    //         var wire2 = new WireToken('wire2');
    //         wire2.load(new Point(-250, 25));
    //         wire2.load(new Point(250, 25));
    //         wire2.config.color = "red";
    
    //         var theText = new TText("testText", 30, 110, ">> ");
    //         this.arrTokens.push(theText);
    //         this.arrTokens.push(wire1);
    //         this.arrTokens.push(wire2);
    
    //         var msg = "";
    //         wire1.getIntersections(wire2).forEach(element => {
    
    //             element.config.color = "orange";
    //             element.id = 'intersection_' + wire1.id + '_' + wire2.id;
    //             msg = msg + '\n' + element.id;
    //             this.arrTokens.push(element);
    //         })
    //         this.message = msg;
    
    
    //         this.arrTokens.push(theToken);
    //         this.ctx.restore();
    //     }
    
    
    //     if (build == 'wirebrick') {
    
    //         var wire1 = new WireToken('wire1', 0, -125);
    //         wire1.load(new Point(-125, 0));
    //         wire1.load(new Point(125, 0));
    //         this.arrTokens.push(wire1);
    
    //         let wallPos = { x: 0, y: -375 }
    //         for (var i = 0; i < 1000; i++) {
    //             for (var j = 0; j < 4; j++) {
    //                 var brick = new Rectangle(wallPos.x + (32 * i), wallPos.y + (20 * j), 32, 20);
    //                 brick.id = brick.id + '_' + i + '_' + j;
    //                 brick.config.viewName = true;
    //                 brick.wire.config.position = 'relative';
    //                 this.arrTokens.push(brick);
    //             }
    //         }
    
    //         this.arrTokens.push(theToken);
    //         this.ctx.restore();
    //     }
    
    
    
    //     if (build == 'imagebrick') {
    
    //         var wire1 = new WireToken('wire1', 0, -125);
    //         wire1.load(new Point(-125, 0));
    //         wire1.load(new Point(125, 0));
    //         this.arrTokens.push(wire1);
    
    //         let wallPos = { x: 0, y: -375 }
    //         for (var i = 0; i < 1000; i++) {
    //             for (var j = 0; j < 6; j++) {
    //                 var brick = new ColliderToken('brick31_' + i + '_' + j, wallPos.x + (20 * i), wallPos.y + (32 * j), 1.5708, 'img/brick001_32x20.png', 32, 20);
    //                 brick.health = 150;
    //                 brick.config.viewName = false;
    //                 this.arrTokens.push(brick);
    //             }
    //         }
    //         this.arrTokens.push(theToken);
    //         this.ctx.restore();
    //     }
    
    
    //     if (build == 'rectangles') {
    
    //         var rect1 = new Rectangle(0, -250, 400, 120);
    //         var rect2 = new Rectangle(125, 0, 120, 300);
    //         rect1.id = 'rectangle1';
    //         rect2.id = 'rectangle2';
    
    //         console.log(rect1.isCollisioning(rect2));
    
    
    //         //theToken = rect1;
    //         var theText = new TText("testText", 30, 110, ">> ");
    
    //         var intpoints = rect1.wire.getIntersections(rect2.wire);
    //         if (intpoints !== null) {
    //             intpoints.forEach(element => {
    //                 var p = new Point(element.x, element.y);
    //                 p.config.color = "orange";
    //                 this.arrTokens.push(p);
    //                 theText.msg += `;;(${p.x},${p.y})`;
    //             })
    //         }
    
    
    
    //         this.arrTokens.push(theText);
    //         this.arrTokens.push(rect2);
    //         this.arrTokens.push(rect1);
    //         this.arrTokens.push(theToken);
    //         this.ctx.restore();
    //     }
    
    //     if (build == 'empty') {
    
    //         this.ctx.restore();
    //     }
    // }
} 


