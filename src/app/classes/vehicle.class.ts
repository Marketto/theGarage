import { VehicleType } from './vehicle-type.enum';
import { IndexedDbModel } from './indexed-db-model.class';
import { VehicleInterface } from './vehicle.interface';
export class Vehicle extends IndexedDbModel implements VehicleInterface {
    private $plate: string;
    public type: VehicleType;
    public floor: number;
    public place: number;
    public enterDt: Date;
    public leaveDt: Date;

    public get plate(): string {
        return this.$plate || null;
    }
    public set plate(plate: string) {
        this.$plate = (plate && plate.toUpperCase().trim().replace(/\s+/igm, '')) || null;
    }

    constructor({
        plate = null,
        type = null,
        floor = null,
        place = null,
        enterDt = null,
        leaveDt = null,
        ...params
    }: {
        plate: string,
        type: VehicleType,
        floor: number,
        place: number,
        enterDt: Date,
        leaveDt: Date
    } = {
        plate: null,
        type: null,
        floor: null,
        place: null,
        enterDt: null,
        leaveDt: null
    }) {
        super(params);
        Object.assign(this, {
            plate,
            type,
            floor,
            place,
            enterDt,
            leaveDt
        });
    }

    public exportDbEntry(): VehicleInterface {
        const {
            id,
            plate,
            type,
            floor,
            place,
            enterDt,
            leaveDt
        } = this;
        return Object.assign({
            plate,
            type,
            floor,
            place,
            enterDt,
            leaveDt
        }, id ? {id} : {}) as VehicleInterface;
    }
}
