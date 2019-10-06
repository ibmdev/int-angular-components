import { TestBed } from '@angular/core/testing';

import { MontantService } from './montant.service';

describe('MontantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MontantService = TestBed.get(MontantService);
    expect(service).toBeTruthy();
  });
});
