import { Population } from "./scenes/population.js";
import { Token2DCursor } from "../../lib/components/tokens/2d/Token2DCursor.js";
import { ImgToken } from "../../lib/components/tokens/2d/image.js";
import { Token2D } from "../../lib/components/tokens/2d/Token2D.js";
import { Projectile } from "../../lib/components/tokens/2d/projectile.js";
import { Vector2D } from "../../lib/components/poligons/2d/Vector2D.js";
import { Shooter} from "../../lib/components/tokens/2d/shooter.js";
import { ViewPortConfig, SceneBuffer, SceneConfig, GridConfig, RenderState } from "./models.js";
import { ViewPort, TokenSelector, SceneSelector, BulletEffectSelector } from "./ui.js";
import { BulletProjectile } from '../../lib/components/tokens/2d/bulletprojectile.js';
import { IToken2D } from "../../lib/interfaces/IToken2D.js";
import { Tile } from "../../lib/components/poligons/2d/tile.js";
import { TText } from "../../lib/components/ttext.js";
import { Collider } from '../../lib/components/tokens/2d/collider.js';
import { ColliderToken } from "../../lib/components/tokens/2d/collidertoken.js";





export class Scene{
    population: Population;
    engineInfo: string;
    sceneTokens: Token2D[];
    buffer: SceneBuffer;
    arr: any[];
    mapkey: any[];
    drawing: boolean;
    tokenIndex: number;
    tokenId: any;
    pause: boolean;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    config: SceneConfig;
    orders: any[];
    message: string;
    x: number;
    y: number;
    viewPort: ViewPort;
    //resize: () => void;
    w: any;
    h: any;
    renderState: RenderState;    
    sceneSelector: HTMLElement;  
    autoFPS: any;
    fps: any;
    //move: (x: any, y: any) => void;
    //centerOn: (t: any) => boolean;
    //center: () => void;
    //drawPath: () => void;
    //drawGrid: (c:CanvasRenderingContext2D) => void;
    //render: () => number;
    //reloadSel: () => void;
    //loadImg: ()=> void;
    //getSelectedToken: () => any;
    //sceneSelectorLoad: () => void;    //está definido en ui.ts
    //setToken: (t:string) => boolean;


    constructor(canvasId: string, population: Population){    //Lo que veremos en el canvas       
        console.log("constructor Scene");

        this.renderState = new RenderState();
        this.updateRenderState();

        this.population = population;

        this.engineInfo = "";
        this.sceneTokens = []; 
        //this.buffer = {drawing: string[] = [], insersections: [], misc: []}; 
      
        // otros tokens             
        this.buffer = new SceneBuffer();
        this.buffer.drawing = [];           // buffer de dibujo: secuencia de puntos
        this.buffer.intersections = [];     //buffer de cálculo de intersecciones de vectores
        this.buffer.misc = []; //

        this.arr = []; //auxiliar para filtrado de tokens
        
        this.mapkey = []; //comandos que serán agregados por el control
        this.drawing = false;
        this.tokenIndex = 0;    //indica que índice de token tenemos seleccionado para centrar vista, tomar control, etc.
        this.tokenId;           //Análogo con lo anterior. Identificador del token.
        this.pause = false;   
        
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasId);   


        this.ctx = this.canvas.getContext('2d');    
        this.config = new SceneConfig();
        
        this.config.grid = new GridConfig();
        this.config.viewGrid = true;
        this.config.scale = 11;
        this.config.viewColliders =  false;
        this.config.viewIds = false;
        this.config.autoFPS = true;
        this.config.viewPortWidth = 1920;
        this.config.viewPortHeight = 900;
        this.config.effect = 'damage';
        this.config.grid = new GridConfig();
    
        this.orders = []; //Pila de órdenes a ejecutar (movimientos, disparos, étc)
    
        this.message = " - - - "; //para paso de mensajes de otro módulo
    
            
        //Posición con respecto al mapa
        this.x = 500;
        this.y = 500;
        
