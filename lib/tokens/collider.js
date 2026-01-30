"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColliderToken = exports.Collider = void 0;
const image_1 = require("./image");
const cursorpoint_1 = require("../point/cursorpoint");
// Colisionador circular
class Collider extends cursorpoint_1.CursorPoint {
    constructor(id, x, y, rad, r) {
        super(x, y, rad);
        this.id = id;
        this.radius = r;
        this.subColliders = []; // colisionadores internos
        this.config = { enabled: true, visible: true, innerColor: "rgba(255, 255, 15, 0.60)", borderColor: "magenta", borderWidth: 5 };
        this.back = [];
    }
    addSubCollider() {
        const id = this.id + '_sc_' + this.subColliders.length;
        const sc = new Collider(id, this.x, this.y, this.rad, this.radius / 2);
        this.subColliders.push(sc);
    }
    getParentId() {
        return this.id.split('_sc_')[0];
    }
    isCollisioning(otherCollider) {
        if (this.config.enabled === false)
            return false;
        if (this.id === otherCollider.id)
            return false;
        if (!(otherCollider instanceof Collider))
            return false;
        const dx = this.x - otherCollider.x;
        const dy = this.y - otherCollider.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        const diff = distance - (this.radius + otherCollider.radius);
        if (diff >= 0) {
            return false;
        }
        else {
            if (this.subColliders.length === 0) {
                if (otherCollider.subColliders.length === 0) {
                    return true;
                }
                else {
                    return otherCollider.subColliders.some(sc => this.isCollisioning(sc));
                }
            }
            else {
                if (otherCollider.subColliders.length === 0) {
                    return this.subColliders.some(sc => sc.isCollisioning(otherCollider));
                }
                else {
                    return this.subColliders.some(sc => otherCollider.subColliders.some(oc => sc.isCollisioning(oc)));
                }
            }
        }
    }
    getCollisions(tokens) {
        if (!tokens || tokens.length === 0)
            return [];
        const collisions = [];
        for (let i = 0; i < tokens.length; i++) {
            const currCollider = tokens[i].collider;
            if (currCollider !== undefined) {
                if (this.isCollisioning(currCollider)) {
                    collisions.push(tokens[i].id);
                }
            }
        }
        return collisions;
    }
    moveCollider(cmd, displ, tokens) {
        return new Promise((resolve) => {
            if (this.back === undefined) {
                console.log('<<collider sin back >>' + JSON.stringify(this.id));
                resolve({ canMove: false, collisions: [] });
                return;
            }
            this.back.push({ x: this.x, y: this.y, rad: this.rad, time: window.performance.now() });
            super.move(cmd, displ);
            if (this.subColliders.length > 0) {
                this.subColliders.forEach(sc => {
                    sc.moveCollider(cmd, displ);
                });
            }
            const collisions = tokens ? this.getCollisions(tokens) : [];
            if (collisions.length > 0) {
                const pos = this.back.pop();
                if (pos) {
                    this.rad = pos.rad;
                    this.placeAt(pos.x, pos.y);
                }
                if (this.subColliders.length > 0) {
                    this.subColliders.forEach(sc => {
                        const possc = sc.back.pop();
                        if (possc) {
                            sc.placeAt(possc.x, possc.y);
                            sc.rad = possc.rad;
                        }
                    });
                }
                resolve({ canMove: false, collisions: collisions });
            }
            else {
                if (this.back.length > 350) {
                    this.back.shift();
                }
                resolve({ canMove: true, collisions: collisions });
            }
        });
    }
    draw(ctx) {
        ctx.save();
        const pos = this.getRelPos();
        ctx.beginPath();
        ctx.lineWidth = this.config.borderWidth;
        ctx.strokeStyle = this.config.borderColor;
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        if (this.subColliders.length === 0) {
            ctx.fillStyle = this.config.innerColor;
            ctx.fill();
        }
        else {
            this.subColliders.forEach(sc => sc.draw(ctx));
        }
        ctx.restore();
    }
}
exports.Collider = Collider;
// ImgToken + Colisionador. El movimiento es dependiente del colisionador.
class ColliderToken extends image_1.ImgToken {
    constructor(id, x, y, rad, src, w, h) {
        super(id, x, y, rad, src, w, h);
        this.collider = new Collider(id, x, y, rad, w / 2);
        this.health = 1000;
    }
    placeAt(x, y) {
        super.placeAt(Math.round(x), Math.round(y));
        this.collider.placeAt(x, y);
    }
    // Redefinición del método usando además el del colisionador
    move(cmd, displ, tokens) {
        const _super = Object.create(null, {
            move: { get: () => super.move }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const moveResult = yield this.collider.moveCollider(cmd, displ, tokens);
            if (moveResult.canMove) {
                return _super.move.call(this, cmd, displ);
            }
            return moveResult;
        });
    }
}
exports.ColliderToken = ColliderToken;
//# sourceMappingURL=collider.js.map