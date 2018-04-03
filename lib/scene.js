var Scene = function(canvasId){    //Lo que veremos en el canvas
    this.canvas =  document.getElementById(canvasId);   
    this.ctx = this.canvas.getContext('2d');    
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);  
    this.arrTokens = [];  
    this.mapkey = []; //comandos que serán agregados por el control
    this.drawing = false;
    this.token;
    
    //Posición con respecto al mapa
    this.x = 0;
    this.y = 0;
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    //Token de referencia (para centrar vista en él)
    this.token;

    //Cronómetro
    var t0 = new Date();
    var nframes = 0;
    var t1;
    
    var self = this;

    //Movimiento de la ventana: transformamos las coordenadas de todos los objetos
    this.move = function(x,y){ 
        this.moving = true;       
        this.x = x;
        this.y = y;
        for(var i = 0;i<this.arrTokens.length;i++){
            var t = this.arrTokens[i];
            t.placeAt(t.x - this.x,t.y - this.y);
        }              
    }

    //Centrar la escena en un token (para hacer seguimiento)
    this.centerOn = (function(t){                
        var dx = t.x - (this.w/2) ;
        var dy = t.y - (this.h/2) ;
        this.move(dx,dy);
    }).bind(this);

    //centramos vista en el token seleccionado en la escena 
    //generalmente designado por el control, el token que movemos
    this.center = function(){ 
        self.centerOn(self.token);        
    }

    
    this.drawScene = function(){    //Ciclo de dibujo (activamos movimientos automáticos, pintamos en canvas)
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height); 
        self.ctx.fillStyle = "#ABFFAB";
        self.ctx.fillRect(0,0,self.canvas.width, self.canvas.height);
        
        //Ejecución de comandos de control sobre el token seleccionado
        self.mapkey.forEach(function(cmd){
            if(cmd=="fire"){
                self.token.shot();                
            }
            else{
                self.token.move(cmd, self.token.displ,self.arrTokens);                
            }                     
        });

        self.center();



        //Tratamiento por cada token       
        self.arrTokens.forEach(function(t){  //Según el tipo de token realizaremos unas u otras opciones

                                if (t instanceof AutoToken){                               
                                    t.autopilot(self.arrTokens);                                
                                }
                                if (t instanceof Projectile){                               
                                    t.shot();                                
                                }
                                
                                if(t instanceof ColliderToken){
                                    t.collider.draw(self.canvas);                                                                        
                                }                               
                                t.draw(self.canvas);                              
                            });
                            //self.center(); centrar aquí vibra un montón ¿?


        requestAnimationFrame(self.drawScene);
             
        self.nframes += 1;  
        t1 = new Date();  
                            
        var difT = t1 - t0;

        if (difT>=1000){                                    
            var fps = self.nframes / (difT/1000);
            document.getElementById('info').value = 'fps:' + fps.toString().substr(0,6) + ' - ' + difT + ' ms';          
            self.nframes = 0;
            t0 = new Date();
            t1 = 0;
        }
    
    return true;    

    };

}

