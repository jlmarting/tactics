import { IDeletable } from "../../../interfaces/IDeletable";
import { IDrawableCanvas2D } from "../../../interfaces/IDrawableCanvas2D";
import { ITimed } from "../../../interfaces/ITimed";
import { IToken2D } from "../../../interfaces/IToken2D";
import { ConfigPoint2D } from "../../../models/ConfigPoint2D.js";
import { Coord2D } from "../../../models/Coord2D";


//Punto, para posicionamiento básico en el canvas
export class Token2D implements IToken2D, IDeletable, ITimed, IDrawableCanvas2D{

    position: Coord2D;
    id: string;
    delete: Boolean;
    time: number;
    ctx: CanvasRenderingContext2D;
    canvasId: string;
    config: ConfigPoint2D;
   

    constructor(position: Coord2D) {
        
        this.position = position;
        this.id = 'point_' + Date.now();
        this.time = window.performance.now();
        this.config = new ConfigPoint2D();
        //blue', 1, 'relative', 'red', false 
        this.config.borderColor = 'blue';
        this.config.borderWidth = 1;
        this.config.position = 'relative';
        this.config.color = 'red';
        this.config.selectable = false;
    }
    

    setContext(ctx: CanvasRenderingContext2D): void {
        ctx = ctx;
    }


    draw(){
        let lColor = "white";
        let fColor = this.config.color;
            
        this.ctx.beginPath();    
        this.ctx.strokeStyle = lColor;
        this.ctx.fillStyle = fColor;   

        if(this.config.position == 'relative'){
            this.ctx.fillRect(this.position.x+this.position.x, this.position.y+this.position.y, 4,4);
            this.ctx.fillText('*('+this.position.x +',' + this.position.y+')',
                this.position.x+this.position.x, this.position.y+this.position.y);                
        }else{
            this.ctx.fillRect(this.position.x, this.position.y, 2,2);   
            this.ctx.fillText('**('+this.position.x +',' + this.position.y+')',
                Math.round(this.position.x), Math.round(this.position.y));             
        }
        this.ctx.stroke();    
    }
   
   
    
    getRelPos(){return this.position;}

   

    getCenter() {
         return { "x": Math.round(this.position.x), "y": Math.round(this.position.y) }
    }

    placeAt(position: Coord2D): void {
        this.position = position;
    }

    
}
