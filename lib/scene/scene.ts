import { Point } from '../point/point.js';
import { Rectangle } from '../tokens/rectangle.js';
import { ColliderToken, Collider } from '../tokens/collider.js';
import { ImgToken } from '../tokens/image.js';
import { Effects } from '../projectile/effects.js';
import { IToken } from '../tokens/itoken.js';
import { ViewPort } from './viewport.js';

/**
 * Clase Scene: Gestiona el renderizado (draw loop), el estado de la cámara (ViewPort)
 * y la integración con la interfaz de usuario (DOM).
 */
export class Scene {
    /** Información de depuración del motor. */
    engineInfo: string;
    /** Lista principal de objetos de juego presentes en la escena. */
    arrTokens: any[];
    /** Buffers temporales para dibujo auxiliar, intersecciones y otros elementos visuales. */
    buffer: { drawing: any[], intersections: any[], misc: any[] };
    /** Tokens que se renderizarán en el frame actual (filtrados por viewport). */
    arr: any[];
    /** Comandos activos (duplicado del motor para referencia). */
    mapkey: any[];
    /** Estado de ejecución del renderizado. */
    drawing: boolean;
    /** Índice del token seleccionado actualmente (foco de la cámara y control). */
    tokenIndex: number;
    /** Identificador del token seleccionado. */
    tokenId: string | null;
    /** Estado de pausa del motor. */
    pause: boolean;
    /** Referencia al elemento Canvas del DOM. */
    canvas: HTMLCanvasElement;
    /** Contexto de dibujo 2D del Canvas. */
    ctx: CanvasRenderingContext2D;
    /** Pila de órdenes pendientes. */
    orders: any[];
    /** Mensaje de texto informativo para mostrar en la UI. */
    message: string;
    /** Desplazamiento X global de la escena (cámara). */
    x: number;
    /** Desplazamiento Y global de la escena (cámara). */
    y: number;
    /** Gestor de la ventana de visualización y clipping. */
    viewPort: ViewPort;
    /** Ancho del canvas. */
    w: number;
    /** Alto del canvas. */
    h: number;
    /** Flag para ajuste automático de FPS. */
    autoFPS: boolean;
    /** FPS configurados/objetivo. */
    fps: number;

    /** Configuración general de visualización de la escena. */
    config: {
        viewGrid: boolean;
        scale: number;
        viewColliders: boolean;
        viewIds: boolean;
        autoFPS: boolean;
        viewPortWidth: number;
        viewPortHeight: number;
        effect: string;
        grid: { height: number, width: number, granularity: number }
    };

