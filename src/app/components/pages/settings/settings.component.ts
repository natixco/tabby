import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Select } from '@ngxs/store';
import { DataService } from '@services/data/data.service';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SetCurrentWeek, SetLanguage, SetDarkMode } from '@state/settings/settings.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  objKeys = Object.keys;
  showErrorText: boolean;
  showExportText: boolean;
  showImportText: boolean;

  @Select(state => Object.keys(state.timetable.weeks)) weeks$: Observable<string[]>;
  @Select(state => state.settings.currentWeek) currentWeek$: Observable<string>;
  @Select(state => state.settings.isDarkMode) isDarkMode$: Observable<boolean>;
  isDarkMode: boolean;

  constructor(
    private _TranslateService: TranslateService,
    public _DataService: DataService,
    private ref: ChangeDetectorRef
  ) {
    this.isDarkMode$.subscribe(res => { this.isDarkMode = res; });
    ipcRenderer.on('export-reply', (_, arg: object) => this._export(_, arg))
    ipcRenderer.on('import-reply', (_, arg: object) => this._import(_, arg))
  }

  ngOnInit(): void { }

  @Dispatch() setCurrentWeek = async (currentWeek: string) => new SetCurrentWeek(currentWeek);
  @Dispatch() setLanguage = async (language: string) => new SetLanguage(language);
  @Dispatch() setDarkMode = async (isDarkMode: boolean) => new SetDarkMode(isDarkMode);

  async _export(_, arg: object) {
    if(!arg) return;
    if(arg['canceled']) return;

    await this._DataService.copyData(this._DataService.getDataPath(), arg['filePaths'][0] + '/data.json')
      .then(() => {
        this.showExportText = true;
        this.showImportText = false;
        this.showErrorText = false;
      })
      .catch(() => {
        this.showErrorText = true;
        this.showExportText = false;
        this.showImportText = false;
      });

    this.ref.detectChanges();
  }

  async _import(_, arg: object) {
    if(!arg) return;
    if(arg['canceled']) return;

    await this._DataService.copyData(arg['filePaths'][0], this._DataService.getDataPath())
      .then(() => {
        this.showImportText = true;
        this.showExportText = false;
        this.showErrorText = false;
      })
      .catch(() => {
        this.showErrorText = true;
        this.showExportText = false;
        this.showImportText = false;
      });

    this.ref.detectChanges();
    this._DataService.readData();
  }

  async changeLanguage(lang: string) {
    await this.setLanguage(lang);
    this._DataService.saveData();
  }

  async changeTheme() {
    await this.setDarkMode(!this.isDarkMode);
    this._DataService.saveData();
  }

  async changeCurrentWeek(week: string) {
    await this.setCurrentWeek(week);
    this._DataService.saveData();
  }

  getCurrentLang(): string {
    return this._TranslateService.currentLang;
  }

  importData(): void {
    ipcRenderer.send('import');
  }

  exportData(): void {
    ipcRenderer.send('export');
  }

}
