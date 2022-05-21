import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPopupFiltersComponent } from './dropdown-popup-filters.component';

describe('DropdownPopupFiltersComponent', () => {
  let component: DropdownPopupFiltersComponent;
  let fixture: ComponentFixture<DropdownPopupFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownPopupFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownPopupFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
