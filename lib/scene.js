const Scene = function(canvasId){    //Lo que veremos en el canvas   
    this.arrTokens = []; 
    this.arr = []; //auxiliar para filtrado de tokens
    this.mapkey = []; //comandos que serán agregados por el control
    this.drawing = false;
    this.tokenIndex;    //indica que índice de token tenemos seleccionado para centrar vista, tomar control, etc.
    this.tokenId;       //Análogo con lo anterior
    this.pause = false;   
    this.canvas =  document.getElementById(canvasId);   
    this.ctx = this.canvas.getContext('2d');    
    this.config = {viewLines:false, scale:1, viewColliders: false, viewIds: true, autoFPS: false, viewPortWidth: 1400, viewPortHeight: 800};

    this.orders = []; //Pila de órdenes a ejecutar (movimientos, disparos, étc)

        
    //Posición con respecto al mapa
    this.x = 500;
    this.y = 500;
    
    var self = this;

    
    this.viewPort = new Rectangle(0,0,self.config.viewPortWidth, self.config.viewPortHeight);
    this.viewPort.config = {};
    this.viewPort.config.innerColor = null; 
    this.viewPort.config.position = 'absolute';        
    this.viewPort.enabled =  false;    
    this.viewPort.attachTo = function(t){   
        var pos = t.getRelPos();     
        self.viewPort.placeAt(pos.x,pos.y);
    }

    this.resize = function(){
        self.canvas.width =  (window.innerWidth)*0.90;
        self.canvas.height = (window.innerHeight)*0.90;
        self.w = this.canvas.width;
        self.h = this.canvas.height;
        self.ctx.scale(self.config.scale,self.config.scale);
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
            return element.id == tokenId;
        });

        if(self.tokenIndex>-1){
            self.tokenId = tokenId;
        }else{
            console.log('No se ha encontrado nada');
            return false;
        }
        
        //viewport al token activo que acabamos de determinar
        self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);

        //Eventos para control de estado del objeto
        if(self.arrTokens[self.tokenIndex] instanceof ColliderToken){
            
            var viewLines = document.getElementById('lines');
            viewLines.checked = self.config.viewLines;
            viewLines.onchange = function(){
            self.config.viewLines = !self.config.viewLines
            viewLines.blur();
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
                    viewportheight.blur();
                }

            var viewportwidth = document.getElementById('viewportwidth');
            viewportwidth.value = self.config.viewPortWidth;            
            viewportwidth.onchange = function(){
                    self.config.viewPortwidth = viewportwidth.value;
                    viewportwidth.blur();
                }
    


            var tokenSelector = document.getElementById('tokens');

            tokenSelector.load = function(){
                                        tokenSelector.innerHTML = null;
        
                                        self.arrTokens.forEach(function(t){                                    
                                        if((typeof t.config!== 'undefined')&&(t.config.selectable)){
                                            var opt = document.createElement('option');
                                            opt.value = t.id;
                                            opt.text = t.id;
                                            if(t.id==theScene.tokenId){
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

    this.drawLines = function(){
        self.ctx.strokeStyle = 'white';
        self.ctx.linewidth = 1;
        
        var oTokenCenter = {x:0,y:0};
        let i = 0;
        self.arrTokens.forEach(function(dToken){            
            self.ctx.beginPath();            
            self.ctx.moveTo(oTokenCenter.x,oTokenCenter.y);            
            var dTokenCenter = dToken.getRelPos();
            self.ctx.lineTo(dTokenCenter.x,dTokenCenter.y);
            self.ctx.stroke();
            self.ctx.fillStyle ='white';
            self.ctx.font = '12px';
            self.ctx.fillText(i,dTokenCenter.x,dTokenCenter.y+50);
            oTokenCenter = dTokenCenter;
            i++;
        });
    }


    /*******DRAW*****************/
 
    Point.prototype.draw = function(lColor,fColor){
    
        if(lColor==undefined){
            lColor = "white";
        }
        
        if(fColor==undefined){
            fColor = "red";
        }
                
        self.ctx.beginPath();    
        self.ctx.strokeStyle = lColor;
        self.ctx.fillStyle = fColor;        
        self.ctx.fillRect(this.x+self.x, this.y+self.y, 4,4);                
        self.ctx.stroke();    
    }
    
    Point.prototype.getRelPos = function(){
        return {x:this.x+self.x, y:this.y+self.y};
    }

    
    Rectangle.prototype.draw = function(lColor,fColor){        
        var pos = {};
        if(this.config.position == 'relative'){
            pos = this.getRelPos();
        }else{
            pos.x = this.x;
            pos.y = this.y;
        }

        if(lColor==undefined){
            lColor = "white";
        }
        
        if(fColor==undefined){
            fColor = "blue";
        }
      
        self.ctx.beginPath();    
        self.ctx.strokeStyle = lColor;
        self.ctx.fillStyle = fColor;        
        var rw = this.w/2;
        var rh = this.h/2;
        self.ctx.rect(pos.x-rw, pos.y-rh, this.w, this.h);                
        self.ctx.stroke();    
    }

    Rectangle.prototype.getRelPos = function(){
        return Point.prototype.getRelPos.call(this,this.x,this.y);
    }


    ImgToken.prototype.draw = function(){   

        if(self.ctx){     
            var pos;
            if(this.config.position == 'relative'){
                pos = this.getRelPos(); 
            }
            else{
                pos = {x:this.x,y:this.y};
            }
            
            var posImg = {x:pos.x-(this.w/2),y:pos.y-(this.h/2)}                 
            
            self.ctx.save();
            
            if(typeof this.img !== 'undefined'){                       
                self.ctx.translate(pos.x, pos.y);            
                self.ctx.rotate(this.rad);                        
                self.ctx.translate(-(pos.x), -(pos.y));                    
                self.ctx.drawImage(this.img, posImg.x, posImg.y);       
                self.ctx.restore();              

                if((this.config['viewName'])&&(self.config['viewIds'])){
                    self.ctx.font = '14px serif';
                    self.ctx.fillStyle = this.idColor;   
                    self.ctx.fillText('('+Math.round(this.x) + ' ,'+Math.round(this.y)+')', pos.x-90,pos.y);
                    self.ctx.font = '24px serif';
                    self.ctx.fillText(this.id, pos.x-20,pos.y-30);

                    if(typeof this.health !== 'undefined'){
                        //panel de puntos de vida: un rectángulo sobre el que va el texto
                        self.ctx.fillStyle = "red";                        
                        self.ctx.fillRect(pos.x-30,pos.y-70,(1000*120)/1200,10);
                        self.ctx.fillStyle = "green";                        
                        self.ctx.fillRect(pos.x-30,pos.y-70,(this.health*120)/1200,10);
                        self.ctx.fillStyle = "red";                    
                        self.ctx.font = '14px serif';
                        // self.ctx.fillText('HP: ['+this.health+']', pos.x-20,pos.y-60);                    
                    }
                }    

            return 1;
            }
            else{
                var p = new Point(this.x,this.y);;
                p.draw();
                return 1;
            }

        }
        else{
            return -1;        
        }
    };

    
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



    Collider.prototype.draw = function(){              
        var pos = this.getRelPos(); 
        var colliderPos = {x:pos.x,y:pos.y}                    ;
        self.ctx.beginPath();
        self.ctx.lineWidth = this.config.borderWidth;
        self.ctx.strokeStyle = this.config.borderColor;
        self.ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI*2,false);        
        self.ctx.stroke();            
        if(this.subColliders.length == 0){
            self.ctx.fillStyle = this.config.innerColor;
            self.ctx.fill();
        }else{
            this.subColliders.forEach(function(sc){                  
                sc.draw()}
            );
        }
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
    this.render = function(){
        
        self.ctx.clearRect(0, 0, self.canvas.width/self.config.scale, self.canvas.height/self.config.scale); 
        self.ctx.fillStyle = "black";
        self.ctx.fillRect(0,0,self.canvas.width/self.config.scale, self.canvas.height/self.config.scale);        
   
        if(self.viewPort.enabled){
            self.arr = [];            
            self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);
            self.arrTokens.forEach(function(e){
                var p = e.getRelPos();
                if (self.viewPort.isInside(p.x,p.y)){
                    self.arr.push(e)
                }
            });
            
        }
        else{
            self.arr = self.arrTokens;   
        }  


       
        self.arr.forEach(function(t){  //Según el tipo de token realizaremos unas u otras opciones                                                            
                                    t.draw(); 
                                
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

        if(self.config.viewLines){         

            var p = new Point(self.arrTokens[self.tokenIndex].x,self.arrTokens[self.tokenIndex].y);
            p.draw();
            self.drawLines();  
            self.drawPath();          
            
         }


         
        if(self.viewPort.enabled){
            self.viewPort.draw();            
        }


         
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
        document.getElementById('info').value = `TOKENS(TOTAL/DRAWED): [${self.arrTokens.length} / ${self.arr.length}]  FPS(config/real): [${self.fps} / ${realFPS}] Draw cycle (config/real): [${Math.round(1000/self.fps)}ms / ${Math.round(averageInterval)}ms]`;

        requestAnimationFrame(self.drawScene);          
       
        
    };

}

