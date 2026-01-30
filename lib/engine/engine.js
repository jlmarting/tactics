"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const auto_1 = require("../tokens/auto");
const bulletprojectile_1 = require("../projectile/bulletprojectile");
const wire_1 = require("../tokens/wire");
const projectile_1 = require("../projectile/projectile");
const shooter_1 = require("../tokens/shooter");
const tactics_1 = require("../tactics");
/**
 * Clase Engine: Corazón lógico del motor de juego.
 * Gestiona el ciclo de actualización (logic loop), la resolución de comandos
 * y la automatización de objetos (balas, IA simple).
 */
class Engine {
    /**
     * @param scene Instancia de Scene que el motor debe procesar.
     */
    constructor(scene) {
        this.scene = scene;
        this.mapkey = [];
    }
    /**
     * Inicia el ciclo lógico del motor con un intervalo fijo de 16ms (~60 FPS).
     */
    start() {
        setInterval(() => {
            this.resolver();
            this.automat();
        }, 16);
    }
    /**
     * Ciclo de automatización: Procesa comportamientos autónomos de los tokens.
     * - Elimina tokens marcados para borrado.
     * - Actualiza pilotos automáticos (AutoToken).
     * - Actualiza trayectoria de proyectiles.
     * - Verifica intersecciones de WireTokens seleccionados.
     */
    automat() {
        this.scene.arrTokens.forEach((t) => {
            // Gestión de eliminación
            if (t.delete) {
                const tokenIndex = this.scene.arrTokens.findIndex((element) => element.id === t.id);
                this.scene.arrTokens.splice(tokenIndex, 1);
                // Ajustamos el índice de selección si es necesario
                this.scene.tokenIndex = this.scene.arrTokens.findIndex((element) => element.id === this.scene.tokenId);
            }
            // Comportamiento de IA / Piloto automático
            if (t instanceof auto_1.AutoToken) {
                t.autopilot(this.scene.arrTokens);
            }
            // Lógica de proyectiles
            if (t instanceof projectile_1.Projectile) {
                if (t instanceof bulletprojectile_1.BulletProjectile) {
                    t.shot(this.scene.arrTokens);
                }
            }
            // Prueba de intersecciones en tiempo real para el WireToken seleccionado
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
                // Actualizar mensaje de depuración con vértices
                this.scene.message = `# ${t.config.message} # ${t.id} Centro:-> [${t.x},${t.y}] Vértices: `;
                t.points.forEach(element => {
                    this.scene.message += `[${element.x} , ${element.y}] `;
                });
            }
            // Desactivar temporalmente si hay colisión detectada en buffer
            if (this.scene.buffer.intersections.length > 0) {
                t.config.enabled = false;
            }
        });
        return window.performance.now();
    }
    /**
     * Ciclo de resolución: Ejecuta los comandos de la pila mapkey sobre el token seleccionado.
     * Se encarga del movimiento controlado por el usuario y de la acción de disparo.
     */
    resolver() {
        const selectedToken = this.scene.arrTokens[this.scene.tokenIndex];
        this.mapkey.forEach((cmd) => {
            if (cmd === "fire") {
                // El comando fire solo es válido para tokens tipo Shooter
                if (selectedToken instanceof shooter_1.Shooter) {
                    const bullet = selectedToken.shot();
                    if (bullet instanceof bulletprojectile_1.BulletProjectile) {
                        // Asignamos el efecto actual configurado en la escena a la bala
                        bullet.effect = tactics_1.Effects[this.scene.config.effect];
                        this.scene.arrTokens.push(bullet);
                    }
                    else {
                        this.scene.engineInfo = `scene.fire -> recargando/sin balas`;
                    }
                }
            }
            else {
                // Comandos de movimiento
                this.scene.engineInfo = `scene.move -> ${cmd} `;
                if (selectedToken && typeof selectedToken.move === 'function') {
                    // El movimiento puede estar condicionado por colisiones si el token las soporta
                    selectedToken.move(cmd, selectedToken.displ, this.scene.arrTokens);
                }
            }
        });
        return window.performance.now();
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map