import { State, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetCurrentWeek, SetLanguage, SetDarkMode } from './settings.actions';
import { TranslateService } from '@ngx-translate/core';
import { Theme, light, dark } from '../../../assets/themes';
import { DataService } from '@services/data/data.service';

export interface SettingsStateModel {
  [name: string]: any,
  currentWeek: string,
  language: string,
  isDarkMode: boolean
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    currentWeek: '',
    language: '',
    isDarkMode: false
  }
})

@Injectable()
export class SettingsState {

  constructor(
    private _TranslateService: TranslateService,
    private _DataService: DataService
  ) {}

  @Action(SetCurrentWeek)
  setCurrentWeek({ patchState }: StateContext<SettingsStateModel>, { currentWeek }: SetCurrentWeek) {
    patchState({ currentWeek });
  }

  @Action(SetLanguage)
  SetLanguage({ patchState }: StateContext<SettingsStateModel>, { language }: SetLanguage) {
    this._TranslateService.use(language);
    patchState({ language });
  }

  @Action(SetDarkMode)
  SetDarkMode({ patchState }: StateContext<SettingsStateModel>, { isDarkMode }: SetDarkMode) {
    let active: Theme = (isDarkMode ? dark : light);

    Object.keys(active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        active.properties[property]
      );
    });

    patchState({ isDarkMode });
  }
}