import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownAnnotationLayerComponent } from './dropdown-annotation-layer.component';

describe('DropdownAnnotationLayerComponent', () => {
  let component: DropdownAnnotationLayerComponent;
  let fixture: ComponentFixture<DropdownAnnotationLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownAnnotationLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownAnnotationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
