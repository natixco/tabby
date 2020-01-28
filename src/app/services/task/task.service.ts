import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private _DataService: DataService
  ) { }

  saveTask(task: object) {
    let newData: object = this._DataService.data;
    task['checked'] = false;
    newData['tasks'].push(task);

    this._DataService._data.next(newData);
    this._DataService.writeData();
  }

  deleteTask(task: object) {
    let newData: object = this._DataService.data;
    newData['tasks'].forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(task)) {
        newData['tasks'].splice(index, 1);
        this._DataService._data.next(newData);
        this._DataService.writeData();
        return;
      }
    });
  }

  changeTaskChecked(task: object) {
    let newData: object = this._DataService.data;
    newData['tasks'].forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(task)) {
        newData['tasks'][index] = { task: task['task'], description: task['description'], checked: !task['checked']};
        this._DataService._data.next(newData);
        this._DataService.writeData();
        return;
      }
    });
  }
}
