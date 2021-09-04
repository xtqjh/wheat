import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskProgressBankComponent } from './task-progress-bank.component';

describe('TaskProgressBankComponent', () => {
  let component: TaskProgressBankComponent;
  let fixture: ComponentFixture<TaskProgressBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskProgressBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskProgressBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
