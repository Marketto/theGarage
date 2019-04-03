import { VehicleType } from './vehicle-type.enum';

export interface VehicleInterface {
    id?: number;
    plate: string;
    type: VehicleType;
    floor: number;
    place: number;
    enterDt: Date;
    leaveDt?: Date;
}
