import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeTableComponent } from './pledge-table.component';

describe('PledgeTableComponent', () => {
  let component: PledgeTableComponent;
  let fixture: ComponentFixture<PledgeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PledgeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
