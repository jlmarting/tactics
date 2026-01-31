import { Point } from '../point/point';
import { ImgToken } from '../tokens/image';
import { Effects } from '../projectile/effects';
import { IToken } from '../tokens/interfaces/itoken';
import { CursorPoint } from '../point/cursorpoint';
import { Vector } from '../tokens/vector';
import { IntersectionPoint } from '../point/intersectionpoint';
import { Projectile } from '../projectile/projectile';
import { BulletProjectile } from '../projectile/bulletprojectile';
import { ColliderToken } from '../tokens/colliderToken';
import { ViewPort} from './viewport'


/**
 * Parte visible del mundo. Un recorte rectangular de lo que abarca nuestra vista. * 
 */
class WorldTokens{

    public tokens: Array<IToken>;
    public loadImg() {
        this.tokens.forEach(function (t) {
            if (t instanceof ImgToken) {
                t.img = new Image();
                t.img.src = t.src;
            }
            else {
            //Tratamiento alternativo
            }
        });
    }
    public purgeMarked(){ 
        this.tokens = this.tokens.filter(t=>!t.delete);                
    }
    
}


class GridConfiguration{
     height: 0;
     width: 0;
     granularity: 50; 
}


class SceneConfiguration{
        viewGrid: boolean;
        scale: number;
        viewColliders: boolean;
        viewIds: boolean;
        autoFPS: boolean;
        viewPortWidth: number;
        viewPortHeight: number;
        enableAutoMov: boolean;
        effect: string;
        grid : GridConfiguration;
    };

/**
 * Distancia relativa por componentes
 */
class DeltaXY{
    dx: number;
    dy: number;
    constructor(dx:number, dy: number){
        this.dx = dx;
        this.dy = dy;
    }
}


/**
 *  Soporte para representar una escena
 */
export class Scene {

    public engineInfo: string;

    private worldTokens: WorldTokens;
    public buffer: { drawing, intersections, misc };
    public renderQueue: any[];
    public mapkey: any[];HTMLCanvasElement
    public drawing: boolean;
    public tokenIndex: number;
    public tokenId: any;    
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public orders: any[];
    public message: string;
    public x: number;
    public y: number;
    public viewPort: ViewPort;
    public w: any;
    public h: any;
    public autoFPS: any;
    public fps: any;
    public config: SceneConfiguration;


    public getWorldTokens(){
        return this.worldTokens.tokens;
    }


    public deleteMarkedTokens(){
 
        this.worldTokens.purgeMarked();        
        this.tokenIndex = 
                this.getWorldTokens()
                    .findIndex(t=> t.id === this.tokenId);
    }


    /**
     * Configuración de la escena por defecto
     */
    public defaultConfig():void {
        this.config = new SceneConfiguration();
        this.config.viewGrid = true;
        this.config.scale = 1;
        this.config.viewColliders = false;
        this.config.viewIds = false;
        this.config.autoFPS = true;
        this.config.viewPortWidth = 1920;
        this.config.viewPortHeight = 900;
        this.config.effect = 'damage';
        this.config.enableAutoMov = true;
        this.config.grid = new GridConfiguration();
        this.config.grid.height = 0;
        this.config.grid.width = 0;
        this.config.grid.granularity = 50;
    }

    /**Posición por defecto de la escena */
    public defaultPosition(): void{                
                this.x = 500;
                this.y = 500;
    }

    /**
     * 
     * @param canvasId Identificador del ID del canvas existente en el DOM 
     * en el que se representará la escena
     */
    public constructor(canvasId: string) {    //Lo que veremos en el canvas       
        
        const elemento = document.getElementById(canvasId)
        if(elemento instanceof HTMLCanvasElement){
            this.canvas = elemento
        }else{
            throw new Error(`Canvas ${canvasId} no encontrado. Revise HTML`);
        }

        
        this.engineInfo = "";
        this.worldTokens = new WorldTokens();

        this.defaultConfig();

        // otros tokens         
        this.buffer.drawing = [];   // buffer de dibujo: secuencia de puntos
        this.buffer.intersections = [];  //buffer de cálculo de intersecciones de vectores
        this.buffer.misc = []; //
        this.renderQueue = []; //auxiliar para filtrado de tokens
        this.mapkey = []; //comandos que serán agregados, empilados, por el control
        this.drawing = false;
        this.tokenIndex = 0;    //indica que índice de token tenemos seleccionado para centrararr vista, tomar control, etc.
        this.tokenId;       //Análogo con lo anterior pero con el identificador

        this.config.enableAutoMov = false;
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);canvasId

