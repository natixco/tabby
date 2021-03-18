import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@services/data/data.service';
import { Router } from '@angular/router';
import { ipcRenderer } from 'electron';

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

  async ngOnInit() {
    // while (true) {
    //   console.log(this._DataService.userDataPath)
    //   if (this._DataService.userDataPath) break;
    // }
    // await this._DataService.readData();
    // console.log(this._DataService.data);
  }

  // async getUserDataPath(): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     ipcRenderer.send('getUserDataPath');

  //     ipcRenderer.once('_getUserDataPath', (event, args) => {
  //       console.log(args);
  //       resolve(args);
  //     })
  //   })
  // }

}
