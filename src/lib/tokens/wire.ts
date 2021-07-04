//@ts-nocheck
//Token poligonal. Sin imagen. Se forma con la unión de una sucesión de puntos ordenada        
const WireToken = function(id, p){  
    CursorPoint.call(this,p.x,p.y,0);
    this.id = id;
    this.config = {viewName:false, selectable:true, position: 'relative', color: 'white', radial: false, enabled: true, closed: true, mesage: ""};         
    this.points = [];  
    this.mod_points = [];
    this.bkpx;
    this.bkpy; 
    this.bkppoints = [];
    this.lastRad = this.rad; 
    this.x = p.x;
    this.y = p.y;
}

WireToken.prototype = Object.create(CursorPoint.prototype);

WireToken.prototype.getRelPos = function(){
    //console.log(this.id);
    return Point.prototype.getRelPos.call(this);
}

WireToken.prototype.draw = function(ctx){   
    if(this.config.enabled==false){
        this.x = JSON.parse(this.bkpx);
        this.y = JSON.parse(this.bkpy);        
        this.points = JSON.parse(this.bkppoints);
        this.rad = JSON.parse(this.bkpRad);
        this.config.enabled = true;        
    } 
    var vectors = this.getVectors();
    CursorPoint.prototype.draw.call(this,ctx);
    vectors.forEach(e =>{
         e.draw(ctx)
     });
     if(this.config.radial == true){
        vectors = this.getRadialVectors();
        CursorPoint.prototype.draw.call(this,ctx);
        vectors.forEach(e =>{
        e.config.color = 'cyan'; 
        e.draw(ctx)
     });
     }
    
 }


WireToken.prototype.move =  function(cmd, displ){  
    
    if(this.config.enabled==false){
        this.x = JSON.parse(this.bkpx);
        this.y = JSON.parse(this.bkpy);        
        this.points = JSON.parse(this.bkppoints);
        this.rad = JSON.parse(this.bkpRad);
        this.config.enabled = true;
        return;       
    } 

    this.bkpRad = JSON.stringify(this.rad);
    this.bkpx = JSON.stringify(this.x);
    this.bkpy = JSON.stringify(this.y);
    this.bkppoints = JSON.stringify(this.points);

    
    if(this.rad > Math.PI *2){
        this.rad -= Math.PI*2;
    }
    if(this.lastRad==null){
        this.lastRad = this.rad;
    }
    
    console.log(`1.- Centro antes de mover: (${this.x}, ${this.y}) ${this.rad} rad`);
    var dXY = CursorPoint.prototype.move.call(this,cmd,displ);   
    console.log(`Vector move ${dXY.x}, ${dXY.y}`);     
    console.log(`2.- Centro despues de mover: (${this.x}, ${this.y}) ${this.rad} rad`);


    //giramos el incremento de rad entre el actual y el anterior
    var rad = (this.lastRad - this.rad)*(-1);    
    console.log(`Giro: ${rad}`);
    //var rad = this.rad;

    var distancias = [];
    this.points.forEach(element => {
        distancias.push(0);
    });
   
    this.config.message = "MOVE:"

    this.mod_points = this.points.slice(0);

    for(var i=0; i<this.points.length; i++){              
        p = this.points[i];     
        var temp = new Point(0,0);
        
        // p.x = dXY.x + (Math.cos(rad)*(p.x-dXY.x)) - (Math.sin(rad)*(p.y-dXY.y)) ;
        // p.y = dXY.y + (Math.sin(rad)*(p.x-dXY.x)) + (Math.cos(rad)*(p.y-dXY.y)) ;
        temp.x = this.x + (Math.cos(rad)*Math.round(p.x-this.x)) - (Math.sin(rad)*Math.round(p.y-this.y));
        temp.y = this.y + (Math.sin(rad)*Math.round(p.x-this.x)) + (Math.cos(rad)*Math.round(p.y-this.y));

        temp.x += dXY.dx;
        temp.y += dXY.dy; 

        p.x = temp.x;
        p.y = temp.y;

        var distancia = Math.sqrt(Math.pow((p.y-this.y),2)+Math.pow((p.x-this.x),2));
        console.log(`Distancia punto ${i} al centro: ${distancia}`);
        if(distancias[i]==0){
            distancias[i] = distancia;
        }else{
            distancias[i] -= distancia;
        }        
        console.log(`Diferencia Distancia punto ${i} al centro: ${distancias[i]}`);
        
        this.points[i] = p;
    }
    
    this.lastRad = this.rad; 
    //this.setCenter();  
    return dXY;
};



//Método de carga de puntos
WireToken.prototype.load = function(p){    
    if(p instanceof Point){
        this.points.push(p);
    }   
    var d = Math.sqrt(Math.pow((p.y-this.y),2)+Math.pow((p.x-this.x),2));
    console.log('Distancia: ' + d);
}

WireToken.prototype.setCenter = function(){
    var sX= 0;
    var sY= 0;
    this.points.forEach(p=>{
        sX += p.x;
        sY += p.y;
    })
    //Punto central
    this.x = Math.round(sX/this.points.length);
    this.y = Math.round(sY/this.points.length);
}


//A partir de los puntos, obtenemos vectores
WireToken.prototype.getVectors = function(){
    var vectors = [];
    for(var i = 0; i<this.points.length; i++){
        var next = i+1; 
        if(next>=this.points.length){
            if(this.config.closed){
                next = 0;
            }else{
                return vectors;
            }
        }
        var v = new Vector(this.id+`_${i}`,this.points[i].x,this.points[i].y,this.points[next].x,this.points[next].y);  
        v.config.color = this.config.color;     
        vectors.push(v);        
    }
    return vectors;
}

WireToken.prototype.getRadialVectors = function(){
    var vectors = [];
    for(var i = 0; i<this.mod_points.length; i++){        
        var v = new Vector(this.id+`_r_${i}` ,this.x,this.y ,this.mod_points[i].x,this.mod_points[i].y);  
        v.config.color = this.config.color;     
        vectors.push(v);        
    }
    return vectors;
}

//Devuelve puntos de intersección con otro WireToken
WireToken.prototype.getIntersections = function(otherWire){
    
    let ownVectors = this.getVectors();
    let otherVectors =otherWire.getVectors();
    let intersections = []

    for(var i = 0; i<ownVectors.length; i++){
        for(var j = 0; j<otherVectors.length; j++){
            var p = ownVectors[i].intersection(otherVectors[j]);   
            if(p != null) {
                intersections.push(p);
            }        
        }            
    }
    return intersections;
}