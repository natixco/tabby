import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '@services/task/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.sass']
})
export class NewTaskComponent implements OnInit {

  lessonForm: FormGroup;

  constructor(
    private _TaskService: TaskService,
    private _Router: Router
  ) {
    this.lessonForm = new FormGroup({
      task: new FormControl('', Validators.required),
      description: new FormControl('')
    })
  }

  get form() {
    return this.lessonForm.controls;
  }

  ngOnInit() {

  }

  saveTask() {
    this._TaskService.saveTask(this.lessonForm.value);
    this._Router.navigate(['/tasks']);
  }

}
