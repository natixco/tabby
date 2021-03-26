import { Injectable } from '@angular/core';
import { readFile, writeFile, existsSync, copyFile } from 'fs';
import { ipcRenderer } from 'electron';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SetData } from '@state/timetable/timetable.actions';
import { SetCurrentWeek, SetLanguage, SetDarkMode } from '@state/settings/settings.actions';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userDataPath: string;

  constructor(private _Store: Store) {
    ipcRenderer.once('_getUserDataPath', (_, args) => {
      this.userDataPath = args;
      this.readData();
    });
  }

  @Dispatch() setTimetable = (values: any) => new SetData(values);
  @Dispatch() setCurrentWeek = (currentWeek: string) => new SetCurrentWeek(currentWeek);
  @Dispatch() setLanguage = (language: string) => new SetLanguage(language);
  @Dispatch() setDarkMode = (isDarkMode: boolean) => new SetDarkMode(isDarkMode);

  setPath(): void {
    ipcRenderer.send('getUserDataPath');
  }

  async readData(): Promise<void> {
    const data: string = await this._readData();
    if (!data) return;

    const obj: object = JSON.parse(data);

    this.setTimetable(obj['weeks']);
    this.setCurrentWeek(obj['currentWeek']);
    this.setLanguage(obj['language']);
    this.setDarkMode(obj['darkMode']);
  }

  _readData(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.isFileExist();

      readFile(`${this.userDataPath}/data.json`, 'utf-8', (err, data2) => {
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
    if (!existsSync(`${this.userDataPath}/data.json`)) this.writeDefaultData();
  }

  writeDefaultData(): void {
    let defaultData: object = {
      'language': 'en',
      'darkMode': false,
      'currentWeek': '',
      'weeks': {},
      'tasks': []
    };

    writeFile(`${this.userDataPath}/data.json`, JSON.stringify(defaultData), (err) => {
      if (err !== null) console.log(err);
    });
  }

  writeData(data: object): void {
    if (Object.keys(data['weeks']).length === 0) data['currentWeek'] = '';

    writeFile(`${this.userDataPath}/data.json`, JSON.stringify(data), (err) => {
      if (err !== null) console.log(err);
    });
  }

  copyData(fromPath: string, outputPath: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await copyFile(fromPath, outputPath, (err) => {
        if (err) reject(false);
        resolve(true);
      });
    })
  }

  getDataPath(): string {
    return `${this.userDataPath}/data.json`;
  }

  saveData(): void {
    const state: any = this._Store.snapshot();
    const data: object = {
      currentWeek: state.settings.currentWeek,
      darkMode: state.settings.isDarkMode,
      language: state.settings.language,
      weeks: state.timetable.weeks,
    };
    this.writeData(data);
    console.log(data);
  }
}
