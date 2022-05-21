import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseParametersFormComponent } from './database-parameters-form.component';

describe('DatabaseParametersFormComponent', () => {
  let component: DatabaseParametersFormComponent;
  let fixture: ComponentFixture<DatabaseParametersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatabaseParametersFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseParametersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
