import { Point } from "../point/point.js";
import { ImgToken } from "../tokens/image.js";
import { Rectangle } from "../tokens/rectangle.js";

export class ViewPort extends Point {
    
    config: any;
    viewPort: any;
    enabled: boolean;
    
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.config = {};
        this.config.innerColor = null;
        this.enabled = true;
        
        this.viewPort = new Rectangle(0 - (width - 5 / 2), 0 - (height - 5 / 2), this.x, this.y);
    }

    attachTo(t: ImgToken) {
        let pos = t.getRelPos();
        this.placeAt(pos.x, pos.y);        
    }   
}
