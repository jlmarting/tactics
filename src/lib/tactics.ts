//@ts-nocheck

import { Scene } from './scene.js'
import { Engine } from './engine.js';
import { Control } from './control.js';
import { Editor } from './editor.js';
import { Population} from '../scenes/population.js'
//import { ImgToken } from './tokens/image.js';

//Creación de escenario: objetos a representar, los empilamos en arrTokens de la escena
// y lanzamos el primer drawscene


window.onload = function () {
    const theScene = new Scene("tactics",Population);    
    const theEngine = new Engine(theScene);
    const theControl = new Control(theEngine);
    const theEditor = new Editor(theScene);

    Population.populateScene(theScene, 'simple',);


    theScene.arrTokens.loadImg();
    theScene.sceneSelectorLoad();
    theEngine.start();
    theScene.drawScene();
}

// theScene.sceneSelectorLoad

