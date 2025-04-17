import { ImgToken } from "../../lib/components/tokens/2d/image.js";
import { Token2D } from "../../lib/components/tokens/2d/Token2D.js";
import { Projectile } from "../../lib/components/tokens/2d/projectile.js";
import { SceneBuffer, SceneConfig, GridConfig, RenderState } from "./models.js";
import { ViewPort } from "./ui.js";
import { BulletProjectile } from '../../lib/components/tokens/2d/bulletprojectile.js';
import { Tile } from "../../lib/components/poligons/2d/tile.js";
import { TText } from "../../lib/components/ttext.js";
import { ColliderToken } from "../../lib/components/tokens/2d/collidertoken.js";
export class Scene {
    constructor(canvasId, population) {
        console.log("constructor Scene");
        this.renderState = new RenderState();
        this.updateRenderState();
        this.population = population;
        this.engineInfo = "";
        this.sceneTokens = [];
        this.buffer = new SceneBuffer();
        this.buffer.drawing = [];
        this.buffer.intersections = [];
        this.buffer.misc = [];
        this.arr = [];
        this.mapkey = [];
        this.drawing = false;
        this.tokenIndex = 0;
        this.tokenId;
        this.pause = false;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.config = new SceneConfig();
        this.config.grid = new GridConfig();
        this.config.viewGrid = true;
        this.config.scale = 11;
        this.config.viewColliders = false;
        this.config.viewIds = false;
        this.config.autoFPS = true;
        this.config.viewPortWidth = 1920;
        this.config.viewPortHeight = 900;
        this.config.effect = 'damage';
        this.config.grid = new GridConfig();
        this.orders = [];
        this.message = " - - - ";
        this.x = 500;
        this.y = 500;
        var self = this;
        this.viewPort = new ViewPort(self);
        let sceneSelector = null;
        this.resize();
        window.onresize = function () { self.resize(); };
    }
    drawScene(timeStamp) {
        console.log("____________drawScene____" + timeStamp + "__________");
        this.updateRenderState.bind(this)();
        console.log(`drawScene ${this.renderState.now}`);
        this.renderState.elapsed = window.performance.now() - this.renderState.now;
        if (this.renderState.elapsed >= 1000 / this.fps) {
            this.center();
            this.renderState.now = this.render();
        }
        this.center();
        this.renderState.now = this.render();
        if (!this.pause) {
        }
        this.renderState.arrIntervals.push(window.performance.now());
        var sum = 0;
        for (var i = 0; i < this.renderState.arrIntervals.length - 1; i++) {
            sum += this.renderState.arrIntervals[i + 1] - this.renderState.arrIntervals[i];
        }
        this.renderState.averageInterval = sum / this.renderState.arrIntervals.length;
        this.renderState.realFPS = Math.round(1000 / this.renderState.averageInterval);
        if (this.config.autoFPS) {
            if (this.renderState.averageInterval > 22) {
                if (this.fps > 1) {
                    this.fps = Math.round(this.fps / 1.1);
                }
            }
            if (this.renderState.averageInterval < 17) {
                if (this.fps < 60) {
                    this.fps++;
                }
            }
        }
        if (this.renderState.arrIntervals.length > 40) {
            this.renderState.arrIntervals.shift();
        }
        document.getElementById('info').innerHTML =
            `TOKENS(TOTAL/DRAWED): [${this.sceneTokens.length} / ${this.arr.length}] ` +
                `FPS(config/real): [${this.renderState.fps} / ${this.renderState.realFPS}]` +
                `Draw cycle (config/real): [${Math.round(1000 / this.renderState.fps)}ms / ${Math.round(this.renderState.averageInterval)}ms]` +
                `${this.engineInfo}` + '\n' + this.message;
        requestAnimationFrame(this.drawScene.bind(this));
    }
    ;
    updateRenderState() {
        let _rndrStatus = new RenderState();
        _rndrStatus.now = window.performance.now();
        _rndrStatus.fps = 60;
        _rndrStatus.arrIntervals = [];
        _rndrStatus.elapsed = 0;
        _rndrStatus.averageInterval = 0;
        _rndrStatus.realFPS = 0;
        this.renderState.now = _rndrStatus.now;
        this.renderState.fps = _rndrStatus.fps;
        this.renderState.arrIntervals = [];
        console.log('----updateRenderStatus-----' + JSON.stringify(_rndrStatus));
    }
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        var grid = this.config.grid;
        grid.width = 1900;
        grid.height = 1200;
        var numRows = Math.round(grid.height / grid.granularity);
        var numCols = Math.round(grid.width / grid.granularity);
        var dx = (Math.round((this.x - Math.round(grid.width / 2)) / grid.granularity) * grid.granularity) + Math.round(grid.width / 2);
        var dy = (Math.round((this.y - Math.round(grid.height / 2)) / grid.granularity) * grid.granularity) + Math.round(grid.height / 2);
        this.ctx.fillStyle = 'green';
        var cont = 0;
        for (var col = 0; col <= numCols; col++) {
            for (var row = 0; row <= numRows; row++) {
                cont++;
                var x = (col * grid.granularity);
                var y = (row * grid.granularity);
                x -= dx;
                y -= dy;
                var rx = x + this.x;
                var ry = y + this.y;
                if (this.viewPort.enabled) {
                    if (this.viewPort.isInside(rx, ry)) {
                        if ((x % (grid.granularity * 5) == 0) && (y % (grid.granularity * 5) == 0)) {
                            this.ctx.fillRect(rx, ry, 5, 5);
                            this.ctx.fillText(`(${x},${y})`, rx + 15, ry - 5);
                        }
                        else {
                            this.ctx.fillRect(rx, ry, 1, 1);
                        }
                    }
                }
                else {
                    if ((x % (grid.granularity * 5) == 0) && (y % (grid.granularity * 5) == 0)) {
                        this.ctx.fillRect(rx, ry, 5, 5);
                        this.ctx.fillText(`(${x},${y})`, rx + 15, ry - 5);
                    }
                    else {
                        this.ctx.fillRect(rx, ry, 1, 1);
                    }
                }
            }
        }
        this.ctx.restore();
    }
    render() {
        console.log('-render-');
        this.ctx.clearRect(0, 0, this.canvas.width / this.config.scale, this.canvas.height / this.config.scale);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width / this.config.scale, this.canvas.height / this.config.scale);
        if (this.viewPort.enabled) {
            this.arr = [];
            this.sceneTokens = this.sceneTokens.concat(this.buffer.drawing).concat(this.buffer.intersections);
            this.viewPort.attachTo(this.sceneTokens[this.tokenIndex]);
            this.sceneTokens.forEach(function (e) {
                var p = e.getRelPos();
                if (this.viewPort.isInside(p.x, p.y)) {
                    this.arr.push(e);
                }
            });
        }
        else {
            this.arr = this.sceneTokens.concat(this.buffer.drawing).concat(this.buffer.intersections);
        }
        this.arr.forEach(function (t) {
            if (t.destroy) {
                t.collider = null;
                t = null;
            }
            else {
                t.draw(this.ctx);
            }
            if (t instanceof Projectile) {
                if (t instanceof BulletProjectile) {
                    if (this.config.viewColliders) {
                    }
                }
            }
            if (this.config.viewColliders) {
                if (t instanceof ColliderToken) {
                }
            }
        }.bind(this));
        if (this.config.viewGrid) {
            this.drawGrid();
        }
        if (this.viewPort.enabled) {
            this.viewPort.draw();
        }
        return window.performance.now();
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    loadImg() {
        this.sceneTokens.forEach(function (t) {
            console.log(`loadImg ${JSON.stringify(t)}`);
            if (t instanceof ImgToken) {
                t.img = new Image();
                t.img.src = t.src;
            }
            else {
                if (t instanceof Tile) {
                    t.img = new Image();
                    t.img.src = t.src;
                }
            }
        });
    }
    drawPath() {
        let t = this.getSelectedToken();
        if (t instanceof ColliderToken) {
            this.ctx.strokeStyle = 'orange';
            let l = this.ctx.lineWidth;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            let rpos;
            let t = this.sceneTokens[this.tokenIndex];
            t.collider.back.forEach(function (pos) {
                rpos = new Token2D(pos.x + this.x, pos.y + this.y);
                this.ctx.lineTo(rpos.x, rpos.y);
            });
            this.ctx.stroke();
            if (typeof rpos != 'undefined') {
                this.ctx.fillStyle = 'cyan';
                this.ctx.fillText('[path steps: ' + t.collider.back.length + ']', rpos.x, rpos.y);
            }
        }
        this.ctx.lineWidth = l;
    }
    resize() {
        this.canvas.width = (window.innerWidth) * 1;
        this.canvas.height = (window.innerHeight) * 0.95;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.ctx.scale(this.config.scale, this.config.scale);
    }
    getSelectedToken() {
        return this.sceneTokens[this.tokenIndex];
    }
    centerOn(t) {
        if (typeof t == 'undefined')
            return false;
        var scale = this.config.scale;
        var dx = (this.w / (2 * scale)) - t.x;
        var dy = (this.h / (2 * scale)) - t.y;
        this.move(dx, dy);
    }
    center() {
        this.centerOn(this.sceneTokens[this.tokenIndex]);
    }
    reloadSel() {
        let tokenSelector = null;
    }
    setToken(tokenId) {
        this.tokenIndex = this.sceneTokens.findIndex(function (element) {
            return element.id == tokenId;
        });
        if (this.tokenIndex > -1) {
            this.tokenId = tokenId;
        }
        else {
            console.log('No se ha encontrado token a asignar..........');
            return false;
        }
        this.viewPort.attachTo(this.sceneTokens[this.tokenIndex]);
        let currentToken = this.sceneTokens[this.tokenIndex];
        if (currentToken instanceof ColliderToken) {
            let viewGrid = document.getElementById('lines');
            viewGrid.checked = this.config.viewGrid;
            viewGrid.onchange = function () {
                this.config.viewGrid = !this.config.viewGrid;
                viewGrid.blur();
            }.bind(this);
            var collision = document.getElementById('collision');
            let t = currentToken;
            collision.checked = t.collider.config.enabled;
            collision.onchange = function () {
                this.arrTokens[this.tokenIndex].collider.config.enabled = !this.arrTokens[this.tokenIndex].collider.config.enabled;
                collision.blur();
            }.bind(this);
            var autoFPS = document.getElementById('autoFPS');
            autoFPS.checked = this.autoFPS;
            autoFPS.onchange = function () {
                this.config.autoFPS = !this.config.autoFPS;
                autoFPS.blur();
            }.bind(this);
            var viewcolliders = document.getElementById('colliders');
            viewcolliders.checked = this.config.viewColliders;
            viewcolliders.onchange = function () {
                this.config.viewColliders = !this.config.viewColliders;
                viewcolliders.blur();
            }.bind(this);
            var viewport = document.getElementById('viewport');
            viewport.checked = this.viewPort.enabled;
            viewport.onchange = function () {
                this.viewPort.enabled = !this.viewPort.enabled;
                viewport.blur();
            }.bind(this);
            var viewids = document.getElementById('ids');
            viewids.checked = this.config.viewIds;
            viewids.onchange = function () {
                this.config.viewIds = !this.config.viewIds;
                viewids.blur();
            }.bind(this);
            var zoomin = document.getElementById('zoomin');
            zoomin.onclick = function () {
                if (this.config.scale >= 0.25) {
                    this.config.scale = this.config.scale + 0.1;
                    this.resize();
                    zoomin.blur();
                }
            }.bind(this);
            var zoomout = document.getElementById('zoomout');
            zoomout.onclick = function () {
                if (this.config.scale <= 3) {
                    this.config.scale = this.config.scale - 0.1;
                    this.resize();
                    zoomout.blur();
                }
            }.bind(this);
            var stopAutomat = document.getElementById('stopAutomat');
            stopAutomat.onclick = function () {
                this.pause = !this.pause;
                zoomout.blur();
            }.bind(this);
            var fps = document.getElementById('fps');
            fps.value = this.fps;
            fps.onchange = function () {
                this.fps = fps.value;
                fps.blur();
            }.bind(this);
            var viewportheight = document.getElementById('viewportheight');
            viewportheight.value = this.config.viewPortHeight.toString();
            viewportheight.onchange = function () {
                this.config.viewPortHeight = parseInt(viewportheight.value);
                viewportheight.blur();
            }.bind(this);
            var viewportwidth = document.getElementById('viewportwidth');
            viewportwidth.value = this.config.viewPortWidth.toString();
            viewportwidth.onchange = function () {
                this.config.viewPortWidth = parseInt(viewportwidth.value);
                viewportwidth.blur();
            }.bind(this);
            let bulletEffect = null;
            let tokenSelector = null;
        }
        TText.prototype.draw = function () {
            this.ctx.fillStyle = this.color;
            var arrMsg = this.msg.split(';;');
            if (arrMsg.length > 1) {
                var x0 = this.x;
                var y0 = this.y;
                arrMsg.forEach((m) => {
                    this.ctx.fillText(m, x0, y0);
                    y0 += 15;
                });
            }
            else {
                this.ctx.fillText(this.msg[0], this.x, this.y);
            }
        };
        Projectile.prototype.draw = function () {
            var pos = this.getRelPos();
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
            this.ctx.fill();
            this.ctx.stroke();
        };
        BulletProjectile.prototype.bulletEffect = function (collisions, bullet) {
            if (typeof collisions == 'undefined') {
                return false;
            }
            var i = this.arrTokens.indexOf(bullet);
            this.arrTokens.splice(i, 1);
            var thPromise = function (collisions) {
                return new Promise(function (resolve, reject) {
                    var tokenHitted = this.arrTokens.find(function (element) {
                        return element.id == collisions[0];
                    });
                    resolve(tokenHitted);
                });
            };
            thPromise(collisions).then(function (tokenHitted) {
                if (typeof tokenHitted == 'undefined')
                    return false;
                return bullet.effect(tokenHitted, bullet);
            });
            this.updateRenderState.call(this);
        };
    }
}
//# sourceMappingURL=scene.js.map