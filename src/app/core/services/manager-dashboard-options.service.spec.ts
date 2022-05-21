import { TestBed } from '@angular/core/testing';

import { ManagerDashboardOptionsService } from './manager-dashboard-options.service';

describe('ManagerDashboardOptionsService', () => {
  let service: ManagerDashboardOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerDashboardOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
