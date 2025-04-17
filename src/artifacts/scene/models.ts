import { Token2D } from "../../lib/components/tokens/2d/Token2D.js";
import { ConfigPoint2D } from "../../lib/models/ConfigPoint2D.js";
import { IToken2D } from "../../lib/interfaces/IToken2D.js";

export class SceneBuffer{
    drawing: Token2D[];
    intersections: Token2D[];    
    misc: string[];
}

export class SceneConfig{
    effect: string;
    grid: GridConfig;
    viewGrid: Boolean;
    scale: number;
    viewColliders: Boolean;
    viewIds: Boolean;
    autoFPS: Boolean;
    viewPortWidth: number;
    viewPortHeight: number;
};

export class ViewPortConfig extends ConfigPoint2D{     
    //innerColor: string;           
}

export class GridConfig{
    height: number;
    width: number;
    granularity: number;
}

export class RenderState{
    now: number = Date.now();
    fps: number = 60; //fps objetivo
    arrIntervals: any[] = [];
    elapsed: number = 0;
    averageInterval: number = 0;
    realFPS: number = 0;
}

// export class ConfigScene{
//     grid: GridConfig;
//     viewGrid: boolean;
//     scale: number;
//     viewColliders: boolean;
//     viewIds: boolean;
//     viewPortWidth: number;
//     viewPortWeight: number;
//     effect: string;
//     autoFPS: boolean;
// }
