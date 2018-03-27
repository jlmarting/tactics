var Scene = function(canvasId){    
    this.canvas =  document.getElementById(canvasId);   
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);  
    this.arrTokens = [];  
    
    var t0 = new Date();
    var nframes = 0;
    var t1;
    
    var self = this;
        
    this.drawScene = function(){                     
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height); 
        self.ctx.fillStyle = "black";
        self.ctx.fillRect(0,0,self.canvas.width, self.canvas.height);         
        self.arrTokens.forEach(function(t){                                            
                                if (t instanceof AutoToken){                               
                                    t.autopilot();                                
                                }
                                
                                if(t instanceof ColliderToken){                                    
                                    var colIds = t.collider.getSceneCollisions(self.arrTokens);
                                    
                                    if(colIds.length>0){                                    
                                        t.collider.back();
                                        t.x = t.collider.backTokenX;
                                        t.y = t.collider.backTokenY ;                                                  
                                    }
                                    else{                                        
                                        t.collider.go();
                                        t.collider.backTokenX = t.x;
                                        t.collider.backTokenY = t.y;                                                
                                    }
                                    t.collider.draw(self.canvas);
                                }
                                
                                //self.draw(t);
                                t.draw(self.canvas);    

                            });
       
       
        self.nframes += 1;  
        self.t1 = new Date();  
    
        var difT = self.t1 - self.timeEllapsed;

        if ( difT >= 1000){                        
            var fps = self.nframes / (difT/1000);
            document.getElementById('info').value = 'fps:' + fps.toString().substr(0,6) + ' - ' + difT + ' ms';          
            self.nframes = 0;
            self.t0 = new Date();
            self.t1 = 0;
        }
        
        requestAnimationFrame(self.drawScene);
    };

}

