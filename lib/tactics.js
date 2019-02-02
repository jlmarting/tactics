//Creación de escenario: objetos a representar, los empilamos en arrTokens de la escena
// y lanzamos el primer drawscene

var theScene = new Scene("tactics");
    this.config = {};
    this.config.buildExample = false;

    //generalmente nuestro token
    var theToken = new Shooter('one',50,50,0.3,'img/token.png',141,50);
    theToken.displ = 5; //subimos la velocidad de desplazamiento
    theToken.collider.addSubCollider();
    theToken.config.viewName = true;
    theToken.config.selectable = true;


if (this.config.buildExample) {
    var theGrass1 = new ImgToken('grass1', 0,0,2,'img/grass.png',150,100);
    var theGrass2 = new ImgToken('grass2', 0,-500,0,'img/grass.png',150,100);
    var theGrass3 = new ImgToken('grass3', 0,500,0,'img/grass.png',150,100);
    var theGrass4 = new ImgToken('grass4', 500,0,0,'img/grass.png',150,100);
    
    var theBlock4 = new ColliderToken('block4', 150,680,0,'img/concrete_block.png',237,150);
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


}


var theBlock1 = new ColliderToken('block1', 250,50,0,'img/concrete_block.png',237,150);
theBlock1.collider.addSubCollider();
theBlock1.config.viewName = true;
theBlock1.config.selectable = true;

var theBlock2 = new ColliderToken('block2', 725,150,0,'img/concrete_block.png',237,150);
theBlock2.config.viewName = true;

var theBlock3 = new ColliderToken('block3', 750,540,0,'img/concrete_block.png',237,150);
theBlock3.config.viewName = true;
theBlock3.config.selectable = true;


window.onload = function(){

    if (this.config.buildExample){
        //Textura suelo
        for(var i=0;i<30;i++){
            for(var j=0;j<40;j++){            
                var soil = new Tile('soil_'+i+'_'+j,-2000+236*(i),-2000+210*(j),'img/tile_desert_237x211.png',237,211);                            
                theScene.arrTokens.push(soil);            
            }        
        }

        //Muro horizontal superior
        var wallPos = {x:-500,y:-900}
        for(var i=0;i<1000;i++){
            for(var j=10;j<10;j++){
                var brick = new ColliderToken('brick1_'+i+'_'+j,wallPos.x+(32*i),wallPos.y+(20*j) ,0,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push(brick);            
            }        
        }

        

        //Muro vertical izquierda
        wallPos = {x:-500,y:-200}
        for(var i=0;i<10;i++){
            for(var j=0;j<400;j++){
                var brick = new ColliderToken('brick2_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push(brick);            
            }        
        }

        // //Muro vertical izquierda
        wallPos.x += 1200; 
        
        for(var i=0;i<5;i++){
            for(var j=0;j<100;j++){
                var brick = new ColliderToken('brick3_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push( brick);            
            }        
        }

        wallPos.x += 300; 
        wallPos.y = 800; 
        for(var i=0;i<200;i++){
            for(var j=0;j<20;j++){
                var brick = new ColliderToken('brick31_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push( brick);            
            }        
        }




        wallPos.x = 1000; 
        for(var i=0;i<30;i++){
            for(var j=0;j<2;j++){
                var brick = new ColliderToken('brick4_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.config.viewName = false;
                brick.health = 150;
                theScene.arrTokens.push( brick);            
            }        
        }
    
        theScene.arrTokens.push(theGrass1);
        theScene.arrTokens.push(theGrass2);
        theScene.arrTokens.push(theGrass3);
        theScene.arrTokens.push(theGrass4);        
        theScene.arrTokens.push(theBlock3);
        theScene.arrTokens.push(theBlock4);
        theScene.arrTokens.push(AutoToken1);
        theScene.arrTokens.push(AutoToken2);
        theScene.arrTokens.push(AutoToken3);
        theScene.arrTokens.push(AutoToken4);           

    }
    
    theScene.arrTokens.push(theBlock2);
    theScene.arrTokens.push(theBlock1);    
    theScene.arrTokens.push(theToken);  
   
    
    var theEngine = new Engine(theScene);
    var theControl = new Control(theEngine);
    
    theScene.arrTokens.loadImg();
    theEngine.start();
    theScene.drawScene();   
    theScene.setToken('one');  
    
}


