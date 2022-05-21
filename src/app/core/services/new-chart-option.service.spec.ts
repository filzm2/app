import { TestBed } from '@angular/core/testing';

import { NewChartOptionService } from './new-chart-option.service';

describe('NewChartOptionService', () => {
  let service: NewChartOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewChartOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
