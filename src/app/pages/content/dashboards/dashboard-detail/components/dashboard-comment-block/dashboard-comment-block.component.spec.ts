import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCommentBlockComponent } from './dashboard-comment-block.component';

describe('DashboardCommentBlockComponent', () => {
  let component: DashboardCommentBlockComponent;
  let fixture: ComponentFixture<DashboardCommentBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCommentBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCommentBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