        let c = <HTMLCanvasElement>this.canvas;
        this.ctx = c.getContext('2d');
        this.orders = []; //Pila de órdenes a ejecutar (movimientos, disparos, étc)
        this.message = " - - - "; //para paso de mensajes de otro módulo
        this.defaultPosition();
        let viewportpoint = new Point(this.config.viewPortWidth, this.config.viewPortHeight);
        this.viewPort = new ViewPort(0 - (this.config.viewPortWidth - 5 / 2), 0 - (this.config.viewPortHeight - 5 / 2), viewportpoint.x, viewportpoint.y)

        // let sceneSelector = document.getElementById('scene');
        // sceneSelector.load = function () {
        //      sceneSelector.innerHTML = null;
        // }

        this.resize();

        window.onresize = function () { this.resize() };


        //Cargamos todas las imágenes de los tokens que las tengan
        // this.arrTokens.loadImg = function () {
        //     this.arrTokens.forEach(function (t) {
        //         if (t instanceof ImgToken) {/**  */
        //             t.img = new Image();
        //             t.img.src = t.src;
        //         } else {
        //             //TODO: código repetido...
        //             // if (t instanceof Tile) {
        //             //     t.img = new Image();
        //             //     t.img.src = t.src;
        //             // }
        //         }
        //});
        //}

        // const loadImg = function () {
        //     this.arrTokens.forEach(function (t) {
        //         if (t instanceof ImgToken) {
        //             t.img = new Image();
        //             t.img.src = t.src;
        //         } else {
        //             //Tratamiento alternativo
        //         }
        //     }
        // }Point
    }

    
