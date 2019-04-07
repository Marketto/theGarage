import { TestBed } from '@angular/core/testing';

import { VehicleOperationService } from './vehicle-operation.service';

describe('VehicleOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehicleOperationService = TestBed.get(VehicleOperationService);
    expect(service).toBeTruthy();
  });
});
