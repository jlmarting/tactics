import { Control } from "./artifacts/control/control";
import { Editor } from "./artifacts/editor/editor";
import { Engine } from "./artifacts/engine/engine";
import { Scene } from "./artifacts/scene/scene";
import { Population } from "./artifacts/scene/scenes/population";
window.onload = function () {
    const theScene = new Scene("tactics", Population);
    const theEngine = new Engine(theScene);
    const theControl = new Control(theEngine);
    const theEditor = new Editor(theScene);
    Population.populateScene(theScene, 'simple');
    theScene.loadImg();
    theEngine.start();
    theScene.drawScene(Date.now());
};
//# sourceMappingURL=main.js.map