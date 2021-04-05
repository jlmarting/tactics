"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
var wire_1 = require("../tokens/wire");
var point_1 = require("../point/point");
var Editor = function (scene) {
    //Puntos de trazado activos del editor
    this.points = [];
    var self = this;
    document.addEventListener('keypress', function (e) {
        console.log("keypress " + e.keyCode + " - points: " + self.points.length);
        if (e.keyCode == 110) {
            var tPoints = self.points.slice(0);
            var p = tPoints[0];
            var wt = new wire_1.WireToken('wiretoken' + scene.arrTokens.length, p);
            //self.points.forEach(p=>{wt.load(p)});
            wt.points = self.points.slice(0);
            wt.setCenter();
            console.log("punto medio de " + wt.id + ": " + wt.x + ", " + wt.y);
            //wt.points = self.points;            
            //wt.points.push(wt.points[0]);
            scene.arrTokens.push(wt);
            console.log('Insertado wiretoken: ' + wt.id);
            //el control pasa al último token recien creado
            scene.tokenIndex = scene.arrTokens.length - 1;
            scene.reloadSel();
            scene.arrTokens.forEach(function (element) {
                if (element instanceof wire_1.WireToken) {
                    var iPoints = wt.getIntersections(element);
                    iPoints.forEach(function (e) { scene.buffer.intersections.push(e); });
                }
            });
            self.points = [];
            scene.buffer.drawing = [];
        }
        if (e.keyCode == 100) { //tecla d, borramos
            self.points = [];
            scene.buffer.drawing = [];
        }
        if (e.keyCode == 115) { //tecla S, demo de giro
            var p0 = new point_1.Point(0, 0);
            var wt = new wire_1.WireToken("demo", p0);
            var p1 = new point_1.Point(-250, 0);
            var p2 = new point_1.Point(250, 0);
            wt.load(p1);
            wt.load(p2);
            scene.arrTokens.push(wt);
            // var vueltas = 10;
            // for(var rad = 0; rad += 0.01; rad < (2*Math.PI)*vueltas){
            //     for(var i = 0; i = i; i<wt.points.length){
            //         var p = wt.points[i];   
            //         p.x = p0.x + (Math.cos(rad)*(p.x-p0.x)) - (Math.sin(rad)*(p.y-p0.y)) ;
            //         p.y = p0.y + (Math.sin(rad)*(p.x-p0.x)) + (Math.cos(rad)*(p.y-p0.y)) ;
            //     }
            // } 
            scene.tokenIndex = scene.arrTokens.length - 1;
            self.points = [];
            scene.buffer.drawing = [];
        }
    });
    document.getElementById("tactics").onclick = function (e) {
        var rect = scene.canvas.getBoundingClientRect();
        var p0 = new point_1.Point(rect.x, rect.y);
        var p1 = new point_1.Point(e.x, e.y);
        p1.x = Math.round(p1.x - p0.x - scene.x);
        p1.y = Math.round(p1.y - p0.y - scene.y);
        var p = new point_1.Point(p1.x, p1.y);
        p.id = 'P_' + e.x + '_' + e.y;
        scene.buffer.drawing.push(p);
        this.last = p;
        self.points.push(p);
    };
};
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map