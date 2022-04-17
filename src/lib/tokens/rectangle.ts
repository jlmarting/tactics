//@ts-nocheck
import {Point} from './point'
import {CursorPoint} from './cursorpoint';
import {WireToken} from './wire';

//x,y: coordenadas centro, w,h:width, height
export class Rectangle extends CursorPoint{

    constructor(x:number,y: number,w:number,h:number){
        console.log(`Rectangle x:[${x}] y:[${y}] w:[${w}] h:[${h}]`)
        super(x,y,0);
        this.w=w;
        this.h=h;        
        this.wire = new WireToken("wire_" + this.id, new Point(x,y));
        //this.wire.load(new CursorPoint(x,y,0));
        this.wire.load(new CursorPoint((x+w)/2, (y+h)/2,0));
        this.wire.load(new CursorPoint((x+w/2),(y-h)/2,0));
        this.wire.load(new CursorPoint((x-w)/2, (y-h)/2,0));
        this.wire.load(new CursorPoint((x+w)/2,(y+h)/2,0));
    }
    
    placeAt(x,y){
        CursorPoint.prototype.placeAt.call(this,x,y);
    }
    
    isCollisioning(otherElement){
        if(otherElement instanceof Rectangle == true){
            var intersections = this.wire.getIntersections(otherElement.wire);
            if(intersections.length > 0){
                return true;
            }else{
                return false;
            }
        }else{
            if(s instanceof Collider == true){
                //TODO colisión con Collider
                return false;
            }else{
                return false;
            }
        }
    }
    
    isInside(x,y){
        var rw = Math.round(this.w/2);
        var rh = Math.round(this.h/2);
        return !((x < this.x-rw)||(x > this.x+rw)||(y < this.y-rh)||(y > this.y+rh))
    }
    
    move(cmd){    
        var dXY = CursorPoint.prototype.move.call(this,cmd,5);
        console.log('rectangle move ' + cmd + ' ' + dXY.x + ' ' + dXY.y);  
        this.wire.move(cmd,5);
        return dXY;
    };    
    
    
    
    getRelPos(){
        return Point.prototype.getRelPos.call(this,this.x,this.y);
    }
    
    draw(ctx,lColor,fColor){
        Point.prototype.draw.call(ctx);           
        this.wire.draw(ctx);     
    }

} 