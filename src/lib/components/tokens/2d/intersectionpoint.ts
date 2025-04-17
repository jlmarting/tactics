//Punto de intersección

import { Coord2D } from "../../../models/Coord2D.js";
import { Vector2D } from "../../poligons/2d/Vector2D.js";
import { Token2D } from "./Token2D.js";


export class IntersectionPoint extends Token2D{
    tokens: any[];
    constructor(x: number, y:number, vector: Vector2D) {
        let pos = new Coord2D(x,y);
        super(pos);        
        this.config.color = 'orange';
        this.tokens = []; //Tokens que intervienen en la intersección
        this.tokens.push(vector);
    }


    draw(){
      super.draw();
    }
} 