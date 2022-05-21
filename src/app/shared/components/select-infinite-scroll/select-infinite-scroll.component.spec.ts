import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInfiniteScrollComponent } from './select-infinite-scroll.component';

describe('SelectInfiniteScrollComponent', () => {
  let component: SelectInfiniteScrollComponent;
  let fixture: ComponentFixture<SelectInfiniteScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectInfiniteScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
