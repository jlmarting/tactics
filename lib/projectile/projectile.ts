import { Point } from '../point/point.js';

// Proyectil básico (sin impacto)
export class Projectile extends Point {
    from: any;
    rad: number;
    displ: number;
    originalRange: number;
    range: number;
    effect: (target: any, bullet: any) => boolean;

    constructor(x: number, y: number, rad: number, displ: number) {
        super(Math.round(x), Math.round(y));
        this.from = null;
        this.rad = rad;
        this.displ = displ;
        this.originalRange = 1000;
        this.range = this.originalRange;
        this.effect = (target: any, bullet: any) => {
            console.log(this.id + ': No effect');
            return true;
        };
    }

    move(): any {
        if (this.displ <= 0) return -1;
        if (this.range === 0) return -1;

        if (this.range > this.displ) {
            this.range -= this.displ;
        } else {
            this.displ = this.range;
            this.range = 0;
        }

        const dx = Math.round(Math.cos(this.rad) * this.displ);
        const dy = Math.round(Math.sin(this.rad) * this.displ);

        this.x = Math.round(this.x + dx);
        this.y = Math.round(this.y + dy);

        return { dx, dy, displ: this.displ };
    }

    shot(): any {
        const d = this.move();
        if (this.displ === 0) {
            return -1;
        }
        return d;
    }
}
