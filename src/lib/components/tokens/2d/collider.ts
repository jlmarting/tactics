import { Token2DCursor } from './Token2DCursor.js'
import { ColliderToken } from './collidertoken.js';
import { Movement2D } from '../../../models/movement.js';
import { Coord2DTime } from '../../../models/Coord2DTime.js';
import { KeyCmd } from '../../../../artifacts/control/control.js';
import { IDrawableCanvas2D } from '../../../interfaces/IDrawableCanvas2D.js';
import { Coord2D } from '../../../models/Coord2D.js';
// ImgToken +  Colisionador. El movimiento es dependiente del colisionador.

// class Config {
//     viewName: boolean;
// }

//{ x: this.x, y: this.y, rad: this.rad, time: window.performance.now() }

// C O L L I D E R
//Colisionador circular
export class Collider extends Token2DCursor implements IDrawableCanvas2D{
    radius: number;
    subColliders: Collider[];
    back: any[];

    constructor(id: string, x: number, y: number, rad: number, cradius: number) {
        super(new Coord2D(x, y), rad);
        this.id = id;
        this.radius = cradius;
        this.config.enabled =  true;
        this.config.visible = true;
        this.config.innerColor = "rgba(255, 255, 15, 0.60)";
        this.config.borderColor = "magenta";
        this.config.borderWidth = 5 ;
        this.back = [];
        this.subColliders = [];
    }

    addSubCollider() {
        let id = this.id + '_sc_' + this.subColliders.length; //seguimos esta convención en la nomenclatura de identificadores    
        let sc = new Collider(id, this.x, this.y, this.rad, this.radius / 2);
        this.subColliders.push(sc);
    }

    getParentId() {
        let arrIds = [];
        arrIds = this.id.split('_sc_');
        return arrIds[0];
    }


    //Tenemos colisionador y subcolisionadores. el colisionador es una forma rápida de descartar colisiones.
    isCollisioning(otherCollider: Collider): boolean {
        let self = this;
        if (this.config.enabled == false) return false;
        if (this.id == otherCollider.id) return false;
        if ((this instanceof Collider) && (otherCollider instanceof Collider)) {
            let dx = this.z - otherCollider.x;
            let dy = this.y - otherCollider.y;
            let distance = Math.sqrt((dx * dx) + (dy * dy)); //distancia entre centros                    
            let diff = distance - (this.radius + otherCollider.radius); //margen de maniobra           

            if (diff >= 0) {
                return false;
            }
            else {
                if (this.subColliders.length == 0) {
                    if (otherCollider.subColliders.length == 0) {
                        return true;
                    }
                    else {
                        let isCol = false;
                        otherCollider.subColliders.forEach(function (sc) {
                            isCol = isCol || self.isCollisioning(sc);
                        });
                        return isCol;
                    }
                }
                else {
                    if (otherCollider.subColliders.length == 0) {
                        let isCol = false;
                        this.subColliders.forEach(function (sc) {
                            isCol = isCol || sc.isCollisioning(otherCollider);
                        });
                        return isCol;
                    }
                    else {
                        let isCol = false;
                        this.subColliders.forEach(function (sc) {
                            otherCollider.subColliders.forEach(function (oc) {
                                isCol = isCol || sc.isCollisioning(oc);
                            });
                        });
                        return isCol;
                    }
                }
            }
        }
        else {  //No estamos analizando colliders
            return false;
        }
    }

    getCollisions(tokens: ColliderToken[]) {
        if ((typeof tokens == 'undefined') || (tokens.length == 0)) {
            return [];
        }
        let collisions = [];
        for (let i = 0; i < tokens.length; i++) {
            let currCollider = tokens[i].collider;
            if (typeof currCollider !== 'undefined') {
                let currentCol = tokens[i].collider;
                if (this.isCollisioning(currentCol)) {
                    collisions.push(tokens[i].id);
                }
            }
        }
        return collisions;
    }

