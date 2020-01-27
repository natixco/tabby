import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@services/data/data.service';

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

  constructor(
    private _TranslateService: TranslateService,
    public _DataService: DataService
  ) {}

  ngOnInit() {
    this.weeks = Object.keys(this._DataService.data['weeks']);

    this._DataService._accentColor.subscribe((color: string) => {
      this.accentColor = color;
    });

    this._DataService._darkMode.subscribe((res: boolean) => {
      this.darkMode = res;
    });

    this._DataService._currentWeek.subscribe((res: string) => {
      this.currentWeek = res;
    });
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
    // this.active = (this.darkMode ? dark : light);
    // this.darkMode = !this.darkMode;
    this._DataService.changeData("darkMode", !this.darkMode);
    this._DataService._darkMode.next(!this.darkMode);
    // Object.keys(this.active.properties).forEach(property => {
    //   document.documentElement.style.setProperty(
    //     property,
    //     this.active.properties[property]
    //   );
    // });
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

}
