var Control = function (engine) {
    var self = this;
    var engine = engine;
    this.moveCMD = ['left', 'right', 'up', 'down'];
    this.fireCMD = ['fire'];
    this.keyCommand = function (keyCode) {
        switch (keyCode) {
            case 37: return "left";
            case 38: return "up";
            case 39: return "right";
            case 40: return "down";
            case 32: return "fire";
        }
    };
    this.keyScene = function (keyCode) {
        switch (keyCode) {
            case 107:
                return "zoomin";
                break;
            case 109:
                return "zoomout";
                break;
        }
    };
    document.onkeydown = function (e) {
        var t = e.target;
        var cmd = self.keyCommand(e.keyCode);
        if (engine.mapkey.indexOf(cmd) == -1) {
            if (self.fireCMD.indexOf(cmd) > -1) {
                engine.mapkey.push(cmd);
            }
            if (self.moveCMD.indexOf(cmd) > -1) {
                engine.mapkey.push(cmd);
            }
        }
    };
    document.onkeyup = function (e) {
        var cmd = self.keyCommand(e.keyCode);
        var index = engine.mapkey.indexOf(cmd);
        if (index > -1) {
            engine.mapkey.splice(index, 1);
        }
    };
};
//# sourceMappingURL=control.js.map