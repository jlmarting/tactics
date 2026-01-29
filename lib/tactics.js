//Creación de escenario: objetos a representar, los empilamos en arrTokens de la escena
// y lanzamos el primer drawscene

const theScene = new Scene("tactics", ['general','linerectangle','2lines','imagebrick', 'wirebrick','rectangles','textTest','empty']);

this.config = {};
//this.config.buildExample = 'rectangles';
this.config.buildExample = 'empty';

//generalmente nuestro token
const theToken = new Shooter('one',50,50,0.3,'img/token.png',141,50);
//subimos la velocidad de desplazamiento
theToken.displ = 5; 
theToken.collider.addSubCollider();
theToken.config.viewName = true;
//Para que pueda ser seleccionable tendremos que tener esta configuración en el token
theToken.config.selectable = true;


if (this.config.buildExample == 'general') {
    const theGrass1 = new ImgToken('grass1', 0,0,2,'img/grass.png',150,100);
    const theGrass2 = new ImgToken('grass2', 0,-500,0,'img/grass.png',150,100);
    const theGrass3 = new ImgToken('grass3', 0,500,0,'img/grass.png',150,100);
    const theGrass4 = new ImgToken('grass4', 500,0,0,'img/grass.png',150,100);
    
    const theBlock4 = new ColliderToken('block4', 150,680,0,'img/concrete_block.png',237,150);
    theBlock4.config.viewName = true;

    const AutoToken1 = new AutoToken('auto1', 550,670,0,'img/token_winter.png',141,50);
    AutoToken1.plan =["up","up","up","up", "up", "left","up", "left"];
    AutoToken1.collider.addSubCollider();
    AutoToken1.config.viewName = true;
    AutoToken1.config.selectable = true;

    const AutoToken2 = new AutoToken('auto2', 150,340,0,'img/token_winter.png',141,50);
    AutoToken2.plan = ["up","up","up","up", "up", "left","up", "left"];
    AutoToken2.config.viewName = true;
    AutoToken2.config.selectable = true;

    const AutoToken3 = new AutoToken('auto3', 450,440,0,'img/token_winter.png',141,50);
    AutoToken3.plan = ["up","up","rigth","right","right","right"];
    AutoToken3.config.viewName = true;
    AutoToken3.config.selectable = true;

    const AutoToken4 = new AutoToken('auto4', 450,140,3.1416/2,'img/token.png',141,50);
    AutoToken4.plan = ["up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up","up"];
    AutoToken4.config.viewName = true;
    AutoToken4.config.selectable = true;

    const theBlock1 = new ColliderToken('block1', 250,50,0,'img/concrete_block.png',237,150);
    theBlock1.collider.addSubCollider();
    theBlock1.config.viewName = true;
    theBlock1.config.selectable = true;

    const theBlock2 = new ColliderToken('block2', 725,150,0,'img/concrete_block.png',237,150);
    theBlock2.config.viewName = true;

    const theBlock3 = new ColliderToken('block3', 750,540,0,'img/concrete_block.png',237,150);
    theBlock3.config.viewName = true;
    theBlock3.config.selectable = true;

    //    //Textura suelo
    //     for(let i=0;i<30;i++){
    //         for(let j=0;j<40;j++){
    //             let soil = new Tile('soil_'+i+'_'+j,-2000+236*(i),-2000+210*(j),'img/tile_desert_237x211.png',237,211);
    //             theScene.arrTokens.push(soil);            
    //         }        
    //     }


        //Muro horizontal superior
        let wallPos = {x:-500,y:-900}
        for(let i=0;i<1000;i++){
            for(let j=10;j<10;j++){
                let brick = new ColliderToken('brick1_'+i+'_'+j,wallPos.x+(32*i),wallPos.y+(20*j) ,0,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push(brick);            
            }        
        }


        wallPos = {x:-500,y:-900}
        for(let i=0;i<1000;i++){
            for(let j=10;j<10;j++){
                const theWire = new WireToken('wire1',i,j,0);
                theWire.points.push({x:i+32,y:j});
                theWire.points.push({x:i+32,y:j+20});
                theWire.points.push({x:i,y:j+20});
                theWire.points.push({x:i,y:j});
                theScene.arrTokens.push(theWire);            
            }        
        }


        //Muro vertical izquierda
        wallPos = {x:-500,y:-200}
        for(let i=0;i<10;i++){
            for(let j=0;j<400;j++){
                const brick = new ColliderToken('brick2_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push(brick);            
            }        
        }

        // //Muro vertical izquierda
        wallPos.x += 1200; 
        
        for(let i=0;i<5;i++){
            for(let j=0;j<100;j++){
                const brick = new ColliderToken('brick3_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push( brick);            
            }        
        }

        wallPos.x += 300; 
        wallPos.y = 800; 
        for(let i=0;i<200;i++){
            for(let j=0;j<20;j++){
                const brick = new ColliderToken('brick31_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
                brick.health = 150;
                brick.config.viewName = false;
                theScene.arrTokens.push( brick);            
            }        
        }
   
        // Estructura equivalente 32000 x 2000
        wallPos = {x:-325,y:-325}
            
        const theWire = new WireToken('wire1_',wallPos.x,wallPos.y,0);
        theWire.load({x:16,y:10});
        theWire.load({x:-32016,y:10});
        theWire.load({x:-32016,y:10});
        theWire.load({x:16,y:-216});
        theScene.arrTokens.push(theWire);            

        theScene.arrTokens.push(theBlock2);
        theScene.arrTokens.push(theBlock1);    
        theScene.arrTokens.push(theToken);  
        
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


//Ejemplo de intersecciones entre un rectángulo y una recta
if(this.config.buildExample == 'linerectangle'){
        const wire1 = new WireToken('wire1');
        wire1.load(new Point(-551,351));
        wire1.load(new Point(600,250));
  
        theScene.arrTokens.push(wire1);        
          
        
        const rectangle = new Rectangle(0,0,500,500);
        rectangle.wire.config.color = "orange";
        rectangle.id = 'rectangle1';
        theScene.arrTokens.push(rectangle);  

        let msg = "";
        
        const intersectionPoints = rectangle.wire.getIntersections(wire1);

        intersectionPoints.forEach(element => {
            element.config.color = "yellow";
            element.id = 'intersection_' + wire1.id + '_' + element.id;
            theScene.arrTokens.push(element);    
            msg = msg + '\n' + element.id + ` (${element.x}, ${element.y})`;
        });

        theScene.message = msg ;
        theScene.arrTokens.push(theToken);

        theScene.ctx.restore();
}

// Test de intersección de dos líneas
if(this.config.buildExample == '2lines'){
    const wire1 = new WireToken('wire1');
    wire1.load(new Point(0,0));
    wire1.load(new Point(0,-350));
    


    const wire2 = new WireToken('wire2');
    wire2.load(new Point(-250,25));
    wire2.load(new Point(250,25));
    wire2.config.color = "red";

    const theText = new TText("testText", 30,110, ">> ");
    theScene.arrTokens.push(theText);
    theScene.arrTokens.push(wire1);        
    theScene.arrTokens.push(wire2);         
   
    let msg = "";
    wire1.getIntersections(wire2).forEach(element => {
       
        element.config.color = "orange";
        element.id = 'intersection_' + wire1.id + '_' + wire2.id;
        msg = msg + '\n' + element.id;
        theScene.arrTokens.push(element);            
    })
    theScene.message = msg;
  

    theScene.arrTokens.push(theToken);
    theScene.ctx.restore();
}


if(this.config.buildExample == 'wirebrick'){
    
    const wire1 = new WireToken('wire1',0,-125);
    wire1.load(new Point(-125,0));
    wire1.load(new Point(125,0));
    theScene.arrTokens.push(wire1);
    
    let wallPos = {x:0,y:-375}
    for(let i=0;i<1000;i++){
        for(let j=0;j<4;j++){
            const brick = new Rectangle(wallPos.x+(32*i),wallPos.y+(20*j),32,20);
            brick.id = brick.id + '_'+ i + '_' + j;
            brick.config.viewName = true;
            brick.wire.config.position = 'relative';
            theScene.arrTokens.push(brick);            
        }        
    }

    theScene.arrTokens.push(theToken);
    theScene.ctx.restore();
}



if(this.config.buildExample == 'imagebrick'){
    
    const wire1 = new WireToken('wire1',0,-125);
    wire1.load(new Point(-125,0));
    wire1.load(new Point(125,0));
    theScene.arrTokens.push(wire1);
    
    let wallPos = {x:0,y:-375}
    for(let i=0;i<1000;i++){
        for(let j=0;j<6;j++){
            const brick = new ColliderToken('brick31_'+i+'_'+j,wallPos.x+(20*i),wallPos.y+(32*j) ,1.5708,'img/brick001_32x20.png',32,20);
            brick.health = 150;
            brick.config.viewName = false;
            theScene.arrTokens.push( brick);                        
        }        
    }
    theScene.arrTokens.push(theToken);
    theScene.ctx.restore();
}


if(this.config.buildExample == 'rectangles'){
    
    const rect1 = new Rectangle(0,-250,400,120);
    const rect2 = new Rectangle(125,0,120,300);
    rect1.id = 'rectangle1';
    rect2.id = 'rectangle2';

    console.log(rect1.isCollisioning(rect2));
    

    //theToken = rect1;
    const theText = new TText("testText", 30,110, ">> ");

    const intpoints = rect1.wire.getIntersections(rect2.wire);
    if(intpoints !== null){
        intpoints.forEach(element => {
            const p = new Point(element.x,element.y);
            p.config.color = "orange";  
            theScene.arrTokens.push(p);
            theText.msg += `;;(${p.x},${p.y})`;
        })
    }
    
   
        
    theScene.arrTokens.push(theText);    
    theScene.arrTokens.push(rect2);
    theScene.arrTokens.push(rect1);
    theScene.arrTokens.push(theToken);
    theScene.ctx.restore();
}

if(this.config.buildExample == 'empty'){

    theScene.ctx.restore();
}


window.onload = function(){
    theScene.setToken('one');      
    const theEngine = new Engine(theScene);
    const theControl = new Control(theEngine);
    const theEditor = new Editor(theScene);
    theScene.arrTokens.loadImg();    
    theEngine.start();    
    theScene.drawScene();       
}