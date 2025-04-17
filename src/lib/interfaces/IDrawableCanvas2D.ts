export interface IDrawableCanvas2D {

    ctx: CanvasRenderingContext2D;

    setContext(ctx: CanvasRenderingContext2D): void;

    draw(): void;

    

}