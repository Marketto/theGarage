import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GarageConfigService } from 'src/app/service/garage-config/garage-config.service';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';
import { Router } from '@angular/router';
import { isNumber, isNullOrUndefined } from 'util';

@Component({
  selector: 'garage-side-bar',
  templateUrl: './side-bar.component.pug',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  public floors: ReadonlyArray<number>;
  public carType: VehicleType = VehicleType.CAR;
  public motorbikeType: VehicleType = VehicleType.MOTORBIKE;
  public searchIcon: IconDefinition = faSearch;
  private $search: string;

  @Input()
  public level: number;
  @Input()
  public type: VehicleType;

  @Output() public searchChange: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  public get search(): string {
    return this.$search;
  }
  public set search(value: string) {
    if (!(!this.$search && !value) && this.$search !== value) {
      this.$search = value;
      this.searchChange.emit(this.$search);
    }
  }

  public makeUrl({ level, type }: {level?: number, type?: VehicleType} = {}): Array<string|number> {
    const targetLevel = isNumber(level) ? level : this.level;
    const targetType = type || this.type;

    const levelRoute = (level !== this.level && isNumber(targetLevel)) ? ['level', targetLevel] : [];
    const typeRoute = (type !== this.type && targetType) ? ['type', targetType] : [];

    return [
      '/garage',
      ...levelRoute,
      ...typeRoute
    ].filter(e => !isNullOrUndefined(e));
  }

  constructor(
    garageConfigService: GarageConfigService
  ) {
    this.floors = garageConfigService.structure.floors;
  }

  ngOnInit() {
  }

}
