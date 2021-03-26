import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '@services/task/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.sass']
})
export class EditTaskComponent implements OnInit {

  lessonForm: FormGroup;
  oldData: object;

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
    this.oldData = this._TaskService.currentlyEditing;
    this.lessonForm.controls.task.setValue(this._TaskService.currentlyEditing['task']);
    this.lessonForm.controls.description.setValue(this._TaskService.currentlyEditing['description']);
  }

  editTask() {
    this._TaskService.editTask(this.oldData, this.lessonForm.value);
    this._Router.navigate(['/tasks']);
  }

}