        var self = this;
        //var viewportpoint = new Point(self.config.viewPortWidth, self.config.viewPortHeight);    
        //this.viewPort = new Rectangle(0-(self.config.viewPortWidth-5/2),0-(self.config.viewPortHeight-5/2),viewportpoint.x,viewportpoint.y);
        this.viewPort = new ViewPort(self);

       
        
        let sceneSelector = null;
        
        this.resize();
    
        window.onresize = function(){self.resize()};
       
        

    }
    

    
    /// <summary>
    /// Maneja el evento de resize de la ventana.
    /// </summary>

    drawScene(timeStamp:number ){    
        console.log("____________drawScene____"+timeStamp+"__________");       
        // if(!timeStamp){
        //     return;
        // }
        this.updateRenderState.bind(this)();        
        console.log(`drawScene ${this.renderState.now}`);

        this.renderState.elapsed = window.performance.now()-this.renderState.now;  
        
        if(this.renderState.elapsed>=1000/this.fps){             
            this.center();
            this.renderState.now = this.render();            
        }

        this.center();
        this.renderState.now = this.render();     

        //self.resolver(1);               

        if(!this.pause){
            //automatTime = self.automat();
        }

        //Cálculo de intervalo medio y FPS real
        this.renderState.arrIntervals.push(window.performance.now());
        var sum=0;
        for(var i=0;i<this.renderState.arrIntervals.length-1;i++){
            sum +=this.renderState.arrIntervals[i+1]-this.renderState.arrIntervals[i];
        }  
        this.renderState.averageInterval = sum/this.renderState.arrIntervals.length;
        this.renderState.realFPS = Math.round(1000/this.renderState.averageInterval);

        //Ajuste automático de FPS
        if(this.config.autoFPS){
            if(this.renderState.averageInterval>22){
                if(this.fps>1){this.fps = Math.round(this.fps/1.1);}                
            }

            if(this.renderState.averageInterval<17){
                if(this.fps<60){this.fps++;}
            }                
        }        
        if(this.renderState.arrIntervals.length>40){this.renderState.arrIntervals.shift();}            
        
        //Info
        // document.getElementById('info').innerHTML = JSON.stringify(arrIntervals)`TOKENS(TOTAL/DRAWED): [${self.arrTokens.length} / ${self.arr.length}] FPS(config/real): [${self.fps} / ${realFPS}]`+ 
        // `Draw cycle (config/real): [${Math.round(1000/self.fps)}ms / ${Math.round(averageInterval)}ms] ${self.engineInfo}` + '\n' + self.message;

        document.getElementById('info').innerHTML = 
        `TOKENS(TOTAL/DRAWED): [${this.sceneTokens.length} / ${this.arr.length}] `+
        `FPS(config/real): [${this.renderState.fps} / ${this.renderState.realFPS}]`+ 
        `Draw cycle (config/real): [${Math.round(1000/this.renderState.fps)}ms / ${Math.round(this.renderState.averageInterval)}ms]`+
         `${this.engineInfo}` + '\n' + this.message;

        requestAnimationFrame(this.drawScene.bind(this));          
        
    };


    //Estas propiedades son usadas por DrawScene
    updateRenderState() {
        let _rndrStatus = new RenderState();
        _rndrStatus.now = window.performance.now();
        _rndrStatus.fps = 60; //fps objetivo
        _rndrStatus.arrIntervals = [];
        _rndrStatus.elapsed = 0;
        _rndrStatus.averageInterval = 0;
        _rndrStatus.realFPS = 0;         
        this.renderState.now = _rndrStatus.now;
        this.renderState.fps = _rndrStatus.fps;
        this.renderState.arrIntervals = [];
        console.log('----updateRenderStatus-----'+ JSON.stringify(_rndrStatus));
    }


    drawGrid(){        
            
        this.ctx.save();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;       
        
        var grid = this.config.grid;
        
        grid.width = 1900;
        grid.height = 1200;

        var numRows = Math.round(grid.height/grid.granularity);        
        var numCols = Math.round(grid.width/grid.granularity);

        var dx = (Math.round((this.x-Math.round(grid.width/2))/grid.granularity) * grid.granularity) + Math.round(grid.width/2);
        var dy = (Math.round((this.y-Math.round(grid.height/2))/grid.granularity) * grid.granularity) + Math.round(grid.height/2);
        
        this.ctx.fillStyle = 'green';
        var cont = 0;
        for(var col=0;col<=numCols;col++){
            for(var row=0;row<=numRows;row++){
                cont++;
                var x = (col*grid.granularity);var y = (row*grid.granularity);                
                x-=dx;y-=dy;              
                var rx = x+this.x;var ry = y+this.y;
                if(this.viewPort.enabled){
                    if(this.viewPort.isInside(rx,ry)){
                        if((x%(grid.granularity*5)==0)&&(y%(grid.granularity*5)==0)){
                            this.ctx.fillRect(rx,ry,5,5);
                            this.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                        }else{
                            this.ctx.fillRect(rx,ry,1,1);
                            //self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                        }
                    }
                }else{
                    if((x%(grid.granularity*5)==0)&&(y%(grid.granularity*5)==0)){
                        this.ctx.fillRect(rx,ry,5,5);
                        this.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                    }else{
                        this.ctx.fillRect(rx,ry,1,1);
                        //self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                    }
                }
            }
        }
        //console.log(`Puntos generados ${cont}`);
        this.ctx.restore();
    }

    render(){
        console.log('-render-');    
        //Ajuste de zoom
        this.ctx.clearRect(0, 0, this.canvas.width/this.config.scale, this.canvas.height/this.config.scale); 
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.canvas.width/this.config.scale, this.canvas.height/this.config.scale);        
   
        
        //Sólo enviamos al render objetos que están en el viewport
        if(this.viewPort.enabled){
            this.arr = [];       
            this.sceneTokens = this.sceneTokens.concat(this.buffer.drawing).concat(this.buffer.intersections);
            this.viewPort.attachTo(this.sceneTokens[this.tokenIndex]);            
            this.sceneTokens.forEach(function(e){
                var p = e.getRelPos();
                if (this.viewPort.isInside(p.x,p.y)){
                    this.arr.push(e)
                }
            });
            
        }
        else{
            this.arr = this.sceneTokens.concat(this.buffer.drawing).concat(this.buffer.intersections);   
            
        }  


       
        this.arr.forEach(function(t:ColliderToken){  //Según el tipo de token realizaremos unas u otras opciones                                                           
                                                
                                    if (t.destroy){
                                        t.collider = null;
                                        t = null;

                                    // var tokenIndex = this.arrTokens.findIndex(function(element){
                                    //     return element.id == t.id;
                                    // });                                                                   
                                    // this.arrTokens.splice(tokenIndex,1);
                                    // this.tokenIndex = this.arrTokens.findIndex(function(element){
                                    //     return element.id == this.tokenId;
                                    // });
                                    }
                                    else{                                        
                                        t.draw(this.ctx); 
                                    }
                                    
                                
                                    if (t instanceof Projectile){    
                                        
                                        if (t instanceof BulletProjectile){                                                                           
                                            if(this.config.viewColliders){                                                                           
                                              //  t.collider.draw(this.canvas);  
                                            }
                                        }                          
                                    }
                                    
                                    if(this.config.viewColliders){                                    
                                            if(t instanceof ColliderToken){                                                                        
                                                //t.collider.draw(this.canvas);                                                                        
                                            }
                                    }  
                                
                                

                            }.bind(this));
       //this.viewPort.draw();

        // Visualización según configuración                    

        if(this.config.viewGrid){         
            this.drawGrid();                  
         }


         
        if(this.viewPort.enabled){
            //this.viewPort.draw(this.ctx, "red", "white");            
            this.viewPort.draw();            
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
    
    //Movimiento de la ventana: transformamos las coordenadas de todos los objetos
    move(x: number,y:number){       
        this.x = x;
        this.y = y;           
    }

    loadImg(){
        this.sceneTokens.forEach(function(t:any){
            console.log(`loadImg ${JSON.stringify(t)}`)
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


    drawPath(){
        let t = this.getSelectedToken();
        if(t instanceof ColliderToken){
            this.ctx.strokeStyle = 'orange';
            let l = this.ctx.lineWidth;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            let rpos: Token2D;
            let t = <ColliderToken>this.sceneTokens[this.tokenIndex];            
            t.collider.back.forEach(function(pos:any){                    
                                            //rpos = {x:pos.x+self.x,y:pos.y+self.y};                      
                                            rpos = new Token2D(pos.x+this.x, pos.y+this.y)
                                            this.ctx.lineTo(rpos.x,rpos.y);                                                                                                                                                             
                                            });
                                            this.ctx.stroke();  
                                if(typeof rpos != 'undefined'){
                                    this.ctx.fillStyle = 'cyan';
                                    this.ctx.fillText('[path steps: '+t.collider.back.length+']', rpos.x,rpos.y);                             
                                }
        }
        this.ctx.lineWidth = l;
    }

    resize(){
        this.canvas.width =  (window.innerWidth)*1;
        this.canvas.height = (window.innerHeight)*0.95;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.ctx.scale(this.config.scale,this.config.scale);
    }

    getSelectedToken(){
        return this.sceneTokens[this.tokenIndex];
    }

    //Centrar la escena en un token (para hacer seguimiento)
    centerOn(t: any){
        if(typeof t == 'undefined') return false;
        var scale = this.config.scale;                        
        var dx = (this.w/(2*scale))-t.x;
        var dy = (this.h/(2*scale))-t.y;
        this.move(dx,dy);
    }

    //centramos vista en el token seleccionado en la escena 
    //generalmente designado por el control, el token que movemos
    center(){ 
        this.centerOn(this.sceneTokens[this.tokenIndex]);        
    }

    reloadSel(){
            
        // let tokenSelector = new TokenSelector(this);
        let tokenSelector = null;
        
        // tokenSelector = document.getElementById('tokens');

        // tokenSelector.load = function(){
        //                             tokenSelector.innerHTML = null;
    
        //                             self.arrTokens.forEach(function(t){                                    
        //                             if((typeof t.config!== 'undefined')&&(t.config.selectable)){
        //                                 var opt = document.createElement('option');
        //                                 opt.value = t.id;
        //                                 opt.text = t.id;
        //                                 if(t.id==this.tokenId){
        //                                     opt.selected="selected";
        //                                 }
        //                                 tokenSelector.appendChild(opt);
        //                             }
        //                         });
        //                     };
        
        
        //tokenSelector.load();

        // tokenSelector.onchange = function(){  
        //     var sel = tokenSelector.value; 
        //     if(self.setToken(sel)){
        //         tokenSelector.blur();
        //     };                
        // };
    }

    setToken(tokenId: string){       
        //guardamos identificador y indice del token activo
        this.tokenIndex = this.sceneTokens.findIndex(function(element){
            //console.log(`tokenId[${tokenId}] setToken.tokenIndex -> ${this.tokenIndex}`);            
            return element.id == tokenId;
        });

        if(this.tokenIndex > -1){
            this.tokenId = tokenId;
        }else{
            console.log('No se ha encontrado token a asignar..........');
            return false;
        }
        
        //viewport al token activo que acabamos de determinar
        this.viewPort.attachTo(this.sceneTokens[this.tokenIndex]);

        //Eventos para control de estado del objeto
        let currentToken = this.sceneTokens[this.tokenIndex];

        if( currentToken instanceof ColliderToken){            
            let viewGrid = <HTMLInputElement> document.getElementById('lines');
            viewGrid.checked = <boolean>this.config.viewGrid;
            viewGrid.onchange = function(){
            this.config.viewGrid = !this.config.viewGrid;
            viewGrid.blur();
            }.bind(this);          
        
            var collision = <HTMLInputElement> document.getElementById('collision');

            //collision.checked = <boolean>this.arrTokens[this.tokenIndex].collider.config.enabled;
            let t = <ColliderToken>currentToken;
            collision.checked = <boolean>t.collider.config.enabled;
            
            collision.onchange = function(){            
                this.arrTokens[this.tokenIndex].collider.config.enabled = !this.arrTokens[this.tokenIndex].collider.config.enabled;
                collision.blur();
            }.bind(this);   


            var autoFPS = <HTMLInputElement> document.getElementById('autoFPS');
            autoFPS.checked = <boolean>this.autoFPS;
            autoFPS.onchange = function(){            
                this.config.autoFPS = !this.config.autoFPS;
                autoFPS.blur();
            }.bind(this);  
            

            var viewcolliders = <HTMLInputElement> document.getElementById('colliders');
            viewcolliders.checked = <boolean>this.config.viewColliders;
            viewcolliders.onchange = function(){
                this.config.viewColliders = !this.config.viewColliders;
                viewcolliders.blur();
            }.bind(this);

            var viewport = <HTMLInputElement> document.getElementById('viewport');
            viewport.checked = <boolean> this.viewPort.enabled;            
            viewport.onchange = function(){
                this.viewPort.enabled = !this.viewPort.enabled;
                viewport.blur();
            }.bind(this);

            var viewids = <HTMLInputElement> document.getElementById('ids');
            viewids.checked = <boolean> this.config.viewIds;
            viewids.onchange = function(){
                this.config.viewIds = !this.config.viewIds;
                viewids.blur();
            }.bind(this);

            var zoomin = <HTMLInputElement> document.getElementById('zoomin');
            zoomin.onclick = function(){
                if(this.config.scale>=0.25){
                    this.config.scale = this.config.scale + 0.1;
                    this.resize();
                    zoomin.blur();
                }                
            }.bind(this);

            var zoomout = <HTMLInputElement> document.getElementById('zoomout');
            zoomout.onclick = function(){
                if(this.config.scale <= 3){
                    this.config.scale = this.config.scale - 0.1;
                    this.resize();
                    zoomout.blur();
                }
                
            }.bind(this);

            var stopAutomat = document.getElementById('stopAutomat');
            stopAutomat.onclick = function(){
                    this.pause = !this.pause;
                    zoomout.blur();
                }.bind(this);
                
            

            var fps = <HTMLInputElement> document.getElementById('fps');
            fps.value = this.fps;
            fps.onchange = function(){
                    this.fps = fps.value;
                    fps.blur();
                }.bind(this)
        
            var viewportheight = <HTMLInputElement> document.getElementById('viewportheight');
            viewportheight.value = this.config.viewPortHeight.toString();
            viewportheight.onchange = function(){
                    this.config.viewPortHeight = parseInt(viewportheight.value);                    
                    viewportheight.blur();
                }.bind(this)

            var viewportwidth = <HTMLInputElement> document.getElementById('viewportwidth');
            viewportwidth.value = this.config.viewPortWidth.toString();            
            viewportwidth.onchange = function(){
                    this.config.viewPortWidth = parseInt(viewportwidth.value);
                    //this.config.viewPort.width = parseInt(viewportwidth.value);
                    viewportwidth.blur();
                }.bind(this)
            let bulletEffect = null;
            let tokenSelector = null;    
    }

 


    /*******DRAW*****************/
    //TODO🧮 
    // Debemos pasar los métodos draw a sus respectivas clases
    // el contexto CanvasRenderingContext2D deberá de ser asignado 
    // a cada objeto.



    // Collider.prototype.draw =  function(ctx) {
    //     ctx.save();
    //     let pos = this.getRelPos();
    //     let colliderPos = { x: pos.x, y: pos.y };
    //     ctx.beginPath();
    //     ctx.lineWidth = this.config.borderWidth;
    //     ctx.strokeStyle = this.config.borderColor;
    //     ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI * 2, false);
    //     ctx.stroke();
    //     if (this.subColliders.length == 0) {
    //         this.ctx.fillStyle = this.config.innerColor;
    //         this.ctx.fill();
    //     } else {
    //         //TODO: revisar
    //         // this.subColliders
    //         //     .forEach(
    //         //         function (sc: Collider) {
    //         //             sc.draw(ctx)
    //         //         });
    //     }
    //     this.ctx.restore();
    // }

    // Point2D.prototype.draw = function(lColor: any,fColor: any){
    //     if(this.config == undefined){          
    //         this.config = {};
    //     }
        
    //     if(this.config.color == undefined){

    //         if(lColor==undefined){
    //             lColor = "red";
    //         }
            
    //         if(fColor==undefined){
    //             fColor = "white";
    //         }
    //     }else{
    //         lColor = "white";
    //         fColor = this.config.color;
    //     }
        
                
    //     this.ctx.beginPath();    
    //     this.ctx.strokeStyle = lColor;
    //     this.ctx.fillStyle = fColor;   

    //     if(this.config.position == 'relative'){
    //         this.ctx.fillRect(this.x+this.x, this.y+this.y, 4,4);
    //         this.ctx.fillText('*('+this.x +',' + this.y+')',this.x+this.x, this.y+this.y);                
    //     }else{
    //         this.ctx.fillRect(this.x, this.y, 2,2);   
    //         this.ctx.fillText('**('+this.x +',' + this.y+')',Math.round(this.x), Math.round(this.y));             
    //     }

    //     this.ctx.stroke();    
    // }.bind(this);
    
    // Token2D.prototype.getRelPos = function(){
    //     return {x:Math.round(this.x+this.x), y:Math.round(this.y+this.y)};
    // }

    // Token2DCursor.prototype.draw = function(ctx){
    //     ctx.save();                          
    //     ctx.beginPath();
    //     var relPos = this.getRelPos();
    //     var p0 = new Token2D(this.x,this.y);
    //     var p1 = new Token2D(this.x+(Math.cos(this.rad)*25),this.y+(Math.sin(this.rad)*25));
    //     var vector = new Vector2D(this.id + '_vect', p0.x, p0.y, p1.x, p1.y );
    //     // vector.id = this.id + '_vect';
    //     // vector.a = p0;
    //     // vector.b = p1;
    //     vector.draw(ctx);

    //     ctx.lineWidth = this.config.borderWidth;
    //     ctx.strokeStyle = this.config.borderColor;          
    
    //     ctx.stroke(); 
    //     ctx.restore()
    // }

    // IntersectionPoint.prototype.draw = function(){
    //     Point2D.prototype.draw.call(this,'yellow','yellow');
    // }

    TText.prototype.draw = function(){
        this.ctx.fillStyle = this.color;
        var arrMsg = this.msg.split(';;');
        if(arrMsg.length>1){
            var x0 = this.x;
            var y0 = this.y;
            arrMsg.forEach((m:string) => {
                this.ctx.fillText(m,x0,y0);
                y0 += 15;
            });

        }else{
            this.ctx.fillText(this.msg[0],this.x,this.y);
        }
        
    }
    
   
    // Tile.prototype.draw = function(ctx){    
    //     var pos = this.getRelPos();    
    //     var rw = this.w/2;
    //     var rh = this.h/2;
    //     ctx.drawImage(this.img, pos.x-rw, pos.y-rh);       
    //    // Rectangle.prototype.draw.call(this);
    // }

    Projectile.prototype.draw = function(){
        var pos = this.getRelPos(); 
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI*2,false);        
        this.ctx.fill();
        this.ctx.stroke();        
    }

    BulletProjectile.prototype.bulletEffect = function(collisions,bullet){                                                            
        if(typeof collisions == 'undefined'){                               
            return false;
        }
        
        var i = this.arrTokens.indexOf(bullet);
        this.arrTokens.splice(i,1);  
        //Buscamos token impactado
        var thPromise = function(collisions: any){
                            return new Promise(function(resolve,reject){
                                    var tokenHitted = this.arrTokens.find(function(element: any){
                                                                            return element.id == collisions[0];
                                                                            });
                                    resolve(tokenHitted);
                            });
                        }
    
        thPromise(collisions).then(function(tokenHitted){        
            if(typeof tokenHitted == 'undefined') return false;        
            return bullet.effect(tokenHitted,bullet);
        });
    




    /******* RENDER *************/

    // Tratamos cada uno de los objetos a representar en la escena


    // this.render = function(){
        
    //     //Ajuste de zoom
    //     self.ctx.clearRect(0, 0, self.canvas.width/self.config.scale, self.canvas.height/self.config.scale); 
    //     self.ctx.fillStyle = "black";
    //     self.ctx.fillRect(0,0,self.canvas.width/self.config.scale, self.canvas.height/self.config.scale);        
   
        
    //     //Sólo enviamos al render objetos que están en el viewport
    //     if(self.viewPort.enabled){
    //         self.arr = [];       
    //         self.arrTokens = self.arrTokens.concat(self.buffer.drawing).concat(self.buffer.intersections);
    //         self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);            
    //         self.arrTokens.forEach(function(e){
    //             var p = e.getRelPos();
    //             if (self.viewPort.isInside(p.x,p.y)){
    //                 self.arr.push(e)
    //             }
    //         });
            
    //     }
    //     else{
    //         self.arr = self.arrTokens.concat(self.buffer.drawing).concat(self.buffer.intersections);   
            
    //     }  


       
    //     self.arr.forEach(function(t){  //Según el tipo de token realizaremos unas u otras opciones                                                           
                                                
    //                                 if (t.destroy){
    //                                     t.collider = {};
    //                                     t = {};

    //                                 // var tokenIndex = this.arrTokens.findIndex(function(element){
    //                                 //     return element.id == t.id;
    //                                 // });                                                                   
    //                                 // this.arrTokens.splice(tokenIndex,1);
    //                                 // this.tokenIndex = this.arrTokens.findIndex(function(element){
    //                                 //     return element.id == this.tokenId;
    //                                 // });
    //                                 }else{
    //                                     t.
    //                                     t.draw(self.ctx); 
    //                                 }
                                    
                                
    //                                 if (t instanceof Projectile){    
                                        
    //                                     if (t instanceof BulletProjectile){                                                                           
    //                                         if(self.config.viewColliders){                                                                           
    //                                             t.collider.draw(self.canvas);  
    //                                         }
    //                                     }                          
    //                                 }
                                    
    //                                 if(self.config.viewColliders){                                    
    //                                         if(t instanceof ColliderToken){                                                                        
    //                                             t.collider.draw(self.canvas);                                                                        
    //                                         }
    //                                 }  
    //                         });
    //    //self.viewPort.draw();

    //     // Visualización según configuración                    

    //     if(self.config.viewGrid){         
    //         self.drawGrid();                  
    //      }

    //     if(self.viewPort.enabled){
    //         //self.viewPort.draw(self.ctx, "red", "white");            
    //         self.viewPort.draw(self.ctx, "red");            
    //     }


    //     // self.ctx.save();
    //     // self.ctx.beginPath();
    //     // self.ctx.lineWidth = 4;
    //     // self.ctx.strokeStyle = 'red';
    //     // self.ctx.moveTo(self.x,self.y);
    //     // self.ctx.lineTo(375+self.x,-250+self.y);
    //     // self.ctx.stroke();
    //      return window.performance.now();
    // }
    
    
    //Ciclo de dibujo (activamos movimientos automáticos, pintamos en canvas)         

    this.updateRenderState.call(this);

    //Estaba aquí antes DrawScene decladaro ¿?
    //this.drawScene(this.renderState.now);

    }

     


    }



  
}