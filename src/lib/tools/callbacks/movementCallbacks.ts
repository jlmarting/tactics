import { Coord2D } from "../../models/Coord2D.js";
import { Movement2D } from "../../models/movement.js";

export class MovementCallbacks {
    

    static moveUp(initialPosition: Coord2D, displacement: number, timed: boolean = false): Movement2D{
        return MovementCallbacks.move(initialPosition, 0, displacement, timed);
    }

    static moveDown(initialPosition: Coord2D, displacement: number, timed: boolean = false): Movement2D{
        let displ = (displacement) * (-1);
        return MovementCallbacks.move(initialPosition, 0, displ, timed);
    }

    static moveLeft(initialPosition: Coord2D, angleInRadians: number, displacement: number, timed: boolean = false): Movement2D{   
        let delta_angle = angleInRadians % (Math.PI * 2);
        return MovementCallbacks.move(initialPosition, delta_angle, displacement, timed);
    }

    static moveRight(initialPosition: Coord2D, angleInRadians: number, displacement: number, timed: boolean = false): Movement2D{        
        let delta_angle = angleInRadians % (Math.PI * 2);
        return MovementCallbacks.move(initialPosition, delta_angle, displacement, timed);
    }

    static move(initialPosition: Coord2D, angleInRadians: number, displacement: number, timed: boolean = false): Movement2D {       
        
        let delta_x = (Math.cos(angleInRadians) * displacement);
        let delta_y = (Math.sin(angleInRadians) * displacement);          
        let x: number = Math.round(initialPosition.x + delta_x);
        let y: number = Math.round(initialPosition.y + delta_y);        
        let dest: Coord2D = new Coord2D(x,y,timed);        
        let movement: Movement2D = new Movement2D();       
        movement.origin = initialPosition;
        movement.destination = dest; 
        return movement;
    }


}