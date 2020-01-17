import { Injectable } from '@angular/core';
import { readFile, writeFile, existsSync } from 'fs';
import { remote } from 'electron';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  app: any = remote.app;
  _isDataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  data: object;
  _data: BehaviorSubject<object> = new BehaviorSubject<object>({});

  currentLesson: object;
  _currentLesson: BehaviorSubject<object> = new BehaviorSubject<object>({});

  // user settings
  _accentColor: BehaviorSubject<string> = new BehaviorSubject<string>('');

  currentWeek: string;
  _currentWeek: BehaviorSubject<string> = new BehaviorSubject<string>('');

  _language: BehaviorSubject<string> = new BehaviorSubject<string>('');

  darkMode: string;
  _darkMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _TranslateService: TranslateService
  ) {
    this._accentColor.subscribe((color: string) => {
      document.documentElement.style.setProperty("--color-accent", color);

      if(color === '#0366FC') {
        document.documentElement.style.setProperty("--color-accent-rgb", "3,102,252");
        document.documentElement.style.setProperty("--color-accent-hover", "#0258D8");
      } else if(color === '#fa5e62') {
        document.documentElement.style.setProperty("--color-accent-rgb", "250,94,98");
        document.documentElement.style.setProperty("--color-accent-hover", "#D35054");
      } else if(color === '#27ae60') {
        document.documentElement.style.setProperty("--color-accent-rgb", "39,174,96");
        document.documentElement.style.setProperty("--color-accent-hover", "#1D8749");
      } else if(color === '#8980F5') {
        document.documentElement.style.setProperty("--color-accent-rgb", "137,128,245");
        document.documentElement.style.setProperty("--color-accent-hover", "#736BCE");
      } else if(color === '#FFBA08') {
        document.documentElement.style.setProperty("--color-accent-rgb", "255,186,8");
        document.documentElement.style.setProperty("--color-accent-hover", "#D89D06");
      }
    });

    this._currentWeek.subscribe((res: string) => {
      this.currentWeek = res;
    });
    this._language.subscribe((res: string) => {
      if(res.length !== 0) {
        this._TranslateService.use(res);
      }
    });

    this._data.subscribe((res: object) => {
      this.data = res;
    });

    this._currentLesson.subscribe((res: object) => {
      this.currentLesson = res;
    });
  }

  async readData() {
    await this._readData()
      .then((res: string) => {
        this._data.next(JSON.parse(res));
        this._accentColor.next(JSON.parse(res)["accentColor"]);
        this._language.next(JSON.parse(res)["language"]);
        this._currentWeek.next(JSON.parse(res)["currentWeek"]);
        this._isDataLoaded.next(true);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  _readData(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.isFileExist();

      readFile(this.app.getPath('userData') + '/data.json', "utf-8", (err, data2) => {
        if(err) return reject(err);
        return resolve(data2);
      });
    });
  }

  isFileExist() {
    if(!existsSync(this.app.getPath('userData') + '/data.json')) {
      let defaultData: object = {
        "accentColor": "#0366FC",
        "language": "en",
        "darkMode": false,
        "currentWeek": "",
        "weeks": {}
      }
      writeFile(this.app.getPath('userData') + '/data.json', JSON.stringify(defaultData), (err) => {
        if(err !== null) console.log(err);
      });
    }
  }

  writeData() {
    writeFile(this.app.getPath('userData') + '/data.json', JSON.stringify(this.data), (err) => {
      if(err !== null) console.log(err);
    });
  }

  changeData(property: string, value: any) {
    let newData: object = this.data;
    newData[property] = value;
    this._data.next(newData);
    this.writeData();
  }

  saveLesson(lesson: object) {
    let newData: object = this.data;

    // check if week is exist, if not add it
    if(newData['weeks'][lesson['week']] === undefined) {
      newData['weeks'][lesson['week']] = {};
    }

    // check if weeks length is 1 to set currentWeek first time
    if(Object.keys(newData['weeks']).length === 1) {
      newData['currentWeek'] = lesson['week'];
      this._currentWeek.next(lesson['week']);
    }

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

    this._data.next(newData);
    this.writeData();
  }

  deleteLesson(lesson: object, week: string, day: string) {
    let newData: object = this.data;

    Object.values(newData['weeks'][week][day]).forEach((item, index) => {
      if(item === lesson) {
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
      this._currentWeek.next(Object.keys(newData['weeks'])[0]);
    }

    this._data.next(newData);
    this.writeData();
  }

  editLesson(originalLesson: object, modifiedLesson: object) {
    let newData: object = this.data;
    let tempLesson: object = JSON.parse(JSON.stringify(originalLesson['lesson']));
    delete tempLesson['week'];
    delete tempLesson['day'];

    Object.values(newData['weeks'][originalLesson['week']][originalLesson['day']]).forEach((item, index) => {
      if(JSON.stringify(item) === JSON.stringify(tempLesson)) {
        newData['weeks'][originalLesson['week']][originalLesson['day']].splice(index, 1);
      }
    });

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
      this._currentWeek.next(Object.keys(newData['weeks'])[0]);
    }

    let tmp = newData['weeks'][modifiedLesson['week']][modifiedLesson['day']];
    delete modifiedLesson['week'];
    delete modifiedLesson['day'];
    tmp.push(modifiedLesson);
  }
}
