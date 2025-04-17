import { BulletProjectile } from "../../lib/components/tokens/2d/bulletprojectile";
import { ColliderToken } from "../../lib/components/tokens/2d/collidertoken";
import { KeyCmd } from "../control/control";
import { Scene } from "./scene";



// Effects: funciones de efectos de impacto    
export class Effect{     
    
    scene: Scene;

    RND(tokenHitted: ColliderToken, bullet: BulletProjectile) {
        var sel = Math.round(Math.random() * 3);
        switch (sel) {
            case 0: this.damage(tokenHitted, bullet); break;
            case 1: this.spin(tokenHitted, bullet); break;
            case 2: this.damage(tokenHitted, bullet); break;
        }
    }
    
    damage(tokenHitted: ColliderToken, bullet: BulletProjectile) {
        tokenHitted.health -= Math.round(Math.random() * 200);
        let hitTime = window.performance.now() - bullet.startTime;
        let hitDistance = bullet.originalRange - bullet.range;
        //bullet.destroy = true;
        console.log(`Tiempo de impacto de ${bullet.id} en ${tokenHitted.id}: ${hitTime}ms` +
            `  ${hitDistance}px vel: ${Math.round((hitDistance / hitTime) * 1000)}px/s`);
        if (tokenHitted.health <= 0) {
            tokenHitted.health = 0;
            tokenHitted.destroy = true;
        }
    }
    
    spin(tokenHitted: ColliderToken, bullet: BulletProjectile) {
        tokenHitted.rad -= Math.round(Math.random() * 1);
    }
    
    displace(tokenHitted: ColliderToken, bullet: BulletProjectile) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move(KeyCmd.UP, 100, this.scene.sceneTokens);
    }
    
    split(tokenHitted: ColliderToken) {
        tokenHitted.delete = true;
    }
    
    brick(tokenHitted: ColliderToken, bullet: BulletProjectile) {
        var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
        brick1.health = 150;
        brick1.config.viewName = false;
        this.scene.sceneTokens.push(brick1); this.scene.sceneTokens.push(brick2); this.scene.sceneTokens.push(brick3); this.scene.sceneTokens.push(brick4);
        
        //TODO: revisar
        //this.scene.arrTokens.loadImg();
        return brick1;
    }
    

}
