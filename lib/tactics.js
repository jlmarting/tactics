var canvas = document.getElementById('tactics');
var ctx;

var token1 = {
    'img' :  new Image(),
    'x': 10,
    'y': 10
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
        //volcamos figuras
        ctx.drawImage(token1.img, token1.x, token1.y);        
    }
    else{
        alert('_ERR_NO CANVAS');
        return -1;
    }
};

function move(e){
    var i = document.getElementById('tokens').value;    
    switch (e.keyCode){
        case 37: token1.x -= 10; break;
        case 39: token1.x += 10; break;
        case 38: token1.y -= 10; break;
        case 40: token1.y += 10; break;
    }
    token1.img.x = token1.x;
    token1.img.y = token1.y;
    draw();
    console.log(JSON.stringify(token1));
}




