import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowLevelEditComponent } from './row-level-edit.component';

describe('RowLevelEditComponent', () => {
  let component: RowLevelEditComponent;
  let fixture: ComponentFixture<RowLevelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowLevelEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowLevelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
