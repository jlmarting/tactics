import { ColliderToken } from './tokens/collider';

// Effects: funciones de efectos de impacto    
export class Effects {

        RND = function (tokenHitted, bullet) {
            var sel = Math.round(Math.random() * 3);
            switch (sel) {
                case 0: this.damage(tokenHitted, bullet); break;
                case 1: this.spin(tokenHitted, bullet); break;
                case 2: this.damage(tokenHitted, bullet); break;
            }
        };
    
        damage = function (tokenHitted, bullet) {
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
    
        spin = function (tokenHitted, bullet) {
            tokenHitted.rad -= Math.round(Math.random() * 1);
        }
    
        displace = function (tokenHitted, bullet, scene) {
            tokenHitted.rad = Math.round(Math.random() * 1);
            tokenHitted.move("up", 100, scene.arrTokens);
        }
    
        split = function (tokenHitted, bullet) {
            tokenHitted.delete = true;
        }
    
        brick = function (tokenHitted, bullet, scene) {
            var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
            var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
            var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
            var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
            brick1.health = 150;
            brick1.config.viewName = false;
            scene.arrTokens.push(brick1); scene.arrTokens.push(brick2); scene.arrTokens.push(brick3); scene.arrTokens.push(brick4);
            scene.arrTokens.loadImg();
            return brick1;
        }
 
    



} 