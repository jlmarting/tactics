import { AutoToken } from '../tokens/auto.js';
import { BulletProjectile } from '../projectile/bulletprojectile.js';
import { WireToken } from '../tokens/wire.js';
import { Projectile } from '../projectile/projectile.js';
import { Shooter } from '../tokens/shooter.js';
import { Effects } from '../tactics.js';
import { IToken } from '../tokens/itoken.js';

/**
 * Clase Engine: Motor lógico independiente que gestiona las reglas del juego.
 *
 * Se encarga de:
 * 1. Procesar la inteligencia artificial de los tokens (pilotos automáticos).
 * 2. Gestionar la vida de los proyectiles y sus efectos de impacto.
 * 3. Resolver la pila de comandos de entrada del usuario.
 * 4. Realizar cálculos costosos como intersecciones complejas fuera del bucle de dibujo.
 */
export class Engine {
    /** Instancia de la escena sobre la que opera el motor. */
    scene: any;

    /** Lista de comandos pendientes de ejecución (ej: 'up', 'fire'). */
    mapkey: string[];

    /**
     * @param scene La escena que contiene los datos del mundo.
     */
    constructor(scene: any) {
        this.scene = scene;
        this.mapkey = [];
    }

    /**
     * Arranca el bucle lógico del motor.
     * Utiliza un intervalo de 16ms para mantener una lógica constante e independiente del renderizado.
     */
    start() {
        setInterval(() => {
            this.resolver(); // Procesa entrada del usuario
            this.automat();  // Procesa comportamientos autónomos
        }, 16);
    }

    /**
     * Ejecuta comportamientos programados o automáticos de los tokens en la escena.
     */
    automat() {
        this.scene.arrTokens.forEach((t: IToken) => {
            // Eliminar tokens marcados para destrucción (limpieza de memoria)
            if (t.delete) {
                const tokenIndex = this.scene.arrTokens.findIndex((element: any) => element.id === t.id);
                this.scene.arrTokens.splice(tokenIndex, 1);
                // Sincronizar el índice de selección de la escena
                this.scene.tokenIndex = this.scene.arrTokens.findIndex((element: any) => element.id === this.scene.tokenId);
            }

            // Actualizar tokens con piloto automático
            if (t instanceof AutoToken) {
                t.autopilot(this.scene.arrTokens);
            }

            // Actualizar trayectoria y colisión de proyectiles
            if (t instanceof Projectile) {
                if (t instanceof BulletProjectile) {
                    t.shot(this.scene.arrTokens);
                }
            }

            // Lógica experimental de intersección en tiempo real para WireTokens seleccionados
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

                // Actualizar el mensaje de estado con la posición de los vértices
                this.scene.message = `# ${t.config.message} # ${t.id} Centro:-> [${t.x},${t.y}] Vértices: `;
                t.points.forEach(element => {
                    this.scene.message += `[${element.x} , ${element.y}] `;
                });
            }

            // Si hay muchas intersecciones, desactivamos el token para indicar colisión visualmente
            if (this.scene.buffer.intersections.length > 0) {
                t.config.enabled = false;
            }
        });

        return window.performance.now();
    }

    /**
     * Resuelve los comandos de la entrada del usuario aplicándolos al token activo.
     */
    resolver() {
        const selectedToken = this.scene.arrTokens[this.scene.tokenIndex];

        this.mapkey.forEach((cmd) => {
            if (cmd === "fire") {
                // Solo los Shooter pueden disparar
                if (selectedToken instanceof Shooter) {
                    const bullet = selectedToken.shot();
                    if (bullet instanceof BulletProjectile) {
                        // Inyectar el efecto de proyectil configurado globalmente
                        bullet.effect = Effects[this.scene.config.effect];
                        this.scene.arrTokens.push(bullet);
                    } else {
                        this.scene.engineInfo = `scene.fire -> recargando/sin balas`;
                    }
                }
            } else {
                // Comandos de movimiento ('up', 'down', 'left', 'right')
                this.scene.engineInfo = `scene.move -> ${cmd} `;
                if (selectedToken && typeof selectedToken.move === 'function') {
                    // El movimiento se delega al objeto, pasando la lista de tokens para verificar colisiones
                    selectedToken.move(cmd, selectedToken.displ, this.scene.arrTokens);
                }
            }
        });
        return window.performance.now();
    }
}
