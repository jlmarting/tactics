"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColliderToken = exports.Collider = void 0;
const image_1 = require("./image");
const cursorpoint_1 = require("../point/cursorpoint");
/**
 * Clase Collider: Representa un colisionador circular.
 * Soporta jerarquía de sub-colisionadores para mayor precisión (fase rápida -> fase detallada).
 */
class Collider extends cursorpoint_1.CursorPoint {
    /**
     * @param id Identificador único.
     * @param x Posición X.
     * @param y Posición Y.
     * @param rad Orientación.
     * @param r Radio del colisionador.
     */
    constructor(id, x, y, rad, r) {
        super(x, y, rad);
        this.id = id;
        this.radius = r;
        this.subColliders = [];
        this.config = { enabled: true, visible: true, innerColor: "rgba(255, 255, 15, 0.60)", borderColor: "magenta", borderWidth: 5 };
        this.back = [];
    }
    /**
     * Añade un sub-colisionador concéntrico de la mitad de tamaño.
     */
    addSubCollider() {
        const id = this.id + '_sc_' + this.subColliders.length;
        const sc = new Collider(id, this.x, this.y, this.rad, this.radius / 2);
        this.subColliders.push(sc);
    }
    /**
     * Obtiene el ID del token padre (eliminando el sufijo de sub-colisionador).
     */
    getParentId() {
        return this.id.split('_sc_')[0];
    }
    /**
     * Verifica si colisiona con otro objeto Collider.
     * Implementa un algoritmo recursivo que primero chequea el círculo envolvente
     * y luego baja a los sub-colisionadores si existen.
     */
    isCollisioning(otherCollider) {
        if (this.config.enabled === false)
            return false;
        if (this.id === otherCollider.id)
            return false;
        if (!(otherCollider instanceof Collider))
            return false;
        // Distancia euclídea entre centros
        const dx = this.x - otherCollider.x;
        const dy = this.y - otherCollider.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        // El margen de colisión es la suma de los radios
        const diff = distance - (this.radius + otherCollider.radius);
        if (diff >= 0) {
            // No hay contacto entre los círculos envolventes
            return false;
        }
        else {
            // Hay contacto entre envolventes, verificamos precisión con sub-colisionadores
            if (this.subColliders.length === 0) {
                if (otherCollider.subColliders.length === 0) {
                    return true; // Ambos son hojas, hay colisión confirmada
                }
                else {
                    return otherCollider.subColliders.some(sc => this.isCollisioning(sc));
                }
            }
            else {
                if (otherCollider.subColliders.length === 0) {
                    return this.subColliders.some(sc => sc.isCollisioning(otherCollider));
                }
                else {
                    // Verificación cruzada de todas las hojas de ambos árboles de colisión
                    return this.subColliders.some(sc => otherCollider.subColliders.some(oc => sc.isCollisioning(oc)));
                }
            }
        }
    }
    /**
     * Dada una lista de tokens, devuelve los IDs de aquellos que colisionan con este.
     */
    getCollisions(tokens) {
        if (!tokens || tokens.length === 0)
            return [];
        const collisions = [];
        for (let i = 0; i < tokens.length; i++) {
            const currCollider = tokens[i].collider;
            if (currCollider !== undefined) {
                if (this.isCollisioning(currCollider)) {
                    collisions.push(tokens[i].id);
                }
            }
        }
        return collisions;
    }
    /**
     * Mueve el colisionador y verifica si la nueva posición es válida (sin colisiones).
     * Si detecta colisión, revierte el movimiento.
     */
    moveCollider(cmd, displ, tokens) {
        return new Promise((resolve) => {
            if (this.back === undefined) {
                resolve({ canMove: false, collisions: [] });
                return;
            }
            // Guardamos posición actual por si hay que revertir
            this.back.push({ x: this.x, y: this.y, rad: this.rad, time: window.performance.now() });
            // Ejecutamos el movimiento hipotético
            super.move(cmd, displ);
            if (this.subColliders.length > 0) {
                this.subColliders.forEach(sc => {
                    sc.moveCollider(cmd, displ);
                });
            }
            // Verificamos si en la nueva posición hay colisiones
            const collisions = tokens ? this.getCollisions(tokens) : [];
            if (collisions.length > 0) {
                // Hay colisión: Realizamos ROLLBACK
                const pos = this.back.pop();
                if (pos) {
                    this.rad = pos.rad;
                    this.placeAt(pos.x, pos.y);
                }
                if (this.subColliders.length > 0) {
                    this.subColliders.forEach(sc => {
                        const possc = sc.back.pop();
                        if (possc) {
                            sc.placeAt(possc.x, possc.y);
                            sc.rad = possc.rad;
                        }
                    });
                }
                resolve({ canMove: false, collisions: collisions });
            }
            else {
                // Posición válida: Mantenemos el movimiento
                if (this.back.length > 350) {
                    this.back.shift(); // Limitar historial para ahorrar memoria
                }
                resolve({ canMove: true, collisions: collisions });
            }
        });
    }
    /**
     * Dibuja la representación visual del colisionador (círculo magenta).
     */
    draw(ctx, lColor, fColor, offset) {
        ctx.save();
        const pos = this.getRelPos(offset);
        ctx.beginPath();
        ctx.lineWidth = this.config.borderWidth;
        ctx.strokeStyle = this.config.borderColor;
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        if (this.subColliders.length === 0) {
            ctx.fillStyle = this.config.innerColor;
            ctx.fill();
        }
        else {
            this.subColliders.forEach(sc => sc.draw(ctx, undefined, undefined, offset));
        }
        ctx.restore();
    }
}
exports.Collider = Collider;
/**
 * Clase ColliderToken: Especialización de ImgToken que incorpora un Collider.
 * El movimiento de este token está condicionado por los resultados de su colisionador.
 */
class ColliderToken extends image_1.ImgToken {
    constructor(id, x, y, rad, src, w, h) {
        super(id, x, y, rad, src, w, h);
        // El radio del colisionador se basa en el ancho de la imagen por defecto
        this.collider = new Collider(id, x, y, rad, w / 2);
        this.health = 1000;
    }
    /**
     * Sincroniza la posición del token y de su colisionador.
     */
    placeAt(x, y) {
        super.placeAt(Math.round(x), Math.round(y));
        this.collider.placeAt(x, y);
    }
    /**
     * Sobrescribe el método move para integrar la lógica de colisiones.
     * Solo actualiza la posición visual si el colisionador confirma que el camino está despejado.
     */
    move(cmd, displ, tokens) {
        const _super = Object.create(null, {
            move: { get: () => super.move }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const moveResult = yield this.collider.moveCollider(cmd, displ, tokens);
            if (moveResult.canMove) {
                // El colisionador ya se movió, ahora sincronizamos el token visual
                return _super.move.call(this, cmd, displ);
            }
            return moveResult;
        });
    }
}
exports.ColliderToken = ColliderToken;
//# sourceMappingURL=collider.js.map