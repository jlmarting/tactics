var canvas = document.getElementById('tactics');
var ctx;

var grade = (Math.PI/360)*3;

var token1 = {
    'img' :  new Image(),
    'x': 10,
    'y': 10,
    'rotation': 0
}

token1.img.src ='img/token.png';
token1.img.x = token1.x;
token1.img.y = token1.y;

document.onkeydown = move;

function draw(){

    if(canvas.getContext){
        ctx = canvas.getContext('2d');  
        //limpiamos
        ctx.clearRect(0,0,canvas.width, canvas.height);      
        //guardamos conexto
        ctx.save();
        //cambiamos origen (al centro del token a rotar)
        ctx.translate(token1.x+(token1.img.width/2), token1.y+(token1.img.height/2));
        //aplicamos rotación
        ctx.rotate(token1.rotation);
        //volvemos a trasladar (de vuelta)
        ctx.translate(-(token1.x+(token1.img.width/2)), -(token1.y+(token1.img.height/2)));
        //volcamos figuras
        ctx.drawImage(token1.img, token1.x, token1.y);        
        //retablecemos contexto
        ctx.restore();
    }
    else{
        alert('_ERR_NO CANVAS');
        return -1;        
    }
};

function move(e){
    var i = document.getElementById('tokens').value;
    var desplazamiento = 0;    
    switch (e.keyCode){      
        case 38: desplazamiento = 12; break;
        case 40: desplazamiento = -3; break;
        case 37: token1.rotation -= grade;break;
        case 39: token1.rotation += grade;break;
    }

    token1.x = token1.x + (Math.cos(token1.rotation) * desplazamiento); 
    token1.y = token1.y + (Math.sin(token1.rotation) * desplazamiento); 
    token1.img.x = token1.x;
    token1.img.y = token1.y;
    draw();    
}






