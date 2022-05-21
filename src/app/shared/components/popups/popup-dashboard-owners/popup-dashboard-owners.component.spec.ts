import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDashboardOwnersComponent } from './popup-dashboard-owners.component';

describe('PopupDashboardOwnersComponent', () => {
  let component: PopupDashboardOwnersComponent;
  let fixture: ComponentFixture<PopupDashboardOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupDashboardOwnersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDashboardOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
