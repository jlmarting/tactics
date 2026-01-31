import { Point } from "../../point/point";
import { ImgToken } from "../../tokens/image";
import { IToken } from "../../tokens/interfaces/itoken";
import { Rectangle } from "../../tokens/rectangle";
import { Scene } from './scene';

export class ViewPort extends Point{    
    
    config: any;
    viewPort: Rectangle;
    scene: Scene;
    enabled: boolean;
    
    constructor(x: number, y: number, width: number, height: number)    
    {        
        super(x,y);
        this.config = {};
        this.config.innerColor = null;
        this.enabled = true;
        
        this.viewPort = new Rectangle(0 - (width - 5 / 2), 0 - (height - 5 / 2), this.x, this.y);
        

    }

    public attachTo(t: IToken){
        let delta = this.scene.getRelViewportPos(t)
        this.placeAt(delta.dx, delta.dy);        
    }   

    public isInside(t:IToken): boolean{
        return this.viewPort.isInside(t.center.x,t.center.y)
    }


    

}