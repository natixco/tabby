import { TestBed } from '@angular/core/testing';

import { LessonService } from './lesson.service';

describe('LessonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LessonService = TestBed.get(LessonService);
    expect(service).toBeTruthy();
  });
});
