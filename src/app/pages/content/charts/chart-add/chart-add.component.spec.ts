import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAddComponent } from './chart-add.component';

describe('ChartAddComponent', () => {
  let component: ChartAddComponent;
  let fixture: ComponentFixture<ChartAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
