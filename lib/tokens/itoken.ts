import { Point } from "../point/point";

export interface IToken{
    center: Point;
    w: number;
    h: number;
    rad: number;
    incrGrad: number;
    displ: number;
    grad: number;
    path: Array<Point>;
    config: any;
    delete: boolean;
    id: string;
    x: number;
    y: number;

    getCenter();

    move(cmd:string, displ:number);

    
}