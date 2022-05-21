import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingCompositionComponent } from './holding-composition.component';

describe('HoldingCompositionComponent', () => {
  let component: HoldingCompositionComponent;
  let fixture: ComponentFixture<HoldingCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldingCompositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
