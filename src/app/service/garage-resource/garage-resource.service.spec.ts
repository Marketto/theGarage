import { TestBed } from '@angular/core/testing';

import { GarageResourceService } from './garage-resource.service';

describe('GarageResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GarageResourceService = TestBed.get(GarageResourceService);
    expect(service).toBeTruthy();
  });
});
