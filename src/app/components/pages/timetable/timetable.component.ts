import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.sass']
})
export class TimetableComponent implements OnInit {

  objKeys = Object.keys;
  objValues = Object.values;
  isDataLoaded: boolean;

  currentWeek: string = 'A';

  constructor(
    public _DataService: DataService,
    private _TranslateService: TranslateService
  ) {
    this._DataService._isDataLoaded.subscribe((res: boolean) => {
      this.isDataLoaded = res;
    });
  }

  ngOnInit() {
    this.dragSlider();

    setTimeout(() => {
      // console.clear();
      console.log(Object.keys(this._DataService.data['weeks']['A']));
      console.log(Object.values(this._DataService.data['weeks']['A']['monday']))
    },1000);
  }

  getTranslatedDay(day: string) {
    return this._TranslateService.instant(`DAYS.${day}`);
  }

  getValues(week: string, day: string) {
    return Object.values(this._DataService.data['weeks'][week][day]);
  }

  dragSlider() {
    const slider: HTMLElement = document.querySelector('.timetable-container');
    let isDown = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('grabbing-timetable-container');
      startX = e.pageX - slider.offsetLeft;
      startY = e.pageY - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollTop = slider.scrollTop;
    })

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('grabbing-timetable-container');
    })

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('grabbing-timetable-container');
    })

    slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walkX = (x - startX) * 1;
      const walkY = (y - startY) * 1;
      slider.scrollLeft = scrollLeft - walkX;
      slider.scrollTop = scrollTop - walkY;
    })
  }
}
