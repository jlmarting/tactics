var Scene = function (canvasId, arrBuilds) {
    this.engineInfo = "";
    this.arrTokens = [];
    this.buffer = {};
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
    this.config = { viewGrid: true, scale: 1, viewColliders: false, viewIds: false, autoFPS: true, viewPortWidth: 1920, viewPortHeight: 900 };
    this.config.effect = 'damage';
    this.config.grid = { height: 0, width: 0, granularity: 50 };
    this.orders = [];
    this.message = " - - - ";
    this.x = 500;
    this.y = 500;
    var self = this;
    var viewportpoint = new Point(self.config.viewPortWidth, self.config.viewPortHeight);
    this.viewPort = new Rectangle(0 - (self.config.viewPortWidth - 5 / 2), 0 - (self.config.viewPortHeight - 5 / 2), viewportpoint.x, viewportpoint.y);
    this.viewPort.config = {};
    this.viewPort.config.innerColor = null;
    this.viewPort.enabled = false;
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
    this.setToken = function (tokenId) {
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
        self.viewPort.attachTo(self.arrTokens[self.tokenIndex]);
        if (self.arrTokens[self.tokenIndex] instanceof ColliderToken) {
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
    this.arrTokens.loadImg = function () {
        self.arrTokens.forEach(function (t) {
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
    };
    this.move = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.centerOn = function (t) {
        if (typeof t == 'undefined')
            return false;
        var scale = self.config.scale;
        var dx = (self.w / (2 * scale)) - t.x;
        var dy = (self.h / (2 * scale)) - t.y;
        self.move(dx, dy);
    };
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
                    }
                }
            }
        }
        self.ctx.restore();
    };
    Point.prototype.draw = function (lColor, fColor) {
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
    Point.prototype.getRelPos = function () {
        return { x: Math.round(this.x + self.x), y: Math.round(this.y + self.y) };
    };
    CursorPoint.prototype.draw = function (ctx) {
        self.ctx.save();
        self.ctx.beginPath();
        var relPos = this.getRelPos();
        var p0 = new Point(this.x, this.y);
        var p1 = new Point(this.x + (Math.cos(this.rad) * 25), this.y + (Math.sin(this.rad) * 25));
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
        Point.prototype.draw.call(this, 'yellow', 'yellow');
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
        return Point.prototype.getRelPos.call(this, this.x, this.y);
    };
    Tile.prototype.draw = function () {
        var pos = this.getRelPos();
        var rw = this.w / 2;
        var rh = this.h / 2;
        self.ctx.drawImage(this.img, pos.x - rw, pos.y - rh);
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
    this.render = function () {
        self.ctx.clearRect(0, 0, self.canvas.width / self.config.scale, self.canvas.height / self.config.scale);
        self.ctx.fillStyle = "black";
        self.ctx.fillRect(0, 0, self.canvas.width / self.config.scale, self.canvas.height / self.config.scale);
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
                if (t instanceof ColliderToken) {
                    t.collider.draw(self.canvas);
                }
            }
        });
        if (self.config.viewGrid) {
            self.drawGrid(self.ctx);
        }
        if (self.viewPort.enabled) {
            self.viewPort.draw(self.ctx);
        }
        return window.performance.now();
    };
    var now = window.performance.now();
    this.fps = 60;
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
        if (!self.pause) {
        }
        arrIntervals.push(window.performance.now());
        var sum = 0;
        for (var i = 0; i < arrIntervals.length - 1; i++) {
            sum += arrIntervals[i + 1] - arrIntervals[i];
        }
        averageInterval = sum / arrIntervals.length;
        realFPS = Math.round(1000 / averageInterval);
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
        document.getElementById('info').value = "TOKENS(TOTAL/DRAWED): [" + self.arrTokens.length + " / " + self.arr.length + "] FPS(config/real): [" + self.fps + " / " + realFPS + "]" +
            ("Draw cycle (config/real): [" + Math.round(1000 / self.fps) + "ms / " + Math.round(averageInterval) + "ms] " + self.engineInfo) + '\n' + self.message;
        requestAnimationFrame(self.drawScene);
    };
};
//# sourceMappingURL=scene.js.map