import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAutorefreshDialogComponent } from './dashboard-autorefresh-dialog.component';

describe('DashboardAutorefreshDialogComponent', () => {
  let component: DashboardAutorefreshDialogComponent;
  let fixture: ComponentFixture<DashboardAutorefreshDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAutorefreshDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAutorefreshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
