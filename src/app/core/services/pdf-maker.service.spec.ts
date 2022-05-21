import { TestBed } from '@angular/core/testing';

import { PdfMakerService } from './pdf-maker.service';

describe('PdfMakerService', () => {
  let service: PdfMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
