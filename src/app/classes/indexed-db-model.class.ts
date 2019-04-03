export abstract class IndexedDbModel {
    public id: number;

    constructor({ id = null}: { id?: number } = { id: null }) {
        this.id = id;
    }

    public static dbSchema() {
        return '++id';
    }
}