    // Actualizamos colisionador a posición previa(rebobinado)
    rewind(){
        let pos = this.back.pop();        
        this.rad = pos.rad;
        this.placeAt(pos.x, pos.y);

        let rewindPoint = this.back.length;
        let wrongSC: Collider[];

        if (this.subColliders.length > 0) {
            this.subColliders.forEach(function (sc) {
                
                //Ningún subcolisionador debería de tener histórico back superior al colisionador
                if(sc.back.length>rewindPoint+1){
                    sc.back = sc.back.splice(rewindPoint+1);
                    console.log(`Diferencia histórico back en ${sc.id} [${rewindPoint} vs ${sc.back.length}]. Regularizando.`);
                }
                //Caso normal
                if(sc.back.length==rewindPoint+1){
                    let possc = sc.back.pop();
                    sc.placeAt(possc.x, possc.y);
                    sc.rad = possc.rad;    
                }
                else{
                    console.log(`Diferencia histórico back en ${sc.id} [${rewindPoint} vs ${sc.back.length}]. Marcado para eliminar.`);
                    wrongSC.push(sc);
                } 
                
            });
        }
        // Eliminamos subcolisionadores que no se han actualizado correctamente
        this.subColliders.filter(sc => !wrongSC.includes(sc));
    }


move(cmd: KeyCmd, displ: number, tokens?: ColliderToken[]): Movement2D {

        let ctDesplazados: Collider[];
    
        if (typeof this.back == 'undefined') {
            console.log('<<collider sin back >>' + JSON.stringify(this.id));
            return null;
        }

        //Guardamos posición actual del colisionador
        let backPos = new Coord2DTime(this.x, this.y, this.rad);
        backPos.time = window.performance.now();
        if(this.back.length >= 50){
            this.back.pop();
        }
        this.back.push(backPos);

        //Realizamos movimiento y obtenemos colisiones
        this.move(cmd, displ, tokens);
        let collisions = this.getCollisions(tokens);
        
        
        if(collisions.length > 0){
            //Si existen subcolisionadores, sólo habrá colisión si estos la tienen
            if(this.subColliders.length >0){
                for (let i = 0; i<this.subColliders.length; i++ ){
                    let subCollider = this.subColliders[i];
                    let movement = subCollider.move(cmd, displ, tokens);
                    let collisions = subCollider.getCollisions(tokens);                
                    if(collisions.length > 0){
                        this.rewind();
                        return null;
                    }else{
                        ctDesplazados.push(subCollider);
                    }
                }
            }
        }else{
            if (this.back.length > 350) {
                this.back.shift();
            }
        }

        
        
        draw() {
            ctx.save();
            let pos = this.getRelPos();
            let colliderPos = { x: pos.x, y: pos.y };
            ctx.beginPath();
            ctx.lineWidth = this.config.borderWidth;
            ctx.strokeStyle = this.config.borderColor;
            ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
            if (this.subColliders.length == 0) {
                this.ctx.fillStyle = this.config.innerColor;
                this.ctx.fill();
            } else {
                //TODO: revisar
                // this.subColliders
                //     .forEach(
                //         function (sc: Collider) {
                //             sc.draw(ctx)
                //         });
            }
            this.ctx.restore();
        }
     
        



    // return colPromise.then(function (collisions) {
    //     if (collisions.length > 0) {
    //         let pos = this.back.pop();
    //         this.rad = pos.rad;
    //         this.placeAt(pos.x, pos.y);
    //         if (this.subColliders.length > 0) {
    //             this.subColliders.forEach(function (sc) {
    //                 let possc = sc.back.pop();
    //                 sc.placeAt(possc.x, possc.y);
    //                 sc.rad = possc.rad;
    //             });
    //         }
    //         return { canMove: false, collisions: collisions };
    //     }
    //     else {
    //         if (this.back.length > 350) {
    //             this.back.shift();
    //         }
    //         return { canMove: true, collisions: collisions };
    //     }
    // }.bind(this));
}

//refac: revisar donde se hace draw...
// draw() {

//     ctx.save();
//     let pos = this.getRelPos();
//     let colliderPos = { x: pos.x, y: pos.y };
//     ctx.beginPath();
//     ctx.lineWidth = this.config.borderWidth;
//     ctx.strokeStyle = this.config.borderColor;
//     ctx.arc(colliderPos.x, colliderPos.y, this.radius, 0, Math.PI * 2, false);
//     ctx.stroke();

//     if (this.subColliders.length == 0) {
//         ctx.fillStyle = this.config.innerColor;
//         ctx.fill();
//     } else {
//         this.subColliders.forEach(function (sc) {
//             sc.draw()
//         }

//         );
//     }
//     ctx.restore();
// }




}








