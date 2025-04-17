import { AutoToken } from '../../lib/components/tokens/2d/auto.js';
import { Shooter } from '../../lib/components/tokens/2d/shooter.js';
import { Projectile, Effect } from '../../lib/components/tokens/2d/projectile.js';
import { WireToken } from '../../lib/components/poligons/2d/wire.js';
import { IToken2D } from '../../lib/interfaces/IToken2D.js';
import { Scene } from '../scene/scene.js';
import { Token2D } from '../../lib/components/tokens/2d/Token2D.js';
import { BulletProjectile } from '../../lib/components/tokens/2d/bulletprojectile.js';
import { ImgToken } from '../../lib/components/tokens/2d/image.js';
import { Token2DCursor } from '../../lib/components/tokens/2d/Token2DCursor.js';
import { KeyCmd } from '../control/control.js';


export class Engine {

    scene: Scene;
    mapkey: KeyCmd[];
    automat() {
        //Movimientos automáticos (autopilot, balas,...)
        let scene = this.scene;

        scene.sceneTokens = scene.sceneTokens.filter(t=> !t.delete);

        scene.sceneTokens.forEach(function (t: IToken2D) {
            
            // try {
            //     if (t.delete) {
            //         var tokenIndex = scene.arrTokens.findIndex(function (element) {
            //             return element.id == t.id;
            //         });
            //         scene.arrTokens.splice(tokenIndex, 1);
            //         scene.tokenIndex = scene.arrTokens.findIndex(function (element) {
            //             return element.id == scene.tokenId;
            //         });
            //     }
            // } catch (error) {
            //     console.log(`automat: ${error} ${typeof (t)}`);
            // }

            if (t instanceof AutoToken) {
                //self.orders.push({cmd:'autopilot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                t.autopilot(scene.sceneTokens);
            }

            if (t instanceof Projectile) {

                if (t instanceof BulletProjectile) {
                    //self.orders.push({cmd:'shot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                    var d = t.shot(scene.sceneTokens);
                }
            }


            //Prueba intersección wiretoken del token seleccionado en tiempo real           
            let selToken = scene.getSelectedToken();

            if ((t instanceof WireToken) && (typeof selToken != 'undefined')) {

                if (t.id == selToken.id) {
                    let iPoints: any[] = [];
                    scene.buffer.intersections = [];
                    for (var i = 0; i < scene.sceneTokens.length; i++) {
                        var element = scene.sceneTokens[i];
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

        })
        return window.performance.now();
    };

    start() {
        setInterval(function () {
            this.resolve();
            this.automat();
        }.bind(this), 16);
    };

    resolve() {
        //Ejecución de comandos de control sobre el token seleccionado
        let selectedToken = this.scene.sceneTokens[this.scene.tokenIndex];

            this.mapkey.forEach(function (cmd: KeyCmd) {

            let t = this.scene.arrTokens[this.scene.tokenIndex];
            
            //self.orders.push({cmd:cmd,id:t.id, displ: t.displ, timestamp: window.performance.now()});


            //tratamiento de comandos
            if (cmd == KeyCmd.FIRE) {
                if (selectedToken instanceof Shooter) {

                    var bullet = selectedToken.shot();

                    if (bullet instanceof BulletProjectile) {
                        //bullet.effect = Effects[this.scene.config.effect];
                        this.scene.arrTokens.push(bullet);
                    } else {
                        this.scene.engineInfo = `scene.fire -> ${JSON.stringify(bullet)} recargando/sin balas`;
                    }
                }

            }
            else {
                this.scene.engineInfo = `scene.move -> ${cmd} `;
                let s = <Token2DCursor>selectedToken;
                s.move(cmd, s.displ);

            }
        }.bind(this));
        return window.performance.now();
    };



    constructor(scene: Scene) {

        this.scene = scene;
        this.mapkey = [];

    };
}