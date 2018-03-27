var theScene = new Scene("tactics");

var theToken = new Shooter('one',50,50,0.3,'img/token.png',theScene);

var theGrass1 = new ImgToken('grass1', 350,370,2,'img/grass.png');
var theGrass2 = new ImgToken('grass2', 350,640,0,'img/grass.png');

var theBlock1 = new ColliderToken('block1', 250,50,0,'img/concrete_block.png');
var theBlock2 = new ColliderToken('block2', 550,50,0,'img/concrete_block.png');
var theBlock3 = new ColliderToken('block3', 750,540,0,'img/concrete_block.png');


//var theOtherToken = new ColliderToken('two', 550,540,0.2,'img/token_winter.png');

var AutoToken1 = new AutoToken('auto', 450,440,0,'img/token_winter.png');
AutoToken1.plan = ["down","left", "left", "left", "left", "left", "left","right","right","right","right","right","right","right","right"];

var AutoToken2 = new AutoToken('auto', 150,540,0,'img/token_winter.png');
AutoToken2.plan = ["up","up","up","up", "up", "left","up", "left"];

var Bullet1 = new Projectile(0,0,0.7,8);

theScene.arrTokens.push(theGrass1);
theScene.arrTokens.push(theGrass2);
theScene.arrTokens.push(theBlock1);
theScene.arrTokens.push(theBlock2);
theScene.arrTokens.push(theBlock3);

//theScene.arrTokens.push(theOtherToken);
theScene.arrTokens.push(AutoToken1);
theScene.arrTokens.push(AutoToken2);
theScene.arrTokens.push(theToken);
theScene.arrTokens.push(Bullet1);
theScene.drawScene();

AutoToken1.autopilot();AutoToken2.autopilot();
Bullet1.shot();
var theControl = new Control(theToken);

