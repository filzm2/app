import { TestBed } from '@angular/core/testing';

import { RequestMakerService } from './request-maker.service';

describe('RequestMakerService', () => {
  let service: RequestMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
