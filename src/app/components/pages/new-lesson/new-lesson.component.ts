import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LessonService } from '@services/lesson/lesson.service';

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.sass']
})
export class NewLessonComponent implements OnInit {

  lessonForm: FormGroup;
  weeks: string[];

  constructor(
    private _LessonService: LessonService,
    private _Router: Router
  ) {
    this.lessonForm = new FormGroup({
      start_time: new FormControl('',Validators.required),
      finish_time: new FormControl('',Validators.required),
      lesson_name: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      week: new FormControl('',Validators.required),
      day: new FormControl('',Validators.required),
      teacher_name: new FormControl(''),
      class_room: new FormControl(''),
    })
  }

  get form() {
    return this.lessonForm.controls;
  }

  ngOnInit() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.weeks = alphabet;
  }

  saveLesson() {
    this._LessonService.saveLesson(this.lessonForm.value);
    this._Router.navigate(['/timetable']);
  }

}
