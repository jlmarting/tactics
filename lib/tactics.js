//Creación de escenario: objetos a representar, los empilamos en arrTokens de la escena
// y lanzamos el primer drawscene

var theScene = new Scene("tactics");

//generalmente nuestro token
var theToken = new Shooter('one',50,50,0.3,'img/token.png',theScene);
theToken.displ = 5; //subimos la velocidad de desplazamiento
theToken.collider.addSubCollider(25,25);


var theGrass1 = new ImgToken('grass1', 550,370,2,'img/grass.png');
var theGrass2 = new ImgToken('grass2', 850,640,0,'img/grass.png');
var theGrass3 = new ImgToken('grass3', 850,240,0,'img/grass.png');
var theGrass4 = new ImgToken('grass4', 250,540,0,'img/grass.png');

var theBlock1 = new ColliderToken('block1', 250,50,0,'img/concrete_block.png');
theBlock1.collider.addSubCollider(50,50);
var theBlock2 = new ColliderToken('block2', 725,150,0,'img/concrete_block.png');
var theBlock3 = new ColliderToken('block3', 750,540,0,'img/concrete_block.png');
var theBlock4 = new ColliderToken('block3', 150,680,0,'img/concrete_block.png');


var AutoToken1 = new AutoToken('auto1', 550,670,0,'img/token_winter.png');
AutoToken1.plan = ["down","left", "left", "left", "left", "left", "left","right","right","right","right","right","right","right","right"];
AutoToken1.collider.addSubCollider(50,50);

var AutoToken2 = new AutoToken('auto2', 150,340,0,'img/token_winter.png');
AutoToken2.plan = ["up","up","up","up", "up", "left","up", "left"];

var AutoToken3 = new AutoToken('auto3', 450,440,0,'img/token_winter.png');
AutoToken3.plan = ["up","up","rigth","right","right","right"];


window.onload = function(){

    theScene.arrTokens.push(theGrass1);
    theScene.arrTokens.push(theGrass2);
    theScene.arrTokens.push(theGrass3);
    theScene.arrTokens.push(theGrass4);
    theScene.arrTokens.push(theBlock1);
    theScene.arrTokens.push(theBlock2);
    theScene.arrTokens.push(theBlock3);
    theScene.arrTokens.push(theBlock4);

    theScene.arrTokens.push(AutoToken1);
    theScene.arrTokens.push(AutoToken2);
    theScene.arrTokens.push(AutoToken3);

    theScene.arrTokens.push(theToken);

    var theControl = new Control(theScene);
    
    theControl.selectToken(theToken);


    theScene.drawScene();     
    theScene.centerOn(theToken);
}


