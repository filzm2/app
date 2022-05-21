import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFilterDialogComponent } from './manager-filter-dialog.component';

describe('ManagerFilterDialogComponent', () => {
  let component: ManagerFilterDialogComponent;
  let fixture: ComponentFixture<ManagerFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
