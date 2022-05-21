import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPopupMetricsComponent } from './dropdown-popup-metrics.component';

describe('DropdownPopupMetricsComponent', () => {
  let component: DropdownPopupMetricsComponent;
  let fixture: ComponentFixture<DropdownPopupMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownPopupMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownPopupMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
