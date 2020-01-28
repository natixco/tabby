import { Injectable } from '@angular/core';
import { readFile, writeFile, existsSync } from 'fs';
import { remote } from 'electron';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Theme, light, dark } from '../../../assets/themes';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  app: any = remote.app;
  sysPref: any = remote.systemPreferences;

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

  darkMode: boolean;
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
      } else if(color === '#E5A910') {
        document.documentElement.style.setProperty("--color-accent-rgb", "255,186,8");
        document.documentElement.style.setProperty("--color-accent-hover", "#BF8C0D");
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

    this._darkMode.subscribe((res: boolean) => {
      this.darkMode = res;

      let active: Theme = (this.darkMode ? dark : light);

      Object.keys(active.properties).forEach(property => {
        document.documentElement.style.setProperty(
          property,
          active.properties[property]
        );
      });
    });
  }

  async readData() {
    await this._readData()
      .then((res: string) => {
        this._data.next(JSON.parse(res));
        this._accentColor.next(JSON.parse(res)["accentColor"]);
        this._darkMode.next(JSON.parse(res)["darkMode"]);
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
        if(data2.length === 0) {
          this.writeDefaultData();
          this.readData();
        } else {
          return resolve(data2);
        }
      });
    });
  }

  isFileExist() {
    if(!existsSync(this.app.getPath('userData') + '/data.json')) {
      this.writeDefaultData();
    }
  }

  writeDefaultData() {
    let defaultData: object = {
      "accentColor": "#0366FC",
      "language": "en",
      "darkMode": false,
      "currentWeek": "",
      "weeks": {},
      "tasks": []
    }
    writeFile(this.app.getPath('userData') + '/data.json', JSON.stringify(defaultData), (err) => {
      if(err !== null) console.log(err);
    });
  }

  writeData() {
    if(Object.keys(this.data['weeks']).length === 0) {
      this.data['currentWeek'] = '';
      this._data.next(this.data);
    }
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
}
