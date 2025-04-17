import { Movement2D } from "../models/movement";

/* Provee a una clase de métodos necesarios 
para generar un movimiento 2D*/

export interface IMovable2D{    

    move() : Movement2D;
   
    turn(rad: number): void;
}
