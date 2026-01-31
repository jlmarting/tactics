import { Point } from "./point.js";

/**
 * Clase CursorPoint: Extiende Point para añadirle capacidades de orientación (radianes)
 * y lógica de movimiento tipo "tanque" o cursor.
 * El movimiento se basa en una dirección (radianes) y una magnitud de desplazamiento.
 */
export class CursorPoint extends Point {
    /** Dirección actual del punto en radianes. */
    rad: number;
    /** Incremento de rotación en grados por cada comando de giro. */
    incrGrad: number;
    /** Velocidad de desplazamiento base. */
    displ: number;
    /** Valor calculado de radianes por cada paso de rotación (basado en incrGrad). */
    grad: number;
    /** Historial de posiciones (opcional). */
    path: Array<Point>;

    /**
     * @param x Posición X inicial.
     * @param y Posición Y inicial.
     * @param rad Rotación inicial en radianes.
     */
    constructor(x: number, y: number, rad: number) {
        super(x, y);
        this.rad = rad;
        this.incrGrad = 10;
        this.displ = 1;
        // Conversión de grados a radianes para los incrementos de giro
        this.grad = (Math.PI / 180) * this.incrGrad;
        this.path = [];
        this.config.borderColor = 'cyan';
        this.config.borderWidth = 1;
    }

    /**
     * Actualiza la posición o rotación basada en un comando.
     * @param cmd Comando ('left', 'right', 'up', 'down').
     * @param displ Magnitud del movimiento (píxeles).
     * @returns Objeto con el desglose del movimiento realizado.
     */
    move(cmd: string, displ: number) {
        switch (cmd) {
            case "left":
                // Girar a la izquierda (disminuir radianes)
                this.rad -= this.grad;
                displ = 0;
                break;
            case "right":
                // Girar a la derecha (aumentar radianes)
                this.rad += this.grad;
                displ = 0;
                break;
            case "up":
                // Mover hacia adelante en la dirección actual
                break;
            case "down":
                // Mover hacia atrás (magnitud negativa)
                displ = -displ;
                break;
        }

        // Trigonometría para calcular el desplazamiento en los ejes X e Y
        // dx = cos(angulo) * hipotenusa
        // dy = sin(angulo) * hipotenusa
        const dx = (Math.cos(this.rad) * displ);
        const dy = (Math.sin(this.rad) * displ);

        // Actualización de la posición absoluta
        this.x = Math.round(this.x + dx);
        this.y = Math.round(this.y + dy);

        // Normalizamos los radianes para que se mantengan en el rango [0, 2PI]
        this.rad = this.rad % (Math.PI * 2);
        if (this.rad < 0) this.rad += (Math.PI * 2);

        // Devolvemos el estado del movimiento para posibles verificaciones externas (ej. colisiones)
        return { "x": this.x, "y": this.y, "dx": dx, "dy": dy, "rad": this.rad, "displ": displ };
    };

}
