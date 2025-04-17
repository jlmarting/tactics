import { ICoord2D } from "../interfaces/ICoord2D.js";

export class Coord2D implements ICoord2D{
 
    time: number = 0;
    x: number;
    y: number;
    
    constructor(x:number, y:number, timed: boolean = false){   
        this.x = x;
        this.y = y;     
        if(timed){
            this.time = window.performance.now();
        }   
        
    }

    toString(): string{
        return (`(${this.x},${this.y})`);
    }
  
}



