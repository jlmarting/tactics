import { Engine } from "../engine/engine";


//Comandos de teclado
export enum KeyCmd{
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,    
    FIRE = 4,
    ZOOMIN = 5,
    ZOOMOUT = 6
}




//Identifica ciertas señales desde los dispositivos de entrada
//para pasarlas al motor para su procesado
export class Control {

    //Comandos de movimiento
    moveCMD: KeyCmd[] = [KeyCmd.LEFT,KeyCmd.RIGHT,KeyCmd.UP,KeyCmd.DOWN];
    
    //Comandos de acción (dusparo)
    fireCMD: KeyCmd[] = [KeyCmd.FIRE];    


    constructor(engine: Engine) {
        let self = this;     

        
        //Configuración de teclas
        function KeyCommand (keyCode: string):KeyCmd {
            console.log(`-- keyCommand: ${keyCode}`);
            switch (keyCode) {
                case "ArrowLeft": return KeyCmd.LEFT;
                case "ArrowUp": return KeyCmd.UP;
                case "ArrowRight": return KeyCmd.RIGHT;
                case "ArrowDown": return KeyCmd.DOWN;
                case "Space": return KeyCmd.FIRE;
            }
        }

        //Teclas de comando de escena
        function KeyScene(keyCode: number):KeyCmd {
            switch (keyCode) {
                case 107: return KeyCmd.ZOOMIN; break;
                case 109: return KeyCmd.ZOOMOUT; break;
            }
        }

        

        //Tratamiento de eventos de teclasdo-
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
        canvas.addEventListener('wheel', 
            function (e) {});
        canvas.addEventListener('mousedcliown', 
            function(e){});

    }
}
