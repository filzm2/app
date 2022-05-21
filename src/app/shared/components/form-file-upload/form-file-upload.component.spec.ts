import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFileUploadComponent } from './form-file-upload.component';

describe('FormFileUploadComponent', () => {
  let component: FormFileUploadComponent;
  let fixture: ComponentFixture<FormFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
