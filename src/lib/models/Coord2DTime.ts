import { ICoord2D } from "../interfaces/ICoord2D.js";

export class Coord2DTime implements ICoord2D{
 
    time: number;
    x: number;
    y: number;
    
    constructor(x:number, y:number){   
        this.x = x;
        this.y = y;    
        this.time = window.performance.now();      
    }
  
}





    