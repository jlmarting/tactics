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
import { ColliderToken } from './collider';
var AutoToken = (function (_super) {
    __extends(AutoToken, _super);
    function AutoToken(id, x, y, rad, src, w, h) {
        var _this = _super.call(this, id, x, y, rad, src, w, h) || this;
        _this.plan = [];
        return _this;
    }
    AutoToken.prototype.autopilot = function (tokens) {
        if (this.plan.length > 0) {
            var order = this.plan.pop();
            this.plan.unshift(order);
            this.move(order, 2, tokens);
        }
    };
    return AutoToken;
}(ColliderToken));
export { AutoToken };
//# sourceMappingURL=auto.js.map