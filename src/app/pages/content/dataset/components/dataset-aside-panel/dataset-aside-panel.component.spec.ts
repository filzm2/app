import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetAsidePanelComponent } from './dataset-aside-panel.component';

describe('DatasetAsidePanelComponent', () => {
  let component: DatasetAsidePanelComponent;
  let fixture: ComponentFixture<DatasetAsidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetAsidePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetAsidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
