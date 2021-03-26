import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewLessonComponent } from './new-lesson.component';

describe('NewLessonComponent', () => {
  let component: NewLessonComponent;
  let fixture: ComponentFixture<NewLessonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
