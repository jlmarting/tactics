var Control = function(token){    
    this.token = token;
    this.selectToken = function(token){this.token=token};
    //teclas pulsadas
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

    var self = this;


    //eventos de teclas    
    document.onkeydown = function(e){
                            var cmd = self.keyCommand(e.keyCode);
                            //console.log(cmd);
                            if(cmd=="fire"){
                                self.token.shot();
                            }
                            
                            if(self.mapkey.indexOf(cmd)==-1){                         
                                self.mapkey.push(cmd);      
                            }    
                            //movemos si mantenemos pulsado                                                        
                            self.mapkey.forEach(
                                function(cmd){self.token.move(cmd, 10)});
                        };

    document.onkeyup = function(e){   
                            var cmd = self.keyCommand(e.keyCode); 
                            var index = self.mapkey.indexOf(cmd);
                            if(index>-1){
                                self.mapkey.splice(index,1);
                            }                               
                        };
}
