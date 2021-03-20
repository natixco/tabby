import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(
    private _TranslateService: TranslateService,
    private _DataService: DataService,
    public _Router: Router
  ) {
    this._DataService.setPath();
    this._TranslateService.addLangs(['en', 'hu', 'de']);
    _TranslateService.setDefaultLang('en');
  }

  ngOnInit() {
    this._Router.navigate(['/timetable']);
  }

}
