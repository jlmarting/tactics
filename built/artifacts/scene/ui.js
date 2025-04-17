import { Token2D } from "../../lib/components/tokens/2d/Token2D.js";
import { Rectangle } from "../../lib/components/tokens/2d/rectangle.js";
export class SceneSelector {
    constructor() {
        this.onchange = function () {
            this.theScene.population.populateScene(self, this.value);
        };
        this.sceneSelectorLoad = function () {
            this.population.scenes.forEach((build) => {
                let opt = document.createElement('option');
                opt.value = build;
                opt.text = build;
                this.sceneSelector.appendChild(opt);
            });
        };
    }
}
export class ViewPort extends Rectangle {
    constructor(theScene) {
        super(0, 0, 0, 0);
        this.scene = theScene;
        let viewportpoint = new Token2D(theScene.config.viewPortWidth, theScene.config.viewPortHeight);
        this.x = (0 - (theScene.config.viewPortWidth - 5 / 2));
        this.y = 0 - (theScene.config.viewPortHeight - 5 / 2);
        this.w = viewportpoint.x;
        this.h = viewportpoint.y;
    }
    attachTo(t) {
        var pos = t.getRelPos();
        this.scene.viewPort.placeAt(pos.x, pos.y);
    }
    ;
}
export class TokenSelector extends HTMLElement {
    constructor() {
        super(...arguments);
        this.onchange = function () {
            let sel = this.value;
            if (this.theScene.setToken(sel)) {
                this.blur();
            }
            ;
        };
    }
    load() {
        this.innerHTML = null;
        this.theScene.sceneTokens.forEach(function (t) {
            if ((typeof t.config !== 'undefined') && (t.config.selectable)) {
                let opt = document.createElement('option');
                opt.value = t.id;
                opt.text = t.id;
                if (t.id == this.tokenId) {
                    opt.selected = true;
                }
                this.appendChild(opt);
            }
        });
    }
    ;
}
export class BulletEffectSelector extends HTMLSelectElement {
    load() { }
    ;
}
//# sourceMappingURL=ui.js.map