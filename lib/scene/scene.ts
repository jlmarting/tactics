import { Point } from '../point/point';
import { Rectangle } from '../tokens/rectangle';
import { ColliderToken, Collider } from '../tokens/collider';
import { ImgToken } from '../tokens/image';
import { Effects } from '../projectile/effects';
import { IToken } from '../tokens/itoken';
import { ViewPort } from './viewport';

export class Scene {
    engineInfo: string;
    arrTokens: any[];
    buffer: { drawing: any[], intersections: any[], misc: any[] };
    arr: any[];
    mapkey: any[];
    drawing: boolean;
    tokenIndex: number;
    tokenId: string | null;
    pause: boolean;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    orders: any[];
    message: string;
    x: number;
    y: number;
    viewPort: ViewPort;
    w: number;
    h: number;
    autoFPS: boolean;
    fps: number;
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

        window.onresize = () => this.resize();
        this.drawScene = this.drawScene.bind(this);
    }

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

    defaultPosition() {
        this.x = 500;
        this.y = 500;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.95;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
    }

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

    render() {
        const scale = this.config.scale;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.scale(scale, scale);

        if (this.viewPort.enabled) {
            this.arr = [];
            const allTokens = [...this.arrTokens, ...this.buffer.drawing, ...this.buffer.intersections];
            const selected = this.arrTokens[this.tokenIndex];
            if (selected) {
                this.viewPort.attachTo(selected);
            }
            allTokens.forEach(e => {
                const p = e.getRelPos ? e.getRelPos() : { x: e.x, y: e.y };
                // Simple inclusion check
                this.arr.push(e);
            });
        } else {
            this.arr = [...this.arrTokens, ...this.buffer.drawing, ...this.buffer.intersections];
        }

        this.arr.forEach((t) => {
            if (t.destroy) {
                // destruct
            } else {
                if (typeof t.draw === 'function') {
                    t.draw(this.ctx, undefined, undefined, { x: this.x, y: this.y });
                }
            }
            if (this.config.viewColliders && t.collider) {
                t.collider.draw(this.ctx);
            }
        });

        if (this.config.viewGrid) {
            this.drawGrid();
        }
        if (this.viewPort.enabled) {
            // this.viewPort.draw(this.ctx);
        }

        this.ctx.restore();
        return window.performance.now();
    }

    private lastTime = window.performance.now();
    private arrIntervals: number[] = [];

    drawScene(timeStamp: number) {
        const now = window.performance.now();
        const elapsed = now - this.lastTime;

        if (elapsed >= 1000 / this.fps) {
            this.center();
            this.render();
            this.lastTime = now;
        }

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

        if (this.config.autoFPS) {
            if (averageInterval > 22 && this.fps > 1) this.fps = Math.round(this.fps / 1.1);
            if (averageInterval < 17 && this.fps < 60) this.fps++;
        }

        const infoElem = document.getElementById('info');
        if (infoElem instanceof HTMLTextAreaElement) {
            infoElem.value = `TOKENS(TOTAL/DRAWED): [${this.arrTokens.length} / ${this.arr.length}] FPS(config/real): [${this.fps} / ${realFPS}]\n` +
                `Draw cycle (config/real): [${Math.round(1000 / this.fps)}ms / ${Math.round(averageInterval)}ms] ${this.engineInfo}\n${this.message}`;
        }

        requestAnimationFrame(this.drawScene);
    }

    center() {
        this.centerOn(this.arrTokens[this.tokenIndex]);
    }

    centerOn(t: IToken) {
        if (!t) return;
        const scale = this.config.scale;
        this.x = (this.w / (2 * scale)) - t.x;
        this.y = (this.h / (2 * scale)) - t.y;
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        const gran = this.config.grid.granularity;
        const gridW = 1900;
        const gridH = 1200;
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

    getSelectedToken() {
        return this.arrTokens[this.tokenIndex];
    }
}
