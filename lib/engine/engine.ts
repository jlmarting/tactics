import { AutoToken } from '../tokens/auto';
import { BulletProjectile } from '../projectile/bulletprojectile';
import { WireToken } from '../tokens/wire';
import { Projectile } from '../projectile/projectile';
import { Shooter } from '../tokens/shooter';
import { Effects } from '../tactics';
import { IToken } from '../tokens/itoken';

export class Engine {
    scene: any;
    mapkey: string[];

    constructor(scene: any) {
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
        this.scene.arrTokens.forEach((t: IToken) => {
            if (t.delete) {
                const tokenIndex = this.scene.arrTokens.findIndex((element: any) => element.id === t.id);
                this.scene.arrTokens.splice(tokenIndex, 1);
                this.scene.tokenIndex = this.scene.arrTokens.findIndex((element: any) => element.id === this.scene.tokenId);
            }

            if (t instanceof AutoToken) {
                t.autopilot(this.scene.arrTokens);
            }

            if (t instanceof Projectile) {
                if (t instanceof BulletProjectile) {
                    t.shot(this.scene.arrTokens);
                }
            }

            // Prueba intersección wiretoken del token seleccionado en tiempo real
            const selectedToken = this.scene.getSelectedToken();
            if (t instanceof WireToken && selectedToken && t.id === selectedToken.id) {
                this.scene.buffer.intersections = [];
                for (let i = 0; i < this.scene.arrTokens.length; i++) {
                    const element = this.scene.arrTokens[i];
                    if (element instanceof WireToken && element !== t) {
                        const iPoints = t.getIntersections(element);
                        iPoints.forEach((e: any) => this.scene.buffer.intersections.push(e));
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
                if (selectedToken instanceof Shooter) {
                    const bullet = selectedToken.shot();
                    if (bullet instanceof BulletProjectile) {
                        bullet.effect = Effects[this.scene.config.effect];
                        this.scene.arrTokens.push(bullet);
                    } else {
                        this.scene.engineInfo = `scene.fire -> recargando/sin balas`;
                    }
                }
            } else {
                this.scene.engineInfo = `scene.move -> ${cmd} `;
                if (selectedToken && typeof selectedToken.move === 'function') {
                    selectedToken.move(cmd, selectedToken.displ, this.scene.arrTokens);
                }
            }
        });
        return window.performance.now();
    }
}
