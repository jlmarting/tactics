export class Point {

    x: number;
    y: number;
    info: string;
    id: string;
    startTime: number;
    config: any;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.info;        
        this.startTime = window.performance.now();
        this.id = 'point_' + this.startTime;
        this.config = { position: 'relative', color: 'red', viewName: false };
    }

    placeAt(x: number, y: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }

    getCenter() {
        return { "x": Math.round(this.x), "y": Math.round(this.y) }
    }

    draw(lColor,fColor, self){
        if(this.config == undefined){          
            this.config = {};
        }
        
        if(this.config.color == undefined){

            if(lColor==undefined){
                lColor = "red";
            }
            
            if(fColor==undefined){
                fColor = "white";
            }
        }else{
            lColor = "white";
            fColor = this.config.color;
        }
        
                
        self.ctx.beginPath();    
        self.ctx.strokeStyle = lColor;
        self.ctx.fillStyle = fColor;   

        if(this.config.position == 'relative'){
            self.ctx.fillRect(this.x+self.x, this.y+self.y, 4,4);
            self.ctx.fillText('*('+this.x +',' + this.y+')',this.x+self.x, this.y+self.y);                
        }else{
            self.ctx.fillRect(this.x, this.y, 2,2);   
            self.ctx.fillText('**('+this.x +',' + this.y+')',Math.round(this.x), Math.round(this.y));             
        }

        self.ctx.stroke();    
    }
    
    getRelPos = function(){
        return {x:Math.round(this.x+self.x), y:Math.round(this.y+self.y)};
    }
}
