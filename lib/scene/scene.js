import { ImgToken } from '../tokens/image.js';
import { ViewPort } from './viewport.js';
/**
 * Clase Scene: Responsable de la orquestación visual y la gestión del estado de la escena.
 *
 * Esta clase centraliza:
 * 1. El ciclo de renderizado (usando requestAnimationFrame).
 * 2. La gestión de la cámara y el viewport.
 * 3. La interacción con los elementos del DOM para la configuración del motor.
 * 4. El almacenamiento de todos los tokens (objetos de juego) activos.
 */
export class Scene {
    /**
     * Inicializa una nueva escena vinculada a un elemento canvas.
     * @param canvasId El ID del elemento HTML <canvas>.
     */
    constructor(canvasId) {
        this.lastTime = window.performance.now();
        this.arrIntervals = [];
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
            throw new Error(`El elemento con id ${canvasId} no es un canvas válido.`);
        }
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error("No se pudo obtener el contexto 2D del canvas.");
        }
        this.ctx = ctx;
        this.defaultPosition();
        this.resize();
        this.viewPort = new ViewPort(0, 0, this.config.viewPortWidth, this.config.viewPortHeight);
        // Ajustar el canvas automáticamente cuando cambia el tamaño de la ventana
        window.onresize = () => this.resize();
        // El método drawScene debe estar bindeado para mantener el contexto 'this' en requestAnimationFrame
        this.drawScene = this.drawScene.bind(this);
    }
    /**
     * Carga los valores de configuración por defecto.
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
     * Establece la posición inicial de la cámara en el mapa.
     */
    defaultPosition() {
        this.x = 500;
        this.y = 500;
    }
    /**
     * Ajusta las dimensiones del buffer de dibujo del canvas para que coincidan con la ventana.
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.95;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
    }
    /**
     * Carga las imágenes (activos) de todos los tokens presentes en la escena.
     */
    loadImg() {
        this.arrTokens.forEach((t) => {
            if (t instanceof ImgToken) {
                t.img = new Image();
                t.img.src = t.src;
            }
            else if (t.src) {
                t.img = new Image();
                t.img.src = t.src;
            }
        });
    }
    /**
     * Realiza el renderizado de un único frame.
     * Gestiona la limpieza del fondo, la aplicación de transformaciones (zoom, cámara)
     * y el dibujado de cada entidad.
     */
    render() {
        const scale = this.config.scale;
        // Limpieza del canvas con la identidad
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.ctx.save();
        // Aplicar el zoom configurado
        this.ctx.scale(scale, scale);
        // Gestión del ViewPort y filtrado de entidades (Culling)
        if (this.viewPort.enabled) {
            this.arr = [];
            const allTokens = [...this.arrTokens, ...this.buffer.drawing, ...this.buffer.intersections];
            const selected = this.arrTokens[this.tokenIndex];
            if (selected) {
                // La cámara sigue al token seleccionado
                this.viewPort.attachTo(selected);
            }
            // Por ahora dibujamos todo, pero aquí iría la lógica de descarte por coordenadas
            this.arr = allTokens;
        }
        else {
            this.arr = [...this.arrTokens, ...this.buffer.drawing, ...this.buffer.intersections];
        }
        // Dibujar cada token en su posición relativa a la cámara
        this.arr.forEach((t) => {
            if (!t.destroy) {
                if (typeof t.draw === 'function') {
                    // El offset {x, y} es la posición de la cámara que se resta/suma en el dibujo
                    t.draw(this.ctx, undefined, undefined, { x: this.x, y: this.y });
                }
            }
            // Dibujar colisionadores si la depuración está activa
            if (this.config.viewColliders && t.collider) {
                t.collider.draw(this.ctx, undefined, undefined, { x: this.x, y: this.y });
            }
        });
        // Dibujar la rejilla de coordenadas si está activa
        if (this.config.viewGrid) {
            this.drawGrid();
        }
        this.ctx.restore();
        return window.performance.now();
    }
    /**
     * Bucle principal de dibujo invocado por el navegador.
     * Calcula el paso del tiempo y decide cuándo renderizar un nuevo frame según los FPS.
     */
    drawScene(timeStamp) {
        const now = window.performance.now();
        const elapsed = now - this.lastTime;
        if (elapsed >= 1000 / this.fps) {
            this.center(); // Actualizar posición de cámara
            this.render(); // Dibujar escena
            this.lastTime = now;
        }
        // Cálculo de telemetría de rendimiento
        this.arrIntervals.push(now);
        if (this.arrIntervals.length > 40)
            this.arrIntervals.shift();
        let averageInterval = 0;
        if (this.arrIntervals.length > 1) {
            let sum = 0;
            for (let i = 0; i < this.arrIntervals.length - 1; i++) {
                sum += this.arrIntervals[i + 1] - this.arrIntervals[i];
            }
            averageInterval = sum / (this.arrIntervals.length - 1);
        }
        const realFPS = averageInterval > 0 ? Math.round(1000 / averageInterval) : 0;
        // Estabilizador de FPS: si el intervalo es muy alto, baja la exigencia
        if (this.config.autoFPS) {
            if (averageInterval > 22 && this.fps > 1)
                this.fps = Math.round(this.fps / 1.1);
            if (averageInterval < 17 && this.fps < 60)
                this.fps++;
        }
        // Actualizar el panel de información en el DOM
        const infoElem = document.getElementById('info');
        if (infoElem instanceof HTMLTextAreaElement) {
            infoElem.value = `TOKENS(TOTAL/DRAWED): [${this.arrTokens.length} / ${this.arr.length}] FPS(config/real): [${this.fps} / ${realFPS}]\n` +
                `Draw cycle (config/real): [${Math.round(1000 / this.fps)}ms / ${Math.round(averageInterval)}ms] ${this.engineInfo}\n${this.message}`;
        }
        // Solicitar el siguiente frame
        requestAnimationFrame(this.drawScene);
    }
    /**
     * Centra la vista en el token seleccionado.
     */
    center() {
        this.centerOn(this.arrTokens[this.tokenIndex]);
    }
    /**
     * Calcula los desplazamientos X e Y necesarios para situar al token en el centro del canvas.
     */
    centerOn(t) {
        if (!t)
            return;
        const scale = this.config.scale;
        this.x = (this.w / (2 * scale)) - t.x;
        this.y = (this.h / (2 * scale)) - t.y;
    }
    /**
     * Dibuja una cuadrícula de referencia que se desplaza con la cámara.
     */
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        const gran = this.config.grid.granularity;
        const gridW = 1900;
        const gridH = 1200;
        // Ajuste de fase para que la rejilla parezca infinita y estática al mover la cámara
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
                }
                else {
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                    this.ctx.fillRect(rx, ry, 1, 1);
                }
            }
        }
        this.ctx.restore();
    }
    /**
     * Selecciona un token por su ID, actualiza la cámara y los controles de la interfaz.
     */
    setToken(tokenId) {
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
     * Sincroniza los controles HTML (checkboxes, botones, selectores) con el estado de la escena.
     */
    setupUIControls() {
        const getElem = (id) => document.getElementById(id);
        const lines = getElem('lines');
        if (lines) {
            lines.checked = this.config.viewGrid;
            lines.onchange = () => { this.config.viewGrid = lines.checked; lines.blur(); };
        }
        const colliders = getElem('colliders');
        if (colliders) {
            colliders.checked = this.config.viewColliders;
            colliders.onchange = () => { this.config.viewColliders = colliders.checked; colliders.blur(); };
        }
        const autoFPS = getElem('autoFPS');
        if (autoFPS) {
            autoFPS.checked = this.config.autoFPS;
            autoFPS.onchange = () => { this.config.autoFPS = autoFPS.checked; autoFPS.blur(); };
        }
        const viewport = getElem('viewport');
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
     * Obtiene el objeto token que actualmente tiene el foco.
     */
    /**
     * Recarga el selector de tokens en la interfaz de usuario.
     */
    reloadSel() {
        const tokenSelector = document.getElementById('tokens');
        if (!tokenSelector)
            return;
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
    getSelectedToken() {
        return this.arrTokens[this.tokenIndex];
    }
}
//# sourceMappingURL=scene.js.map