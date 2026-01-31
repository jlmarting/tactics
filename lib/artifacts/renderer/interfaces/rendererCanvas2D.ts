import { IToken } from "../../../tokens/interfaces/itoken";
import { IRenderer } from "./irenderer";

export class RendererCanvas2D implements IRenderer<IToken>{

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    constructor(canvas: HTMLCanvasElement){    
        
        this.canvas = canvas;
        let canvasCtx = this.canvas.getContext("2d");
        if(!canvasCtx){
            throw new Error("No se pudo obtener contexto 2d");
        }
        this.ctx = canvasCtx;
    }
    
    render(items: IToken[]): number {
        const start = performance.now();
        this.clear();
        items.forEach(token => {
            this.drawToken(token);
        });
        return (performance.now() - start);
    }

    clear(): void {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    }

    private drawToken(token: IToken): void{
        throw new Error("Pendiente de implementar drawToken");
    }
    
}