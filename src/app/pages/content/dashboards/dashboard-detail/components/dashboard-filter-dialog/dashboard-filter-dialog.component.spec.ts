import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilterDialogComponent } from './dashboard-filter-dialog.component';

describe('DashboardFilterDialogComponent', () => {
  let component: DashboardFilterDialogComponent;
  let fixture: ComponentFixture<DashboardFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
