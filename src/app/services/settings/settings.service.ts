import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  accentColor: string;
  _accentColor: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private _DataService: DataService
  ) {
    this._accentColor.subscribe((res: string) => {
      this.accentColor = res;
    });
  }
}
