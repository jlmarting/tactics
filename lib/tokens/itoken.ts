import { Point } from "../point/point.js";

/**
 * Interface IToken: Define el contrato mínimo que debe cumplir cualquier objeto
 * que desee ser gestionado por el motor (Engine) y la escena (Scene).
 */
export interface IToken {
    /** Punto que representa la posición central del token en el mapa. */
    center: Point;

    /** Ancho del token (para renderizado y colisiones). */
    w: number;

    /** Alto del token (para renderizado y colisiones). */
    h: number;

    /** Rotación actual del token en radianes. */
    rad: number;

    /** Incremento de rotación base (opcional). */
    incrGrad: number;

    /** Velocidad de desplazamiento base. */
    displ: number;

    /** Alias o valor calculado de rotación para movimientos complejos. */
    grad: number;

    /** Historial o plan de puntos recorridos. */
    path: Array<Point>;

    /** Objeto de configuración dinámica (colores, visibilidad, etc.). */
    config: any;

    /** Marca si el token debe ser eliminado de la escena en el siguiente ciclo. */
    delete: boolean;

    /** Identificador único del token. */
    id: string;

    /** Posición X absoluta en el mapa. */
    x: number;

    /** Posición Y absoluta en el mapa. */
    y: number;

    /** Obtiene el centro del objeto como un objeto {x, y}. */
    getCenter(): { x: number, y: number };

    /**
     * Ejecuta un movimiento basado en un comando.
     * @param cmd Comando de movimiento ('up', 'down', 'left', 'right', etc.).
     * @param displ Distancia o magnitud del desplazamiento.
     */
    move(cmd: string, displ: number): any;
}
