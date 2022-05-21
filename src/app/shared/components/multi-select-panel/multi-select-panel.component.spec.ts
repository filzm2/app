import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectPanelComponent } from './multi-select-panel.component';

describe('MultiSelectPanelComponent', () => {
  let component: MultiSelectPanelComponent;
  let fixture: ComponentFixture<MultiSelectPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
