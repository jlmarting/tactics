// Creación de escenario: objetos a representar, los empilamos en arrTokens de la escena
// y lanzamos el primer drawscene
import { Point } from "./point/point.js";
import { Rectangle } from "./tokens/rectangle.js"
import { ImgToken } from './tokens/image.js';
import { Collider, ColliderToken } from './tokens/collider.js';
import { Projectile } from './projectile/projectile.js';
import { Scene } from './scene/scene.js';
import { Engine } from './engine/engine.js';
import { Control } from './ui/control.js';
import { Editor } from './editor/editor.js';
import { WireToken } from './tokens/wire.js';
import { Shooter } from './tokens/shooter.js';
import { AutoToken } from './tokens/auto.js';

export class TText {
    id: string;
    x: number;
    y: number;
    msg: string;
    config: { color: string };

    constructor(id: string, x: number, y: number, msg: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.config = { color: 'green' };
    }

    draw(ctx: CanvasRenderingContext2D, offset?: { x: number, y: number }) {
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

export class Tactics {
    config: { buildExample: string };

    constructor() {
        this.config = { buildExample: 'general' };
    }
}

import { Effects as EffectsModule } from './projectile/effects.js';
export const Effects = new EffectsModule();

const theScene = new Scene("tactics");
const theTactics = new Tactics();

// generalmente nuestro token
const theToken = new Shooter('one', 50, 50, 0.3, 'img/token.png', 141, 50);

// subimos la velocidad de desplazamiento
theToken.displ = 5;
if (theToken.collider) {
    theToken.collider.addSubCollider();
}
theToken.config.viewName = true;
// Para que pueda ser seleccionable tendremos que tener esta configuración en el token
theToken.config.selectable = true;

if (theTactics.config.buildExample === 'general') {
    const theGrass1 = new ImgToken('grass1', 0, 0, 2, 'img/grass.png', 150, 100);
    const theGrass2 = new ImgToken('grass2', 0, -500, 0, 'img/grass.png', 150, 100);
    const theGrass3 = new ImgToken('grass3', 0, 500, 0, 'img/grass.png', 150, 100);
    const theGrass4 = new ImgToken('grass4', 500, 0, 0, 'img/grass.png', 150, 100);

    const theBlock4 = new ColliderToken('block4', 150, 680, 0, 'img/concrete_block.png', 237, 150);
    theBlock4.config.viewName = true;

    const autoToken1 = new AutoToken('auto1', 550, 670, 0, 'img/token_winter.png', 141, 50);
    autoToken1.plan = ["up", "up", "up", "up", "up", "left", "up", "left"];
    if (autoToken1.collider) autoToken1.collider.addSubCollider();
    autoToken1.config.viewName = true;
    autoToken1.config.selectable = true;

    const autoToken2 = new AutoToken('auto2', 150, 340, 0, 'img/token_winter.png', 141, 50);
    autoToken2.plan = ["up", "up", "up", "up", "up", "left", "up", "left"];
    autoToken2.config.viewName = true;
    autoToken2.config.selectable = true;

    const autoToken3 = new AutoToken('auto3', 450, 440, 0, 'img/token_winter.png', 141, 50);
    autoToken3.plan = ["up", "up", "rigth", "right", "right", "right"];
    autoToken3.config.viewName = true;
    autoToken3.config.selectable = true;

    const autoToken4 = new AutoToken('auto4', 450, 140, 3.1416 / 2, 'img/token.png', 141, 50);
    autoToken4.plan = ["up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up", "up"];
    autoToken4.config.viewName = true;
    autoToken4.config.selectable = true;

    const theBlock1 = new ColliderToken('block1', 250, 50, 0, 'img/concrete_block.png', 237, 150);
    if (theBlock1.collider) theBlock1.collider.addSubCollider();
    theBlock1.config.viewName = true;
    theBlock1.config.selectable = true;

    const theBlock2 = new ColliderToken('block2', 725, 150, 0, 'img/concrete_block.png', 237, 150);
    theBlock2.config.viewName = true;

    const theBlock3 = new ColliderToken('block3', 750, 540, 0, 'img/concrete_block.png', 237, 150);
    theBlock3.config.viewName = true;
    theBlock3.config.selectable = true;

    // Muro horizontal superior
    let wallPos = { x: -500, y: -900 };
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const brick = new ColliderToken(`brick1_${i}_${j}`, wallPos.x + (32 * i), wallPos.y + (20 * j), 0, 'img/brick001_32x20.png', 32, 20);
            brick.health = 150;
            brick.config.viewName = false;
            theScene.arrTokens.push(brick);
        }
    }

    // Muro vertical izquierda
    wallPos = { x: -500, y: -200 };
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const brick = new ColliderToken(`brick2_${i}_${j}`, wallPos.x + (20 * i), wallPos.y + (32 * j), 1.5708, 'img/brick001_32x20.png', 32, 20);
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
    const rect1 = new Rectangle(0, -250, 400, 120);
    const rect2 = new Rectangle(125, 0, 120, 300);
    rect1.id = 'rectangle1';
    rect2.id = 'rectangle2';

    theScene.arrTokens.push(rect2);
    theScene.arrTokens.push(rect1);
    theScene.arrTokens.push(theToken);
}

window.onload = () => {
    theScene.setToken('one');
    const theEngine = new Engine(theScene);
    const theControl = new Control(theEngine);
    const theEditor = new Editor(theScene);
    theScene.loadImg();
    theEngine.start();
    requestAnimationFrame(theScene.drawScene);
};
