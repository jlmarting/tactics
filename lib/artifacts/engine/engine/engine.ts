import { AutoToken } from '../../../tokens/auto';
import { WireToken } from '../../../tokens/wire';
import { Projectile} from '../../../projectile/projectile';
import { Shooter } from '../../../tokens/shooter';

import { Scene } from '../../scene/scene';
import { IToken } from '../../../tokens/interfaces/itoken';
import { BulletProjectile } from '../../../projectile/bulletprojectile';

export class Engine{

    private scene: Scene;
    private mapkey: [];
        
    constructor(scene: Scene){
        this.scene = scene;
        this.mapkey = [];
    }
    

    
    public Start(){
            setInterval(function(){
                    this.resolver(1);
                    this.automat();}.bind(this), 16);
    }

    
    //Movimientos automáticos (autopilot, balas,...)
    public Automat(){        

        this.scene.deleteMarkedTokens();

        this.scene.getWorldTokens().forEach(

            t => {

                if (t instanceof AutoToken){   
                    let tk: AutoToken = t;                            
                    //self.orders.push({cmd:'autopilot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                    tk.autopilot(this.scene.getWorldTokens());                                
                    }
            
                if (t instanceof Projectile){    
                    
                    if (t instanceof BulletProjectile){                                                                           
                        //self.orders.push({cmd:'shot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                        let tk: BulletProjectile = t;                            
                        tk.shot(this.scene.getWorldTokens());                  
                    }                          
                }
                        
                //Prueba intersección wiretoken del token seleccionado en tiempo real           
                if((t instanceof WireToken)&&(t.id == this.scene.getSelectedToken().id)){
                    var iPoints = [];
                    this.scene.buffer.intersections = [];
                    for(var i = 0; i<this.scene.getWorldTokens().length;i++){
                        var element = this.scene.getWorldTokens()[i];
                        if(element instanceof WireToken){
                            let tk: WireToken = t;                            
                            iPoints = tk.getIntersections(element);
                        }                        
                        iPoints.forEach(e =>{console.log(e);this.scene.buffer.intersections.push(e)});
                    } 
                    //Pasamos los vértices al mensaje de la escena
                    this.scene.message = `# ${t.config.message} # ${t.id} Centro:-> [${t.x},${t.y}] Vértices: `;
                    t.points.forEach(element => {
                        this.scene.message = this.scene.message + `[${element.x} , ${element.y}] `;
                    });
                    

                }
                if (this.scene.buffer.intersections.length>0){
                    //Marcamos el token para indicar que hay colisión
                    t.config.enabled = false;
                }   
            }
        )   
        return window.performance.now();
    }


        // Resolver
        this.resolver = function(){
            //Ejecución de comandos de control sobre el token seleccionado
            let selectedToken = scene.arrTokens[scene.tokenIndex];

            self.mapkey.forEach(function(cmd){   
                
                let t = scene.arrTokens[scene.tokenIndex];
                //self.orders.push({cmd:cmd,id:t.id, displ: t.displ, timestamp: window.performance.now()});
    
    
                //tratamiento de comandos
                if(cmd=="fire"){
                    if( selectedToken instanceof Shooter){
                         const delta = engine.update(scene); // engine actualiza, calcula tiempo, etc.
    const renderTime = renderer.render(scene);
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

 const delta = engine.update(scene); // engine actualiza, calcula tiempo, etc.
    const renderTime = renderer.render(scene);

    
    

}