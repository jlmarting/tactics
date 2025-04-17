import { KeyCmd } from '../../../../artifacts/control/control.js';
import {Token2D} from '../../tokens/2d/Token2D.js'
import {Token2DCursor} from '../../tokens/2d/Token2DCursor.js'
import {ConfigPoint2D } from '../../../models/ConfigPoint2D.js';
import {Vector2D} from './Vector2D.js'
import { Coord2DTime } from '../../../models/Coord2DTime';
import { Coord2D } from '../../../models/Coord2D.js';
import { Maths2D } from '../../../tools/Maths2D.js';
import { Movement2D } from '../../../models/movement.js';

//Token poligonal. Sin imagen. Se forma con la unión de una sucesión de puntos ordenada        

export class WireToken extends Token2DCursor {    
    
    points: Token2D[];
    mod_points: Token2D[];
    bkppoints: Token2D[];
    
    lastRad: number;    
    bkpx: number;
    bkpy: number;
    bkrad: number;
   


    constructor(id: string, p: Token2D) {

        if(p == null){
            console.log('Empty wire created...');
            super(new Coord2D(0,0),0);            
        }else{
            super(p.position,0);
            this.position = p.position;
        }

        this.id = id;
        this.config = new ConfigPoint2D();        
        this.config.viewName = false;
        this.config.selectable = true;
        this.config.position = 'relative';
        this.config.color = 'white';
        this.config.radial = false;
        this.config.enabled = true;
        this.config.message = "";
        this.config.closed = false;

        
        this.points = [];
        this.mod_points = [];
        this.bkpx = null;
        this.bkpy = null;
        this.bkrad = null;
        this.bkppoints = [];
        this.lastRad = this.rad;

    }

    getRelPos(){        
        return Token2D.prototype.getRelPos.call(this);
    }

    draw() {
        if (this.config.enabled == false) {
            this.position.x = this.bkpx;
            this.position.y = this.bkpy;
            this.points = this.bkppoints;
            this.rad = this.bkrad;
            this.config.enabled = true;
        }
        var vectors = this.getVectors();
        super.draw();        
        vectors.forEach(e => {
            e.draw();
        });
        if (this.config.radial == true) {
            vectors = this.getRadialVectors();            
            super.draw();
            vectors.forEach(e => {
                e.config.color = 'cyan';
                e.draw()
            });
        }

    }


    move() {

        
        if (this.config.enabled == false) {
            this.position.x = this.bkpx;
            this.position.y = this.bkpy;
            this.points = this.bkppoints;
            this.rad = this.bkrad;
            this.config.enabled = true;
            return;
        }

        this.bkrad = this.rad;
        this.bkpx = this.position.x;
        this.bkpy = this.position.y;
        this.bkppoints = this.points;


        if (this.rad > Math.PI * 2) {
            this.rad -= Math.PI * 2;
        }
        if (this.lastRad == null) {
            this.lastRad = this.rad;
        }

        console.log(`1.- Centro antes de mover: ${this.position.toString()} ${this.rad} rad`);
        // var dXY = Token2DCursor.prototype.move.call(this, cmd, displ);
        super.move(); 
        console.log(`2.- Centro despues de mover: (${this.position.toString()}) ${this.rad} rad`);
        let dXY = {dX: 1, dY: 1};

        //giramos el incremento de rad entre el actual y el anterior
        let rad = (this.lastRad - this.rad) * (-1);
        console.log(`Giro: ${rad}`);
        //var rad = this.rad;

        var distancias = [];
        this.points.forEach(element => {
            distancias.push(0);
        });

        this.config.message = "MOVE:"

        this.mod_points = this.points.slice(0);

        
        //Aplicamos desplazamiento y rotación a todos los puntos de WireToken
        for (var i = 0; i < this.points.length; i++) {
            let p: Token2D = this.points[i];
            let temp = new Token2D(new Coord2D(0,0));

            //Aplicamos fórmula de rotación 2D
            temp.position = new Coord2D(
                this.position.x + 
                (Math.cos(rad) * (p.position.x - this.position.x)) - 
                (Math.sin(rad) * (p.position.y - this.position.y))
                ,
                this.position.y + 
                (Math.sin(rad) * (p.position.x - this.position.x)) + 
                (Math.cos(rad) * (p.position.y - this.position.y))
                );

            let dX = temp.position.x - this.position.x;
            let dY = temp.position.y - this.position.y;
            temp.position.x += dX;
            temp.position.y += dY;
            
            // p.x = temp.x;
            // p.y = temp.y;
            p = temp;

            //var distancia = Math.sqrt(Math.pow((p.position.y - this.position.y), 2) + Math.pow((p.position.x - this.position.x), 2));
            let distancia = Maths2D.getDistance(this.position, temp.position);
            console.log(`Distancia punto ${i} al centro: ${distancia}`);
            
            if (distancias[i] == 0) {
                distancias[i] = distancia;
            } else {
                distancias[i] -= distancia;
            }
            console.log(`Diferencia Distancia punto ${i} al centro: ${distancias[i]}`);

            this.points[i] = p;
        }

        this.lastRad = this.rad;
        //this.setCenter();  
        
        let movement = new Movement2D()
        movement.origin = new Coord2D(this.bkpx, this.bkpy);
        movement.destination = this.position;
        return movement;
    };



    //Método de carga de puntos
    load(p: Token2D) {
        if (p instanceof Token2D) {
            this.points.push(p);
        }
        var d = Math.sqrt(Math.pow((p.position.y - this.position.y), 2) + Math.pow((p.position.x - this.position.x), 2));
        console.log('Distancia: ' + d);
    }

    setCenter() {
        var sX = 0;
        var sY = 0;
        this.points.forEach(p => {
            sX += p.position.x;
            sY += p.position.y;
        })
        //Punto central
        this.position.x = Math.round(sX / this.points.length);
        this.position.y = Math.round(sY / this.points.length);
    }


    //A partir de los puntos, obtenemos vectores
    getVectors() {
        var vectors = [];
        for (var i = 0; i < this.points.length; i++) {
            var next = i + 1;
            if (next >= this.points.length) {
                if (this.config.closed) {
                    next = 0;
                } else {
                    return vectors;
                }
            }
            var v = new Vector2D(
                            this.id + `_${i}`, 
                            new Coord2D(this.points[i].position.x, this.points[i].position.y),
                            new Coord2D(this.points[next].position.x, this.points[next].position.y)
                        );
            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }

    getRadialVectors() {
        var vectors = [];
        for (var i = 0; i < this.mod_points.length; i++) {
            var v = new Vector2D(
                            this.id + `_r_${i}`, 
                            this.position, 
                            new Coord2D(this.mod_points[i].position.x, this.mod_points[i].position.y)
                        );

            v.config.color = this.config.color;
            vectors.push(v);
        }
        return vectors;
    }

    //Devuelve puntos de intersección con otro WireToken
    getIntersections(otherWire: WireToken) {

        let ownVectors = this.getVectors();
        let otherVectors = otherWire.getVectors();
        let intersections = []

        for (var i = 0; i < ownVectors.length; i++) {
            for (var j = 0; j < otherVectors.length; j++) {
                var p = ownVectors[i].intersection(otherVectors[j]);
                if (p != null) {
                    intersections.push(p);
                }
            }
        }
        return intersections;
    }


}
