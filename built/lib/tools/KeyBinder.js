export class KeyBinder {
    constructor() {
        this.keyMap = new Map();
    }
    bindKey(key, callback) {
        this.keyMap.set(key, callback);
    }
    executeKey(key) {
        const callBack = this.keyMap.get(key);
        if (callBack) {
            return callBack();
        }
    }
    unbindKey(key) {
        return this.keyMap.delete(key);
    }
    isKeyBound(key) {
        return this.keyMap.has(key);
    }
}
//# sourceMappingURL=KeyBinder.js.map