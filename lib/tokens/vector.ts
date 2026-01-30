import { Point } from '../point/point';

export class IntersectionPoint extends Point {
    tokens: any[];

    constructor(x: number, y: number, vector: any) {
        super(x, y);
        this.config.color = 'orange';
        this.tokens = [vector];
    }
}

export class Vector {
    id: string;
    a: Point;
    b: Point;
    config: { color: string };

    constructor(id: string, x0: number, y0: number, x1: number, y1: number) {
        this.id = id;
        this.a = new Point(x0, y0);
        this.b = new Point(x1, y1);
        this.config = { color: 'green' };
    }

    draw(ctx: CanvasRenderingContext2D, offset?: { x: number, y: number }) {
        const pa = this.a.getRelPos(offset);
        const pb = this.b.getRelPos(offset);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.strokeStyle = this.config.color;
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
    }

    inRangeX(p: Point): boolean {
        return (p.x <= this.a.x && p.x >= this.b.x) || (p.x >= this.a.x && p.x <= this.b.x);
    }

    inRangeY(p: Point): boolean {
        return (p.y <= this.a.y && p.y >= this.b.y) || (p.y >= this.a.y && p.y <= this.b.y);
    }

    inRange(p: Point): boolean {
        return this.inRangeX(p) && this.inRangeY(p);
    }

    intersection(v: Vector): IntersectionPoint | null {
        // Comprobamos que no son vectores del mismo objeto
        const id1 = this.id.split('_')[0];
        const id2 = v.id.split('_')[0];
        if (id1 === id2) return null;

        const m0 = (this.a.y - this.b.y) / (this.a.x - this.b.x);
        const m1 = (v.b.y - v.a.y) / (v.b.x - v.a.x);

        let x: number | null = null;
        let y: number | null = null;

        const b0 = (this.a.y) - (m0 * this.a.x);
        const b1 = (v.a.y) - (m1 * v.a.x);

        // Paralelos
        if ((!isFinite(m1) && !isFinite(m0)) || (m0 === m1)) {
            return null;
        }

        if (!isFinite(m0) && isFinite(m1)) {
            x = this.a.x;
            y = (m1 * x) + b1;
        } else if (!isFinite(m1) && isFinite(m0)) {
            x = v.a.x;
            y = (m0 * x) + b0;
        } else {
            x = (b1 - b0) / (m0 - m1);
            y = (m0 * x!) + b0;
        }

        if (x !== null && y !== null) {
            const p = new IntersectionPoint(Math.round(x), Math.round(y), this);
            if (this.inRange(p) && v.inRange(p)) {
                p.tokens.push(v);
                return p;
            }
        }

        return null;
    }
}
