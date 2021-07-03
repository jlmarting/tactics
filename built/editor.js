var Editor = function (scene) {
    this.points = [];
    var self = this;
    document.addEventListener('keypress', function (e) {
        console.log("keypress " + e.keyCode + " - points: " + self.points.length);
        if (e.keyCode == 110) {
            var tPoints = self.points.slice(0);
            var p = tPoints[0];
            var wt = new WireToken('wiretoken' + scene.arrTokens.length, p);
            wt.points = self.points.slice(0);
            wt.setCenter();
            console.log("punto medio de " + wt.id + ": " + wt.x + ", " + wt.y);
            scene.arrTokens.push(wt);
            console.log('Insertado wiretoken: ' + wt.id);
            scene.tokenIndex = scene.arrTokens.length - 1;
            scene.reloadSel();
            scene.arrTokens.forEach(function (element) {
                if (element instanceof WireToken) {
                    var iPoints = wt.getIntersections(element);
                    iPoints.forEach(function (e) { scene.buffer.intersections.push(e); });
                }
            });
            self.points = [];
            scene.buffer.drawing = [];
        }
        if (e.keyCode == 100) {
            self.points = [];
            scene.buffer.drawing = [];
        }
        if (e.keyCode == 115) {
            var p0 = new Point(0, 0);
            var wt = new WireToken("demo", p0);
            var p1 = new Point(-250, 0);
            var p2 = new Point(250, 0);
            wt.load(p1);
            wt.load(p2);
            scene.arrTokens.push(wt);
            scene.tokenIndex = scene.arrTokens.length - 1;
            self.points = [];
            scene.buffer.drawing = [];
        }
    });
    document.getElementById("tactics").onclick = function (e) {
        var rect = scene.canvas.getBoundingClientRect();
        var p0 = new Point(rect.x, rect.y);
        var p1 = new Point(e.x, e.y);
        p1.x = Math.round(p1.x - p0.x - scene.x);
        p1.y = Math.round(p1.y - p0.y - scene.y);
        var p = new Point(p1.x, p1.y, 0);
        p.id = 'P_' + e.x + '_' + e.y;
        scene.buffer.drawing.push(p);
        this.last = p;
        self.points.push(p);
    };
};
//# sourceMappingURL=editor.js.map