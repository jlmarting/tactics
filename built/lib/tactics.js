import { Scene } from './scene.js';
import { Engine } from './engine.js';
import { Control } from './control.js';
import { Editor } from './editor.js';
import { Population } from '../scenes/population.js';


window.onload = function () {
    var theScene = new Scene("tactics", Population);
    var theEngine = new Engine(theScene);
    var theControl = new Control(theEngine);
    var theEditor = new Editor(theScene);
    Population.populateScene(theScene, 'simple');
    theScene.arrTokens.loadImg();
    theScene.sceneSelectorLoad();
    theEngine.start();
    theScene.drawScene();
};
//# sourceMappingURL=tactics.js.map