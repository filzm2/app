import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFilterBarComponent } from './manager-filter-bar.component';

describe('ManagerFilterBarComponent', () => {
  let component: ManagerFilterBarComponent;
  let fixture: ComponentFixture<ManagerFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerFilterBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
