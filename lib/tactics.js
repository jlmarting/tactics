"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effects = exports.Tactics = exports.TText = void 0;
const rectangle_1 = require("./tokens/rectangle");
const image_1 = require("./tokens/image");
const collider_1 = require("./tokens/collider");
const scene_1 = require("./scene/scene");
const engine_1 = require("./engine/engine");
const control_1 = require("./ui/control");
const editor_1 = require("./editor/editor");
const shooter_1 = require("./tokens/shooter");
const auto_1 = require("./tokens/auto");
class TText {
    constructor(id, x, y, msg) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.config = { color: 'green' };
    }
    draw(ctx, offset) {
        ctx.save();
        ctx.fillStyle = this.config.color;
        const rx = offset ? this.x + offset.x : this.x;
        const ry = offset ? this.y + offset.y : this.y;
        const arrMsg = this.msg.split(';;');
        let currentY = ry;
        arrMsg.forEach(m => {
            ctx.fillText(m, rx, currentY);
            currentY += 15;
        });
        ctx.restore();
    }
}
exports.TText = TText;
class Tactics {
    constructor() {
        this.config = { buildExample: 'general' };
    }
}
exports.Tactics = Tactics;
const effects_1 = require("./projectile/effects");
exports.Effects = new effects_1.Effects();
const theScene = new scene_1.Scene("tactics");
const theTactics = new Tactics();
// generalmente nuestro token
const theToken = new shooter_1.Shooter('one', 50, 50, 0.3, 'img/token.png', 141, 50);
// subimos la velocidad de desplazamiento
theToken.displ = 5;
if (theToken.collider) {
    theToken.collider.addSubCollider();
}
theToken.config.viewName = true;
// Para que pueda ser seleccionable tendremos que tener esta configuración en el token
theToken.config.selectable = true;
if (theTactics.config.buildExample === 'general') {
    const theGrass1 = new image_1.ImgToken('grass1', 0, 0, 2, 'img/grass.png', 150, 100);
    const theGrass2 = new image_1.ImgToken('grass2', 0, -500, 0, 'img/grass.png', 150, 100);
    const theGrass3 = new image_1.ImgToken('grass3', 0, 500, 0, 'img/grass.png', 150, 100);
    const theGrass4 = new image_1.ImgToken('grass4', 500, 0, 0, 'img/grass.png', 150, 100);
    const theBlock4 = new collider_1.ColliderToken('block4', 150, 680, 0, 'img/concrete_block.png', 237, 150);
    theBlock4.config.viewName = true;
    const autoToken1 = new auto_1.AutoToken('auto1', 550, 670, 0, 'img/token_winter.png', 141, 50);
    autoToken1.plan = ["up", "up", "up", "up", "up", "left", "up", "left"];
    if (autoToken1.collider)
        autoToken1.collider.addSubCollider();
    autoToken1.config.viewName = true;
    autoToken1.config.selectable = true;
    const autoToken2 = new auto_1.AutoToken('auto2', 150, 340, 0, 'img/token_winter.png', 141, 50);
    autoToken2.plan = ["up", "up", "up", "up", "up", "left", "up", "left"];
    autoToken2.config.viewName = true;
    autoToken2.config.selectable = true;
    const autoToken3 = new auto_1.AutoToken('auto3', 450, 440, 0, 'img/token_winter.png', 141, 50);
    autoToken3.plan = ["up", "up", "rigth", "right", "right", "right"];
    autoToken3.config.viewName = true;
    autoToken3.config.selectable = true;
    const autoToken4 = new auto_1.AutoToken('auto4', 450, 140, 3.1416 / 2, 'img/token.png', 141, 50);
    autoToken4.plan = ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up"];
    autoToken4.config.viewName = true;
    autoToken4.config.selectable = true;
    const theBlock1 = new collider_1.ColliderToken('block1', 250, 50, 0, 'img/concrete_block.png', 237, 150);
    if (theBlock1.collider)
        theBlock1.collider.addSubCollider();
    theBlock1.config.viewName = true;
    theBlock1.config.selectable = true;
    const theBlock2 = new collider_1.ColliderToken('block2', 725, 150, 0, 'img/concrete_block.png', 237, 150);
    theBlock2.config.viewName = true;
    const theBlock3 = new collider_1.ColliderToken('block3', 750, 540, 0, 'img/concrete_block.png', 237, 150);
    theBlock3.config.viewName = true;
    theBlock3.config.selectable = true;
    // Muro horizontal superior
    let wallPos = { x: -500, y: -900 };
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const brick = new collider_1.ColliderToken(`brick1_${i}_${j}`, wallPos.x + (32 * i), wallPos.y + (20 * j), 0, 'img/brick001_32x20.png', 32, 20);
            brick.health = 150;
            brick.config.viewName = false;
            theScene.arrTokens.push(brick);
        }
    }
    // Muro vertical izquierda
    wallPos = { x: -500, y: -200 };
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const brick = new collider_1.ColliderToken(`brick2_${i}_${j}`, wallPos.x + (20 * i), wallPos.y + (32 * j), 1.5708, 'img/brick001_32x20.png', 32, 20);
            brick.health = 150;
            brick.config.viewName = false;
            theScene.arrTokens.push(brick);
        }
    }
    theScene.arrTokens.push(theBlock2);
    theScene.arrTokens.push(theBlock1);
    theScene.arrTokens.push(theToken);
    theScene.arrTokens.push(theGrass1);
    theScene.arrTokens.push(theGrass2);
    theScene.arrTokens.push(theGrass3);
    theScene.arrTokens.push(theGrass4);
    theScene.arrTokens.push(theBlock3);
    theScene.arrTokens.push(theBlock4);
    theScene.arrTokens.push(autoToken1);
    theScene.arrTokens.push(autoToken2);
    theScene.arrTokens.push(autoToken3);
    theScene.arrTokens.push(autoToken4);
}
if (theTactics.config.buildExample === 'rectangles') {
    const rect1 = new rectangle_1.Rectangle(0, -250, 400, 120);
    const rect2 = new rectangle_1.Rectangle(125, 0, 120, 300);
    rect1.id = 'rectangle1';
    rect2.id = 'rectangle2';
    theScene.arrTokens.push(rect2);
    theScene.arrTokens.push(rect1);
    theScene.arrTokens.push(theToken);
}
window.onload = () => {
    theScene.setToken('one');
    const theEngine = new engine_1.Engine(theScene);
    const theControl = new control_1.Control(theEngine);
    const theEditor = new editor_1.Editor(theScene);
    theScene.loadImg();
    theEngine.start();
    requestAnimationFrame(theScene.drawScene);
};
//# sourceMappingURL=tactics.js.map