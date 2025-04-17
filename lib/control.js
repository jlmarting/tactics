var Control = function(scene){    
    this.token;
    var self = this;
    var scene = scene;
    
    this.selectToken = function(token){
        this.token=token
        scene.token = token;
    };
    //teclas pulsadas, pulsación múltiple
    this.mapkey = [];

    //Configuración de teclas
    this.keyCommand = function(keyCode){
        switch(keyCode){
            case 37: return "left";
            case 38: return "up";
            case 39: return "rigth";
            case 40: return "down";
            case 32: return "fire";
        }
    }

    
    //eventos de teclas    
    document.onkeydown = function(e){
                            var cmd = self.keyCommand(e.keyCode);
                       
                            if(cmd=="fire"){
                                self.token.shot();
                            }
                            
                            if(self.mapkey.indexOf(cmd)==-1){                         
                                self.mapkey.push(cmd);                                      
                            }    
                            //movemos si mantenemos pulsado                                                        
                            self.mapkey.forEach(function(cmd){ //move responde a los cursores, clase CursorPoint
                                    self.token.move(cmd, self.token.displ,scene.arrTokens);  
                                   });
                       
                            scene.center();
                            
                        };

    document.onkeyup = function(e){   
                            var cmd = self.keyCommand(e.keyCode); 
                            var index = self.mapkey.indexOf(cmd);
                            if(index>-1){
                                self.mapkey.splice(index,1);
                            }
                        
                        };
}
