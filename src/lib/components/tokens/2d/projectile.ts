import { Token2D } from './Token2D.js';
import { ColliderToken } from './collidertoken.js';
import { Movement2D } from '../../../models/movement.js';
import { Coord2D } from '../../../models/Coord2D.js';

/*
 Proyectil básico (sin impacto)
 Representa un punto cuya posición varía con el tiempo desde una posición inicial
 hasta una posición final, en una dirección dada por 'rad'
- from: elemento de procedencia (token al que corresponde el proyectil)
- rad: ángulo en radianes-
- displ: desplazamiento por instante.
- originalRange: rango de movimiento, desplazamiento máximo. 
- range: rango pendiente, desplazamiento por cubrir.
- effect: efecto, una función que podrá ser ejecutada a discreción.
 */
export class Projectile extends Token2D{
    from: any;
    rad: number;
    displ: number;
    originalRange: number;
    range: number;
    effect: Function;


    constructor(x: number, y: number, rad: number, displ: any) {
        super(new Coord2D(x, y));
        this.from = null;
        this.rad = rad;
        this.displ = displ;
        this.originalRange = 1000;
        this.range = this.originalRange;
        this.effect = function () { console.log(this.id + ': No effect'); return true }.bind(this);
    }
    

    //Establece un efecto: función a resolver cuando se determine necesario.
    setEffect(effectType: string) {

        let effect = new Effect();
        switch (effectType) {
            case "damage": this.effect = effect.damage;
            case "split": this.effect = effect.split;
            case "brick": this.effect = effect.brick;
        }
    
    }
    
    //Resolución de movimiento
    move() {
        
        //Inicialización de movimiento
        let dXY: Movement2D = new Movement2D();
        dXY.origin =  this.position;
        dXY.destination = dXY.origin
   
        //Casos en los que no calculamos desplazamiento
        if (this.displ <= 0) return dXY;
        if (this.range == 0) return dXY;
        
        //Caso normal de desplazamiento según rango (desplazamiento pendiente)
        if (this.range > this.displ) {
            this.range -= this.displ;
        } else {
            this.displ = this.range;
            this.range = 0;
        }

        //Cálculo de desplazamiento por eje
        let dx = Math.round(Math.cos(this.rad) * this.displ);
        let dy = Math.round(Math.sin(this.rad) * this.displ);

        //Cálculo de nueva posición
        let x = Math.round(dXY.origin.x  + dx);
        let y = Math.round(dXY.origin.y + dy);
        dXY.destination.x = x;
        dXY.destination.y = y;        
        
        return dXY;
    }
    

    
    // shot(id:any) {
    //     let d = this.move();
    //     if (this.displ == 0) {
    //         d = -1;
    //     }
    //     return d;
    // }
    

}



// Effects: funciones de efectos de impacto    
export class Effect{

    RND(tokenHitted: any, bullet: any) {
        var sel = Math.round(Math.random() * 3);
        switch (sel) {
            case 0: this.damage(tokenHitted, bullet); break;
            case 1: this.spin(tokenHitted, bullet); break;
            case 2: this.damage(tokenHitted, bullet); break;
        }
    }
    
    damage(tokenHitted: any, bullet: any) {
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
    
    spin(tokenHitted: any, bullet: any) {
        tokenHitted.rad -= Math.round(Math.random() * 1);
    }
    
    displace(tokenHitted: any, bullet: any, tokens: Array<any>) {
        tokenHitted.rad = Math.round(Math.random() * 1);
        tokenHitted.move("up", 100, tokens);
    }
    
    split(tokenHitted: any, bullet: any) {
        tokenHitted.delete = true;
    }
    
    brick(tokenHitted: any, bullet: any, tokens: Array<any>) {
        var brick1 = new ColliderToken('newbrick', bullet.x, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick2 = new ColliderToken('newbrick', bullet.x + 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick3 = new ColliderToken('newbrick', bullet.x - 32, bullet.y, 0, 'img/brick001_32x20.png', 32, 20);
        var brick4 = new ColliderToken('newbrick', bullet.x, bullet.y + 20, 0, 'img/brick001_32x20.png', 32, 20);
        brick1.health = 150;
        brick1.config.viewName = false;
        tokens.push(brick1); tokens.push(brick2); tokens.push(brick3); tokens.push(brick4);
        //tokens.loadImg();
        return brick1;
    }
    

}