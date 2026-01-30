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
exports.BulletProjectile = void 0;
const projectile_1 = require("./projectile");
const collider_1 = require("../tokens/collider");
// Añadimos colisionador y efecto tras impacto
class BulletProjectile extends projectile_1.Projectile {
    constructor(id, x, y, rad, displ) {
        super(x, y, rad, displ);
        this.collider = new collider_1.Collider(id, Math.round(x), Math.round(y), rad, 1);
        this.delete = false;
    }
    shot(tokens) {
        const _super = Object.create(null, {
            shot: { get: () => super.shot }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const moveResult = yield this.collider.moveCollider("up", this.displ, tokens);
            if (moveResult.canMove === false || this.range === 0) {
                this.displ = 0;
                this.delete = true;
                this.bulletEffect(moveResult.collisions, this);
            }
            _super.shot.call(this);
            return this.range;
        });
    }
    bulletEffect(collisions, bullet) {
        if (!collisions || collisions.length === 0)
            return;
        // La lógica de qué hacer tras el impacto suele estar en la escena o en un manejador de efectos
        if (this.effect) {
            this.effect(collisions[0], bullet);
        }
    }
}
exports.BulletProjectile = BulletProjectile;
//# sourceMappingURL=bulletprojectile.js.map