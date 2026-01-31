import { WireToken } from '../tokens/wire.js';
import { Point } from '../point/point.js';
import { Scene } from '../scene/scene.js';

/**
 * Clase Editor: Proporciona herramientas para la creación de polígonos (WireTokens)
 * mediante clics en el canvas y atajos de teclado.
 */
export class Editor {
    scene: Scene;
    points: Point[];

    /**
     * @param scene Referencia a la escena donde se añadirán los tokens creados.
     */
    constructor(scene: Scene) {
        this.scene = scene;
        // Puntos de trazado activos del editor (vértices del polígono en creación)
        this.points = [];

        this.initEvents();
    }

    /**
     * Inicializa los eventos de teclado y ratón para interactuar con el editor.
     */
    private initEvents() {
        document.addEventListener('keypress', (e: KeyboardEvent) => {
            // Tecla 'n' (110): Finaliza el trazado actual y crea un WireToken
            if (e.keyCode === 110) {
                if (this.points.length === 0) return;

                const firstPoint = this.points[0];
                const wt = new WireToken('wiretoken' + this.scene.arrTokens.length, firstPoint);

                // Asignamos los puntos capturados al nuevo token
                wt.points = [...this.points];

                // Recalculamos el centro del polígono basado en sus vértices
                wt.setCenter();

                this.scene.arrTokens.push(wt);
                console.log('Insertado wiretoken: ' + wt.id);

                // Cambiamos el foco al nuevo token
                this.scene.setToken(wt.id);

                // Recargamos el selector de la UI
                this.scene.reloadSel();

                // Limpiamos los puntos de trazado
                this.points = [];
                this.scene.buffer.drawing = [];
            }

            // Tecla 'd' (100): Cancela el trazado actual y borra los puntos temporales
            if (e.keyCode === 100) {
                this.points = [];
                this.scene.buffer.drawing = [];
            }

            // Tecla 's' (115): Demo de creación de una línea simple centrada
            if (e.keyCode === 115) {
                const p0 = new Point(0, 0);
                const wt = new WireToken("demo", p0);
                wt.load(new Point(-250, 0));
                wt.load(new Point(250, 0));

                this.scene.arrTokens.push(wt);
                this.scene.setToken(wt.id);

                this.points = [];
                this.scene.buffer.drawing = [];
            }
        });

        // Clic en el canvas: Añade un nuevo vértice al trazado actual
        const canvasElem = document.getElementById("tactics");
        if (canvasElem) {
            canvasElem.onclick = (e: MouseEvent) => {
                const rect = this.scene.canvas.getBoundingClientRect();

                // Traducimos las coordenadas del ratón a coordenadas del mapa del motor
                const mapX = Math.round(e.clientX - rect.left - this.scene.x);
                const mapY = Math.round(e.clientY - rect.top - this.scene.y);

                const p = new Point(mapX, mapY);
                p.id = 'P_' + e.clientX + '_' + e.clientY;

                // Añadimos al buffer de dibujo temporal para visualización
                this.scene.buffer.drawing.push(p);
                this.points.push(p);
            };
        }
    }
}