/** * 
 * @param element elemento de la escena
 * @returns distancia relativa a la escena de este objeto por cada componente (x, y)
 */

    public getRelPos(element: Object){
        if (element instanceof Point){            
            return new DeltaXY(Math.round(element.x + this.x),Math.round(element.y + this.y));
        }
    }

    /**
     * 
     * @param element 
     */
    public drawElement(element: Object){
        
        if (element instanceof Point){            
            this.drawPoint(element.x, element.y,'red', 'white');
        }


        if (element instanceof CursorPoint){
            this.ctx.save();
            this.ctx.beginPath();
            let relPos = this.getRelPos(element);
            let p0 = new Point(this.x, this.y);
            let p1 = new Point(this.x + (Math.cos(element.rad) * 25), this.y + (Math.sin(element.rad) * 25));
            //var vector = new Vector(this);
            // vector.id = this.id + '_vect';
            // vector.a = p0;
            // vector.b = p1;
            // vector.draw(ctx);
            let vector = new Vector(element.id + '_vect', p0.x, p0.y, p1.x, p1.y);

            // TODO: revisar y abordar diseño del elemento a representar
            // this.ctx.lineWidtCursorPointh = this.config.borderWidth;
            // this.ctx.strokeStyle = this.config.borderColor;

            this.ctx.stroke();
            this.ctx.restore()

        }
        

        if (element instanceof IntersectionPoint){
            this.drawPoint(element.x, element.y, 'yellow', 'yellow')
        }


        // TODO: revisar estos tipos TText y Tile...
        // if (element instanceof TText){}

        // TText.prototype.draw = function () {
        //     this.ctx.fillStyle = this.color;
        //     var arrMsg = this.msg.split(';;');
        //     if (arrMsg.length > 1) {
        //         var x0 = thiCursorPoints.x;
        //         var y0 = this.y;
        //         arrMsg.forEach(m => {
        //             this.ctx.fillText(m, x0, y0);
        //             y0 += 15;
        //         });

        //     } else {
        //         this.ctx.fillText(this.msg[0], this.x, this.y);
        //     }

        // }

        // if (element instanceof Tile{}timeStamp
        // CursorPoint
        // Tile.prototype.getRelPos = function () {
        //     return Point.prototype.getRelPos.call(this, this.x, this.y);
        // }


        // Tile.prototype.draw = function () {
        //     var pos = this.getRelPos();
        //     var rw = this.w / 2;
        //     var rh = this.h / 2;
        //     this.ctx.drawImage(this.img, pos.x - rw, pos.y - rh);
        //     // Rectangle.prototype.draw.call(this);
        // }


        //TODO: refactorizar primero Projectile a TS
        // if (element instanceof Projectile){
        //     drawPoint(element.x, element.y, 'red', 'red')
        // }
        
        // Projectile.prototype.draw = function () {
        //     var pos = this.getRelPos();
        //     this.ctx.beginPath();
        //     this.ctx.strokeStyle = 'red';
        //     this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
        //     this.ctx.fill();
        //     this.ctx.stroke();
        // }

        }

        /**
         * 
         * @param x 
         * @param y 
         * @param lColor 
         * @param fColor 
         */
        public drawPoint(x: number, y: number, lColor: string, fColor: string) {         

            this.ctx.beginPath();
            this.ctx.strokeStyle = lColor;
            this.ctx.fillStyle = fColor;

            //TODO: revisar
            // Creo que esta idea correponde a que las coordenadas de un punto 
            // pueden estar supeditadas a la de otro (relativas a uno concreto)
            // Comento y por ahora considero el caso de punto con posición absoluta.
            // if (this.config.position == 'relative') {
            //     this.ctx.fillRect(this.x + this.x, this.y + this.y, 4, 4);
            //     this.ctx.fillText('*(' + this.x + ',' + this.y + ')', this.x + this.x, this.y + this.y);
            // } else {
            //     this.ctx.fillRect(this.x, this.y, 2, 2);
            //     this.ctx.fillText('**(' + this.x + ',' + this.y + ')', Math.round(this.x), Math.round(this.y));
            // }
            this.ctx.fillRect(x, y, 2, 2);
            this.ctx.fillText('**(' + x + ',' + y + ')', Math.round(x), Math.round(y));

            this.ctx.stroke();
        }
    


    public drawScene(timeStamp: number) {

        //Ciclo de dibujo (activamos movimientos automáticos, pintamos en canvas)  
        var now = window.performance.now();
        this.fps = 60; //fps objetivo
        var arrIntervals = [];
        var elapsed = 0;
        var averageInterval = 0;
        var realFPS = 0

        elapsed = window.performance.now() - now;

        if (elapsed >= 1000 / this.fps) {
            this.center();
            now = this.render();
        }

        //this.resolver(1);               

        if (!this.pause) {
            //automatTime = this.automat();
        }

        //Cálculo de intervalo medio y FPS real
        arrIntervals.push(window.performance.now());
        var sum = 0;
        for (var i = 0; i < arrIntervals.length - 1; i++) {
            sum += arrIntervals[i + 1] - arrIntervals[i];
        }
        averageInterval = sum / arrIntervals.length;
        realFPS = Math.round(1000 / averageInterval);

        //Ajuste automático de FPS
        if (this.config.autoFPS) {
            if (averageInterval > 22) {
                if (this.fps > 1) { this.fps = Math.round(this.fps / 1.1); }
            }

            if (averageInterval < 17) {
                if (this.fps < 60) { this.fps++; }
            }
        }
        if (arrIntervals.length > 40) { arrIntervals.shift(); }

        //Info
        document.getElementById('info').textContent = 
        `TOKENS(TOTAL/DRAWED): [${this.worldTokens.tokens.length} / ${this.renderQueue.length}] 
            FPS(config/real): [${this.fps} / ${realFPS}]` +
            `Draw cycle (config/real): [${Math.round(1000 / this.fps)}ms / ${Math.round(averageInterval)}ms] 
            ${this.engineInfo}` + '\n' + this.message;

        requestAnimationFrame(this.drawScene);

        }

//    /**
//     * Representa los elementos de la escena.
//     * @returns Tiempo de renderizado
//     */
//     public render():number {

//         //Ajuste de zoom
//         this.ctx.clearRect(0, 0, this.canvas.width / this.config.scale, this.canvas.height / this.config.scale);
//         this.ctx.fillStyle = "black";
//         this.ctx.fillRect(0, 0, this .canvas.width / this.config.scale, this.canvas.height / this.config.scale);


//         //Sólo enviamos al render objetos que están en el viewport
//         if (this.viewPort.enabled) {
//             this.renderQueue = [];
//             this.arrTokens = this.arrTokens.concat(this.buffer.drawing).concat(this.buffer.intersections);
//             this.viewPort.attachTo(this.arrTokens[this.tokenIndex]);
//             this.arrTokens.forEach(function (e) {
//                 var p = e.getRelPos();
//                 if (this.viewPort.isInside(p.x, p.y)) {
//                     this.arr.push(e)
//                 }
//             });

