import { KeyCmd } from "../../artifacts/control/control";

export interface IKeyBindeable<T>{
    bindKey(key: KeyCmd, callback: () => T): void;
    executeKey(key: KeyCmd): T | void;
    unbindKey(key: KeyCmd): boolean;
    isKeyBound(key: KeyCmd): boolean;
}