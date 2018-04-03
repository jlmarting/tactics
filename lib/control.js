var Control = function(scene){    
    this.token;
    var self = this;
    var scene = scene;
    
    this.selectToken = function(token){
        this.token=token
        scene.token = token;
    };
    //teclas pulsadas, pulsación múltiple
    this.mapkey = scene.mapkey;

    //comandos disponibles
    this.moveCMD = ['left', 'right', 'up','down'];
    this.fireCMD = ['fire'];
    //Configuración de teclas
    this.keyCommand = function(keyCode){
        switch(keyCode){
            case 37: return "left";
            case 38: return "up";
            case 39: return "right";
            case 40: return "down";
            case 32: return "fire";
        }
    }

    
    //eventos de teclas    
    document.onkeydown = function(e){
                            var cmd = self.keyCommand(e.keyCode);
                           
                            if(self.mapkey.indexOf(cmd)==-1){                         
                                if(self.fireCMD.indexOf(cmd)>-1){
                                    self.mapkey.push(cmd);                                                                 
                                }
                                if(self.moveCMD.indexOf(cmd)>-1){
                                    self.mapkey.push(cmd);                                  
                                }
                                
                            }    

                            //scene.mapkey = self.mapkey;
                            //scene.center();
                            
                        };

    document.onkeyup = function(e){   
                            var cmd = self.keyCommand(e.keyCode);                             
                            var index = self.mapkey.indexOf(cmd);                            
                            if(index>-1){
                                self.mapkey.splice(index,1);                            
                            }
                            //scene.mapkey = self.mapkey;
                        };
}
