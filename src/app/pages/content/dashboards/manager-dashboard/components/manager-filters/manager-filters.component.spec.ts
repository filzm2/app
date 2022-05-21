import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFiltersComponent } from './manager-filters.component';

describe('ManagerFiltersComponent', () => {
  let component: ManagerFiltersComponent;
  let fixture: ComponentFixture<ManagerFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
