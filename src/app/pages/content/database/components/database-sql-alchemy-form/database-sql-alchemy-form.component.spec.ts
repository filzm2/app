import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSqlAlchemyFormComponent } from './database-sql-alchemy-form.component';

describe('DatabaseSqlAlchemyFormComponent', () => {
  let component: DatabaseSqlAlchemyFormComponent;
  let fixture: ComponentFixture<DatabaseSqlAlchemyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatabaseSqlAlchemyFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseSqlAlchemyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
