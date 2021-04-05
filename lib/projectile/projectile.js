"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
var point_1 = require("./point/point");
var tactics_1 = require("./tactics");
// Proyectil básico (sin impacto)
var Projectile = function (x, y, rad, displ) {
    point_1.Point.call(this, x, y);
    this.from = null;
    this.rad = rad;
    this.displ = displ;
    this.originalRange = 1000;
    this.range = this.originalRange;
    this.effect = function () { console.log(this.id + ': No effect'); return true; }.bind(this);
};
exports.Projectile = Projectile;
exports.Projectile.prototype.setEffect = function (effectType) {
    switch (effectType) {
        case "damage": this.effect = tactics_1.Tactics.damage();
        case "split": this.effect = tactics_1.Tactics.split();
        case "brick": this.effect = tactics_1.Tactics.effects.brick();
    }
};
exports.Projectile.prototype = Object.create(point_1.Point.prototype);
exports.Projectile.prototype.move = function () {
    if (this.displ <= 0)
        return -1;
    if (this.range == 0)
        return -1;
    if (this.range > this.displ) {
        this.range -= this.displ;
    }
    else {
        this.displ = this.range;
        this.range = 0;
    }
    var dx = Math.round(Math.cos(this.rad) * this.displ);
    var dy = Math.round(Math.sin(this.rad) * this.displ);
    var x = Math.round(this.x + dx);
    var y = Math.round(this.y + dy);
    this.x = x;
    this.y = y;
    var dXY = { "dx": dx, "dy": dy, "displ": this.displ };
    return dXY;
};
exports.Projectile.prototype.shot = function (id) {
    var d = this.move();
    if (this.displ == 0) {
        d = -1;
    }
    return d;
};
//# sourceMappingURL=projectile.js.map