import { ConfigPoint2D } from '../../../models/ConfigPoint2D.js';
import { Coord2D } from '../../../models/Coord2D.js';
import {Token2D} from '../../tokens/2d/Token2D.js'
import {IntersectionPoint} from '../../tokens/2d/intersectionpoint.js'
import { IDrawableCanvas2D } from '../../../interfaces/IDrawableCanvas2D';


export class Vector2D implements IDrawableCanvas2D{
    id: string;
    origin: Coord2D;
    end: Coord2D;
    config: ConfigPoint2D;

    ctx: CanvasRenderingContext2D;
    

    constructor(id: string, firstPoint: Coord2D, lastPoint: Coord2D){
        this.id = id;
        this.origin = firstPoint;
        this.end = lastPoint;
        this.config = new ConfigPoint2D();
        this.config.color = 'green';
    }


    setContext(ctx: CanvasRenderingContext2D): void {
        this.ctx = ctx;
    }    


    draw(){       
        this.ctx.beginPath();        
        this.ctx.moveTo(this.origin.x,this.origin.y);
        this.ctx.strokeStyle = this.config.color;
        this.ctx.lineTo(this.end.x,this.end.y);
        this.ctx.stroke();
    }
    
    
    inRangeX(p:Coord2D){
        if((p.x <= this.origin.x)&&(p.x >= this.end.x)){  
            return true;
        }
        if((p.x >= this.origin.x)&&(p.x <= this.end.x)){  
            return true;
        }
        return false;
    }
    
    inRangeY(p:Coord2D){
        if((p.y <= this.origin.y)&&(p.y >= this.end.y)){  
            return true;
        }
        if((p.y >= this.origin.y)&&(p.y <= this.end.y)){  
            return true;
        }
        return false;
    }
    
    inRange(p:Coord2D){
        return this.inRangeX(p)&&this.inRangeY(p);
    }
    
    intersection(v:Vector2D): IntersectionPoint{
    
        //Comprobamos que no son vectores del mismo objeto
        const id1 = this.id.split('_')[0];
        const id2 = v.id.split('_')[0];
        if (id1==id2){return null};
    
        const m0 = (this.origin.y - this.end.y)/(this.origin.x - this.end.x);
        const m1 = (v.b.y - v.a.y)/(v.b.x - v.a.x);
        let x = null;
        let y = null;
        let b0 = (this.origin.y)-(m0*this.origin.x);
        let b1 = (v.origin.y)-(m1*v.origin.x);
       
        //Comprobamos rectas notables
        if((!isFinite(m1) && !isFinite(m0)) || ((m0==0)&&(m1==0))){       
            console.log("Vectores: " +this.origin.x +","+this.origin.y + " - " + this.end.x + ","+ this.end.y + " --> " + v.a.x +","+v.a.y + " - " + v.b.x + ","+ v.b.y) ;
            console.log("Paralelos");
            return null;
        }
    
        if(!isFinite(m0) && isFinite(m1)){
            //Ax+By+C = 0 , si m = -A/B = infinito, B = 0 --> Ax+C = 0
            x = this.origin.x;        
            y = (m1*x)+b1;                      
            let p = new IntersectionPoint(Math.round(x),Math.round(y),this);        
            if( (this.inRange(p)) && (v.inRange(p)) ){
                p.tokens.push(v);        
                console.log(`* recta 0 vertical --> x:${x} y:${y}   m0:${m0}  m1:${m1}`);  
                return p;
            }
        }
    
        if(!isFinite(m1) && isFinite(m0)){
            x = v.origin.x;
            y = (m0*x)+b0; 
            
            var p = new IntersectionPoint(Math.round(x),Math.round(y),this);
            if(x<v.origin.x){
                if( (this.inRange(p)) && (v.inRange(p)) ){   
                    p.tokens.push(v);        
                    console.log(`* recta 1 vertical --> x:${x} y:${y}   m0:${m0}  m1:${m1}`);  
                    return p;
                }else{
                    return null;
                }            
            }
        
        }
    
        if(m0 == 0){
            y = b0;
            x = (y-b1)/m1;       
            var p =  new IntersectionPoint(Math.round(x),Math.round(y),this);
            if( (this.inRange(p)) && (v.inRange(p)) ){           
                p.tokens.push(v);           
                console.log(`* recta 0 horizontal --> x:${x} y:${y}   m0:${m0}  m1:${m1}`);   
                return ;
            }
        }
    
        if(m1 == 0){
            y = b1;
            x = (y-b0)/m0;        
            var p = new IntersectionPoint(Math.round(x),Math.round(y), this);
            if( (this.inRange(p)) && (v.inRange(p)) ){  
                p.tokens.push(v);         
                console.log(`* recta 1 horizontal --> x:${x} y:${y}   m0:${m0}  m1:${m1}`); 
                return p; 
            }
        }
        
        //  Igualamos las dos rectas: m0x+b0 = m1x+b1 --> (b1-b0)/(m0-m1) --> x
        x = (b1-b0)/(m0-m1);
        y = (m0*x)+b0;       
        if(!isFinite(x) || !isFinite(y)){
            console.log(` infinitos --> x:${x} y:${y}   m0:${m0}  m1:${m1}`); 
            return null;
        }
       
        var p = new IntersectionPoint(Math.round(x),Math.round(y), this);
        if( (this.inRange(p)) && (v.inRange(p)) ){      
            p.tokens.push(v);  
            console.log(`* Rectas no notables x:${x} y:${y}   m0:${m0}  m1:${m1}`);  
            return p;
        }
        
        return null;
    
    }



}