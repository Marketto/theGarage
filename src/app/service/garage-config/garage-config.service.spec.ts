import { TestBed } from '@angular/core/testing';

import { GarageConfigService } from './garage-config.service';

describe('GarageConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GarageConfigService = TestBed.get(GarageConfigService);
    expect(service).toBeTruthy();
  });
});
