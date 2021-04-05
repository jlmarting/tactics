import { Point } from '../point/point';
import { ColliderToken, Collider } from './collider';
// Token con movimiento programado (sigue comandos del plan)
// export const AutoToken = function(id,x,y,rad,src,w,h){
//     ColliderToken.call(this,id,x,y,rad,src,w,h);
//     this.plan = [];
// } 

// AutoToken.prototype = Object.create(ColliderToken.prototype);

// AutoToken.prototype.autopilot = function(tokens){
//                                     //se envían movimientos (keyCodes) de la pila "plan"
//                                     if(this.plan.length>0){            
//                                         var order = this.plan.pop();
//                                         this.plan.unshift(order);                        
//                                         this.move(order,2,tokens);                                 
//                                     }
//                                 };
class AutoToken extends ColliderToken {

    plan: Array<Point>;
    constructor(id,x,y,rad,src,w,h){
        super(id,x,y,rad,src,w,h);
    }



} 


