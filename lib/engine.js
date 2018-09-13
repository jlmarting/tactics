const Engine = function(scene){

        this.scene = scene;
        this.mapkey = [];
        this.start = function(){
                setInterval(function(){
                        this.resolver(1);
                        this.automat();}.bind(this), 16);
        }
        var self = this;

        //Movimientos automáticos (autopilot, balas,...)
        this.automat = function(){
            scene.arrTokens.forEach(function(t){  //Según el tipo de token realizaremos unas u otras opciones                                                                  
                
                            
                if (t instanceof AutoToken){                               
                    //self.orders.push({cmd:'autopilot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                    t.autopilot(scene.arrTokens);                                
                }
                
                if (t instanceof Projectile){    
                    
                    if (t instanceof BulletProjectile){                                                                           
                        //self.orders.push({cmd:'shot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                        var d = t.shot(scene.arrTokens);                  
                    }                          
                }
            });        
            return window.performance.now();
        }


        // Resolver
        this.resolver = function(){
            //Ejecución de comandos de control sobre el token seleccionado
            self.mapkey.forEach(function(cmd){   
                
                let t = scene.arrTokens[scene.tokenIndex];
                //self.orders.push({cmd:cmd,id:t.id, displ: t.displ, timestamp: window.performance.now()});
    
    
                //tratamiento de comandos
                if(cmd=="fire"){
                    if(scene.arrTokens[scene.tokenIndex] instanceof Shooter){
                        
                        var bullet = scene.arrTokens[scene.tokenIndex].shot(self.effects.damage);
                        if(bullet instanceof Point){                      
                            scene.arrTokens.push(bullet);                
                        }else{
                            //console.log(`scene.fire -> ${JSON.stringify(bullet)} recargando/sin balas`);
                        }
                    }
                    
                }
                else{              
                    scene.arrTokens[scene.tokenIndex].move(cmd, scene.arrTokens[scene.tokenIndex].displ,scene.arrTokens);                
                    
                } 
            });
            return window.performance.now();
        }



    // Effects: funciones de efectos de impacto    
    this.effects = {};
    this.effects.damage = function(tokenHitted,bullet){
            tokenHitted.health -= Math.round(Math.random()*250);
            let hitTime = window.performance.now()-bullet.startTime;
            let hitDistance = bullet.originalRange - bullet.range;
            console.log(`Tiempo de impacto de ${bullet.id} en ${tokenHitted.id}: ${hitTime}ms`+
            `  ${hitDistance}px vel: ${Math.round((hitDistance/hitTime)*1000)}px/s`);
            if (tokenHitted.health<=0){
                var tokenIndex = scene.arrTokens.findIndex(function(element){
                    return element.id == tokenHitted.id;
                });                                                                   
                scene.arrTokens.splice(tokenIndex,1);
                scene.tokenIndex = scene.arrTokens.findIndex(function(element){
                    return element.id == scene.tokenId;
                });
            }    
    }

    


  
        

}