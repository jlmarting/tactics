import { Vector2D } from "../components/poligons/2d/Vector2D.js";
import { Coord2D } from "../models/Coord2D.js";
import { Movement2D } from "../models/movement.js";

export class Maths2D{

    

    public static getAngle(origin: Coord2D, destination: Coord2D): number {
        const deltaX = destination.x - origin.x;
        const deltaY = destination.y - origin.y;
        return Math.atan2(deltaY, deltaX);
    }

    public static getDistance(origin: Coord2D, destination: Coord2D): number {
        const deltaX = destination.x - origin.x;
        const deltaY = destination.y - origin.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);      
    }

    public static getMovement(origin: Coord2D, angleInRad: number, displacement: number, timed: boolean = false): Movement2D {  
        const deltaX = displacement + Math.cos(angleInRad);
        const deltaY = displacement + Math.sin(angleInRad);
        const destination = new Coord2D(origin.x+deltaX, origin.y+deltaY, timed);
        const movement = new Movement2D();        
        movement.origin = origin;
        movement.destination = destination;       
        return movement;
    }

    
    // getIntersection(vector1: Vector2D, vector2: Vector2D): Coord2D{
    //     throw new Error("Method not implemented.");
    // };
    
    // getIntersection(poligon1: Coord2D[], poligon2: Coord2D[]): Coord2D[]{
    //     throw new Error("Method not implemented.");
    // }
    
    // getIntersection(poligon1: unknown, poligon2: unknown): Coord2D | Coord2D[] {
    //     throw new Error("Method not implemented.");
    //}
}



