import { KeyBinder } from "../KeyBinder";
export function WithKeyBinding(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.keyBinder = new KeyBinder();
        }
        bindKey(key, callback) {
            this.keyBinder.bindKey(key, callback);
        }
        executeKey(key) {
            this.keyBinder.executeKey(key);
        }
        unbindKey(key) {
            return this.keyBinder.unbindKey(key);
        }
        isKeyBound(key) {
            return this.keyBinder.isKeyBound(key);
        }
    };
}
//# sourceMappingURL=WithKeyBinding.js.map