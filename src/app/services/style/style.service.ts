import { Injectable } from '@angular/core';
import { THEMES } from '../../themes';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  themes: string[] = [
    'light',
    'dark'
  ];

  constructor() { }

  setTheme(theme: 'light' | 'dark'): void {
    if (!this.themes.includes(theme)) return;

    for (let [key, val] of Object.entries(THEMES[theme])) {
      document.documentElement.style.setProperty(key, val);
    }
  }
}
