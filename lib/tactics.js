var theScene = new Scene("tactics");

var theToken = new Shooter('one',50,50,0.3,'img/token.png',theScene);
theToken.collider.addSubCollider(25,25);
theToken.collider.addSubCollider(15,25);

var theGrass1 = new ImgToken('grass1', 550,370,2,'img/grass.png');
var theGrass2 = new ImgToken('grass2', 850,640,0,'img/grass.png');
var theGrass3 = new ImgToken('grass3', 850,240,0,'img/grass.png');
var theGrass4 = new ImgToken('grass4', 250,540,0,'img/grass.png');

var theBlock1 = new ColliderToken('block1', 250,50,0,'img/concrete_block.png');
theBlock1.collider.addSubCollider(50,50);
var theBlock2 = new ColliderToken('block2', 725,150,0,'img/concrete_block.png');
var theBlock3 = new ColliderToken('block3', 750,540,0,'img/concrete_block.png');
var theBlock4 = new ColliderToken('block3', 150,680,0,'img/concrete_block.png');

//var theOtherToken = new ColliderToken('two', 550,540,0.2,'img/token_winter.png');

var AutoToken1 = new AutoToken('auto1', 550,670,0,'img/token_winter.png');
AutoToken1.plan = ["down","left", "left", "left", "left", "left", "left","right","right","right","right","right","right","right","right"];

var AutoToken2 = new AutoToken('auto2', 150,340,0,'img/token_winter.png');
AutoToken2.plan = ["up","up","up","up", "up", "left","up", "left"];

var AutoToken3 = new AutoToken('auto3', 450,440,0,'img/token_winter.png');
AutoToken3.plan = ["up","up","rigth","right","right","right"];



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
//theScene.arrTokens.push(AutoToken3);

theScene.arrTokens.push(theToken);

theScene.drawScene();

AutoToken1.autopilot();AutoToken2.autopilot();AutoToken3.autopilot();

var theControl = new Control(theToken);

