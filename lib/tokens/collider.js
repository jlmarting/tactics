"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collider = exports.ColliderToken = void 0;
var image_1 = require("./image");
var point_1 = require("../point/point");
var cursorpoint_1 = require("../point/cursorpoint");
// ImgToken +  Colisionador. El movimiento es dependiente del colisionador.
var ColliderToken = function (id, x, y, rad, src, w, h) {
    image_1.ImgToken.call(this, id, x, y, rad, src, w, h);
    this.collider = new exports.Collider(id, x, y, rad, w / 2);
    this.health = 1000;
};
exports.ColliderToken = ColliderToken;
exports.ColliderToken.prototype = Object.create(image_1.ImgToken.prototype);
exports.ColliderToken.prototype.placeAt = function (x, y) {
    point_1.Point.prototype.placeAt.call(this, Math.round(x), Math.round(y));
};
//Redifinición del método usando además el del prototipo
exports.ColliderToken.prototype.move = function (cmd, displ, tokens) {
    var colliderMovePromise = function (cmd, displ, tokens) {
        return new Promise(function (resolve, reject) {
            var moveResult = exports.Collider.prototype.move.call(this.collider, cmd, displ, tokens);
            resolve(moveResult);
        }.bind(this));
    }.bind(this);
    colliderMovePromise(cmd, displ, tokens).then(function (moveResult) {
        if (moveResult.canMove) {
            image_1.ImgToken.prototype.move.call(this, cmd, displ);
        }
    }.bind(this));
};
// C O L L I D E R
//Colisionador circular
var Collider = function (id, x, y, rad, cradius) {
    cursorpoint_1.CursorPoint.call(this, x, y, rad);
    this.id = id;
    this.radius = cradius;
    this.subColliders = []; //colisionadores internos 
    this.config = { enabled: true, visible: true, innerColor: "rgba(255, 255, 15, 0.60)", borderColor: "magenta", borderWidth: 5 };
    this.back = [];
};
exports.Collider = Collider;
exports.Collider.prototype = Object.create(cursorpoint_1.CursorPoint.prototype);
exports.Collider.prototype.addSubCollider = function () {
    var id = this.id + '_sc_' + this.subColliders.length; //seguimos esta convención en la nomenclatura de identificadores    
    var sc = new exports.Collider(id, this.x, this.y, this.rad, this.radius / 2);
    this.subColliders.push(sc);
};
exports.Collider.prototype.getParentId = function () {
    var arrIds = [];
    arrIds = this.id.split('_sc_');
    return arrIds[0];
};
//Tenemos colisionador y subcolisionadores. el colisionador es una forma rápida de descartar colisiones.
exports.Collider.prototype.isCollisioning = function (otherCollider) {
    var self = this;
    if (this.config.enabled == false)
        return false;
    if (this.id == otherCollider.id)
        return false;
    if ((this instanceof exports.Collider) && (otherCollider instanceof exports.Collider)) {
        var dx = this.x - otherCollider.x;
        var dy = this.y - otherCollider.y;
        var distance = Math.sqrt((dx * dx) + (dy * dy)); //distancia entre centros                    
        var diff = distance - (this.radius + otherCollider.radius); //margen de maniobra           
        if (diff >= 0) {
            return false;
        }
        else {
            if (this.subColliders.length == 0) {
                if (otherCollider.subColliders.length == 0) {
                    return true;
                }
                else {
                    var isCol = false;
                    otherCollider.subColliders.forEach(function (sc) {
                        isCol = isCol || self.isCollisioning(sc);
                    });
                    return isCol;
                }
            }
            else {
                if (otherCollider.subColliders.length == 0) {
                    var isCol = false;
                    this.subColliders.forEach(function (sc) {
                        isCol = isCol || sc.isCollisioning(otherCollider);
                    });
                    return isCol;
                }
                else {
                    var isCol = false;
                    this.subColliders.forEach(function (sc) {
                        otherCollider.subColliders.forEach(function (oc) {
                            isCol = isCol || sc.isCollisioning(oc);
                        });
                    });
                    return isCol;
                }
            }
        }
    }
    else { //No estamos analizando colliders
        return false;
        ;
    }
};
exports.Collider.prototype.getCollisions = function (tokens) {
    if ((typeof tokens == 'undefined') || (tokens.length == 0)) {
        return [];
    }
    var collisions = [];
    for (var i = 0; i < tokens.length; i++) {
        var currCollider = tokens[i].collider;
        if (typeof currCollider !== 'undefined') {
            var currentCol = tokens[i].collider;
            if (this.isCollisioning(currentCol)) {
                collisions.push(tokens[i].id);
            }
        }
    }
    return collisions;
};
/*
    El colisionador se moverá a una nueva posición.
    Las colisiones recogidas son identificadores de tokens en un array.
    Si existen colisiones el colisionador se posicionará en sus coordenadas anteriores (almacenadas en back).
    Se devolverá un objeto con las colisiones y con la propiedad canMove para que el objeto que tiene el colisionador
    actúe en consecuencia.
*/
exports.Collider.prototype.move = function (cmd, displ, tokens, callback) {
    var colPromise = new Promise(function (resolve, reject) {
        if (typeof this.back == 'undefined') {
            console.log('<<collider sin back >>' + JSON.stringify(this.id));
            return { canMove: false, collisions: [] };
        }
        this.back.push({ x: this.x, y: this.y, rad: this.rad, time: window.performance.now() });
        cursorpoint_1.CursorPoint.prototype.move.call(this, cmd, displ);
        if (this.subColliders.length > 0) {
            this.subColliders.forEach(function (sc) {
                sc.move(cmd, displ);
            });
        }
        var collisions = this.getCollisions(tokens);
        resolve(collisions);
    }.bind(this));
    return colPromise.then(function (collisions) {
        if (collisions.length > 0) {
            var pos = this.back.pop();
            this.rad = pos.rad;
            this.placeAt(pos.x, pos.y);
            if (this.subColliders.length > 0) {
                this.subColliders.forEach(function (sc) {
                    var possc = sc.back.pop();
                    sc.placeAt(possc.x, possc.y);
                    sc.rad = possc.rad;
                });
            }
            return { canMove: false, collisions: collisions };
        }
        else {
            if (this.back.length > 350) {
                this.back.shift();
            }
            return { canMove: true, collisions: collisions };
        }
    }.bind(this));
};
exports.Collider.prototype.draw = function (ctx) {
    ctx.save();
    var pos = this.getRelPos();
    var colliderPos = { x: pos.x, y: pos.y };
    ctx.beginPath();
    ctx.lineWidth = this.config.borderWidth;
    ctx.strokeStyle = this.config.borderColor;
    ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI * 2, false);
    ctx.stroke();
    if (this.subColliders.length == 0) {
        ctx.fillStyle = this.config.innerColor;
        ctx.fill();
    }
    else {
        this.subColliders.forEach(function (sc) {
            sc.draw();
        });
    }
    ctx.restore();
};
//# sourceMappingURL=collider.js.map