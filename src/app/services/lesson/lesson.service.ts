import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(
    private _DataService: DataService
  ) { }

  saveLesson(lesson: object) {
    let newData: object = this._DataService.data;

    // check if week is exist, if not add it
    if(newData['weeks'][lesson['week']] === undefined) {
      newData['weeks'][lesson['week']] = {};
    }

    // change currentWeek to added lesson's week
    newData['currentWeek'] = lesson['week'];
    this._DataService._currentWeek.next(lesson['week']);

    // check if day is exist, if not add it
    if(newData['weeks'][lesson['week']][lesson['day']] === undefined) {
      newData['weeks'][lesson['week']][lesson['day']] = [];
    }

    // modify lesson
    let newLesson: object = JSON.parse(JSON.stringify(lesson));
    delete newLesson['week'];
    delete newLesson['day'];

    // add lesson to day
    let tmp = newData['weeks'][lesson['week']][lesson['day']];
    tmp.push(newLesson);
    // newData['weeks'][lesson['week']][lesson['day']] = tmp;

    // sort day by lesson start times
    newData['weeks'][lesson['week']][lesson['day']].sort( (a: object, b: object) => {
      if(a['start_time'] > b['start_time']) return 1;
      else if(b['start_time'] > a['start_time']) return -1;
      return 0;
    })

    // sort days of week
    const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    var sorted = {};
    var keys2 = Object.keys(newData['weeks']);
    for(let i=0; i<keys2.length; i++) {
      sorted[keys2[i]] = {};
      Object.keys(newData['weeks'][keys2[i]]).sort( (a,b) => {
        var indexA = days.indexOf(a.toLowerCase());
        var indexB = days.indexOf(b.toLowerCase());
        if(indexA < indexB) return -1;
        else if(indexA > indexB) return 1;
        return 0;
      }).map(elem=>{
        sorted[keys2[i]][elem] = newData['weeks'][keys2[i]][elem];
      });
    }
    newData['weeks'] = sorted;

    this._DataService._data.next(newData);
    this._DataService.writeData();
  }

  deleteLesson(lesson: object, week: string, day: string) {
    let newData: object = this._DataService.data;

    Object.values(newData['weeks'][week][day]).forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(lesson)) {
        newData['weeks'][week][day].splice(index, 1);
      }
    });

    // check if original day's length is 0, if true delete it
    if(Object.values(newData['weeks'][week][day]).length === 0) {
      delete newData['weeks'][week][day];
    }

    // check if original week's length is 0, if true delete it
    if(Object.keys(newData['weeks'][week]).length === 0) {
      delete newData['weeks'][week];
      this._DataService._currentWeek.next(Object.keys(newData['weeks'])[0]);
    }

    this._DataService._data.next(newData);
    this._DataService.writeData();
  }

  editLesson(originalLesson: object, modifiedLesson: object) {
    let newData: object = this._DataService.data;
    let tempLesson: object = JSON.parse(JSON.stringify(originalLesson['lesson']));
    delete tempLesson['week'];
    delete tempLesson['day'];

    Object.values(newData['weeks'][originalLesson['week']][originalLesson['day']]).forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(tempLesson)) {
        newData['weeks'][originalLesson['week']][originalLesson['day']].splice(index, 1);
      }
    });

    if(modifiedLesson['week'] !== originalLesson['week'] || modifiedLesson['day'] !== originalLesson['day']) {
      // check if week is exist, if not add it
      if(newData['weeks'][modifiedLesson['week']] === undefined) {
        newData['weeks'][modifiedLesson['week']] = {};
      }

      // check if day is exist, if not add it
      if(newData['weeks'][modifiedLesson['week']][modifiedLesson['day']] === undefined) {
        newData['weeks'][modifiedLesson['week']][modifiedLesson['day']] = [];
      }
      // check if original day's length is 0, if true delete it
      if(Object.values(newData['weeks'][originalLesson['week']][originalLesson['day']]).length === 0) {
        delete newData['weeks'][originalLesson['week']][originalLesson['day']];
      }

      // check if original week's length is 0, if true delete it
      if(Object.keys(newData['weeks'][originalLesson['week']]).length === 0) {
        delete newData['weeks'][originalLesson['week']];
        this._DataService._currentWeek.next(Object.keys(newData['weeks'])[0]);
      }

      // sort day by lesson start times
      newData['weeks'][modifiedLesson['week']][modifiedLesson['day']].sort( (a: object, b: object) => {
        if(a['start_time'] > b['start_time']) return 1;
        else if(b['start_time'] > a['start_time']) return -1;
        return 0;
      })

      // sort days of week
      const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
      var sorted = {};
      var keys2 = Object.keys(newData['weeks']);
      for(let i=0; i<keys2.length; i++) {
        sorted[keys2[i]] = {};
        Object.keys(newData['weeks'][keys2[i]]).sort( (a,b) => {
          var indexA = days.indexOf(a.toLowerCase());
          var indexB = days.indexOf(b.toLowerCase());
          if(indexA < indexB) return -1;
          else if(indexA > indexB) return 1;
          return 0;
        }).map(elem=>{
          sorted[keys2[i]][elem] = newData['weeks'][keys2[i]][elem];
        });
      }
      newData['weeks'] = sorted;
    }

    let tmp = newData['weeks'][modifiedLesson['week']][modifiedLesson['day']];
    delete modifiedLesson['week'];
    delete modifiedLesson['day'];
    tmp.push(modifiedLesson);

    this._DataService._data.next(newData);
    this._DataService.writeData();
  }
}