//         }
//         else {
//             this.renderQueue = this.arrTokens.concat(this.buffer.drawing).concat(this.buffer.intersections);
 
    /**
    * Representa los elementos de la escena.
    * @returns Tiempo de renderizado
    */
    public render():number {

        //Ajuste de zoom
        this.ctx.clearRect(0, 0, this.canvas.width / this.config.scale, this.canvas.height / this.config.scale);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this .canvas.width / this.config.scale, this.canvas.height / this.config.scale);


        //Sólo enviamos al render objetos que están en el viewport
        if (this.viewPort.enabled) {
            this.renderQueue = [];
            this.worldTokens.tokens = this.worldTokens.tokens.concat(this.buffer.drawing).concat(this.buffer.intersections);
            this.viewPort.attachTo(this.worldTokens.tokens[this.tokenIndex]);
            this.worldTokens.tokens.forEach(function (e) {
                var p = this.getRelPos(e);
                if (this.viewPort.isInside(p.x, p.y)) {
                    this.arr.push(e)
                }
            });

        }
        else {
            this.renderQueue = this.worldTokens.tokens.concat(this.buffer.drawing).concat(this.buffer.intersections);

        }

        this.renderQueue.forEach(function (t) {  //Según el tipo de token realizaremos unas u otras opciones                                                           

            if (t.destroy) {
                t.collider = {};
                t = {};

                // var tokenIndex = theScene.arrTokens.findIndex(function(element){
                //     return element.id == t.id;
                // });                                                                   
                // theScene.arrTokens.splice(tokenIndex,1);
                // theScene.tokenIndex = theScene.arrTokens.findIndex(function(element){
                //     return element.id == theScene.tokenId;
                // });
            } else {
                t.draw(this.ctx);
            }


            // if (t instanceof Projectile) {

            //     if (t instanceof BulletProjectile) {
            //         if (this.config.viewColliders) {
            //             t.collider.draw(this.canvas);
            //         }
            //     }
            // }

            
            // TODO: refactorizar BulletProjectile
            // if (t instanceof BulletProjectile) {                
            //     t.collider.draw(this.canvas);
            //         // if (this.config.viewColliders) {
            //         //     t.collider.draw(this.canvas);
            //         // }
                
            // }

            if (this.config.viewColliders) {
                if (t instanceof ColliderToken) {
                    t.collider.draw(this.canvas);
                }
            }return window.performance.now();



        });
        //this.viewPort.draw();

        // Visualización según configuración                    

        if (this.config.viewGrid) {
            this.drawGrid(this.ctx);
        }



        if (this.viewPort.enabled) {
            this.viewPort.draw(this.ctx);
        }


        // this.ctx.save();
        // this.ctx.beginPath();
        // this.ctx.lineWidth = 4;
        // this.ctx.strokeStyle = 'red';
        // this.ctx.moveTo(this.x,this.y);
        // this.ctx.lineTo(375+this.x,-250+this.y);
        // this.ctx.stroke();



        return window.performance.now();
    }

//         }



//         this.renderQueue.forEach(function (t) {  //Según el tipo de token realizaremos unas u otras opciones                                                           

//             if (t.destroy) {
//                 t.collider = {};
//                 t = {};

//                 // var tokenIndex = theScene.arrTokens.findIndex(function(element){
//                 //     return element.id == t.id;
//                 // });                                                                   
//                 // theScene.arrTokens.splice(tokenIndex,1);
//                 // theScene.tokenIndex = theScene.arrTokens.findIndex(function(element){
//                 //     return element.id == theScene.tokenId;
//                 // });
//             } else {
//                 t.draw(this.ctx);
//             }


//             // if (t instanceof Projectile) {

//             //     if (t instanceof BulletProjectile) {
//             //         if (this.config.viewColliders) {
//             //             t.collider.draw(this.canvas);
//             //         }
//             //     }
//             // }

            
//             if (t instanceof BulletProjectile) {
                
//                     if (this.config.viewColliders) {
//                         t.collider.draw(this.canvas);
//                     }
                
//             }

//             if (this.config.viewColliders) {
//                 if (t instanceof ColliderToken) {
//                     t.collider.draw(this.canvas);
//                 }
//             }



//         });
//         //this.viewPort.draw();

//         // Visualización según configuración                    

