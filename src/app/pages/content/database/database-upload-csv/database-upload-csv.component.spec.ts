import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseUploadCsvComponent } from './database-upload-csv.component';

describe('DatabaseUploadCsvComponent', () => {
  let component: DatabaseUploadCsvComponent;
  let fixture: ComponentFixture<DatabaseUploadCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseUploadCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseUploadCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
