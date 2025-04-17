import { Coord2D } from "../models/Coord2D.js";
import { Movement2D } from "../models/movement.js";
export class Maths2D {
    static getAngle(origin, destination) {
        const deltaX = destination.x - origin.x;
        const deltaY = destination.y - origin.y;
        return Math.atan2(deltaY, deltaX);
    }
    static getDistance(origin, destination) {
        const deltaX = destination.x - origin.x;
        const deltaY = destination.y - origin.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    static getMovement(origin, angleInRad, displacement, timed = false) {
        const deltaX = displacement + Math.cos(angleInRad);
        const deltaY = displacement + Math.sin(angleInRad);
        const destination = new Coord2D(origin.x + deltaX, origin.y + deltaY, timed);
        const movement = new Movement2D();
        movement.origin = origin;
        movement.destination = destination;
        return movement;
    }
}
//# sourceMappingURL=Maths2D.js.map