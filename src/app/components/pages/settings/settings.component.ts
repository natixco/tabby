import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@services/data/data.service';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  darkMode: boolean = true;
  accentColor: string;
  weeks: string[];
  objKeys = Object.keys;
  currentWeek: string;
  showErrorText: boolean;
  showExportText: boolean;
  showImportText: boolean;

  constructor(
    private _TranslateService: TranslateService,
    public _DataService: DataService,
    private ref: ChangeDetectorRef
  ) {
    ipcRenderer.on('export-reply', (_, arg: object) => this._export(_, arg))
    ipcRenderer.on('import-reply', (_, arg: object) => this._import(_, arg))
  }

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

  ngOnInit() {
    this._DataService._accentColor.subscribe((color: string) => {
      this.accentColor = color;
    });

    this._DataService._darkMode.subscribe((res: boolean) => {
      this.darkMode = res;
    });

    this._DataService._currentWeek.subscribe((res: string) => {
      this.currentWeek = res;
    });

    this.weeks = Object.keys(this._DataService.data['weeks']);
  }

  changeLanguage(lang: string) {
    this._DataService.changeData("language", lang);
    this._DataService._language.next(lang);
  }

  changeAccentColor(color: string) {
    this._DataService.changeData("accentColor", color);
    this._DataService._accentColor.next(color);
  }

  changeTheme() {
    this._DataService.changeData("darkMode", !this.darkMode);
    this._DataService._darkMode.next(!this.darkMode);
  }

  changeCurrentWeek(week: string) {
    this._DataService.changeData("currentWeek", week);
    this._DataService._currentWeek.next(week);
  }

  getProperty(): string {
    return document.documentElement.style.getPropertyValue("--color-accent");
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
