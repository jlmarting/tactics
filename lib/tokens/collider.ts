import { ImgToken } from './image.js';
import { Point } from '../point/point.js';
import { CursorPoint } from '../point/cursorpoint.js';
import { IToken } from './itoken.js';

/**
 * Clase Collider: Representa un colisionador circular.
 * Soporta jerarquía de sub-colisionadores para mayor precisión (fase rápida -> fase detallada).
 */
export class Collider extends CursorPoint {
    /** Radio del círculo de colisión. */
    radius: number;
    /** Lista de colisionadores internos más pequeños para mayor precisión. */
    subColliders: Array<Collider>;
    /** Historial de posiciones previas para realizar "rollback" en caso de impacto. */
    back: Array<{x: number, y: number, rad: number, time: number}>;

    /**
     * @param id Identificador único.
     * @param x Posición X.
     * @param y Posición Y.
     * @param rad Orientación.
     * @param r Radio del colisionador.
     */
    constructor(id: string, x: number, y: number, rad: number, r: number) {
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
    isCollisioning(otherCollider: Collider): boolean {
        if (this.config.enabled === false) return false;
        if (this.id === otherCollider.id) return false;

        if (!(otherCollider instanceof Collider)) return false;

        // Distancia euclídea entre centros
        const dx = this.x - otherCollider.x;
        const dy = this.y - otherCollider.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

        // El margen de colisión es la suma de los radios
        const diff = distance - (this.radius + otherCollider.radius);

        if (diff >= 0) {
            // No hay contacto entre los círculos envolventes
            return false;
        } else {
            // Hay contacto entre envolventes, verificamos precisión con sub-colisionadores
            if (this.subColliders.length === 0) {
                if (otherCollider.subColliders.length === 0) {
                    return true; // Ambos son hojas, hay colisión confirmada
                } else {
                    return otherCollider.subColliders.some(sc => this.isCollisioning(sc));
                }
            } else {
                if (otherCollider.subColliders.length === 0) {
                    return this.subColliders.some(sc => sc.isCollisioning(otherCollider));
                } else {
                    // Verificación cruzada de todas las hojas de ambos árboles de colisión
                    return this.subColliders.some(sc =>
                        otherCollider.subColliders.some(oc => sc.isCollisioning(oc))
                    );
                }
            }
        }
    }
    
    /**
     * Dada una lista de tokens, devuelve los IDs de aquellos que colisionan con este.
     */
    getCollisions(tokens: any[]) {
        if (!tokens || tokens.length === 0) return [];

        const collisions: string[] = [];
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
    moveCollider(cmd: string, displ: number, tokens?: any[]): Promise<{canMove: boolean, collisions: string[]}> {
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
            } else {
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
    draw(ctx: CanvasRenderingContext2D, lColor?: string, fColor?: string, offset?: {x: number, y: number}) {
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
        } else {
            this.subColliders.forEach(sc => sc.draw(ctx, undefined, undefined, offset));
        }
        ctx.restore();
    } 
}

/**
 * Clase ColliderToken: Especialización de ImgToken que incorpora un Collider.
 * El movimiento de este token está condicionado por los resultados de su colisionador.
 */
export class ColliderToken extends ImgToken {
    /** Instancia del colisionador asociado al token. */
    collider: Collider;

    constructor(id: string, x: number, y: number, rad: number, src: string, w: number, h: number) {
        super(id, x, y, rad, src, w, h);
        // El radio del colisionador se basa en el ancho de la imagen por defecto
        this.collider = new Collider(id, x, y, rad, w / 2);
        this.health = 1000;
    }

    /**
     * Sincroniza la posición del token y de su colisionador.
     */
    placeAt(x: number, y: number) {
        super.placeAt(Math.round(x), Math.round(y));
        this.collider.placeAt(x, y);
    }

    /**
     * Sobrescribe el método move para integrar la lógica de colisiones.
     * Solo actualiza la posición visual si el colisionador confirma que el camino está despejado.
     * En modo debug, actúa como un "pico" eliminando obstáculos y permitiendo el paso.
     */
    async move(cmd: string, displ: number, tokens?: any[], debugMode?: boolean): Promise<any> {
        const moveResult = await this.collider.moveCollider(cmd, displ, tokens);

        if (moveResult.canMove) {
            // El colisionador ya se movió, ahora sincronizamos el token visual
            return super.move(cmd, displ);
        } else if (debugMode && moveResult.collisions.length > 0) {
            // EFECTO PICO: Eliminamos los tokens con los que hemos colisionado
            moveResult.collisions.forEach(targetId => {
                const target = tokens?.find(t => t.id === targetId);
                if (target) {
                    target.delete = true; // Marcar para eliminación
                }
            });

            // Forzamos el movimiento ignorando la colisión que acabamos de "limpiar"
            super.move(cmd, displ);
            this.collider.placeAt(this.x, this.y); // Sincronizar colisionador manualmente

            return { canMove: true, collisions: [] };
        }

        return moveResult;
    }
}
