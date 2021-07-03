//Token vinculado a una imagen
const ImgToken = function(id,x,y,rad,src,width,height){
    CursorPoint.call(this,x,y,rad);    
    this.id = id;  
    this.idColor = 'red';    
    this.src = src;
    this.w = width;
    this.h = height;                                       
    this.config = {viewName:false, selectable:false, position: 'relative'};
}

ImgToken.prototype = Object.create(CursorPoint.prototype);

ImgToken.prototype.draw = function(ctx){   

    if(ctx){     
        var pos;
        if(this.config.position == 'relative'){
            pos = this.getRelPos(); 
        }
        else{
            pos = {x:this.x,y:this.y};
        }
        
        var posImg = {x:pos.x-(this.w/2),y:pos.y-(this.h/2)}                 
        
        ctx.save();
        
        if(typeof this.img !== 'undefined'){                       
            ctx.translate(pos.x, pos.y);            
            ctx.rotate(this.rad);                        
            ctx.translate(-(pos.x), -(pos.y));                    
            ctx.drawImage(this.img, posImg.x, posImg.y);       
            ctx.restore();              

            if((this.config['viewName'])&&(self.config['viewIds'])){
                ctx.font = '14px serif';
                ctx.fillStyle = this.idColor;   
                ctx.fillText('('+Math.round(this.x) + ' ,'+Math.round(this.y)+')', pos.x-90,pos.y);
                ctx.font = '24px serif';
                ctx.fillText(this.id, pos.x-20,pos.y-30);

                if(typeof this.health !== 'undefined'){
                    //panel de puntos de vida: un rectángulo sobre el que va el texto
                    ctx.fillStyle = "red";                        
                    ctx.fillRect(pos.x-30,pos.y-70,(1000*120)/1200,10);
                    ctx.fillStyle = "green";                        
                    ctx.fillRect(pos.x-30,pos.y-70,(this.health*120)/1200,10);
                    ctx.fillStyle = "red";                    
                    ctx.font = '14px serif';
                    // self.ctx.fillText('HP: ['+this.health+']', pos.x-20,pos.y-60);                    
                }
            }    

        return 1;
        }
        else{
            var p = new Point(this.x,this.y);;
            p.draw();
            return 1;
        }

    }
    else{
        return -1;        
    }
};


ImgToken.prototype.getCenter = function(){
    return {"x": this.x, "y": this.y}
}

ImgToken.prototype.move = 
function(cmd, displ){
    var dXY = CursorPoint.prototype.move.call(this,cmd,displ)                                                   
    return dXY;
};    

