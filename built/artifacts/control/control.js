export var KeyCmd;
(function (KeyCmd) {
    KeyCmd[KeyCmd["UP"] = 0] = "UP";
    KeyCmd[KeyCmd["DOWN"] = 1] = "DOWN";
    KeyCmd[KeyCmd["LEFT"] = 2] = "LEFT";
    KeyCmd[KeyCmd["RIGHT"] = 3] = "RIGHT";
    KeyCmd[KeyCmd["FIRE"] = 4] = "FIRE";
    KeyCmd[KeyCmd["ZOOMIN"] = 5] = "ZOOMIN";
    KeyCmd[KeyCmd["ZOOMOUT"] = 6] = "ZOOMOUT";
})(KeyCmd || (KeyCmd = {}));
export class Control {
    constructor(engine) {
        this.moveCMD = [KeyCmd.LEFT, KeyCmd.RIGHT, KeyCmd.UP, KeyCmd.DOWN];
        this.fireCMD = [KeyCmd.FIRE];
        let self = this;
        function KeyCommand(keyCode) {
            console.log(`-- keyCommand: ${keyCode}`);
            switch (keyCode) {
                case "ArrowLeft": return KeyCmd.LEFT;
                case "ArrowUp": return KeyCmd.UP;
                case "ArrowRight": return KeyCmd.RIGHT;
                case "ArrowDown": return KeyCmd.DOWN;
                case "Space": return KeyCmd.FIRE;
            }
        }
        function KeyScene(keyCode) {
            switch (keyCode) {
                case 107:
                    return KeyCmd.ZOOMIN;
                    break;
                case 109:
                    return KeyCmd.ZOOMOUT;
                    break;
            }
        }
        document.onkeydown = function (e) {
            let t = e.target;
            let cmd = KeyCommand(e.code);
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
            var cmd = KeyCommand(e.code);
            var index = engine.mapkey.indexOf(cmd);
            if (index > -1) {
                engine.mapkey.splice(index, 1);
            }
        };
        let canvas = engine.scene.ctx.canvas;
        canvas.addEventListener('wheel', function (e) { });
        canvas.addEventListener('mousedcliown', function (e) { });
    }
}
//# sourceMappingURL=control.js.map