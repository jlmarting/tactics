"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var collider_1 = require("./collider");
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
var AutoToken = /** @class */ (function (_super) {
    __extends(AutoToken, _super);
    function AutoToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AutoToken;
}(collider_1.ColliderToken));
//# sourceMappingURL=auto.js.map