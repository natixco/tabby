import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';
import { LessonService } from '@services/lesson/lesson.service';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.sass']
})
export class EditLessonComponent implements OnInit {

  lessonForm: FormGroup;
  weeks: string[];

  currentLesson: object;

  constructor(
    private _DataService: DataService,
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

    this.lessonForm.controls.start_time.setValue(this._DataService.currentLesson['lesson']['start_time']);
    this.lessonForm.controls.finish_time.setValue(this._DataService.currentLesson['lesson']['finish_time']);
    this.lessonForm.controls.lesson_name.setValue(this._DataService.currentLesson['lesson']['lesson_name']);
    this.lessonForm.controls.teacher_name.setValue(this._DataService.currentLesson['lesson']['teacher_name']);
    this.lessonForm.controls.class_room.setValue(this._DataService.currentLesson['lesson']['class_room']);
    this.lessonForm.controls.week.setValue(this._DataService.currentLesson['week']);
    this.lessonForm.controls.day.setValue(this._DataService.currentLesson['day']);
  }

  saveLesson() {
    this._LessonService.editLesson(this._DataService.currentLesson, this.lessonForm.value);
    this._Router.navigate(['/timetable']);
  }

}
