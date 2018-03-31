var Scene = function(canvasId){    
    this.canvas =  document.getElementById(canvasId);   
    this.ctx = this.canvas.getContext('2d');    
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);  
    this.arrTokens = [];  
    
    var t0 = new Date();
    var nframes = 0;
    var t1;
    
    var self = this;
        
    this.drawScene = function(){                     
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height); 
        self.ctx.fillStyle = "#ABFFAB";
        self.ctx.fillRect(0,0,self.canvas.width, self.canvas.height);
        
        //Tratamiento por cada token       
        self.arrTokens.forEach(function(t){  //Según el tipo de token realizaremos unas u otras opciones

                                if (t instanceof AutoToken){                               
                                    t.autopilot();                                
                                }
                                if (t instanceof Projectile){                               
                                    t.shot();                                
                                }
                                
                                if(t instanceof ColliderToken){
                                    // Colisiones del token con el resto    
                                    if ((t.collider.x !== t.collider.backX)||(t.collider.y !== t.collider.backY)){

                                        var colIds = t.collider.getTokenCollisions(self.arrTokens);                                    
                                        var arrSC = t.collider.subColliders;
                               
                                        if(colIds.length>0){    
                                            
                                            arrSC.forEach(function(sc){
                                                sc.back();
                                            });                                    
                                            t.collider.back();
                                            t.x = t.collider.backTokenX;
                                            t.y = t.collider.backTokenY;                                   
                                            
                                                                                       
                                        }
                                        else{ //sin colisiones
                                            var arrSC = t.collider.subColliders;
                                            arrSC.forEach(function(sc){
                                                sc.backX = sc.x;
                                                sc.backY = sc.y;
                                            });    
                                            t.collider.backTokenX = t.x;
                                            t.collider.backTokenY = t.y;
                                                      
                                            t.collider.go();
                                            arrSC.forEach(function(sc){
                                                sc.go();
                                            });                                                                                                                
                                        }

                                    }
                                  
                                    t.collider.draw(self.canvas);
                                    
                                }
                                
                                t.draw(self.canvas);    

                            });
       
       
        self.nframes += 1;  
        t1 = new Date();  
    
        var difT = t1 - t0;

        if ( difT >= 1000){                        
            var fps = self.nframes / (difT/1000);
            document.getElementById('info').value = 'fps:' + fps.toString().substr(0,6) + ' - ' + difT + ' ms';          
            self.nframes = 0;
            t0 = new Date();
            t1 = 0;
        }
        
        requestAnimationFrame(self.drawScene);
    };

}

