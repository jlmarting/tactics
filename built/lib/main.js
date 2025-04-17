import { Scene } from '../artifacts/scene/scene.js';
import { Engine } from '../artifacts/engine/engine.js';
import { Control } from '../artifacts/control/control.js';
import { Editor } from '../artifacts/editor/editor.js';
import { Population } from '../scenes/population.js';
window.onload = function () {
    const theScene = new Scene("tactics", Population);
    const theEngine = new Engine(theScene);
    const theControl = new Control(theEngine);
    const theEditor = new Editor(theScene);
    Population.populateScene(theScene, 'linerectangle');
    theScene.loadImg();
    theEngine.start();
    theScene.drawScene(Date.now());
};
//# sourceMappingURL=main.js.map