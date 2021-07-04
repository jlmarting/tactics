var Engine = (function () {
    function Engine(scene) {
        this.resolver = function () {
            var selectedToken = scene.arrTokens[scene.tokenIndex];
            self.mapkey.forEach(function (cmd) {
                var t = scene.arrTokens[scene.tokenIndex];
                if (cmd == "fire") {
                    if (selectedToken instanceof Shooter) {
                        var bullet = selectedToken.shot();
                        if (bullet instanceof BulletProjectile) {
                            bullet.effect = Effects[theScene.config.effect];
                            scene.arrTokens.push(bullet);
                        }
                        else {
                            scene.engineInfo = "scene.fire -> " + JSON.stringify(bullet) + " recargando/sin balas";
                        }
                    }
                }
                else {
                    scene.engineInfo = "scene.move -> " + cmd + " ";
                    selectedToken.move(cmd, selectedToken.displ, scene.arrTokens);
                }
            });
            return window.performance.now();
        };
        this.scene = scene;
        this.mapkey = [];
        this.start = function () {
            setInterval(function () {
                this.resolver(1);
                this.automat();
            }.bind(this), 16);
        };
        var self = this;
        this.automat = function () {
            scene.arrTokens.forEach(function (t) {
                if (t["delete"]) {
                    var tokenIndex = scene.arrTokens.findIndex(function (element) {
                        return element.id == t.id;
                    });
                    scene.arrTokens.splice(tokenIndex, 1);
                    scene.tokenIndex = scene.arrTokens.findIndex(function (element) {
                        return element.id == scene.tokenId;
                    });
                }
                if (t instanceof AutoToken) {
                    t.autopilot(scene.arrTokens);
                }
                if (t instanceof Projectile) {
                    if (t instanceof BulletProjectile) {
                        var d = t.shot(scene.arrTokens);
                    }
                }
                if ((t instanceof WireToken) && (t.id == scene.getSelectedToken().id)) {
                    var iPoints = [];
                    scene.buffer.intersections = [];
                    for (var i = 0; i < scene.arrTokens.length; i++) {
                        var element = scene.arrTokens[i];
                        if (element instanceof WireToken) {
                            iPoints = t.getIntersections(element);
                        }
                        iPoints.forEach(function (e) { console.log(e); scene.buffer.intersections.push(e); });
                    }
                    scene.message = "# " + t.config.message + " # " + t.id + " Centro:-> [" + t.x + "," + t.y + "] V\u00E9rtices: ";
                    t.points.forEach(function (element) {
                        scene.message = scene.message + ("[" + element.x + " , " + element.y + "] ");
                    });
                }
                if (scene.buffer.intersections.length > 0) {
                    t.config.enabled = false;
                }
            });
            return window.performance.now();
        };
    }
    return Engine;
}());
//# sourceMappingURL=engine.js.map