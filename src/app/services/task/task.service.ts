import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  currentlyEditing: object;
  _currentlyEditing: BehaviorSubject<object> = new BehaviorSubject<object>({});

  constructor(
    private _DataService: DataService
  ) {
    this._currentlyEditing.subscribe((res: object) => {
      this.currentlyEditing = res;
    });
  }

  saveTask(task: object) {
    let newData: object = this._DataService.data;
    task['checked'] = false;
    newData['tasks'].push(task);

    this._DataService._data.next(newData);
    this._DataService.writeData();
  }

  editTask(oldData: object, newData: object) {
    let data: object = this._DataService.data;
    data['tasks'].forEach((item, index) => {
      if(item['task'] === oldData['task'] && item['description'] === oldData['description']) {
        item['task'] = newData['task'];
        item['description'] = newData['description'];
        this._DataService._data.next(data);
        this._DataService.writeData();
        return;
      }
    });
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
