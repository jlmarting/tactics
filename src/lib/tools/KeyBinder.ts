import { KeyCmd } from "../../artifacts/control/control";
import { IKeyBindeable } from "../interfaces/IKeyBindeable";
import { Movement2D } from "../models/movement";

export class KeyBinder<T> implements IKeyBindeable<T>{

    private keyMap: Map<KeyCmd, ()=> T> = new Map();

    bindKey(key: KeyCmd, callback: () => T): void {
       this.keyMap.set(key, callback);
    }

    executeKey(key: KeyCmd): void | T {
        const callBack: Function = this.keyMap.get(key);
        if(callBack){
            return callBack();
        }
    }

    unbindKey(key: KeyCmd): boolean {
        return this.keyMap.delete(key);
    }
    isKeyBound(key: KeyCmd): boolean {
        return this.keyMap.has(key);
    }

}