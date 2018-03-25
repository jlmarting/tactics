var theScene = new Scene("tactics");

var theToken = new ColliderToken('one',50,50,0.3,'img/token.png');

var theGrass1 = new ImgToken('grass1', 350,370,2,'img/grass.png');
var theGrass2 = new ImgToken('grass2', 350,640,0,'img/grass.png');

var theBlock1 = new ColliderToken('block1', 250,150,0,'img/concrete_block.png');
var theBlock2 = new ColliderToken('block2', 550,150,0,'img/concrete_block.png');
var theBlock3 = new ColliderToken('block3', 650,540,0,'img/concrete_block.png');
var theBlock4 = new ColliderToken('block4', 150,540,0,'img/concrete_block.png');

var theOtherToken = new ColliderToken('two', 550,740,0.2,'img/token_winter.png');

var AutoToken1 = new AutoToken('auto', 450,440,0,'img/token_winter.png');

AutoToken1.plan = ["up", "left", "left", "left","up", "left", "left", "left","up", "left", "left", "left"];


theScene.arrTokens.push(theGrass1);
theScene.arrTokens.push(theGrass2);
theScene.arrTokens.push(theBlock1);
theScene.arrTokens.push(theBlock2);
theScene.arrTokens.push(theBlock3);
theScene.arrTokens.push(theBlock4);
theScene.arrTokens.push(theOtherToken);
theScene.arrTokens.push(AutoToken1);
theScene.arrTokens.push(theToken);
theScene.drawScene();

AutoToken1.autopilot();

var theControl = new Control(theToken);

