import { CursorPoint } from './cursorpoint.js';
import { Coord2DTime } from './models/Coord2DTime.js';
export class Collider extends CursorPoint {
    constructor(id, x, y, rad, cradius) {
        super(x, y, rad);
        this.id = id;
        this.radius = cradius;
        this.config.enabled = true;
        this.config.visible = true;
        this.config.innerColor = "rgba(255, 255, 15, 0.60)";
        this.config.borderColor = "magenta";
        this.config.borderWidth = 5;
        this.back = [];
        this.subColliders = [];
    }
    addSubCollider() {
        var id = this.id + '_sc_' + this.subColliders.length;
        var sc = new Collider(id, this.x, this.y, this.rad, this.radius / 2);
        this.subColliders.push(sc);
    }
    getParentId() {
        var arrIds = [];
        arrIds = this.id.split('_sc_');
        return arrIds[0];
    }
    isCollisioning(otherCollider) {
        var self = this;
        if (this.config.enabled == false)
            return false;
        if (this.id == otherCollider.id)
            return false;
        if ((this instanceof Collider) && (otherCollider instanceof Collider)) {
            var dx = this.x - otherCollider.x;
            var dy = this.y - otherCollider.y;
            var distance = Math.sqrt((dx * dx) + (dy * dy));
            var diff = distance - (this.radius + otherCollider.radius);
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
        else {
            return false;
        }
    }
    getCollisions(tokens) {
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
    }
    rewind() {
        let pos = this.back.pop();
        this.rad = pos.rad;
        this.placeAt(pos.x, pos.y);
        let rewindPoint = this.back.length;
        let wrongSC;
        if (this.subColliders.length > 0) {
            this.subColliders.forEach(function (sc) {
                if (sc.back.length > rewindPoint + 1) {
                    sc.back = sc.back.splice(rewindPoint + 1);
                    console.log(`Diferencia histórico back en ${sc.id} [${rewindPoint} vs ${sc.back.length}]. Regularizando.`);
                }
                if (sc.back.length == rewindPoint + 1) {
                    var possc = sc.back.pop();
                    sc.placeAt(possc.x, possc.y);
                    sc.rad = possc.rad;
                }
                else {
                    console.log(`Diferencia histórico back en ${sc.id} [${rewindPoint} vs ${sc.back.length}]. Marcado para eliminar.`);
                    wrongSC.push(sc);
                }
            });
        }
        this.subColliders.filter(sc => !wrongSC.includes(sc));
    }
    move(cmd, displ, tokens) {
        let ctDesplazados;
        if (typeof this.back == 'undefined') {
            console.log('<<collider sin back >>' + JSON.stringify(this.id));
            return null;
        }
        let backPos = new Coord2DTime(this.x, this.y, this.rad);
        backPos.time = window.performance.now();
        if (this.back.length >= 50) {
            this.back.pop();
        }
        this.back.push(backPos);
        this.move(cmd, displ, tokens);
        let collisions = this.getCollisions(tokens);
        if (collisions.length > 0) {
            if (this.subColliders.length > 0) {
                for (let i = 0; i < this.subColliders.length; i++) {
                    let subCollider = this.subColliders[i];
                    let movement = subCollider.move(cmd, displ, tokens);
                    let collisions = subCollider.getCollisions(tokens);
                    if (collisions.length > 0) {
                        this.rewind();
                        return null;
                    }
                    else {
                        ctDesplazados.push(subCollider);
                    }
                }
            }
        }
        else {
            if (this.back.length > 350) {
                this.back.shift();
            }
        }
        draw = function (ctx) {
            ctx.save();
            let pos = this.getRelPos();
            let colliderPos = { x: pos.x, y: pos.y };
            ctx.beginPath();
            ctx.lineWidth = this.config.borderWidth;
            ctx.strokeStyle = this.config.borderColor;
            ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
            if (this.subColliders.length == 0) {
                this.ctx.fillStyle = this.config.innerColor;
                this.ctx.fill();
            }
            else {
            }
            this.ctx.restore();
        };
    }
}
//# sourceMappingURL=collider.js.map