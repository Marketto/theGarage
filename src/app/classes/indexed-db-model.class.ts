import { isFunction, isNullOrUndefined } from 'util';

export abstract class IndexedDbModel {
    public id: number;

    constructor({ id = null}: { id?: number } = { id: null }) {
        this.id = id;
    }

    public static dbSchema() {
        const obj = this.prototype.constructor();
        const keys = Object.keys(obj).filter((key: string) => {
            return !isFunction(obj[key]) && !(/^(?:\$|_)|^id$/).test(key);
        });
        return `++id, ${keys.join(', ')}`;
    }
}
