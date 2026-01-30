"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const auto_1 = require("../tokens/auto");
const bulletprojectile_1 = require("../projectile/bulletprojectile");
const wire_1 = require("../tokens/wire");
const projectile_1 = require("../projectile/projectile");
const shooter_1 = require("../tokens/shooter");
const tactics_1 = require("../tactics");
class Engine {
    constructor(scene) {
        this.scene = scene;
        this.mapkey = [];
    }
    start() {
        setInterval(() => {
            this.resolver();
            this.automat();
        }, 16);
    }
    // Movimientos automáticos (autopilot, balas,...)
    automat() {
        this.scene.arrTokens.forEach((t) => {
            if (t.delete) {
                const tokenIndex = this.scene.arrTokens.findIndex((element) => element.id === t.id);
                this.scene.arrTokens.splice(tokenIndex, 1);
                this.scene.tokenIndex = this.scene.arrTokens.findIndex((element) => element.id === this.scene.tokenId);
            }
            if (t instanceof auto_1.AutoToken) {
                t.autopilot(this.scene.arrTokens);
            }
            if (t instanceof projectile_1.Projectile) {
                if (t instanceof bulletprojectile_1.BulletProjectile) {
                    t.shot(this.scene.arrTokens);
                }
            }
            // Prueba intersección wiretoken del token seleccionado en tiempo real
            const selectedToken = this.scene.getSelectedToken();
            if (t instanceof wire_1.WireToken && selectedToken && t.id === selectedToken.id) {
                this.scene.buffer.intersections = [];
                for (let i = 0; i < this.scene.arrTokens.length; i++) {
                    const element = this.scene.arrTokens[i];
                    if (element instanceof wire_1.WireToken && element !== t) {
                        const iPoints = t.getIntersections(element);
                        iPoints.forEach((e) => this.scene.buffer.intersections.push(e));
                    }
                }
                // Pasamos los vértices al mensaje de la escena
                this.scene.message = `# ${t.config.message} # ${t.id} Centro:-> [${t.x},${t.y}] Vértices: `;
                t.points.forEach(element => {
                    this.scene.message += `[${element.x} , ${element.y}] `;
                });
            }
            if (this.scene.buffer.intersections.length > 0) {
                // Marcamos el token para indicar que hay colisión
                t.config.enabled = false;
            }
        });
        return window.performance.now();
    }
    // Resolver
    resolver() {
        const selectedToken = this.scene.arrTokens[this.scene.tokenIndex];
        this.mapkey.forEach((cmd) => {
            if (cmd === "fire") {
                if (selectedToken instanceof shooter_1.Shooter) {
                    const bullet = selectedToken.shot();
                    if (bullet instanceof bulletprojectile_1.BulletProjectile) {
                        bullet.effect = tactics_1.Effects[this.scene.config.effect];
                        this.scene.arrTokens.push(bullet);
                    }
                    else {
                        this.scene.engineInfo = `scene.fire -> recargando/sin balas`;
                    }
                }
            }
            else {
                this.scene.engineInfo = `scene.move -> ${cmd} `;
                if (selectedToken && typeof selectedToken.move === 'function') {
                    selectedToken.move(cmd, selectedToken.displ, this.scene.arrTokens);
                }
            }
        });
        return window.performance.now();
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map