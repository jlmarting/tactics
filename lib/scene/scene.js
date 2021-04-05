"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var point_1 = require("../point/point");
var rectangle_1 = require("../tokens/rectangle");
var collider_1 = require("../tokens/collider");
var image_1 = require("../tokens/image");
var Scene = function (canvasId, arrBuilds) {
    this.engineInfo = "";
    this.arrTokens = [];
    this.buffer = {}; // otros tokens 
    this.buffer.drawing = []; // buffer de dibujo: secuencia de puntos
    this.buffer.intersections = []; //buffer de cálculo de intersecciones de vectores
    this.buffer.misc = []; //
    this.arr = []; //auxiliar para filtrado de tokens
    this.mapkey = []; //comandos que serán agregados por el control
    this.drawing = false;
    this.tokenIndex = 0; //indica que índice de token tenemos seleccionado para centrar vista, tomar control, etc.
    this.tokenId; //Análogo con lo anterior
    this.pause = false;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.config = { viewGrid: true, scale: 1, viewColliders: false, viewIds: false, autoFPS: true, viewPortWidth: 1920, viewPortHeight: 900 };
    this.config.effect = 'damage';
    this.config.grid = { height: 0, width: 0, granularity: 50 };
    this.orders = []; //Pila de órdenes a ejecutar (movimientos, disparos, étc)
    this.message = " - - - "; //para paso de mensajes de otro módulo
    //Posición con respecto al mapa
    this.x = 500;
    this.y = 500;
    var self = this;
    var viewportpoint = new point_1.Point(self.config.viewPortWidth, self.config.viewPortHeight);
    this.viewPort = new rectangle_1.Rectangle(0 - (self.config.viewPortWidth - 5 / 2), 0 - (self.config.viewPortHeight - 5 / 2), viewportpoint.x, viewportpoint.y);
    this.viewPort.config = {};
    this.viewPort.config.innerColor = null;
    this.viewPort.enabled = ss;
    this.viewPort.attachTo = function (t) {
        var pos = t.getRelPos();
        self.viewPort.placeAt(pos.x, pos.y);
    };
    this.resize = function () {
        self.canvas.width = (window.innerWidth) * 1;
        self.canvas.height = (window.innerHeight) * 0.95;
        self.w = this.canvas.width;
        self.h = this.canvas.height;
        self.ctx.scale(self.config.scale, self.config.scale);
    };
    this.reloadSel = function () {
        var tokenSelector = document.getElementById('tokens');
        tokenSelector.load = function () {
            tokenSelector.innerHTML = null;
            self.arrTokens.forEach(function (t) {
                if ((typeof t.config !== 'undefined') && (t.config.selectable)) {
                    var opt = document.createElement('option');
                    opt.value = t.id;
                    opt.text = t.id;
                    if (t.id == theScene.tokenId) {
                        opt.selected = "selected";
                    }
                    tokenSelector.appendChild(opt);
                }
            });
        };
        tokenSelector.load();
        tokenSelector.onchange = function () {
            var sel = tokenSelector.value;
            if (self.setToken(sel)) {
                tokenSelector.blur();
            }
            ;
        };
    };
    var sceneSelector = document.getElementById('scene');
    sceneSelector.load = function () {
        sceneSelector.innerHTML = null;
    };
    this.resize();
    window.onresize = function () { self.resize(); };
    this.getSelectedToken = function () {
        return self.arrTokens[self.tokenIndex];
    };
    //Token de referencia (para centrar vista en él)
    this.setToken = function (tokenId) {
        //guardamos identificador y indice del token activo
        self.tokenIndex = self.arrTokens.findIndex(function (element) {
            return element.id == tokenId;
        });
        if (self.tokenIndex > -1) {
            self.tokenId = tokenId;
        }
        else {
            console.log('No se ha encontrado nada');
            return false;
        }
        //viewport al token activo que acabamos de determinar
        self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);
        //Eventos para control de estado del objeto
        if (self.arrTokens[self.tokenIndex] instanceof collider_1.ColliderToken) {
            var viewGrid = document.getElementById('lines');
            viewGrid.checked = self.config.viewGrid;
            viewGrid.onchange = function () {
                self.config.viewGrid = !self.config.viewGrid;
                viewGrid.blur();
            };
            var collision = document.getElementById('collision');
            collision.checked = self.arrTokens[self.tokenIndex].collider.config.enabled;
            collision.onchange = function () {
                self.arrTokens[self.tokenIndex].collider.config.enabled = !self.arrTokens[self.tokenIndex].collider.config.enabled;
                collision.blur();
            };
            var autoFPS = document.getElementById('autoFPS');
            autoFPS.checked = self.autoFPS;
            autoFPS.onchange = function () {
                self.config.autoFPS = !self.config.autoFPS;
                autoFPS.blur();
            };
            var viewcolliders = document.getElementById('colliders');
            viewcolliders.checked = self.config.viewColliders;
            viewcolliders.onchange = function () {
                self.config.viewColliders = !self.config.viewColliders;
                viewcolliders.blur();
            };
            var viewport = document.getElementById('viewport');
            viewport.checked = self.viewPort.enabled;
            viewport.onchange = function () {
                self.viewPort.enabled = !self.viewPort.enabled;
                viewport.blur();
            };
            var viewids = document.getElementById('ids');
            viewids.checked = self.config.viewIds;
            viewids.onchange = function () {
                self.config.viewIds = !self.config.viewIds;
                viewids.blur();
            };
            var zoomin = document.getElementById('zoomin');
            zoomin.onclick = function () {
                if (self.config.scale >= 0.25) {
                    self.config.scale = self.config.scale + 0.1;
                    self.resize();
                    zoomin.blur();
                }
            };
            var zoomout = document.getElementById('zoomout');
            zoomout.onclick = function () {
                if (self.config.scale <= 3) {
                    self.config.scale = self.config.scale - 0.1;
                    self.resize();
                    zoomout.blur();
                }
            };
            var stopAutomat = document.getElementById('stopAutomat');
            stopAutomat.onclick = function () {
                self.pause = !self.pause;
                zoomout.blur();
            };
            var fps = document.getElementById('fps');
            fps.value = self.fps;
            fps.onchange = function () {
                self.fps = fps.value;
                fps.blur();
            };
            var viewportheight = document.getElementById('viewportheight');
            viewportheight.value = self.config.viewPortHeight;
            viewportheight.onchange = function () {
                self.config.viewPortHeight = viewportheight.value;
                self.config.viewPort.height = viewportheight.value;
                viewportheight.blur();
            };
            var viewportwidth = document.getElementById('viewportwidth');
            viewportwidth.value = self.config.viewPortWidth;
            viewportwidth.onchange = function () {
                self.config.viewPortwidth = viewportwidth.value;
                self.config.viewPort.width = viewportwidth.value;
                viewportwidth.blur();
            };
            var bulletEffect = document.getElementById('effects');
            bulletEffect.load = function () {
                bulletEffect.innerHTML = null;
                var prop = Object.keys(Effects);
                prop.forEach(function (e) {
                    var opt = document.createElement('option');
                    opt.value = e;
                    opt.text = e;
                    bulletEffect.appendChild(opt);
                    if (opt.value == self.config.effect) {
                        opt.selected = "selected";
                    }
                });
            };
            bulletEffect.addEventListener('click', function () {
                bulletEffect.load();
            });
            bulletEffect.onchange = function () {
                var sel = bulletEffect.value;
                self.config.effect = sel;
                tokenSelector.blur();
            };
            bulletEffect.load();
            var tokenSelector = document.getElementById('tokens');
            tokenSelector.load = function () {
                tokenSelector.innerHTML = null;
                self.arrTokens.forEach(function (t) {
                    if ((typeof t.config !== 'undefined') && (t.config.selectable)) {
                        var opt = document.createElement('option');
                        opt.value = t.id;
                        opt.text = t.id;
                        if (t.id == theScene.tokenId) {
                            opt.selected = "selected";
                        }
                        tokenSelector.appendChild(opt);
                    }
                });
            };
            tokenSelector.addEventListener('click', function () {
                tokenSelector.load();
            });
            tokenSelector.onchange = function () {
                var sel = tokenSelector.value;
                if (self.setToken(sel)) {
                    tokenSelector.blur();
                }
                ;
            };
            tokenSelector.load();
        }
    };
    //Cargamos todas las imágenes de los tokens que las tengan
    this.arrTokens.loadImg = function () {
        self.arrTokens.forEach(function (t) {
            if (t instanceof image_1.ImgToken) {
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
    };
    //Movimiento de la ventana: transformamos las coordenadas de todos los objetos
    this.move = function (x, y) {
        this.x = x;
        this.y = y;
    };
    //Centrar la escena en un token (para hacer seguimiento)
    this.centerOn = function (t) {
        if (typeof t == 'undefined')
            return false;
        var scale = self.config.scale;
        var dx = (self.w / (2 * scale)) - t.x;
        var dy = (self.h / (2 * scale)) - t.y;
        self.move(dx, dy);
    };
    //centramos vista en el token seleccionado en la escena 
    //generalmente designado por el control, el token que movemos
    this.center = function () {
        self.centerOn(self.arrTokens[self.tokenIndex]);
    };
    this.drawPath = function () {
        if (self.getSelectedToken()['collider'] !== 'undefined') {
            self.ctx.strokeStyle = 'orange';
            var l = self.ctx.lineWidth;
            self.ctx.lineWidth = 4;
            self.ctx.beginPath();
            var rpos;
            self.arrTokens[self.tokenIndex].collider.back.forEach(function (pos) {
                rpos = { x: pos.x + self.x, y: pos.y + self.y };
                self.ctx.lineTo(rpos.x, rpos.y);
            });
            self.ctx.stroke();
            if (typeof rpos != 'undefined') {
                self.ctx.fillStyle = 'cyan';
                self.ctx.fillText('[path steps: ' + self.arrTokens[self.tokenIndex].collider.back.length + ']', rpos.x, rpos.y);
            }
        }
        self.ctx.lineWidth = l;
    };
    this.drawGrid = function () {
        self.ctx.save();
        self.ctx.strokeStyle = 'white';
        self.ctx.linewidth = 1;
        // var oTokenCenter = {x:0,y:0};
        // let i = 0;
        // self.arrTokens.forEach(function(dToken){                            
        //     var dTokenCenter = dToken.getRelPos();            
        //     self.ctx.font = '12px';
        //     self.ctx.fillText(dToken.id + ' [' +i + ']' ,Math.round(dTokenCenter.x),Math.round(dTokenCenter.y+50));
        //     i++;
        // });  
        var grid = self.config.grid;
        grid.width = 1900;
        grid.height = 1200;
        var numRows = Math.round(grid.height / grid.granularity);
        var numCols = Math.round(grid.width / grid.granularity);
        var dx = (Math.round((self.x - Math.round(grid.width / 2)) / grid.granularity) * grid.granularity) + Math.round(grid.width / 2);
        var dy = (Math.round((self.y - Math.round(grid.height / 2)) / grid.granularity) * grid.granularity) + Math.round(grid.height / 2);
        self.ctx.fillStyle = 'green';
        var cont = 0;
        for (var col = 0; col <= numCols; col++) {
            for (var row = 0; row <= numRows; row++) {
                cont++;
                var x = (col * grid.granularity);
                var y = (row * grid.granularity);
                x -= dx;
                y -= dy;
                var rx = x + self.x;
                var ry = y + self.y;
                if (self.viewPort.enabled) {
                    if (self.viewPort.isInside(rx, ry)) {
                        if ((x % (grid.granularity * 5) == 0) && (y % (grid.granularity * 5) == 0)) {
                            self.ctx.fillRect(rx, ry, 5, 5);
                            self.ctx.fillText("(" + x + "," + y + ")", rx + 15, ry - 5);
                        }
                        else {
                            self.ctx.fillRect(rx, ry, 1, 1);
                            //self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                        }
                    }
                }
                else {
                    if ((x % (grid.granularity * 5) == 0) && (y % (grid.granularity * 5) == 0)) {
                        self.ctx.fillRect(rx, ry, 5, 5);
                        self.ctx.fillText("(" + x + "," + y + ")", rx + 15, ry - 5);
                    }
                    else {
                        self.ctx.fillRect(rx, ry, 1, 1);
                        //self.ctx.fillText(`(${x},${y})`,rx+15,ry-5);                                      
                    }
                }
            }
        }
        //console.log(`Puntos generados ${cont}`);
        self.ctx.restore();
    };
    /*******DRAW*****************/





    
    point_1.Point.prototype.draw = function (lColor, fColor) {
        if (this.config == undefined) {
            this.config = {};
        }
        if (this.config.color == undefined) {
            if (lColor == undefined) {
                lColor = "red";
            }
            if (fColor == undefined) {
                fColor = "white";
            }
        }
        else {
            lColor = "white";
            fColor = this.config.color;
        }
        self.ctx.beginPath();
        self.ctx.strokeStyle = lColor;
        self.ctx.fillStyle = fColor;
        if (this.config.position == 'relative') {
            self.ctx.fillRect(this.x + self.x, this.y + self.y, 4, 4);
            self.ctx.fillText('*(' + this.x + ',' + this.y + ')', this.x + self.x, this.y + self.y);
        }
        else {
            self.ctx.fillRect(this.x, this.y, 2, 2);
            self.ctx.fillText('**(' + this.x + ',' + this.y + ')', Math.round(this.x), Math.round(this.y));
        }
        self.ctx.stroke();
    };
    point_1.Point.prototype.getRelPos = function () {
        return { x: Math.round(this.x + self.x), y: Math.round(this.y + self.y) };
    };
    CursorPoint.prototype.draw = function (ctx) {
        self.ctx.save();
        self.ctx.beginPath();
        var relPos = this.getRelPos();
        var p0 = new point_1.Point(this.x, this.y);
        var p1 = new point_1.Point(this.x + (Math.cos(this.rad) * 25), this.y + (Math.sin(this.rad) * 25));
        var vector = new Vector();
        vector.id = this.id + '_vect';
        vector.a = p0;
        vector.b = p1;
        vector.draw(ctx);
        self.ctx.lineWidth = this.config.borderWidth;
        self.ctx.strokeStyle = this.config.borderColor;
        self.ctx.stroke();
        self.ctx.restore();
    };
    IntersectionPoint.prototype.draw = function () {
        point_1.Point.prototype.draw.call(this, 'yellow', 'yellow');
    };
    TText.prototype.draw = function () {
        self.ctx.fillStyle = this.color;
        var arrMsg = this.msg.split(';;');
        if (arrMsg.length > 1) {
            var x0 = this.x;
            var y0 = this.y;
            arrMsg.forEach(function (m) {
                self.ctx.fillText(m, x0, y0);
                y0 += 15;
            });
        }
        else {
            self.ctx.fillText(this.msg[0], this.x, this.y);
        }
    };
    Tile.prototype.getRelPos = function () {
        return point_1.Point.prototype.getRelPos.call(this, this.x, this.y);
    };
    Tile.prototype.draw = function () {
        var pos = this.getRelPos();
        var rw = this.w / 2;
        var rh = this.h / 2;
        self.ctx.drawImage(this.img, pos.x - rw, pos.y - rh);
        // Rectangle.prototype.draw.call(this);
    };
    Projectile.prototype.draw = function () {
        var pos = this.getRelPos();
        self.ctx.beginPath();
        self.ctx.strokeStyle = 'red';
        self.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
        self.ctx.fill();
        self.ctx.stroke();
    };
    BulletProjectile.prototype.bulletEffect = function (collisions, bullet) {
        if (typeof collisions == 'undefined') {
            return false;
        }
        var i = self.arrTokens.indexOf(bullet);
        self.arrTokens.splice(i, 1);
        //Buscamos token impactado
        var thPromise = function (collisions) {
            return new Promise(function (resolve, reject) {
                var tokenHitted = self.arrTokens.find(function (element) {
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
    };
    /******* RENDER *************/
    // Tratamos cada uno de los objetos a representar en la escena
    this.render = function () {
        //Ajuste de zoom
        self.ctx.clearRect(0, 0, self.canvas.width / self.config.scale, self.canvas.height / self.config.scale);
        self.ctx.fillStyle = "black";
        self.ctx.fillRect(0, 0, self.canvas.width / self.config.scale, self.canvas.height / self.config.scale);
        //Sólo enviamos al render objetos que están en el viewport
        if (self.viewPort.enabled) {
            self.arr = [];
            self.arrTokens = self.arrTokens.concat(self.buffer.drawing).concat(self.buffer.intersections);
            self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);
            self.arrTokens.forEach(function (e) {
                var p = e.getRelPos();
                if (self.viewPort.isInside(p.x, p.y)) {
                    self.arr.push(e);
                }
            });
        }
        else {
            self.arr = self.arrTokens.concat(self.buffer.drawing).concat(self.buffer.intersections);
        }
        self.arr.forEach(function (t) {
            if (t.destroy) {
                t.collider = {};
                t = {};
                // var tokenIndex = theScene.arrTokens.findIndex(function(element){
                //     return element.id == t.id;
                // });                                                                   
                // theScene.arrTokens.splice(tokenIndex,1);
                // theScene.tokenIndex = theScene.arrTokens.findIndex(function(element){
                //     return element.id == theScene.tokenId;
                // });
            }
            else {
                t.draw(self.ctx);
            }
            if (t instanceof Projectile) {
                if (t instanceof BulletProjectile) {
                    if (self.config.viewColliders) {
                        t.collider.draw(self.canvas);
                    }
                }
            }
            if (self.config.viewColliders) {
                if (t instanceof collider_1.ColliderToken) {
                    t.collider.draw(self.canvas);
                }
            }
        });
        //self.viewPort.draw();
        // Visualización según configuración                    
        if (self.config.viewGrid) {
            self.drawGrid(self.ctx);
        }
        if (self.viewPort.enabled) {
            self.viewPort.draw(self.ctx);
        }
        // self.ctx.save();
        // self.ctx.beginPath();
        // self.ctx.lineWidth = 4;
        // self.ctx.strokeStyle = 'red';
        // self.ctx.moveTo(self.x,self.y);
        // self.ctx.lineTo(375+self.x,-250+self.y);
        // self.ctx.stroke();
        return window.performance.now();
    };
    //Ciclo de dibujo (activamos movimientos automáticos, pintamos en canvas)  
    var now = window.performance.now();
    this.fps = 60; //fps objetivo
    var arrIntervals = [];
    var elapsed = 0;
    var averageInterval = 0;
    var realFPS = 0;
    this.drawScene = function (timeStamp) {
        elapsed = window.performance.now() - now;
        if (elapsed >= 1000 / self.fps) {
            self.center();
            now = self.render();
        }
        //self.resolver(1);               
        if (!self.pause) {
            //automatTime = self.automat();
        }
        //Cálculo de intervalo medio y FPS real
        arrIntervals.push(window.performance.now());
        var sum = 0;
        for (var i = 0; i < arrIntervals.length - 1; i++) {
            sum += arrIntervals[i + 1] - arrIntervals[i];
        }
        averageInterval = sum / arrIntervals.length;
        realFPS = Math.round(1000 / averageInterval);
        //Ajuste automático de FPS
        if (self.config.autoFPS) {
            if (averageInterval > 22) {
                if (self.fps > 1) {
                    self.fps = Math.round(self.fps / 1.1);
                }
            }
            if (averageInterval < 17) {
                if (self.fps < 60) {
                    self.fps++;
                }
            }
        }
        if (arrIntervals.length > 40) {
            arrIntervals.shift();
        }
        //Info
        document.getElementById('info').value = "TOKENS(TOTAL/DRAWED): [" + self.arrTokens.length + " / " + self.arr.length + "] FPS(config/real): [" + self.fps + " / " + realFPS + "]" +
            ("Draw cycle (config/real): [" + Math.round(1000 / self.fps) + "ms / " + Math.round(averageInterval) + "ms] " + self.engineInfo) + '\n' + self.message;
        requestAnimationFrame(self.drawScene);
    };
};
exports.Scene = Scene;
//# sourceMappingURL=scene.js.map