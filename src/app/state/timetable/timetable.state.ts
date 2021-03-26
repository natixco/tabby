import { State, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { EditLesson, DeleteLesson, SaveLesson, SetData, SetLessonEdit } from './timetable.actions';
import { DataService } from '@services/data/data.service';
import { SetCurrentWeek } from '@state/settings/settings.actions';

export interface TimetableStateModel {
  [name: string]: any,
  weeks: any,
  lessonEdit: any
}

@State<TimetableStateModel>({
  name: 'timetable',
  defaults: {
    weeks: {},
    lessonEdit: {}
  }
})

@Injectable()
export class TimetableState {

  constructor(private _DataService: DataService) {}

  @Action(SetData)
  setWeeks({ patchState }: StateContext<TimetableStateModel>, { weeks }: SetData) {
    patchState({ weeks });
  }

  @Action(SetLessonEdit)
  setLessonEdit({ patchState }: StateContext<TimetableStateModel>, { lessonEdit }: SetLessonEdit) {
    patchState({ lessonEdit });
  }

  @Action(SaveLesson)
  saveLesson({ getState, patchState, dispatch }: StateContext<TimetableStateModel>, { lesson }: SaveLesson) {
    let weeks: object = getState().weeks;

    // check if week is exist, if not add it
    if(weeks[lesson['week']] === undefined) {
      weeks[lesson['week']] = {};
    }

    // change currentWeek to added lesson's week
    weeks['currentWeek'] = lesson['week'];
    dispatch(new SetCurrentWeek(lesson['week']));

    // check if day is exist, if not add it
    if(weeks[lesson['week']][lesson['day']] === undefined) {
      weeks[lesson['week']][lesson['day']] = [];
    }

    // modify lesson
    let newLesson: object = JSON.parse(JSON.stringify(lesson));
    delete newLesson['week'];
    delete newLesson['day'];

    // add lesson to day
    let tmp = weeks[lesson['week']][lesson['day']];
    tmp.push(newLesson);
    // newData['weeks'][lesson['week']][lesson['day']] = tmp;

    // sort day by lesson start times
    weeks[lesson['week']][lesson['day']].sort( (a: object, b: object) => {
      if(a['start_time'] > b['start_time']) return 1;
      else if(b['start_time'] > a['start_time']) return -1;
      return 0;
    })

    // sort days of week
    const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    var sorted = {};
    var keys2 = Object.keys(weeks);
    for(let i=0; i<keys2.length; i++) {
      sorted[keys2[i]] = {};
      Object.keys(weeks[keys2[i]]).sort( (a,b) => {
        var indexA = days.indexOf(a.toLowerCase());
        var indexB = days.indexOf(b.toLowerCase());
        if(indexA < indexB) return -1;
        else if(indexA > indexB) return 1;
        return 0;
      }).map(elem=>{
        sorted[keys2[i]][elem] = weeks[keys2[i]][elem];
      });
    }
    weeks = sorted;

    patchState({ weeks });
    this._DataService.saveData();
  }

  @Action(DeleteLesson)
  deleteLesson({ getState, patchState, dispatch }: StateContext<TimetableStateModel>, { lesson, week, day }: DeleteLesson) {
    let weeks: object = getState().weeks;

    Object.values(weeks[week][day]).forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(lesson)) {
        weeks[week][day].splice(index, 1);
      }
    });

    // check if original day's length is 0, if true delete it
    if(Object.values(weeks[week][day]).length === 0) {
      delete weeks[week][day];
    }

    // check if original week's length is 0, if true delete it
    if(Object.keys(weeks[week]).length === 0) {
      delete weeks[week];
      dispatch(new SetCurrentWeek(Object.keys(weeks)[0]));
    }

    patchState({ weeks });
    this._DataService.saveData();
  }

  @Action(EditLesson)
  editLesson({ getState, patchState, dispatch }: StateContext<TimetableStateModel>, { originalLesson, modifiedLesson }: EditLesson) {
    let weeks: object = getState().weeks;
    let tempLesson: object = JSON.parse(JSON.stringify(originalLesson['lesson']));
    delete tempLesson['week'];
    delete tempLesson['day'];

    Object.values(weeks[originalLesson['week']][originalLesson['day']]).forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(tempLesson)) {
        weeks[originalLesson['week']][originalLesson['day']].splice(index, 1);
      }
    });

    if(modifiedLesson['week'] !== originalLesson['week'] || modifiedLesson['day'] !== originalLesson['day']) {
      // check if week is exist, if not add it
      if(weeks[modifiedLesson['week']] === undefined) {
        weeks[modifiedLesson['week']] = {};
      }

      // check if day is exist, if not add it
      if(weeks[modifiedLesson['week']][modifiedLesson['day']] === undefined) {
        weeks[modifiedLesson['week']][modifiedLesson['day']] = [];
      }
      // check if original day's length is 0, if true delete it
      if(Object.values(weeks[originalLesson['week']][originalLesson['day']]).length === 0) {
        delete weeks[originalLesson['week']][originalLesson['day']];
      }

      // check if original week's length is 0, if true delete it
      if(Object.keys(weeks[originalLesson['week']]).length === 0) {
        delete weeks[originalLesson['week']];
        // TODO this._DataService._currentWeek.next(Object.keys(newData['weeks'])[0]);
      }

      // sort day by lesson start times
      weeks[modifiedLesson['week']][modifiedLesson['day']].sort( (a: object, b: object) => {
        if(a['start_time'] > b['start_time']) return 1;
        else if(b['start_time'] > a['start_time']) return -1;
        return 0;
      })

      // sort days of week
      const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
      var sorted = {};
      var keys2 = Object.keys(weeks);
      for(let i=0; i<keys2.length; i++) {
        sorted[keys2[i]] = {};
        Object.keys(weeks[keys2[i]]).sort( (a,b) => {
          var indexA = days.indexOf(a.toLowerCase());
          var indexB = days.indexOf(b.toLowerCase());
          if(indexA < indexB) return -1;
          else if(indexA > indexB) return 1;
          return 0;
        }).map(elem=>{
          sorted[keys2[i]][elem] = weeks[keys2[i]][elem];
        });
      }
      weeks = sorted;
    }

    let tmp = weeks[modifiedLesson['week']][modifiedLesson['day']];
    delete modifiedLesson['week'];
    delete modifiedLesson['day'];
    tmp.push(modifiedLesson);

    patchState({ weeks });
    this._DataService.saveData();
  }
}