import { ConfigPoint2D } from "../../lib/models/ConfigPoint2D.js";
export class SceneBuffer {
}
export class SceneConfig {
}
;
export class ViewPortConfig extends ConfigPoint2D {
}
export class GridConfig {
}
export class RenderState {
    constructor() {
        this.now = Date.now();
        this.fps = 60;
        this.arrIntervals = [];
        this.elapsed = 0;
        this.averageInterval = 0;
        this.realFPS = 0;
    }
}
//# sourceMappingURL=models.js.map