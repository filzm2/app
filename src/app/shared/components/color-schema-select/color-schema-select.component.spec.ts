import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSchemaSelectComponent } from './color-schema-select.component';

describe('ColorSchemaSelectComponent', () => {
  let component: ColorSchemaSelectComponent;
  let fixture: ComponentFixture<ColorSchemaSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorSchemaSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSchemaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
