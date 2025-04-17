import { KeyCmd } from "../../../artifacts/control/control";
import { IKeyBindeable } from "../../interfaces/IKeyBindeable";
import { KeyBinder } from "../KeyBinder";

export function WithKeyBinding<T extends {new (...any: any[]): {}}>(constructor: T){
    return class extends constructor implements IKeyBindeable<void>{
        
        private keyBinder = new KeyBinder();
        
        bindKey(key: KeyCmd, callback: () => void): void {
            this.keyBinder.bindKey(key, callback);
        }
        executeKey(key: KeyCmd): void {
            this.keyBinder.executeKey(key);
        }
        unbindKey(key: KeyCmd): boolean {
            return this.keyBinder.unbindKey(key);
        }
        isKeyBound(key: KeyCmd): boolean {
            return this.keyBinder.isKeyBound(key);
        }
        
    }
}
