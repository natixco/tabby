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

  // user settings
  accentColor: string;
  _accentColor: BehaviorSubject<string> = new BehaviorSubject<string>('');

  _language: BehaviorSubject<string> = new BehaviorSubject<string>('');

  darkMode: string;
  _darkMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _TranslateService: TranslateService
  ) {
    this._accentColor.subscribe((res: string) => {
      this.accentColor = res;
    });
    this._language.subscribe((res: string) => {
      if(res.length !== 0) {
        this._TranslateService.use(res);
      }
    });

    this._data.subscribe((res: object) => {
      this.data = res;
    });
  }

  async readData() {
    await this._readData()
      .then((res: string) => {
        this._data.next(JSON.parse(res));
        this._accentColor.next(JSON.parse(res)["accentColor"]);
        this._language.next(JSON.parse(res)["language"]);
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

    // check if day is exist, if not add it
    if(newData['weeks'][lesson['week']][lesson['day']] === undefined) {
      newData['weeks'][lesson['week']][lesson['day']] = [];
    }

    // modify lesson
    let newLesson: object = JSON.parse(JSON.stringify(lesson));
    delete newLesson['week'];
    delete newLesson['day'];

    // add lesson to day
    newData['weeks'][lesson['week']][lesson['day']].push(newLesson);

    // sort day
    newData['weeks'][lesson['week']][lesson['day']].sort( (a:object, b: object) => {
      if(a['start_time'] > b['start_time']) return 1;
      else if(b['start_time'] > a['start_time']) return -1;
      return 0;
    })

    this._data.next(newData);
    console.log(this.data);
    this.writeData();
  }
}
