import { Projectile } from './projectile';
import { Collider } from '../tokens/collider';

// Añadimos colisionador y efecto tras impacto

export class BulletProjectile extends Projectile {
    collider: Collider;
    delete: boolean;

    constructor(id: string, x: number, y: number, rad: number, displ: number) {
        super(x, y, rad, displ);
        this.collider = new Collider(id, Math.round(x), Math.round(y), rad, 1);
        this.delete = false;
    }

    async shot(tokens?: any[]): Promise<number> {
        const moveResult = await this.collider.moveCollider("up", this.displ, tokens);

        if (moveResult.canMove === false || this.range === 0) {
            this.displ = 0;
            this.delete = true;
            this.bulletEffect(moveResult.collisions, this);
        }
        super.shot();
        return this.range;
    }

    bulletEffect(collisions: string[], bullet: BulletProjectile) {
        if (!collisions || collisions.length === 0) return;
        // La lógica de qué hacer tras el impacto suele estar en la escena o en un manejador de efectos
        if (this.effect) {
            this.effect(collisions[0], bullet);
        }
    }
}
