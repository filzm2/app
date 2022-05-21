import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractChartSettingsComponent } from './abstract-chart-settings.component';

describe('AbstractChartSettingsComponent', () => {
  let component: AbstractChartSettingsComponent;
  let fixture: ComponentFixture<AbstractChartSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractChartSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractChartSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