//         if (this.config.viewGrid) {
//             this.drawGrid(this.ctx);
//         }



//         if (this.viewPort.enabled) {
//             this.viewPort.draw(this.ctx);
//         }


//         // this.ctx.save();
//         // this.ctx.beginPath();
//         // this.ctx.lineWidth = 4;
//         // this.ctx.strokeStyle = 'red';
//         // this.ctx.moveTo(this.x,this.y);
//         // this.ctx.lineTo(375+this.x,-250+this.y);
//         // this.ctx.stroke();



//         return window.performance.now();
//     }

    


    resize() {
        this.ctx.width = (window.innerWidth) * 1;
        this.ctx.height = (window.innerHeight) * 0.95;
        this.w = this.ctx.width;
        this.h = this.ctx.height;
        this.ctx.scale(this.config.scale, this.config.scale);
    }

    reloadSel() {

        var tokenSelector = document.getElementById('tokens');

        tokenSelector.load = function () {
            tokenSelector.innerHTML = null;

            this.arrTokens.forEach(function (t) {
                if ((typeof t.config !== 'undefined') && (t.config.selectable)) {
                    var opt = document.createElement('option');
                    opt.value = t.id;
                    opt.text = t.id;
                    if (t.id == this.tokenId) {
                        opt.selected = true;
                    }
                    tokenSelector.appendChild(opt);
                }
            });
        };
        tokenSelector.load();

        tokenSelector.onchange = function () {
            var sel = tokenSelector.value;
            if (this.setToken(sel)) {
                tokenSelector.blur();
            };
        };
    }

    //Movimiento de la ventana: transformamos las coordenadas de todos los objetos
    move(x, y) {
        this.x = x;
        this.y = y;
    }

    //Centrar la escena en un token (para hacer seguimiento)
    centerOn(t:IToken) {
        if (typeof t == 'undefined') return false;
        var scale = this.config.scale;
        var dx = (this.w / (2 * scale)) - t.x;
        var dy = (this.h / (2 * scale)) - t.y;
        this.move(dx, dy);
    };

    //centramos vista en el token seleccionado en la escena 
    //generalmente designado por el control, el token que movemos
    center() {
        this.centerOn(this.arrTokens[this.tokenIndex]);
    }
    
    draw(obj){
        switch(obj.constructor){
            case Point: this.drawPoint(<Point>obj);break;
            case ImgToken: this.drawImgToken(<ImgToken>obj);break;
            case ColliderToken: this.drawColliderToken(<ColliderToken>obj);break;
            default: break;
        }
    }



    drawImgToken(t: ImgToken){

        let ctx = this.ctx;

        if(ctx){     
            var pos;
            if(t.config.position == 'relative'){
                pos = t.center.getRelPos(); 
            }
            else{
                pos = {x:this.x,y:this.y};
            }
            
            var posImg = {x:pos.x-(this.w/2),y:pos.y-(this.h/2)}                 
            
            ctx.save();
            
            if(typeof t.img !== 'undefined'){                       
                ctx.translate(pos.x, pos.y);            
                ctx.rotate(t.rad);                        
                ctx.translate(-(pos.x), -(pos.y));                    
                ctx.drawImage(t.img, posImg.x, posImg.y);       
                ctx.restore();              
    
                if((this.config['viewName'])&&(self.config['viewIds'])){
                    ctx.font = '14px serif';
                    ctx.fillStyle = t.idColor;   
                    ctx.fillText('('+Math.round(this.x) + ' ,'+Math.round(this.y)+')', pos.x-90,pos.y);
                    ctx.font = '24px serif';
                    ctx.fillText(this.id, pos.x-20,pos.y-30);
    
                    if(typeof this.health !== 'undefined'){
                        //panel de puntos de vida: un rectángulo sobre el que va el texto
                        ctx.fillStyle = "red";                        
                        ctx.fillRect(pos.x-30,pos.y-70,(1000*120)/1200,10);
                        ctx.fillStyle = "green";                        
                        ctx.fillRect(pos.x-30,pos.y-70,(this.health*120)/1200,10);
                        ctx.fillStyle = "red";                    
                        ctx.font = '14px serif';
                        // self.ctx.fillText('HP: ['+this.health+']', pos.x-20,pos.y-60);                    
                    }
                }    
    
            return 1;
            }
            else{
                var p = new Point(this.x,this.y);;
                this.draw(p);
                return 1;
            }
    
        }
        else{
            return -1;        
        }

    }
    
    //TODO: refactorizar ColliderToken y revisar para implementar draw
    // drawColliderToken(t: ColliderToken){         
    //     this.ctx.save();
    //     var pos = this.getRelPos(this);
    //     var colliderPos = { x: pos.x, y: pos.y };
    //     this.ctx.beginPath();
    //     this.ctx.lineWidth = this.config.borderWidth;
    //     this.ctx.strokeStyle = this.config.borderColor;
    //     this.ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI * 2, false);
    //     this.ctx.stroke();
    //     if (this.subColliders.length == 0) {
    //         this.ctx.fillStyle = this.config.innerColor;
    //         this.ctx.fill();
    //     } else {
    //         this.subColliders.forEach(function (sc) {
    //             this.drawColliderToken(sc);
    //         });
    //     }
    //     this.ctx.restore();
    // }

  

    public drawPath() {
        if (this.getSelectedToken()['collider'] !== 'undefined') {
            this.ctx.strokeStyle = 'orange';
            var l = this.ctx.lineWidth;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            var rpos;
            this.worldTokens.tokens[this.tokenIndex].collider.back.forEach(function (pos) {
                rpos = { x: pos.x + this.x, y: pos.y + this.y };
                this.ctx.lineTo(rpos.x, rpos.y);
            });
            this.ctx.stroke();
            if (typeof rpos != 'undefined') {
                this.ctx.fillStyle = 'cyan';
                this.ctx.fillText('[path steps: ' + this.arrTokens[this.tokenIndex].collider.back.length + ']', rpos.x, rpos.y);
            }
        }
        this.ctx.lineWidth = l;
    }

    public drawGrid() {

        this.ctx.save();
        this.ctx.strokeStyle = 'white';
        this.ctx.linewidth = 1;

        var grid = this.config.grid;

        grid.width = 1900;
        grid.height = 1200;

        var numRows = Math.round(grid.height / grid.granularity);
        var numCols = Math.round(grid.width / grid.granularity);

        var dx = (Math.round((this.x - Math.round(grid.width / 2)) / grid.granularity) * grid.granularity) + Math.round(grid.width / 2);
        var dy = (Math.round((this.y - Math.round(grid.height / 2)) / grid.granularity) * grid.granularity) + Math.round(grid.height / 2);

        this.ctx.fillStyle = 'green';
        var cont = 0;
        for (var col = 0; col <= numCols; col++) {
            for (var row = 0; row <= numRows; row++) {
                cont++;
                var x = (col * grid.granularity); var y = (row * grid.granularity);
                x -= dx; y -= dy;
                var rx = x + this.x; var ry = y + this.y;
                if (this.viewPort.enabled) {
                    if (this.viewPort.isInside(rx, ry)) {
                        if ((x % (grid.granularity * 5) == 0) && (y % (grid.granularity * 5) == 0)) {
                            this.ctx.fillRect(rx, ry, 5, 5);
                            this.ctx.fillText(`(${x},${y})`, rx + 15, ry - 5);
                        } else {
                            this.ctx.fillRect(rx, ry, 1, 1);
                            //this.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                        }
                    }
                } else {
                    if ((x % (grid.granularity * 5) == 0) && (y % (grid.granularity * 5) == 0)) {
                        this.ctx.fillRect(rx, ry, 5, 5);
                        this.ctx.fillText(`(${x},${y})`, rx + 15, ry - 5);
                    } else {
                        this.ctx.fillRect(rx, ry, 1, 1);
                        //this.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                    }
                }
            }
        }
        //console.log(`Puntos generados ${cont}`);
        this.ctx.restore();
    }

    //Token de referencia (para centrar vista en él)
    public setToken(tokenId) {

        //guardamos identificador y indice del token activo
        this.tokenIndex = this.worldTokens.tokens.findIndex(element => {
            return element.id == tokenId;
        });

        if (this.tokenIndex > -1) {
            this.tokenId = tokenId;
        } else {
            console.log('No se ha encontrado nada');
            return false;
        }

        //viewport al token activo que acabamos de determinar
        this.viewPort.attachTo(this.worldTokens.tokens.[this.tokenIndex]);

        //Eventos para control de estado del objeto
        if (this.worldTokens.tokens.[this.tokenIndex] instanceof ColliderToken) {

            var viewGrid = document.getElementById('lines');
            viewGrid.checked = this.config.viewGrid;
            viewGrid.onchange = function () {
                this.config.viewGrid = !this.config.viewGrid;
                viewGrid.blur();
            };

            var collision = document.getElementById('collision');
            collision.checked = this.arrTokens[this.tokenIndex].collider.config.enabled;
            collision.onchange = function () {
                this.worldTokens.tokens[this.tokenIndex].collider.config.enabled = !this.worldTokens.tokens.[this.tokenIndex].collider.config.enabled;
                collision.blur();
            };


            var autoFPS = document.getElementById('autoFPS');
            autoFPS.checked = this.autoFPS;
            autoFPS.onchange = function () {
                this.config.autoFPS = !this.config.autoFPS;
                autoFPS.blur();
            };


            var viewcolliders = document.getElementById('colliders');
            viewcolliders.checked = this.config.viewColliders;
            viewcolliders.onchange = function () {
                this.config.viewColliders = !this.config.viewColliders;
                viewcolliders.blur();
            }

            var viewport = document.getElementById('viewport');
            viewport.checked = this.viewPort.enabled;
            viewport.onchange = function () {
                this.viewPort.enabled = !this.viewPort.enabled;
                viewport.blur();
            }

            var viewids = document.getElementById('ids');
            viewids.checked = this.config.viewIds;
            viewids.onchange = function () {
                this.config.viewIds = !this.config.viewIds;
                viewids.blur();
            }

            var zoomin = document.getElementById('zoomin');
            zoomin.onclick = function () {
                if (this.config.scale >= 0.25) {
                    this.config.scale = this.config.scale + 0.1;
                    this.resize();
                    zoomin.blur();
                }
            }

            var zoomout = document.getElementById('zoomout');
            zoomout.onclick = function () {
                if (this.config.scale <= 3) {
                    this.config.scale = this.config.scale - 0.1;
                    this.resize();
                    zoomout.blur();
                }

            }

            var stopAutomat = document.getElementById('stopAutomat');
            stopAutomat.onclick = function () {
                this.pause = !this.pause;
                zoomout.blur();
            };



            var fps = document.getElementById('fps');
            fps.value = this.fps;
            fps.onchange = function () {
                this.fps = fps.value;
                fps.blur();
            }

            var viewportheight = document.getElementById('viewportheight');
            viewportheight.value = this.config.viewPortHeight;
            viewportheight.onchange = function () {
                this.config.viewPortHeight = viewportheight.value;
                this.config.viewPort.height = viewportheight.value;
                viewportheight.blur();
            }

            var viewportwidth = document.getElementById('viewportwidth');
            viewportwidth.value = this.config.viewPortWidth;
            viewportwidth.onchange = function () {
                this.config.viewPortwidth = viewportwidth.value;
                this.config.viewPort.width = viewportwidth.value;
                viewportwidth.blur();
            }


            var bulletEffect = document.getElementById('effects');

            bulletEffect.load = function () {
                bulletEffect.innerHTML = null;

                var prop = Object.keys(Effects);

                prop.forEach(function (e) {
                    var opt = document.createElement('option');
                    opt.value = e
                    opt.text = e;
                    bulletEffect.appendChild(opt);
                    if (opt.value == this.config.effect) {
                        opt.selected = "selected";
                    }
                });
            }

            bulletEffect.addEventListener('click', function () {
                bulletEffect.load();
            });


            bulletEffect.onchange = function () {
                var sel = bulletEffect.value;
                this.config.effect = sel;
                tokenSelector.blur();
            };

            bulletEffect.load();




            var tokenSelector = document.getElementById('tokens');

            tokenSelector.load = function () {
                tokenSelector.innerHTML = null;

                this.arrTokens.forEach(function (t) {
                    if ((typeof t.config !== 'undefined') && (t.config.selectable)) {
                        var opt = document.createElement('option');
                        opt.value = t.id;
                        opt.text = t.id;
                        if (t.id == theScene.tokenId) {
                            opt.selected = "selected";
                        }
                        tokenSelector.appendChild(opt);
                    }
                });
            };

            tokenSelector.addEventListener('click', function () {
                tokenSelector.load();
            })

            tokenSelector.onchange = function () {
                var sel = tokenSelector.value;
                if (this.setToken(sel)) {
                    tokenSelector.blur();
                };
            };

            tokenSelector.load();
        }
    };

    getSelectedToken = function () {
        return this.arrTokens[this.tokenIndex];
    }




}
