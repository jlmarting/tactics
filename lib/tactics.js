//Creación de escenario: objetos a representar, los empilamos en arrTokens de la escena
// y lanzamos el primer drawscene

var theScene = new Scene("tactics");

//generalmente nuestro token
var theToken = new Shooter('one',50,50,0.3,'img/token.png',141,50);
theToken.displ = 5; //subimos la velocidad de desplazamiento
theToken.collider.addSubCollider();
theToken.config.viewName = true;
theToken.config.selectable = true;


var theGrass1 = new ImgToken('grass1', 550,370,2,'img/grass.png',150,100);
var theGrass2 = new ImgToken('grass2', 850,640,0,'img/grass.png',150,100);
var theGrass3 = new ImgToken('grass3', 850,240,0,'img/grass.png',150,100);
var theGrass4 = new ImgToken('grass4', 250,540,0,'img/grass.png',150,100);

var theBlock1 = new ColliderToken('block1', 250,50,0,'img/concrete_block.png',237,150);
theBlock1.collider.addSubCollider();
theBlock1.config.viewName = true;
theBlock1.config.selectable = true;

var theBlock2 = new ColliderToken('block2', 725,150,0,'img/concrete_block.png',237,150);
theBlock2.config.viewName = true;
var theBlock3 = new ColliderToken('block3', 750,540,0,'img/concrete_block.png',237,150);
theBlock3.config.viewName = true;
theBlock3.config.selectable = true;

var theBlock4 = new ColliderToken('block3', 150,680,0,'img/concrete_block.png',237,150);
theBlock4.config.viewName = true;

var AutoToken1 = new AutoToken('auto1', 550,670,0,'img/token_winter.png',141,50);
AutoToken1.plan =["up","up","up","up", "up", "left","up", "left"];
AutoToken1.collider.addSubCollider();
AutoToken1.config.viewName = true;
AutoToken1.config.selectable = true;

var AutoToken2 = new AutoToken('auto2', 150,340,0,'img/token_winter.png',141,50);
AutoToken2.plan = ["up","up","up","up", "up", "left","up", "left"];
AutoToken2.config.viewName = true;
AutoToken2.config.selectable = true;

var AutoToken3 = new AutoToken('auto3', 450,440,0,'img/token_winter.png',141,50);
AutoToken3.plan = ["up","up","rigth","right","right","right"];
AutoToken3.config.viewName = true;
AutoToken3.config.selectable = true;

var AutoToken4 = new AutoToken('auto4', 450,140,3.1416/2,'img/token.png',141,50);
AutoToken4.plan = ["up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up"];
AutoToken4.config.viewName = true;
AutoToken4.config.selectable = true;


window.onload = function(){

    //Textura suelo
    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            var soil = new ImgToken('soil_'+i+'_'+j,418*(i-1),418*(j-1) ,0,'img/SoilCracked_418x418.jpg',418,418);
            soil.config.viewName = false;
            theScene.arrTokens.push(soil);            
        }        
    }

    //Muro horizontal superior
    var wallPos = {x:-100,y:-500}
    for(var i=0;i<100;i++){
        for(var j=0;j<10;j++){
            var brick = new ColliderToken('brick1_'+i+'_'+j,wallPos.x+(32*i),wallPos.y+(20*j) ,0,'img/brick001_32x20.png',32,20);
            brick.health = 150000;
            brick.config.viewName = false;
            theScene.arrTokens.push( brick);            
        }        
    }

    

    //Muro vertical izquierda
    wallPos = {x:1000,y:300}
    for(var i=0;i<1;i++){
        for(var j=0;j<10;j++){
            var brick = new ColliderToken('brick2_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
            brick.health = 150;
            brick.config.viewName = false;
            theScene.arrTokens.push( brick);            
        }        
    }

    // //Muro vertical izquierda
    // wallPos.x += 1200; 
    
    // for(var i=0;i<3;i++){
    //     for(var j=0;j<20;j++){
    //         var brick = new ColliderToken('brick3_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
    //         brick.health = 150;
    //         brick.config.viewName = false;
    //         theScene.arrTokens.push( brick);            
    //     }        
    // }

    // wallPos.x += 300; 
    
    // for(var i=0;i<2;i++){
    //     for(var j=0;j<20;j++){
    //         var brick = new ColliderToken('brick31_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
    //         brick.health = 150;
    //         brick.config.viewName = false;
    //         theScene.arrTokens.push( brick);            
    //     }        
    // }




    // wallPos.x = 1000; 
    // for(var i=0;i<3;i++){
    //     for(var j=0;j<20;j++){
    //         var brick = new ColliderToken('brick4_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
    //         brick.config.viewName = false;
    //         brick.health = 150;
    //         theScene.arrTokens.push( brick);            
    //     }        
    // }
    
    


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
    theScene.arrTokens.push(AutoToken4);
    theScene.arrTokens.push(theToken);
    

    var theControl = new Control(theScene);

    theScene.drawScene();   
    theScene.setToken('one');  

    theScene.arrTokens.loadImg();
    
}


