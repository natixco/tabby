import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Theme, light, dark } from '../../../../assets/themes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  active: Theme = light;
  isLight: boolean = true;
  accentColor: string;

  constructor(
    private _TranslateService: TranslateService,
    public _DataService: DataService
  ) {}

  ngOnInit() {
    this._DataService._accentColor.subscribe((color: string) => {
      this.accentColor = color;
    });
  }

  changeLanguage(lang: string) {
    this._DataService.changeData("language", lang);
    this._DataService._language.next(lang);
  }

  changeAccentColor(color: string) {
    // Object.keys(this.active.properties).forEach(property => {
    //   document.documentElement.style.setProperty(
    //     property,
    //     this.active.properties[property]
    //   );
    // });
    //this.active.properties["--color-accent"] = color;
    // document.documentElement.style.setProperty("--color-accent", color);
    // this._DataService._accentColor.next(color);

    // let newData: object = this._DataService.data;
    // newData["accentColor"] = color;
    // this._DataService._data.next(newData);
    this._DataService.changeData("accentColor", color);
    this._DataService._accentColor.next(color);

    // this._DataService.writeData();
  }

  changeTheme() {
    this.active = (this.isLight ? dark : light);
    this.isLight = !this.isLight;
    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }

  getProperty(): string {
    return document.documentElement.style.getPropertyValue("--color-accent");
  }

  getCurrentLang(): string {
    return this._TranslateService.currentLang;
  }

}
