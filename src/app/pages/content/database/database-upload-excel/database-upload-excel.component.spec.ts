import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseUploadExcelComponent } from './database-upload-excel.component';

describe('DatabaseUploadExcelComponent', () => {
  let component: DatabaseUploadExcelComponent;
  let fixture: ComponentFixture<DatabaseUploadExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseUploadExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseUploadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
