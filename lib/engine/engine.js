"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var auto_1 = require("./tokens/auto");
var bulletprojectile_1 = require("./bulletprojectile");
var wire_1 = require("./tokens/wire");
var projectile_1 = require("./projectile/projectile");
var shooter_1 = require("./tokens/shooter");
var tactics_1 = require("./tactics");
var Engine = function (scene) {
    this.scene = scene;
    this.mapkey = [];
    this.start = function () {
        setInterval(function () {
            this.resolver(1);
            this.automat();
        }.bind(this), 16);
    };
    var self = this;
    //Movimientos automáticos (autopilot, balas,...)
    this.automat = function () {
        scene.arrTokens.forEach(function (t) {
            if (t.delete) {
                var tokenIndex = scene.arrTokens.findIndex(function (element) {
                    return element.id == t.id;
                });
                scene.arrTokens.splice(tokenIndex, 1);
                scene.tokenIndex = scene.arrTokens.findIndex(function (element) {
                    return element.id == scene.tokenId;
                });
            }
            if (t instanceof auto_1.AutoToken) {
                //self.orders.push({cmd:'autopilot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                t.autopilot(scene.arrTokens);
            }
            if (t instanceof projectile_1.Projectile) {
                if (t instanceof bulletprojectile_1.BulletProjectile) {
                    //self.orders.push({cmd:'shot',id:t.id, displ: t.displ, timestamp: window.performance.now()});
                    var d = t.shot(scene.arrTokens);
                }
            }
            //Prueba intersección wiretoken del token seleccionado en tiempo real           
            if ((t instanceof wire_1.WireToken) && (t.id == scene.getSelectedToken().id)) {
                var iPoints = [];
                scene.buffer.intersections = [];
                for (var i = 0; i < scene.arrTokens.length; i++) {
                    var element = scene.arrTokens[i];
                    if (element instanceof wire_1.WireToken) {
                        iPoints = t.getIntersections(element);
                    }
                    iPoints.forEach(function (e) { console.log(e); scene.buffer.intersections.push(e); });
                }
                //Pasamos los vértices al mensaje de la escena
                scene.message = "# " + t.config.message + " # " + t.id + " Centro:-> [" + t.x + "," + t.y + "] V\u00E9rtices: ";
                t.points.forEach(function (element) {
                    scene.message = scene.message + ("[" + element.x + " , " + element.y + "] ");
                });
            }
            if (scene.buffer.intersections.length > 0) {
                //Marcamos el token para indicar que hay colisión
                t.config.enabled = false;
            }
        });
        return window.performance.now();
    };
    // Resolver
    this.resolver = function () {
        //Ejecución de comandos de control sobre el token seleccionado
        var selectedToken = scene.arrTokens[scene.tokenIndex];
        self.mapkey.forEach(function (cmd) {
            var t = scene.arrTokens[scene.tokenIndex];
            //self.orders.push({cmd:cmd,id:t.id, displ: t.displ, timestamp: window.performance.now()});
            //tratamiento de comandos
            if (cmd == "fire") {
                if (selectedToken instanceof shooter_1.Shooter) {
                    var bullet = selectedToken.shot();
                    if (bullet instanceof bulletprojectile_1.BulletProjectile) {
                        bullet.effect = tactics_1.Effects[theScene.config.effect];
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
};
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map