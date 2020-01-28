import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TaskService } from '@services/task/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.sass']
})
export class TasksComponent implements OnInit {

  deleteProgress: number = 0;
  currentTask: object;

  constructor(
    public _DataService: DataService,
    private _TaskService: TaskService
  ) { }

  ngOnInit() {
  }

  holdHandler(e, task: object) {
    this.currentTask = task;
    this.deleteProgress = e / 10;
    if(this.deleteProgress > 100) {
      this.deleteProgress = 0;
      this._TaskService.deleteTask(task);
    }
  }

  openTask(event) {
    let text: HTMLElement = event;
    let leftSide: HTMLElement = text.parentElement;
    let header: HTMLElement = leftSide.parentElement;
    let task: HTMLElement = header.parentElement;
    let description: HTMLElement = task.querySelector('.task-description');
    if(description.offsetHeight > 0) {
      description.style.height = '0px';
    } else {
      description.style.height = '100%';
    }
  }

}
