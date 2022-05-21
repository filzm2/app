import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseDeletePopupComponent } from './database-delete-popup.component';

describe('DatabaseDeletePopupComponent', () => {
  let component: DatabaseDeletePopupComponent;
  let fixture: ComponentFixture<DatabaseDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseDeletePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
