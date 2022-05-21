import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetListPopupComponent } from './dataset-list-popup.component';

describe('DatasetListPopupComponent', () => {
  let component: DatasetListPopupComponent;
  let fixture: ComponentFixture<DatasetListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
