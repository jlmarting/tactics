import { Token2D } from "../../lib/components/tokens/2d/Token2D.js";
import { Rectangle } from "../../lib/components/tokens/2d/rectangle.js";
import { Scene } from "./scene.js";
import { ViewPortConfig } from "./models.js";
import { IToken2D } from "../../lib/interfaces/IToken2D.js";

export class SceneSelector {
    
    theScene: Scene;

    // constructor(scene: Scene){
    //     super();                
    //     this.theScene = scene;

    // };
    

    onchange = function(){
        this.theScene.population.populateScene(self, this.value);
    };

    sceneSelectorLoad = function(){
        this.population.scenes.forEach((build: string)=>{
            let opt = document.createElement('option');
            opt.value = build;
            opt.text = build;
            this.sceneSelector.appendChild(opt);
        });
    }
}



export class ViewPort extends Rectangle{
    scene: Scene;
    enabled: Boolean;
    //config: ViewPortConfig; 
    attachTo(t: IToken2D){           
        var pos = t.getRelPos();     
        this.scene.viewPort.placeAt(pos.x,pos.y);
    };  

    constructor(theScene: Scene){
        super(0,0,0,0);
        this.scene = theScene;
        let viewportpoint = new Token2D(theScene.config.viewPortWidth, theScene.config.viewPortHeight);          
        //super(0-(theScene.config.viewPortWidth-5/2),0-(theScene.config.viewPortHeight-5/2),viewportpoint.x,viewportpoint.y);
        this.x = (0-(theScene.config.viewPortWidth-5/2));
        this.y = 0-(theScene.config.viewPortHeight-5/2);
        this.w = viewportpoint.x;
        this.h = viewportpoint.y;
    }
}

export class TokenSelector extends HTMLElement {

    theScene: Scene;
    
    // constructor(scene: Scene) {                    
    //     super();               
    //     this.theScene = scene;     
    // };

    load(){     
        this.innerHTML = null;
        this.theScene.sceneTokens.forEach(function(t){                                    
            if((typeof t.config!== 'undefined')&&(t.config.selectable)){
                let opt = document.createElement('option');
                opt.value = t.id;
                opt.text = t.id;
                if(t.id==this.tokenId){
                    opt.selected= true;
                }
                this.appendChild(opt);
            }
        });
    };


    onchange = function(){  
        let sel = this.value; 
        if(this.theScene.setToken(sel)){
            this.blur();
        };                
    };
}


export class BulletEffectSelector extends HTMLSelectElement{


    // constructor(){
    //    super();
    //    this.addEventListener('click',function(){});
    //    this.addEventListener('change',function(){}); 
    // }

    load(){};

}

