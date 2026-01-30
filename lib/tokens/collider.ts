import { ImgToken } from './image';
import { Point } from '../point/point';
import { CursorPoint } from '../point/cursorpoint';
import { IToken } from './itoken';

// Colisionador circular
export class Collider extends CursorPoint {
    
    radius: number;
    subColliders: Array<Collider>;
    back: Array<{x: number, y: number, rad: number, time: number}>;

    constructor(id: string, x: number, y: number, rad: number, r: number) {
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
    
    isCollisioning(otherCollider: Collider): boolean {
        if (this.config.enabled === false) return false;
        if (this.id === otherCollider.id) return false;

        if (!(otherCollider instanceof Collider)) return false;

        const dx = this.x - otherCollider.x;
        const dy = this.y - otherCollider.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        const diff = distance - (this.radius + otherCollider.radius);

        if (diff >= 0) {
            return false;
        } else {
            if (this.subColliders.length === 0) {
                if (otherCollider.subColliders.length === 0) {
                    return true;
                } else {
                    return otherCollider.subColliders.some(sc => this.isCollisioning(sc));
                }
            } else {
                if (otherCollider.subColliders.length === 0) {
                    return this.subColliders.some(sc => sc.isCollisioning(otherCollider));
                } else {
                    return this.subColliders.some(sc =>
                        otherCollider.subColliders.some(oc => sc.isCollisioning(oc))
                    );
                }
            }
        }
    }
    
    getCollisions(tokens: any[]) {
        if (!tokens || tokens.length === 0) return [];

        const collisions: string[] = [];
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
    
    moveCollider(cmd: string, displ: number, tokens?: any[]): Promise<{canMove: boolean, collisions: string[]}> {
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
            } else {
                if (this.back.length > 350) {
                    this.back.shift();
                }
                resolve({ canMove: true, collisions: collisions });
            }
        });
    }
    
    draw(ctx: CanvasRenderingContext2D) {
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
        } else {
            this.subColliders.forEach(sc => sc.draw(ctx));
        }
        ctx.restore();
    } 
}

// ImgToken + Colisionador. El movimiento es dependiente del colisionador.
export class ColliderToken extends ImgToken {
    collider: Collider;

    constructor(id: string, x: number, y: number, rad: number, src: string, w: number, h: number) {
        super(id, x, y, rad, src, w, h);
        this.collider = new Collider(id, x, y, rad, w / 2);
        this.health = 1000;
    }

    placeAt(x: number, y: number) {
        super.placeAt(Math.round(x), Math.round(y));
        this.collider.placeAt(x, y);
    }

    // Redefinición del método usando además el del colisionador
    async move(cmd: string, displ: number, tokens?: any[]): Promise<any> {
        const moveResult = await this.collider.moveCollider(cmd, displ, tokens);
        if (moveResult.canMove) {
            return super.move(cmd, displ);
        }
        return moveResult;
    }
}
