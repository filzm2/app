import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableChartViewComponent } from './table-chart-view.component';

describe('TableChartComponent', () => {
  let component: TableChartViewComponent;
  let fixture: ComponentFixture<TableChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableChartViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
