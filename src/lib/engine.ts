//@ts-nocheck
import {AutoToken} from './tokens/auto';
import {Shooter} from './tokens/shooter';
import {Projectile} from './tokens/projectile';
import {WireToken} from './tokens/wire';


export class Engine {

    constructor(scene) {

        this.scene = scene;
        this.mapkey = [];

        this.start = function () {
            setInterval(function () {
                this.resolver(1);
                this.automat();
            }.bind(this), 16);
        }

        var self = this;

        //Movimientos automáticos (autopilot, balas,...)
        this.automat = function () {
            scene.arrTokens.forEach(function (t) {  //Según el tipo de token realizaremos unas u otras opciones                                                                  

                if (t.delete) {
                    var tokenIndex = scene.arrTokens.findIndex(function (element) {
                        return element.id == t.id;
                    });
                    scene.arrTokens.splice(tokenIndex, 1);
                    scene.tokenIndex = scene.arrTokens.findIndex(function (element) {
                        return element.id == scene.tokenId;
                    });
                }



                if (t instanceof AutoToken) {
                    //self.orders.push({cmd:'autopilot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                    t.autopilot(scene.arrTokens);
                }

                if (t instanceof Projectile) {

                    if (t instanceof BulletProjectile) {
                        //self.orders.push({cmd:'shot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                        var d = t.shot(scene.arrTokens);
                    }
                }


                //Prueba intersección wiretoken del token seleccionado en tiempo real           
                let selToken = scene.getSelectedToken();

                if ((t instanceof WireToken)&&(typeof selToken != 'undefined')) {

                    if (t.id == selToken.id) {
                        var iPoints = [];
                        scene.buffer.intersections = [];
                        for (var i = 0; i < scene.arrTokens.length; i++) {
                            var element = scene.arrTokens[i];
                            if (element instanceof WireToken) {
                                iPoints = t.getIntersections(element);
                            }
                            iPoints.forEach(e => { console.log(e); scene.buffer.intersections.push(e) });
                        }
                        //Pasamos los vértices al mensaje de la escena
                        scene.message = `# ${t.config.message} # ${t.id} Centro:-> [${t.x},${t.y}] Vértices: `;
                        t.points.forEach(element => {
                            scene.message = scene.message + `[${element.x} , ${element.y}] `;
                        });
                    }

                }
                if (scene.buffer.intersections.length > 0) {
                    //Marcamos el token para indicar que hay colisión
                    t.config.enabled = false;
                }

            });


            return window.performance.now();
        }


    }

     // Resolver
     resolver = function(){
        //Ejecución de comandos de control sobre el token seleccionado
        let selectedToken = scene.arrTokens[scene.tokenIndex];

        self.mapkey.forEach(function(cmd){   
            
            let t = scene.arrTokens[scene.tokenIndex];
            //self.orders.push({cmd:cmd,id:t.id, displ: t.displ, timestamp: window.performance.now()});


            //tratamiento de comandos
            if(cmd=="fire"){
                if( selectedToken instanceof Shooter){
                    
                    var bullet = selectedToken.shot();
                    
                    if(bullet instanceof BulletProjectile){                      
                        bullet.effect = Effects[theScene.config.effect];
                        scene.arrTokens.push(bullet);                
                    }else{
                        scene.engineInfo = `scene.fire -> ${JSON.stringify(bullet)} recargando/sin balas`;
                    }
                }
                
            }
            else{
                scene.engineInfo = `scene.move -> ${cmd} `;              
                selectedToken.move(cmd, selectedToken.displ,scene.arrTokens);                
                
            } 
        });
        return window.performance.now();
    }
}



