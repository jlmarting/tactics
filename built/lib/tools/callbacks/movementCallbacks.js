import { Coord2D } from "../../models/Coord2D.js";
import { Movement2D } from "../../models/movement.js";
export class MovementCallbacks {
    static moveUp(initialPosition, displacement, timed = false) {
        return MovementCallbacks.move(initialPosition, 0, displacement, timed);
    }
    static moveDown(initialPosition, displacement, timed = false) {
        let displ = (displacement) * (-1);
        return MovementCallbacks.move(initialPosition, 0, displ, timed);
    }
    static moveLeft(initialPosition, angleInRadians, displacement, timed = false) {
        let delta_angle = angleInRadians % (Math.PI * 2);
        return MovementCallbacks.move(initialPosition, delta_angle, displacement, timed);
    }
    static moveRight(initialPosition, angleInRadians, displacement, timed = false) {
        let delta_angle = angleInRadians % (Math.PI * 2);
        return MovementCallbacks.move(initialPosition, delta_angle, displacement, timed);
    }
    static move(initialPosition, angleInRadians, displacement, timed = false) {
        let delta_x = (Math.cos(angleInRadians) * displacement);
        let delta_y = (Math.sin(angleInRadians) * displacement);
        let x = Math.round(initialPosition.x + delta_x);
        let y = Math.round(initialPosition.y + delta_y);
        let dest = new Coord2D(x, y, timed);
        let movement = new Movement2D();
        movement.origin = initialPosition;
        movement.destination = dest;
        return movement;
    }
}
//# sourceMappingURL=movementCallbacks.js.map