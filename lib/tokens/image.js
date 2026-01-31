import { CursorPoint } from "../point/cursorpoint.js";
export class ImgToken extends CursorPoint {
    constructor(id, x, y, rad, src, width, height) {
        super(x, y, rad);
        this.id = id;
        this.idColor = 'red';
        this.src = src;
        this.w = width;
        this.h = height;
        this.config = { viewName: false, selectable: false, position: 'relative' };
        this.delete = false;
        // center se refiere a sí mismo o a un punto que represente el centro
        this.center = this;
    }
    getCenter() {
        return { x: this.x, y: this.y };
    }
    // El método move ya está implementado en CursorPoint, pero podemos sobrescribirlo o usarlo
    move(cmd, displ) {
        return super.move(cmd, displ);
    }
    draw(ctx, lColor, fColor, offset) {
        if (!ctx)
            return -1;
        let pos;
        if (this.config.position === 'relative') {
            // Usamos el offset proporcionado por la escena (cámara)
            pos = this.getRelPos(offset);
        }
        else {
            pos = { x: this.x, y: this.y };
        }
        const posImg = { x: pos.x - (this.w / 2), y: pos.y - (this.h / 2) };
        ctx.save();
        if (this.img !== undefined) {
            ctx.translate(pos.x, pos.y);
            ctx.rotate(this.rad);
            ctx.translate(-(pos.x), -(pos.y));
            ctx.drawImage(this.img, posImg.x, posImg.y);
            ctx.restore();
            // Referencia a config global? El código original usaba self.config['viewIds']
            // Esto es un punto de acoplamiento que debería mejorarse.
            if (this.config['viewName']) {
                ctx.font = '14px serif';
                ctx.fillStyle = this.idColor;
                ctx.fillText('(' + Math.round(this.x) + ' ,' + Math.round(this.y) + ')', pos.x - 90, pos.y);
                ctx.font = '24px serif';
                ctx.fillText(this.id, pos.x - 20, pos.y - 30);
                if (this.health !== undefined) {
                    // panel de puntos de vida
                    ctx.fillStyle = "red";
                    ctx.fillRect(pos.x - 30, pos.y - 70, (1000 * 120) / 1200, 10);
                    ctx.fillStyle = "green";
                    ctx.fillRect(pos.x - 30, pos.y - 70, (this.health * 120) / 1200, 10);
                }
            }
            return 1;
        }
        else {
            // Si no hay imagen, dibujamos un punto
            super.draw(ctx); // Esto podría fallar si CursorPoint.draw no es compatible
            return 1;
        }
    }
}
//# sourceMappingURL=image.js.map