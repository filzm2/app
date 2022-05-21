import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAsidePanelComponent } from './chart-aside-panel.component';

describe('ChartAsidePanelComponent', () => {
  let component: ChartAsidePanelComponent;
  let fixture: ComponentFixture<ChartAsidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAsidePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAsidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