    /**
     * @param canvasId ID del elemento <canvas> en el HTML.
     */
    constructor(canvasId: string) {
        this.engineInfo = "";
        this.arrTokens = [];
        this.arr = [];
        this.mapkey = [];
        this.drawing = false;
        this.tokenIndex = 0;
        this.tokenId = null;
        this.pause = false;
        this.orders = [];
        this.message = " - - - ";
        this.autoFPS = true;
        this.fps = 60;

        this.config = {
            viewGrid: true,
            scale: 1,
            viewColliders: false,
            viewIds: false,
            autoFPS: true,
            viewPortWidth: 1920,
            viewPortHeight: 900,
            effect: 'damage',
            grid: { height: 0, width: 0, granularity: 50 }
        };

        this.buffer = {
            drawing: [],
            intersections: [],
            misc: []
        };

        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`Element with id ${canvasId} is not a canvas`);
        }
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not get 2D context");
        }
        this.ctx = ctx;

        this.defaultPosition();
        this.resize();

        this.viewPort = new ViewPort(0, 0, this.config.viewPortWidth, this.config.viewPortHeight);

        // Ajustar canvas al redimensionar ventana
        window.onresize = () => this.resize();

        // Enlazar el ciclo de dibujo
        this.drawScene = this.drawScene.bind(this);
    }

    /**
     * Restablece la configuración por defecto.
     */
    defaultConfig() {
        this.config.viewGrid = true;
        this.config.scale = 1;
        this.config.viewColliders = false;
        this.config.viewIds = false;
        this.config.autoFPS = true;
        this.config.viewPortWidth = 1920;
        this.config.viewPortHeight = 900;
        this.config.effect = 'damage';
        this.config.grid = { height: 0, width: 0, granularity: 50 };
    }

    /**
     * Posición inicial de la cámara.
     */
    defaultPosition() {
        this.x = 500;
        this.y = 500;
    }

    /**
     * Actualiza las dimensiones del canvas según la ventana del navegador.
     */
    reloadSel() {
        const tokenSelector = document.getElementById('tokens') as HTMLSelectElement;
        if (!tokenSelector) return;

        tokenSelector.innerHTML = '';
        this.arrTokens.forEach((t) => {
            if (t.config && t.config.selectable) {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.text = t.id;
                if (t.id === this.tokenId) {
                    opt.selected = true;
                }
                tokenSelector.appendChild(opt);
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.95;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
    }

    /**
     * Carga las imágenes de todos los tokens que tengan una ruta 'src' definida.
     */
    loadImg() {
        this.arrTokens.forEach((t) => {
            if (t instanceof ImgToken) {
                t.img = new Image();
                t.img.src = t.src;
            } else if (t.src) {
                t.img = new Image();
                t.img.src = t.src;
            }
        });
    }

    /**
     * Método principal de renderizado (un frame).
     * 1. Limpia el canvas.
     * 2. Aplica escala (zoom).
     * 3. Filtra y dibuja tokens, colisionadores y rejilla.
     */
    render() {
        const scale = this.config.scale;

        // Limpieza total del canvas
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.scale(scale, scale);

        // Selección y clipping: solo procesamos lo que está en el viewport
        if (this.viewPort.enabled) {
            this.arr = [];
            const allTokens = [...this.arrTokens, ...this.buffer.drawing, ...this.buffer.intersections];
            const selected = this.arrTokens[this.tokenIndex];
            if (selected) {
                this.viewPort.attachTo(selected);
            }
            // TODO: Implementar lógica de filtrado real por ViewPort
            this.arr = allTokens;
        } else {
            this.arr = [...this.arrTokens, ...this.buffer.drawing, ...this.buffer.intersections];
        }

        // Dibujo de cada token
        this.arr.forEach((t) => {
            if (!t.destroy) {
                if (typeof t.draw === 'function') {
                    // Pasamos el offset (x, y) que representa la cámara
                    t.draw(this.ctx, undefined, undefined, { x: this.x, y: this.y });
                }
            }
            // Dibujo auxiliar de colisionadores si está habilitado
            if (this.config.viewColliders && t.collider) {
                t.collider.draw(this.ctx, undefined, undefined, { x: this.x, y: this.y });
            }
        });

        // Dibujo de la rejilla de fondo
        if (this.config.viewGrid) {
            this.drawGrid();
        }

        this.ctx.restore();
        return window.performance.now();
    }

    private lastTime = window.performance.now();
    private arrIntervals: number[] = [];

    /**
     * Ciclo de dibujo mediante requestAnimationFrame.
     * Gestiona el timing, el cálculo de FPS y la actualización de la UI.
     */
    drawScene(timeStamp: number) {
        const now = window.performance.now();
        const elapsed = now - this.lastTime;

        // Control de refresco según FPS configurados
        if (elapsed >= 1000 / this.fps) {
            this.center(); // Centrar cámara en el token activo
            this.render(); // Dibujar frame
            this.lastTime = now;
        }

        // Medición de rendimiento (FPS reales)
        this.arrIntervals.push(now);
        if (this.arrIntervals.length > 40) this.arrIntervals.shift();

        let averageInterval = 0;
        if (this.arrIntervals.length > 1) {
            let sum = 0;
            for (let i = 0; i < this.arrIntervals.length - 1; i++) {
                sum += this.arrIntervals[i + 1] - this.arrIntervals[i];
            }
            averageInterval = sum / (this.arrIntervals.length - 1);
        }
        const realFPS = averageInterval > 0 ? Math.round(1000 / averageInterval) : 0;

        // Lógica de Auto-FPS: Ajusta la carga si el rendimiento cae
        if (this.config.autoFPS) {
            if (averageInterval > 22 && this.fps > 1) this.fps = Math.round(this.fps / 1.1);
            if (averageInterval < 17 && this.fps < 60) this.fps++;
        }

        // Actualización de la caja de texto informativa en el HTML
        const infoElem = document.getElementById('info');
        if (infoElem instanceof HTMLTextAreaElement) {
            infoElem.value = `TOKENS(TOTAL/DRAWED): [${this.arrTokens.length} / ${this.arr.length}] FPS(config/real): [${this.fps} / ${realFPS}]\n` +
                `Draw cycle (config/real): [${Math.round(1000 / this.fps)}ms / ${Math.round(averageInterval)}ms] ${this.engineInfo}\n${this.message}`;
        }

        requestAnimationFrame(this.drawScene);
    }

    /**
     * Centra la cámara en el token seleccionado.
     */
    center() {
        this.centerOn(this.arrTokens[this.tokenIndex]);
    }

    /**
     * Calcula el desplazamiento X, Y para centrar un token en el canvas.
     */
    centerOn(t: IToken) {
        if (!t) return;
        const scale = this.config.scale;
        this.x = (this.w / (2 * scale)) - t.x;
        this.y = (this.h / (2 * scale)) - t.y;
    }

    /**
     * Dibuja una rejilla infinita de referencia sobre el mapa.
     */
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        const gran = this.config.grid.granularity;
        const gridW = 1900;
        const gridH = 1200;

        // Cálculo de alineación de la rejilla para que parezca estática mientras nos movemos
        const dx = (Math.round((this.x - gridW / 2) / gran) * gran) + (gridW / 2);
        const dy = (Math.round((this.y - gridH / 2) / gran) * gran) + (gridH / 2);

        for (let col = 0; col <= Math.round(gridW / gran); col++) {
            for (let row = 0; row <= Math.round(gridH / gran); row++) {
                const x = (col * gran) - dx;
                const y = (row * gran) - dy;
                const rx = x + this.x;
                const ry = y + this.y;

                if ((x % (gran * 5) === 0) && (y % (gran * 5) === 0)) {
                    this.ctx.fillStyle = 'green';
                    this.ctx.fillRect(rx, ry, 5, 5);
                    this.ctx.fillText(`(${x},${y})`, rx + 15, ry - 5);
                } else {
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                    this.ctx.fillRect(rx, ry, 1, 1);
                }
            }
        }
        this.ctx.restore();
    }

    /**
     * Selecciona un token por su ID y actualiza los controles de la UI asociados.
     */
    setToken(tokenId: string) {
        const index = this.arrTokens.findIndex(t => t.id === tokenId);
        if (index > -1) {
            this.tokenIndex = index;
            this.tokenId = tokenId;

            this.viewPort.attachTo(this.arrTokens[this.tokenIndex]);
            this.setupUIControls();

            return true;
        }
        return false;
    }

    /**
     * Vincula los elementos HTML (checkboxes, botones) con las propiedades de la escena.
     */
    private setupUIControls() {
        const getElem = (id: string) => document.getElementById(id);

        const lines = getElem('lines') as HTMLInputElement;
        if (lines) {
            lines.checked = this.config.viewGrid;
            lines.onchange = () => { this.config.viewGrid = lines.checked; lines.blur(); };
        }

        const colliders = getElem('colliders') as HTMLInputElement;
        if (colliders) {
            colliders.checked = this.config.viewColliders;
            colliders.onchange = () => { this.config.viewColliders = colliders.checked; colliders.blur(); };
        }

        const autoFPS = getElem('autoFPS') as HTMLInputElement;
        if (autoFPS) {
            autoFPS.checked = this.config.autoFPS;
            autoFPS.onchange = () => { this.config.autoFPS = autoFPS.checked; autoFPS.blur(); };
        }

        const viewport = getElem('viewport') as HTMLInputElement;
        if (viewport) {
            viewport.checked = this.viewPort.enabled;
            viewport.onchange = () => { this.viewPort.enabled = viewport.checked; viewport.blur(); };
        }

        const stopButton = getElem('stopAutomat');
        if (stopButton) {
            stopButton.onclick = () => { this.pause = !this.pause; stopButton.blur(); };
        }

        const zoomin = getElem('zoomin');
        if (zoomin) {
            zoomin.onclick = () => { this.config.scale += 0.1; this.resize(); zoomin.blur(); };
        }

        const zoomout = getElem('zoomout');
        if (zoomout) {
            zoomout.onclick = () => { this.config.scale -= 0.1; this.resize(); zoomout.blur(); };
        }
    }

    /**
     * Obtiene el token que tiene actualmente el foco.
     */
    getSelectedToken() {
        return this.arrTokens[this.tokenIndex];
    }
}
