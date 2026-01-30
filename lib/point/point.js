"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
/**
 * Clase Point: Representa una coordenada bidimensional (X, Y) en el mapa.
 * Es la base de todos los objetos espaciales del motor.
 */
class Point {
    /**
     * @param x Posición X inicial.
     * @param y Posición Y inicial.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.info = "";
        this.startTime = window.performance.now();
        this.id = 'point_' + this.startTime;
        this.config = { position: 'relative', color: 'red', viewName: false };
    }
    /**
     * Posiciona el punto en una nueva coordenada redondeada.
     */
    placeAt(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
    /**
     * Devuelve las coordenadas actuales del centro del punto.
     */
    getCenter() {
        return { "x": Math.round(this.x), "y": Math.round(this.y) };
    }
    /**
     * Calcula la posición relativa a un desplazamiento (offset) dado.
     * Se usa para traducir coordenadas del mapa a coordenadas de pantalla (canvas)
     * basándose en la posición de la cámara (escena).
     * @param offset Objeto {x, y} que representa la posición de la cámara.
     */
    getRelPos(offset) {
        if (offset) {
            return { x: Math.round(this.x + offset.x), y: Math.round(this.y + offset.y) };
        }
        return { x: Math.round(this.x), y: Math.round(this.y) };
    }
    /**
     * Dibuja el punto en el contexto de canvas.
     * @param ctx Contexto 2D del canvas.
     * @param lColor Color de línea (opcional).
     * @param fColor Color de relleno (opcional).
     * @param offset Desplazamiento de cámara para posicionamiento relativo.
     */
    draw(ctx, lColor, fColor, offset) {
        if (!ctx)
            return;
        // Prioridad de color: config.color > parámetros pasados > valores por defecto
        if (this.config.color !== undefined) {
            lColor = "white";
            fColor = this.config.color;
        }
        else {
            lColor = lColor || "red";
            fColor = fColor || "white";
        }
        ctx.beginPath();
        ctx.strokeStyle = lColor;
        ctx.fillStyle = fColor;
        // Calculamos la posición donde realmente se debe pintar en el canvas
        const pos = this.getRelPos(offset);
        if (this.config.position === 'relative') {
            // Dibujar un pequeño cuadrado y su coordenada informativa
            ctx.fillRect(pos.x, pos.y, 4, 4);
            if (this.config.viewName) {
                ctx.fillText('*(' + Math.round(this.x) + ',' + Math.round(this.y) + ')', pos.x, pos.y);
            }
        }
        else {
            // Posicionamiento absoluto (ignora offset)
            ctx.fillRect(this.x, this.y, 2, 2);
            ctx.fillText('**(' + this.x + ',' + this.y + ')', Math.round(this.x), Math.round(this.y));
        }
        ctx.stroke();
    }
}
exports.Point = Point;
//# sourceMappingURL=point.js.map