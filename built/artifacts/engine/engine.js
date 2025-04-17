import { AutoToken } from '../../lib/components/tokens/2d/auto.js';
import { Shooter } from '../../lib/components/tokens/2d/shooter.js';
import { Projectile } from '../../lib/components/tokens/2d/projectile.js';
import { WireToken } from '../../lib/components/poligons/2d/wire.js';
import { BulletProjectile } from '../../lib/components/tokens/2d/bulletprojectile.js';
import { KeyCmd } from '../control/control.js';
export class Engine {
    constructor(scene) {
        this.scene = scene;
        this.mapkey = [];
    }
    automat() {
        let scene = this.scene;
        scene.sceneTokens = scene.sceneTokens.filter(t => !t.delete);
        scene.sceneTokens.forEach(function (t) {
            if (t instanceof AutoToken) {
                t.autopilot(scene.sceneTokens);
            }
            if (t instanceof Projectile) {
                if (t instanceof BulletProjectile) {
                    var d = t.shot(scene.sceneTokens);
                }
            }
            let selToken = scene.getSelectedToken();
            if ((t instanceof WireToken) && (typeof selToken != 'undefined')) {
                if (t.id == selToken.id) {
                    let iPoints = [];
                    scene.buffer.intersections = [];
                    for (var i = 0; i < scene.sceneTokens.length; i++) {
                        var element = scene.sceneTokens[i];
                        if (element instanceof WireToken) {
                            iPoints = t.getIntersections(element);
                        }
                        iPoints.forEach(e => { console.log(e); scene.buffer.intersections.push(e); });
                    }
                    scene.message = `# ${t.config.message} # ${t.id} Centro:-> [${t.x},${t.y}] Vértices: `;
                    t.points.forEach(element => {
                        scene.message = scene.message + `[${element.x} , ${element.y}] `;
                    });
                }
            }
            if (scene.buffer.intersections.length > 0) {
                t.config.enabled = false;
            }
        });
        return window.performance.now();
    }
    ;
    start() {
        setInterval(function () {
            this.resolve();
            this.automat();
        }.bind(this), 16);
    }
    ;
    resolve() {
        let selectedToken = this.scene.sceneTokens[this.scene.tokenIndex];
        this.mapkey.forEach(function (cmd) {
            let t = this.scene.arrTokens[this.scene.tokenIndex];
            if (cmd == KeyCmd.FIRE) {
                if (selectedToken instanceof Shooter) {
                    var bullet = selectedToken.shot();
                    if (bullet instanceof BulletProjectile) {
                        this.scene.arrTokens.push(bullet);
                    }
                    else {
                        this.scene.engineInfo = `scene.fire -> ${JSON.stringify(bullet)} recargando/sin balas`;
                    }
                }
            }
            else {
                this.scene.engineInfo = `scene.move -> ${cmd} `;
                let s = selectedToken;
                s.move(cmd, s.displ);
            }
        }.bind(this));
        return window.performance.now();
    }
    ;
    ;
}
//# sourceMappingURL=engine.js.map