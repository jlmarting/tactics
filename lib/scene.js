var Scene = function(canvasId){    
    this.canvas =  document.getElementById(canvasId);   
    this.ctx = this.canvas.getContext('2d');     
    this.arrTokens = [];  


    var self = this;
  
    this.draw = function(t){     
            if(self.ctx){                        
                self.ctx.save();
                self.ctx.translate(t.x+(t.img.width/2), t.y+(t.img.height/2));
                self.ctx.rotate(t.rad);                        
                self.ctx.translate(-(t.x+(t.img.width/2)), -(t.y+(t.img.height/2)));                    
                self.ctx.drawImage(t.img, t.x, t.y);                                            
                self.ctx.restore();
                return 1;
            }
            else{
                return -1;        
            }
        };
   

    this.drawScene = function(){                      
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);        
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
                                
                                self.draw(t);
                                    

                            });

        requestAnimationFrame(self.drawScene);
    };

}

