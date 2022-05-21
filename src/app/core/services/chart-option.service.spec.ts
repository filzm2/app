import { TestBed } from '@angular/core/testing';

import { ChartOptionService } from './chart-option.service';

describe('ChartOptionService', () => {
  let service: ChartOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
